import type { LinkCard, QuickLink, SmallLink } from "../../content/schemas";

type ShareLink = Pick<QuickLink, "href" | "icon" | "label">;

export const shareLinkLabel = (href: string) => {
  const url = new URL(href);

  if (url.protocol === "mailto:" || url.protocol === "tel:") {
    return decodeURIComponent(url.pathname);
  }

  return `${url.hostname.replace(/^www\./u, "")}${url.pathname.replace(/\/$/u, "")}`;
};

export const getShareContacts = ({
  quick,
  rich,
  small,
}: {
  quick: QuickLink[];
  rich: LinkCard[];
  small: SmallLink[];
}): ShareLink[] => {
  const otherLinks = [...rich, ...small];

  const directContacts = otherLinks.filter(({ href }) =>
    /^(?:mailto|tel):/u.test(href)
  );

  const website = otherLinks.find(
    ({ href, icon }) => icon === "link" && /^https?:/u.test(href)
  );

  const contacts = [
    ...quick,
    ...directContacts.map(({ href, icon, title }) => ({
      href,
      icon,
      label: title,
    })),
    ...(website
      ? [{ href: website.href, icon: website.icon, label: website.title }]
      : []),
  ];

  return contacts.filter(
    ({ href }, index) =>
      contacts.findIndex((contact) => contact.href === href) === index
  );
};
