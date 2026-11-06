import type { ThemeMode } from "./registry";

export const normalizeHex = (value: string | undefined): string | null => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  const short = /^#?(?<r>[\da-f])(?<g>[\da-f])(?<b>[\da-f])$/iu.exec(trimmed);

  if (short?.groups) {
    const { r, g, b } = short.groups;

    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }

  const full = /^#?(?<hex>[\da-f]{6})$/iu.exec(trimmed);

  return full?.groups ? `#${full.groups.hex}`.toLowerCase() : null;
};

type RGB = [number, number, number];

const parseHex = (hex: string): RGB => {
  const normalized = normalizeHex(hex) ?? "#2d2d2d";

  return [
    Number.parseInt(normalized.slice(1, 3), 16),
    Number.parseInt(normalized.slice(3, 5), 16),
    Number.parseInt(normalized.slice(5, 7), 16),
  ];
};

const toHex = (rgb: RGB): string =>
  `#${rgb
    .map((channel) =>
      Math.min(255, Math.max(0, Math.round(channel)))
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`;

const blend = (rgb: RGB, target: RGB, amount: number): RGB => [
  rgb[0] + (target[0] - rgb[0]) * amount,
  rgb[1] + (target[1] - rgb[1]) * amount,
  rgb[2] + (target[2] - rgb[2]) * amount,
];

const luminance = (rgb: RGB): number => {
  const [r, g, b] = rgb.map((channel) => {
    const value = channel / 255;

    return value <= 0.0405 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const onColor = (rgb: RGB): string =>
  luminance(rgb) > 0.42 ? "#111111" : "#ffffff";

const readablePrimary = (rgb: RGB, mode: ThemeMode): RGB => {
  const light = luminance(rgb);

  if (mode === "light" && light > 0.82) {
    return blend(rgb, [17, 17, 17], 0.45);
  }

  if (mode === "dark" && light < 0.18) {
    return blend(rgb, [255, 255, 255], 0.34);
  }

  return rgb;
};

export const buildThemeTokens = (accent: string, mode: ThemeMode) => {
  const rgb = parseHex(accent);

  if (mode === "light") {
    const primary = readablePrimary(rgb, "light");
    const primaryHex = toHex(primary);

    return {
      "--bg-page": `color-mix(in oklab, ${accent} 4%, #fdfdfd)`,
      "--border": `color-mix(in srgb, ${accent} 12%, transparent)`,
      "--card-bg": `color-mix(in oklab, ${accent} 1.5%, #ffffff)`,
      "--card-bg-hover": `color-mix(in oklab, ${accent} 4%, #ffffff)`,
      "--card-border": `color-mix(in srgb, ${accent} 12%, rgb(0 0 0 / 0.06))`,
      "--card-border-hover": `color-mix(in srgb, ${accent} 48%, transparent)`,
      "--chip-bg": `color-mix(in oklab, ${accent} 8%, #f4f4f4)`,
      "--chip-bg-hover": `color-mix(in oklab, ${accent} 13%, #f4f4f4)`,
      "--chip-bg-pressed": `color-mix(in oklab, ${accent} 17%, #efefef)`,
      "--primary": primaryHex,
      "--primary-foreground": onColor(primary),
      "--ring": `color-mix(in srgb, ${primaryHex} 42%, transparent)`,
      "--text-muted": `color-mix(in oklab, ${accent} 18%, #6c6c6c)`,
      "--text-strong": `color-mix(in oklab, ${accent} 9%, #0d0d0d)`,
      "--text-subtle": `color-mix(in oklab, ${accent} 18%, #767676)`,
      "--theme-accent": primaryHex,
      "--theme-glow": `color-mix(in oklab, ${primaryHex} 9%, transparent)`,
      "--theme-halo": `color-mix(in srgb, ${primaryHex} 16%, transparent)`,
    };
  }

  const lifted = blend(rgb, [255, 255, 255], 0.3);
  const primary = readablePrimary(lifted, "dark");
  const primaryHex = toHex(primary);

  return {
    "--bg-page": `color-mix(in oklab, ${accent} 5%, #121212)`,
    "--border": `color-mix(in srgb, ${primaryHex} 16%, transparent)`,
    "--card-bg": `color-mix(in oklab, ${accent} 7%, #181818)`,
    "--card-bg-hover": `color-mix(in oklab, ${accent} 10%, #181818)`,
    "--card-border": `color-mix(in srgb, ${primaryHex} 18%, transparent)`,
    "--card-border-hover": `color-mix(in srgb, ${primaryHex} 48%, transparent)`,
    "--chip-bg": `color-mix(in oklab, ${accent} 14%, #1c1c1c)`,
    "--chip-bg-hover": `color-mix(in oklab, ${accent} 20%, #1c1c1c)`,
    "--chip-bg-pressed": `color-mix(in oklab, ${accent} 17%, #1c1c1c)`,
    "--primary": primaryHex,
    "--primary-foreground": onColor(primary),
    "--ring": `color-mix(in srgb, ${primaryHex} 42%, transparent)`,
    "--text-muted": `color-mix(in oklab, ${accent} 16%, #a9a9a9)`,
    "--text-strong": `color-mix(in oklab, ${accent} 7%, #ffffff)`,
    "--text-subtle": `color-mix(in oklab, ${accent} 12%, #767676)`,
    "--theme-accent": primaryHex,
    "--theme-glow": `color-mix(in oklab, ${primaryHex} 8%, transparent)`,
    "--theme-halo": `color-mix(in srgb, ${primaryHex} 14%, transparent)`,
  };
};

export const THEME_TOKEN_KEYS = Object.keys(
  buildThemeTokens("#2d2d2d", "light")
);
