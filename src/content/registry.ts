import linkCardsData from "./link-cards/link-cards.json" with { type: "json" };
import linksData from "./links/links.json" with { type: "json" };
import personalData from "./personal/profile.json" with { type: "json" };
import quickLinksData from "./quick-links/quick-links.json" with { type: "json" };
import {
  linkCardsSchema,
  personalProfileSchema,
  quickLinksSchema,
  smallLinksSchema,
} from "./schemas.ts";

export const personal = personalProfileSchema.parse(personalData);

export const linkSections = {
  quick: quickLinksSchema.parse(quickLinksData),
  rich: linkCardsSchema.parse(linkCardsData),
  small: smallLinksSchema.parse(linksData),
};

export const previewLinks = [
  ...linkSections.small,
  ...linkSections.quick,
  ...linkSections.rich,
].map(({ href }) => ({ href }));
