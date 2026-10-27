import { z } from "astro/zod";
import { load } from "cheerio";

import {
  getKind,
  getUsername,
  parseLink,
} from "../src/components/cards/preview.ts";
import type {
  CardPreview,
  CardPreviews,
} from "../src/components/cards/types.ts";

/* oxlint-disable promise/prefer-await-to-then, unicorn/no-useless-undefined -- These catches are Zod validation fallbacks, not promises. */
const optionalText = z.string().trim().min(1).optional().catch(undefined);

const optionalCount = z
  .number()
  .finite()
  .nonnegative()
  .optional()
  .catch(undefined);

const imageSchema = z.union([
  z.string().transform((url) => ({ url })),
  z
    .object({ contentUrl: optionalText, url: optionalText })
    .transform((image) => ({ url: image.url || image.contentUrl })),
]);

const statisticSchema = z.object({
  interactionType: z.union([
    z.string(),
    z.object({ "@type": z.string() }).transform((action) => action["@type"]),
  ]),
  userInteractionCount: optionalCount,
});

const personSchema = z.object({
  "@type": z
    .union([z.string().transform((type) => [type]), z.array(z.string())])
    .optional(),
  address: z
    .union([
      z.string(),
      z
        .object({ addressCountry: optionalText, addressLocality: optionalText })
        .transform((address) =>
          [address.addressLocality, address.addressCountry]
            .filter(Boolean)
            .join(", ")
        ),
    ])
    .optional()
    .catch(undefined),
  description: optionalText,
  image: z
    .union([imageSchema, z.array(imageSchema)])
    .optional()
    .catch(undefined),
  interactionStatistic: z
    .union([statisticSchema, z.array(statisticSchema)])
    .optional()
    .catch(undefined),
  jobTitle: optionalText,
  name: optionalText,
  url: optionalText,
});

const structuredSchema = personSchema.extend({
  "@graph": z.array(personSchema).optional().catch(undefined),
  mainEntity: personSchema.optional().catch(undefined),
});

const jsonLdSchema = z.union([structuredSchema, z.array(structuredSchema)]);

const githubSchema = z.object({
  avatar_url: optionalText,
  bio: optionalText,
  followers: optionalCount,
  following: optionalCount,
  location: optionalText,
  login: z.string(),
  name: optionalText,
});

const xSchema = z.object({
  user: z.object({
    avatar_url: optionalText,
    banner_url: optionalText,
    description: optionalText,
    followers: optionalCount,
    following: optionalCount,
    joined: optionalText,
    name: optionalText,
    tweets: optionalCount,
  }),
});

const contributionsSchema = z.object({
  contributions: z.array(
    z.object({
      count: z.number().int().nonnegative(),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
      level: z.number().int().min(0).max(4),
    })
  ),
  total: z.record(z.string(), z.number().int().nonnegative()),
});

/* oxlint-enable promise/prefer-await-to-then, unicorn/no-useless-undefined */

export const remoteUrl = (value?: string, base?: string) => {
  if (!value?.trim()) {
    return;
  }

  try {
    const url = new URL(value, base);

    if (["http:", "https:"].includes(url.protocol)) {
      return url.href;
    }
  } catch {
    // Invalid image and non-web URLs are omitted.
  }
};

const imageUrl = (
  value: z.infer<typeof personSchema>["image"],
  base: string
) => {
  const item = Array.isArray(value) ? value[0] : value;

  return remoteUrl(item?.url, base);
};

const applyPerson = (
  preview: CardPreview,
  person: z.infer<typeof personSchema>,
  url: string
) => {
  preview.name = person.name || preview.name;
  preview.headline = person.description || person.jobTitle || preview.headline;
  preview.avatar = imageUrl(person.image, url) || preview.avatar;
  preview.location = person.address || undefined;

  for (const statistic of [person.interactionStatistic].flat()) {
    if (!statistic) {
      continue;
    }

    if (statistic.interactionType.endsWith("FollowAction")) {
      preview.followers = statistic.userInteractionCount;
    }
  }
};

const applyStructuredData = (
  preview: CardPreview,
  blocks: string[],
  url: string
) => {
  for (const block of blocks) {
    try {
      const result = jsonLdSchema.safeParse(JSON.parse(block));

      if (!result.success) {
        continue;
      }

      const roots = [result.data].flat();

      const people = roots.flatMap((entry) => [
        entry,
        ...(entry["@graph"] || []),
        entry.mainEntity,
      ]);

      const person = people.find(
        (entry) =>
          entry &&
          entry["@type"]?.includes("Person") &&
          (!entry.url ||
            remoteUrl(entry.url, url)?.replace(/\/$/u, "") ===
              url.replace(/\/$/u, ""))
      );

      if (person) {
        applyPerson(preview, person, url);
      }
    } catch {
      // Malformed JSON-LD must not discard valid Open Graph metadata.
      continue;
    }
  }
};

export const parsePreview = (html: string, url: string): CardPreview | null => {
  const $ = load(html);

  const meta = (names: string[]) =>
    names
      .map((name) =>
        optionalText.parse(
          $(`meta[property="${name}"], meta[name="${name}"]`)
            .first()
            .attr("content")
        )
      )
      .find(Boolean);

  const { host, parts } = parseLink(url);
  const kind = getKind(host, parts);

  const title =
    meta(["og:title", "twitter:title"]) ||
    optionalText.parse($("title").first().text());

  // Authentication and challenge pages aren't profile metadata.
  if (
    title &&
    /^(?:log[ -]?in|sign[ -]?in|sign[ -]?up|join linkedin|linkedin login|facebook|instagram|x|just a moment|access denied)(?:\b|$)/iu.test(
      title
    )
  ) {
    return null;
  }

  const description = meta([
    "og:description",
    "twitter:description",
    "description",
  ]);

  const image = remoteUrl(
    meta([
      "og:image:secure_url",
      "og:image",
      "twitter:image",
      "twitter:image:src",
    ]),
    url
  );

  const preview: CardPreview = { description, image, title };

  if (kind !== "website") {
    preview.name =
      title
        ?.replace(/\s*\(@[^)]+\).*$/u, "")
        .replace(
          /\s*[-|·]\s*(?:LinkedIn|Facebook|Instagram|X|Twitter).*$/iu,
          ""
        )
        .trim() || undefined;
    preview.headline = description;
    preview.avatar = image;
  }

  applyStructuredData(
    preview,
    $('script[type="application/ld+json"]')
      .map((_index, script) => $(script).text())
      .get(),
    url
  );

  return Object.values(preview).some((value) => value !== undefined)
    ? preview
    : null;
};

const request = async (url: string, accept: string) => {
  const response = await fetch(url, {
    headers: {
      accept,
      "user-agent": "Mozilla/5.0 (compatible; LinksPreview/1.0)",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} from ${new URL(url).hostname}`);
  }

  return response;
};

const fetchContributions = async (username: string): Promise<CardPreview> => {
  const year = new Date().getUTCFullYear();

  const response = await request(
    `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=${year}`,
    "application/json"
  );

  const data = contributionsSchema.parse(await response.json());
  const today = new Date().toISOString().slice(0, 10);

  const contributions = data.contributions
    .filter((day) => day.date <= today)
    .toSorted((a, b) => a.date.localeCompare(b.date));

  if (contributions.length === 0) {
    return {};
  }

  return {
    contributions,
    contributionsTotal: data.total[String(year)],
    contributionsYear: year,
  };
};

export const fetchPreview = async (
  url: string
): Promise<CardPreview | null> => {
  const { host, parts } = parseLink(url);
  const kind = getKind(host, parts);
  const username = getUsername(kind, parts);

  if (kind === "github" && username) {
    const [response, activity] = await Promise.all([
      request(
        `https://api.github.com/users/${encodeURIComponent(username)}`,
        "application/json"
      ),
      fetchContributions(username).catch(() => ({})),
    ]);

    const profile = githubSchema.parse(await response.json());

    return {
      ...activity,
      avatar: remoteUrl(profile.avatar_url),
      followers: profile.followers,
      following: profile.following,
      headline: profile.bio,
      location: profile.location,
      name: profile.name || profile.login,
    };
  }

  if (kind === "x" && username) {
    try {
      const response = await request(
        `https://api.fxtwitter.com/${encodeURIComponent(username)}`,
        "application/json"
      );

      const { user } = xSchema.parse(await response.json());

      return {
        avatar: remoteUrl(user.avatar_url?.replace("_normal", "_400x400")),
        banner: remoteUrl(user.banner_url),
        followers: user.followers,
        following: user.following,
        headline: user.description,
        joined: user.joined,
        name: user.name,
        posts: user.tweets,
      };
    } catch {
      // Try the public page when the profile API is unavailable.
    }
  }

  const response = await request(url, "text/html,application/xhtml+xml");

  return parsePreview(await response.text(), response.url || url);
};

export const updatePreviews = async (
  links: { href: string }[],
  previous: CardPreviews,
  fetcher = fetchPreview
): Promise<CardPreviews> => {
  const result: CardPreviews = {};

  for (const href of new Set(links.map((link) => link.href))) {
    const url = remoteUrl(href);

    if (!url) {
      continue;
    }

    try {
      // Fetch each unique URL once, sequentially to avoid bursts to the same host.
      // oxlint-disable-next-line no-await-in-loop
      const preview = await fetcher(url);
      result[href] = preview || previous[href];

      if (!preview) {
        console.warn(
          `No public card metadata for ${href}; keeping any fetched cache.`
        );
      }
    } catch (error) {
      result[href] = previous[href];
      console.warn(
        `Card preview failed for ${href}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  return result;
};
