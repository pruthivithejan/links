const absoluteUrl = /^(?:[a-z][a-z\d+.-]*:)?\/\//iu;

/**
 * Resolve a root-relative public asset against Astro's configured base path.
 * Remote and data URLs are returned unchanged.
 */
export const assetUrl = (path: string) => {
  if (absoluteUrl.test(path) || path.startsWith("data:")) {
    return path;
  }

  const base = import.meta.env.BASE_URL.replace(/\/$/u, "");
  const relativePath = path.replace(/^\//u, "");

  return `${base}/${relativePath}`;
};
