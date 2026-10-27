import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const personalCollection = defineCollection({
  schema: z.object({
    codeRepository: z.string(),
    ga4: z.string().optional(),
    githubUsername: z.string(),
    heading: z.string(),
    profileBio: z.string().optional(),
    profileName: z.string().optional(),
    slogan: z.object({
      highlight: z.string(),
      words: z.string(),
    }),
  }),
  type: "data",
});

const linksCollection = defineCollection({
  schema: z.array(
    z.object({
      description: z.string(),
      href: z.url(),
      icon: z.string(),
      title: z.string(),
    })
  ),
  type: "data",
});

const quickLinksCollection = defineCollection({
  schema: z.array(
    z.object({
      href: z.url(),
      icon: z.string(),
      label: z.string(),
    })
  ),
  type: "data",
});

const linkCardsCollection = defineCollection({
  schema: z.array(
    z.object({
      href: z.url(),
      icon: z.string(),
      title: z.string(),
    })
  ),
  type: "data",
});

export const collections = {
  "link-cards": linkCardsCollection,
  links: linksCollection,
  personal: personalCollection,
  "quick-links": quickLinksCollection,
};
