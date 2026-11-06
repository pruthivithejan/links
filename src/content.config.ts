import { defineCollection } from "astro:content";

import {
  linkCardsSchema,
  personalProfileSchema,
  quickLinksSchema,
  smallLinksSchema,
} from "./content/schemas.ts";

const personalCollection = defineCollection({
  schema: personalProfileSchema,
  type: "data",
});

const linksCollection = defineCollection({
  schema: smallLinksSchema,
  type: "data",
});

const quickLinksCollection = defineCollection({
  schema: quickLinksSchema,
  type: "data",
});

const linkCardsCollection = defineCollection({
  schema: linkCardsSchema,
  type: "data",
});

export const collections = {
  "link-cards": linkCardsCollection,
  links: linksCollection,
  personal: personalCollection,
  "quick-links": quickLinksCollection,
};
