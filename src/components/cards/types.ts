export interface CardMeta {
  avatar?: string;
  fallbackAvatar?: string;
  banner?: string;
  connections?: number | string;
  followers?: number | string;
  following?: number | string;
  friends?: number | string;
  headline?: string;
  joined?: string;
  location?: string;
  mutual?: number | string;
  name?: string;
  posts?: number | string;
}

export interface ContributionDay {
  count: number;
  date: string;
  level: number;
}

export interface CardPreview extends CardMeta {
  contributions?: ContributionDay[];
  contributionsYear?: number;
  contributionsTotal?: number;
  description?: string;
  image?: string;
  title?: string;
}

export type CardPreviews = Record<string, CardPreview | undefined>;

export interface CardData {
  description?: string;
  href: string;
  icon: string;
  meta?: CardPreview;
  title: string;
}

export type CardKind =
  | "facebook"
  | "github"
  | "instagram"
  | "linkedin"
  | "website"
  | "x";
