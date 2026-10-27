import type { CardData, CardKind, CardPreviews } from "./types.ts";

interface ParsedLink {
  host: string;
  parts: string[];
}

export const parseLink = (href: string): ParsedLink => {
  try {
    const url = new URL(href);

    return {
      host: url.hostname.replace(/^www\./u, ""),
      parts: url.pathname.split("/").filter(Boolean).map(decodeURIComponent),
    };
  } catch {
    return { host: "", parts: [] };
  }
};

export const getKind = (host: string, parts?: string[]): CardKind => {
  if (
    parts &&
    parts.length !== 1 &&
    (host === "github.com" || host === "x.com" || host === "twitter.com")
  ) {
    return "website";
  }

  if (host === "github.com") {
    return "github";
  }

  if (host === "x.com" || host === "twitter.com") {
    return "x";
  }

  for (const platform of ["linkedin", "facebook", "instagram"] as const) {
    if (host === `${platform}.com` || host.endsWith(`.${platform}.com`)) {
      return platform;
    }
  }

  return "website";
};

export const getUsername = (kind: CardKind, parts: string[]) => {
  if (kind === "website") {
    return "";
  }

  if (kind === "linkedin") {
    return (parts[0] === "in" ? parts[1] : parts.at(-1)) || "";
  }

  return (parts[0] || "").replace(/^@/u, "");
};

export const resolveCard = (
  card: CardData,
  previews: CardPreviews,
  fallbackAvatar?: string
) => {
  const { host, parts } = parseLink(card.href);
  const kind = getKind(host, parts);
  const username = getUsername(kind, parts);
  const preview = previews[card.href] || {};

  return {
    card: {
      ...card,
      // Profile details come only from this URL's fetched metadata.
      description: preview.description,
      meta: {
        ...preview,
        avatar: preview.avatar || fallbackAvatar,
        fallbackAvatar,
      },
    },
    host,
    kind,
    name: preview.name || username || card.title,
    username,
  };
};

export const formatCount = (value: number | string) => {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return String(value);
  }

  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 1,
    notation: "compact",
  }).format(amount);
};
