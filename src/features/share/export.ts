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
  const background = getComputedStyle(document.body).backgroundColor;
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
    const blob = await toBlob(clone, {
      backgroundColor: background,
      height: card.scrollHeight + padding * 2,
      pixelRatio: 2,
      preferredFontFormat: "woff2",
      style: {
        backgroundColor: background,
        boxSizing: "border-box",
        margin: "0",
        maxWidth: "none",
        padding: `${padding}px`,
      },
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
