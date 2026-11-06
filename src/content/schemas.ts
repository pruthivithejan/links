import { z } from "astro/zod";

const linkSchema = z.object({
  href: z.url(),
  icon: z.string(),
});

export const personalProfileSchema = z.object({
  codeRepository: z.string(),
  description: z.string(),
  favicon: z.object({
    dark: z.string(),
    light: z.string(),
  }),
  githubUsername: z.string(),
  heading: z.string(),
  profileBio: z.string().optional(),
  profileName: z.string().optional(),
  slogan: z.object({
    highlight: z.string(),
    words: z.string(),
  }),
});

export const smallLinksSchema = z.array(
  linkSchema.extend({
    description: z.string(),
    title: z.string(),
  })
);

export const quickLinksSchema = z.array(
  linkSchema.extend({
    label: z.string(),
  })
);

export const linkCardsSchema = z.array(
  linkSchema.extend({
    title: z.string(),
  })
);

export type PersonalProfile = z.infer<typeof personalProfileSchema>;

export type SmallLink = z.infer<(typeof smallLinksSchema)["element"]>;

export type QuickLink = z.infer<(typeof quickLinksSchema)["element"]>;

export type LinkCard = z.infer<(typeof linkCardsSchema)["element"]>;
