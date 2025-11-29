import { defineCollection, z } from 'astro:content';

const personalCollection = defineCollection({
  type: 'data',
  schema: z.object({
    heading: z.string(),
    slogan: z.object({
      words: z.string(),
      highlight: z.string(),
    }),
    githubUsername: z.string(),
    codeRepository: z.string(),
    ga4: z.string().optional(),
  }),
});

const linksCollection = defineCollection({
  type: 'data',
  schema: z.array(
    z.object({
      href: z.string().url(),
      icon: z.string(),
      title: z.string(),
      description: z.string(),
    })
  ),
});

export const collections = {
  personal: personalCollection,
  links: linksCollection,
};
