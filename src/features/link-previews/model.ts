import { z } from "astro/zod";

import type { LinkCard } from "../../content/schemas.ts";

const countSchema = z.union([z.number().finite().nonnegative(), z.string()]);

const contributionDaySchema = z.object({
  count: z.number().int().nonnegative(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
  level: z.number().int().min(0).max(4),
});

export const cardMetaSchema = z.object({
  avatar: z.url().optional(),
  banner: z.url().optional(),
  connections: countSchema.optional(),
  fallbackAvatar: z.url().optional(),
  followers: countSchema.optional(),
  following: countSchema.optional(),
  friends: countSchema.optional(),
  headline: z.string().optional(),
  joined: z.string().optional(),
  location: z.string().optional(),
  mutual: countSchema.optional(),
  name: z.string().optional(),
  posts: countSchema.optional(),
});

export const cardPreviewSchema = cardMetaSchema.extend({
  contributions: z.array(contributionDaySchema).optional(),
  contributionsTotal: z.number().int().nonnegative().optional(),
  contributionsYear: z.number().int().optional(),
  description: z.string().optional(),
  image: z.url().optional(),
  title: z.string().optional(),
});

export const cardPreviewsSchema = z.record(z.string(), cardPreviewSchema);

export type CardMeta = z.infer<typeof cardMetaSchema>;

export type ContributionDay = z.infer<typeof contributionDaySchema>;

export type CardPreview = z.infer<typeof cardPreviewSchema>;

export type CardPreviews = z.infer<typeof cardPreviewsSchema>;

export type CardData = LinkCard & {
  description?: string;
  meta?: CardPreview;
};

export type CardKind =
  | "facebook"
  | "github"
  | "instagram"
  | "linkedin"
  | "website"
  | "x";
