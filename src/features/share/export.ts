import { GOOGLE_FONTS_HREF } from "../theme/registry";

const FONT_FACE_BLOCK = /@font-face\s*\{[^}]*\}/gu;
const FONT_FAMILY = /font-family:\s*["']?(?<family>[^;"']+)/iu;
const FONT_URL = /url\((?:["']?)(?<url>[^"')]+)(?:["']?)\)/gu;

const fontUrlCache = new Map<string, Promise<string>>();
let googleFontCss: Promise<string> | null = null;

const readDataUrl = async (blob: Blob) => {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = "";

  for (let index = 0; index < bytes.length; index += 0x80_00) {
    binary += String.fromCodePoint(...bytes.subarray(index, index + 0x80_00));
  }

  return `data:${blob.type || "font/woff2"};base64,${btoa(binary)}`;
};

const fetchDataUrl = (url: string) => {
  const cached = fontUrlCache.get(url);

  if (cached) {
    return cached;
  }

  const request = (async () => {
    const response = await fetch(url, { mode: "cors" });

    if (!response.ok) {
      throw new Error(`Could not load font: ${url}`);
    }

    return readDataUrl(await response.blob());
  })();

  fontUrlCache.set(url, request);

  return request;
};

const inlineFontUrls = async (cssText: string, baseUrl: string) => {
  const matches = [...cssText.matchAll(FONT_URL)];
  let result = cssText;

  await Promise.all(
    matches.map(async (match) => {
      const path = match.groups?.url;

      if (!path || path.startsWith("data:")) {
        return;
      }

      const url = new URL(path, baseUrl).href;
      const data = await fetchDataUrl(url);

      result = result.replaceAll(match[0], `url("${data}")`);
    })
  );

  return result;
};

const collectUsedFamilies = (node: HTMLElement) => {
  const families = new Set<string>();
  const elements = [node, ...node.querySelectorAll<HTMLElement>("*")];

  for (const element of elements) {
    const stack = getComputedStyle(element).fontFamily;

    for (const family of stack.split(",")) {
      const name = family.trim().replaceAll(/^["']|["']$/gu, "");

      if (name) {
        families.add(name);
      }
    }
  }

  return families;
};

const collectLocalFontFaces = (families: Set<string>) => {
  const faces: { baseUrl: string; cssText: string }[] = [];

  for (const sheet of document.styleSheets) {
    let rules: CSSRuleList;

    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }

    for (const rule of rules) {
      if (!(rule instanceof CSSFontFaceRule)) {
        continue;
      }

      const family = rule.style
        .getPropertyValue("font-family")
        .replaceAll(/["']/gu, "")
        .trim();

      if (families.has(family)) {
        faces.push({
          baseUrl: sheet.href ?? document.baseURI,
          cssText: rule.cssText,
        });
      }
    }
  }

  return faces;
};

const loadGoogleFontCss = () => {
  if (googleFontCss) {
    return googleFontCss;
  }

  googleFontCss = (async () => {
    try {
      const response = await fetch(GOOGLE_FONTS_HREF, { mode: "cors" });

      return response.ok ? await response.text() : "";
    } catch {
      return "";
    }
  })();

  return googleFontCss;
};

const collectGoogleFontFaces = async (families: Set<string>) => {
  const css = await loadGoogleFontCss();

  return [...css.matchAll(FONT_FACE_BLOCK)].flatMap((match) => {
    const family = FONT_FAMILY.exec(match[0])?.groups?.family?.trim();

    return family && families.has(family)
      ? [
          {
            baseUrl: "https://fonts.googleapis.com/",
            cssText: match[0],
          },
        ]
      : [];
  });
};

const buildFontEmbedCss = async (node: HTMLElement) => {
  const families = collectUsedFamilies(node);

  const faces = [
    ...collectLocalFontFaces(families),
    ...(await collectGoogleFontFaces(families)),
  ];

  const css = await Promise.all(
    faces.map(({ baseUrl, cssText }) => inlineFontUrls(cssText, baseUrl))
  );

  return css.join("\n");
};

export const captureShareCard = async (card: HTMLElement): Promise<Blob> => {
  const { toBlob } = await import("html-to-image");
  await document.fonts.ready;
  await Promise.allSettled(
    [...card.querySelectorAll("img")].map((image) => image.decode())
  );
  await Promise.allSettled(
    card.getAnimations({ subtree: true }).map((animation) => animation.finished)
  );

  const padding = 32;

  const {
    backgroundColor: background,
    backgroundImage,
    backgroundPosition,
    backgroundSize,
  } = getComputedStyle(document.body);

  const clone = card.cloneNode(true);

  if (!(clone instanceof HTMLElement)) {
    throw new Error("Could not prepare the share card.");
  }

  const sourceElements = [card, ...card.querySelectorAll("*")];
  const clonedElements = [clone, ...clone.querySelectorAll("*")];

  for (const [index, source] of sourceElements.entries()) {
    const target = clonedElements[index];

    if (!(target instanceof HTMLElement || target instanceof SVGElement)) {
      continue;
    }

    const computed = getComputedStyle(source);
    target.style.animation = "none";
    target.style.transition = "none";
    target.style.opacity = computed.opacity;

    // The image renderer deep-clones SVGs without resolving descendant CSS.
    // Bake the selected QR color and module/corner radii into the snapshot.
    if (target instanceof SVGElement) {
      for (const property of ["fill", "rx", "ry"]) {
        const value = computed.getPropertyValue(property);

        if (value && value !== "auto") {
          target.setAttribute(property, value);
        }
      }
    }
  }

  const container = document.createElement("div");
  container.setAttribute("aria-hidden", "true");
  container.inert = true;
  container.style.cssText = `position:fixed;inset:0 auto auto -100000px;width:${card.offsetWidth}px;pointer-events:none`;
  container.append(clone);
  document.body.append(container);

  try {
    const fontEmbedCSS = await buildFontEmbedCss(card);

    const backgroundStyle = {
      backgroundColor: background,
      boxSizing: "border-box",
      margin: "0",
      maxWidth: "none",
      padding: `${padding}px`,
    } satisfies Record<string, string>;

    if (backgroundImage && backgroundImage !== "none") {
      Object.assign(backgroundStyle, {
        backgroundAttachment: "scroll",
        backgroundImage,
        backgroundPosition,
        backgroundRepeat: "no-repeat",
        backgroundSize,
      });
    }

    const blob = await toBlob(clone, {
      backgroundColor: background,
      fontEmbedCSS,
      height: card.scrollHeight + padding * 2,
      pixelRatio: 2,
      preferredFontFormat: "woff2",
      style: backgroundStyle,
      width: card.offsetWidth + padding * 2,
    });

    if (!blob) {
      throw new Error("Could not create the share card image.");
    }

    return blob;
  } finally {
    container.remove();
  }
};
