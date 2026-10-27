import assert from "node:assert/strict";
import { test } from "node:test";

import { getKind, resolveCard } from "../src/components/cards/preview.ts";
import { parsePreview, updatePreviews } from "./card-preview.mts";

test("parses quoted metadata, entities, and relative images from a website", () => {
  const preview = parsePreview(
    `<title>Example</title>
    <meta content='A designer&#39;s &quot;work&quot; &amp; code' property="og:description">
    <meta property="og:image" content="/preview.png">`,
    "https://example.com/person"
  );

  assert.equal(preview?.description, 'A designer\'s "work" & code');
  assert.equal(preview?.image, "https://example.com/preview.png");
  assert.equal(preview?.avatar, undefined);
});

test("uses public profile metadata and structured data without inventing missing counts", () => {
  const preview = parsePreview(
    `<meta property="og:title" content="Someone Else | LinkedIn">
    <meta property="og:description" content="Fetched headline">
    <meta property="og:image" content="https://cdn.example.com/avatar.jpg">
    <script type="application/ld+json">{broken}</script>
    <script type="application/ld+json">{"@graph":[{"@type":"Person","name":"Someone Else","address":{"addressLocality":"City"},"interactionStatistic":{"interactionType":"https://schema.org/FollowAction","userInteractionCount":0}}]}</script>`,
    "https://www.linkedin.com/in/someone"
  );

  assert.equal(preview?.name, "Someone Else");
  assert.equal(preview?.headline, "Fetched headline");
  assert.equal(preview?.avatar, "https://cdn.example.com/avatar.jpg");
  assert.equal(preview?.followers, 0);
  assert.equal(preview?.connections, undefined);
  assert.equal(preview?.location, "City");
});

test("rejects auth pages and unsafe images", () => {
  assert.equal(
    parsePreview(
      '<title>LinkedIn Login, Sign in</title><meta property="og:image" content="/brand.png">',
      "https://linkedin.com/in/person"
    ),
    null
  );
  assert.equal(
    parsePreview(
      "<title>Log in | Instagram</title>",
      "https://instagram.com/person"
    ),
    null
  );

  const preview = parsePreview(
    '<title>Work</title><meta property="og:image" content="javascript:alert(1)">',
    "https://example.com"
  );

  assert.equal(preview?.image, undefined);
});

test("keeps fetched cache on errors, prunes removed links, and fetches duplicate URLs once", async () => {
  const calls: string[] = [];
  const href = "https://example.com/person";

  const cache = {
    [href]: {
      avatar: "https://cdn.example.com/person.jpg",
      name: "Fetched Person",
    },
    "https://removed.example.com": { name: "Removed" },
  };

  const result = await updatePreviews(
    [{ href }, { href }, { href: "mailto:me@example.com" }],
    cache,
    (url) => {
      calls.push(url);

      return Promise.reject(new Error("offline"));
    }
  );

  assert.deepEqual(calls, [href]);
  assert.deepEqual(result, { [href]: cache[href] });
});

test("a successful refresh removes stale details and ignores manual metadata", async () => {
  const href = "https://linkedin.com/in/person";

  const result = await updatePreviews(
    [{ href }],
    { [href]: { connections: "500+" } },
    () => Promise.resolve({ name: "New Name" })
  );

  const resolved = resolveCard(
    {
      description: "Manual bio",
      href,
      icon: "linkedin",
      meta: { connections: "999", name: "Wrong Person" },
      title: "LinkedIn",
    },
    result,
    "https://cdn.example.com/shared.jpg"
  );

  assert.equal(resolved.name, "New Name");
  assert.equal(resolved.card.meta.connections, undefined);
  assert.equal(resolved.card.description, undefined);
  assert.equal(resolved.card.meta.avatar, "https://cdn.example.com/shared.jpg");
});

test("unknown details stay absent, and URL hosts determine the component", () => {
  const resolved = resolveCard(
    { href: "https://instagram.com/someone", icon: "link", title: "Instagram" },
    {},
    "https://cdn.example.com/another.jpg"
  );

  assert.equal(resolved.kind, "instagram");
  assert.equal(resolved.name, "someone");
  assert.equal(
    resolved.card.meta.avatar,
    "https://cdn.example.com/another.jpg"
  );
  assert.equal(resolved.card.meta.followers, undefined);
  assert.equal(resolved.card.meta.headline, undefined);
  assert.equal(getKind("linkedin.com.evil.example"), "website");
});
