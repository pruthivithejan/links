# Agent guide for Links

Links is a reusable personal links site. Customize the content for the person using it; keep the components available for other people and platforms.

## Stack and commands

The project uses Astro 7, TypeScript, Tailwind CSS v4, and Bun. `package.json` and `bun.lock` are the source of truth for dependency versions. The metadata scripts run TypeScript `.mts` files directly with Node; Node 24 works with this setup.

```bash
bun install
bun run dev                         # Local development
bun run prebuild                    # Fetch and cache public link metadata
bun run build                       # Refresh metadata, then build dist/
bun run preview                     # Serve the production build
bun run check                       # Vite+ formatting and lint checks
bun run astro build                 # Build using the existing metadata cache
node --test scripts/card-preview.test.mts  # Metadata parsing and cache tests
```

`bun run build` runs the `prebuild` lifecycle script. `bun run dev` and a direct Astro build do not refresh previews automatically. Run `bun run prebuild` after changing URLs during development.

## Make the site your own

### 1. Replace the personal profile

Edit `src/content/personal/profile.json`:

```json
{
  "heading": "Your Name | Links",
  "description": "A short description of your links page.",
  "favicon": {
    "light": "/favicon-light.svg",
    "dark": "/favicon-dark.svg"
  },
  "slogan": {
    "words": "Your closing quote",
    "highlight": "highlighted words"
  },
  "githubUsername": "yourhandle",
  "profileName": "Your Name",
  "profileBio": "A short introduction to what you do.",
  "siteUrl": "https://links.example.com/",
  "codeRepository": "links"
}
```

- `heading` sets the page title; `description` supplies the meta description.
- `favicon.light` and `favicon.dark` set the SVG paths for light and dark color schemes.
- `profileName` and `profileBio` supply the hero name and introduction. Both are optional; the name falls back to `githubUsername`.
- `siteUrl` is the full public homepage URL, including the protocol and any deployment subpath. It supplies the `/share/` QR destination and Astro's `site` setting. Replace it when cloning the repo; it does not set Astro's `base`.
- `githubUsername` supplies the hero's remote GitHub avatar and the owner in the footer repository URL.
- `codeRepository` supplies the repository name used by the footer GitHub icon. It does not configure the deployment base path.
- `slogan.words` and `slogan.highlight` supply the footer quote.

Changing `githubUsername` does not rewrite URLs in the link lists. Replace each configured URL with the intended account or website. Accounts can have different usernames on different services.

### 2. Choose where each link appears

There are three independent JSON lists. Array order controls display order within each section. Add, remove, or move entries between these files to arrange the page.

| Section | File | Entry fields |
| --- | --- | --- |
| Quick links: compact pills below the hero | `src/content/quick-links/quick-links.json` | `href`, `icon`, `label` |
| Rich link cards: website previews and social profile cards | `src/content/link-cards/link-cards.json` | `href`, `icon`, `title` |
| Small cards: title, description, and copy button | `src/content/links/links.json` | `href`, `icon`, `title`, `description` |

The page renders the hero, quick links, rich cards, small cards, and footer in that order. `src/pages/index.astro` composes these sections. A link appears only in the lists where it is explicitly configured; an icon never promotes a small card into a rich card. Remove an entry from its previous list when moving it to avoid duplication. Use `[]` when a list is not needed.

The current profile puts Email, Telegram, and WhatsApp in quick links; the two websites before GitHub and X in rich cards; and LinkedIn with the other small cards. These are content choices, not restrictions on the template.

#### Quick links

```json
[
  {
    "href": "mailto:hello@example.com",
    "icon": "mail",
    "label": "Email"
  },
  {
    "href": "https://t.me/yourhandle",
    "icon": "telegram",
    "label": "Telegram"
  },
  {
    "href": "https://wa.me/yourhandle",
    "icon": "whatsapp",
    "label": "WhatsApp"
  }
]
```

Replace `yourhandle` with the actual account username. The WhatsApp example uses its username link. Use the account's own share link if it has a different format. Quick links do not render hovercards or profile details.

#### Rich cards

```json
[
  {
    "href": "https://example.com/",
    "icon": "link",
    "title": "Website"
  },
  {
    "href": "https://github.com/yourhandle",
    "icon": "github",
    "title": "GitHub"
  }
]
```

The URL determines the rich card component, independently of its icon. GitHub and X profile URLs have dedicated cards; LinkedIn, Facebook, and Instagram hosts also have dedicated components. Other URLs use the website card. GitHub repository and X post URLs use website previews rather than the account profile card. Routing lives in `src/features/link-previews/routing.ts`.

Website cards show the full OG image at its natural aspect ratio across the card width, with the URL and fetched description below. They have automatic height and no icon beside the displayed URL. Social card details also come from fetched metadata; do not add manual bios, avatars, locations, or counts to rich-card JSON.

#### Small cards

```json
[
  {
    "href": "https://www.linkedin.com/in/yourhandle",
    "icon": "linkedin",
    "title": "LinkedIn",
    "description": "Connect with me on LinkedIn."
  }
]
```

Small-card descriptions are authored copy. They are separate from fetched rich-card profile details. Any platform can be placed here, even when a rich component exists for it.

### 3. Add or reuse icons

Icons live in `public/icons/`. An entry with `"icon": "whatsapp"` loads `/icons/whatsapp.svg`.

Check for an existing SVG before adding one. Use a clean SVG with a `viewBox`, consistent with the existing monochrome icons and theme filters. Store only the filename without `.svg` in JSON. Keep icons and reusable card components when removing someone's personal links. In particular, Facebook and Instagram remain supported even though this profile does not link to them.

### 4. Replace the remaining branding

The page title, meta description, and light/dark favicon paths are configured in `src/content/personal/profile.json`. Replace the favicon artwork in `public/` or point `favicon.light` and `favicon.dark` to your own assets; the current profile uses `public/pruthivi.svg` and `public/pruthivi-light.svg`.

Review the configured links, email address, footer repository, and profile introduction for the original owner's information. Keep the project license and attribution intact.

### 5. Customize the theme

`src/styles/global.css` owns the light/dark surface colors, typography, radii, shadows, motion tokens, and layout spacing. Tailwind v4 uses CSS-first configuration; do not introduce a Tailwind v3 configuration file.

- Use the existing variables, including `--bg-page`, `--card-bg`, `--card-border`, `--text-strong`, `--text-muted`, and `--primary`, when changing the visual theme. Preserve the existing color conventions, including OKLCH where used.
- Local fonts live in `src/assets/fonts/`. Theme Lab modes, palettes, fonts, avatar presets, and font loading are registered in `src/features/theme/registry.ts`.
- Theme Lab markup and styles live in `src/components/ThemeLab.astro`; validated preferences and browser behavior live in `src/features/theme/`. The head script normalizes stored preferences once, then the controller reads that same state. Choices persist in browser local storage under `links:theme-lab:v1`; they do not edit source files or change the default theme for other visitors. Use Reset when checking source defaults.
- Theme Lab and its trigger have opaque surfaces. On mobile below `48rem`, the trigger sits at the bottom right and the panel opens upward to the viewport width minus the page's left and right padding, using `calc()` and safe-area insets. Desktop retains a compact panel at the top right.
- `--page-inline-padding` is shared by the page and the mobile panel: `1rem` by default, `1.5rem` from `40rem`, and `6rem` from `48rem`. Update this shared variable when changing the page gutters.
- To ship a fixed design, set the `DEFAULT_*` values and source tokens for the intended look, then remove the `ThemeLab` component and its trigger from `src/pages/index.astro` and `src/pages/share.astro`.

### 6. Build for your host

Run `bun run build` and deploy the generated `dist/` directory using your host's static-site workflow. Hosting settings belong in `astro.config.mjs` and the host configuration. If deploying under a subpath, set Astro's `base`; public assets resolve through `src/utils/asset.ts`, and local fonts are bundled from `src/assets/fonts/`, so they follow the base path. Changing `codeRepository` alone does not handle this.

The included `.github/workflows/deploy.yml` deploys to GitHub Pages on pushes to `main`. It installs Bun, runs `bun install` and `bunx astro build`, uploads `dist/`, and deploys through GitHub Actions. Because CI uses `astro build` rather than `bun run build`, it builds from the committed `src/features/link-previews/cache.json`; refresh and commit the cache locally after changing URLs. Enable Pages with GitHub Actions as the source. For project pages, set `base` to the repository subpath. For a custom domain, set `site` and `base` for the root domain, add the domain to `public/CNAME`, point DNS at GitHub Pages (A/AAAA for an apex domain, CNAME for `www`), and enable HTTPS after DNS resolves. `siteUrl` in `profile.json` supplies Astro's `site` and the share QR destination.

### 7. Share your profile

`/share/` reuses the hero profile and theme. The QR is generated at build time with `uqr` and opens `share/` relative to `siteUrl`. The “All links” button returns to the homepage. Contact rows reuse the quick links, email/telephone links from the other lists, and the first HTTP(S) rich or small link with the `link` icon. Do not duplicate these details in a separate profile.

Theme Lab on this page adds module shape, corner shape, and ink/theme color controls. The registry owns their options and defaults; the head script and controller restore the same validated state. QR preferences use the existing browser storage key and Reset/Surprise me behavior. Keep the QR's white background, four-module quiet zone, fixed timing/alignment modules, and dark foreground when styling it. “Save card” captures `[data-share-card]` as a PNG with `html-to-image`, preserving the current profile, theme, and QR appearance. Keep navigation, action buttons, and Theme Lab outside the saved image. Show copy/save feedback within the buttons, with accessible live labels.

## Fetched preview data

`src/content/registry.ts` validates the profile and all three link lists. `scripts/fetch-card-previews.mts` refreshes the cache at `src/features/link-previews/cache.json`; provider fetching, parsing, and cache updates live in `src/features/link-previews/pipeline.ts`.

- Each unique HTTP(S) URL is fetched once per refresh; non-web URLs such as `mailto:` are skipped.
- Website metadata comes from public Open Graph tags and JSON-LD. GitHub profile data comes from the GitHub API, contributions from `github-contributions-api.jogruber.de`, and X profiles from FxTwitter with a public-page fallback.
- The generated cache stores fetched fields and remote image URLs. Do not download profile avatars into `public/`, manually fill the cache, or invent missing profile information.
- When a fetch fails or a site blocks public access, keep any previously fetched metadata for that exact URL. Without cached details, omit unavailable bios, locations, counts, and contribution data. Zero is a valid fetched count.
- A missing or failed social avatar may reuse an avatar fetched for another configured card or link. Reuse only the image; never copy another account's name, bio, location, or metrics. If no avatar is available, retain the component's icon or initials where provided.
- Removed URLs are pruned from the cache. New owners should refresh it after replacing the original links.
- Rich previews render from the build cache; they do not call metadata APIs in the browser. Remote images and fonts still load when someone visits the page.

There is no active Microlink hovercard pipeline, `fetch-link-previews.mjs`, or `src/data/link-previews.json`. Do not restore these older paths when making changes. A blocked site may render better as an authored small card.

## Architecture

| Path | Responsibility |
| --- | --- |
| `src/content/` | Personal profile, link lists, schemas, and validated registry |
| `src/components/Hero.astro` | Profile introduction and remote GitHub avatar |
| `src/components/QuickLinks.astro` | Compact link pills |
| `src/components/LinkCards.astro` | Rich-card routing and fetched metadata |
| `src/components/ui/` | Reusable Button, Card family, CopyButton, Avatar, Icon, and PreviewImage primitives, plus the initials helper |
| `src/components/cards/` | GitHub, X, LinkedIn, Facebook, Instagram, and website rich cards, now built on the `ui` primitives with no shared CardShell |
| `src/features/link-previews/` | Preview schemas, provider parsing/fetching, cache updates, routing, and generated cache |
| `src/components/SmallLinks.astro` | Small-card layout |
| `src/components/links/CopyLinkButton.astro` | Small-card copy control; thin wrapper around `ui/CopyButton.astro` |
| `src/components/BuildYourOwn.astro` | Footer copy-prompt control for the build prompt |
| `src/content/build-prompt.ts` | Extracts the build prompt from the AGENTS.md markers at build time |
| `src/utils/cn.ts` | Shared class-name join helper used by the UI primitives |
| `src/utils/asset.ts` | Resolves public asset paths against Astro's configured base path |
| `src/components/ThemeLab.astro` | Theme Lab markup and scoped styles |
| `src/features/theme/` | Theme option registry, preference validation, color tokens, and browser controller |
| `src/layouts/Layout.astro` | HTML wrapper, profile metadata and icons, font loading, and initial theme restoration |
| `src/pages/index.astro` | Page section composition and footer |
| `src/pages/share.astro` | Share profile layout and contact links |
| `src/components/ShareQr.astro` | Build-time QR encoding and themed SVG rendering |
| `src/features/share/` | Contact selection and share/copy/download behavior |
| `src/styles/global.css` | Shared theme, layout, typography, and motion styles |
| `scripts/card-preview.test.mts` | Preview parsing and cache regression tests |
| `astro.config.mjs` | Astro and Tailwind Vite plugin configuration |
| `vite.config.ts` | Vite+ formatting, lint, and staged-file checks |

### UI primitives

Content components compose the primitives in `src/components/ui/`: `Button`, the `Card` family (`Card`, `CardHeader`, `CardContent`, `CardFooter`, `CardMedia`, `CardTitle`, `CardDescription`), `Icon`, `Avatar`, `CopyButton`, and `PreviewImage`. The class-name helper `src/utils/cn.ts` joins their class lists, and `src/components/ui/initials.ts` supplies avatar fallbacks.

Reuse these primitives for new UI instead of re-adding card, button, icon, avatar, preview, or copy markup. Platform cards in `src/components/cards/` compose the `Card` family directly; there is no shared `CardShell`. `src/utils/asset.ts` prefixes public asset paths with Astro's base URL, so icons, favicons, and other public files keep working under a deployment subpath.

`CopyButton` owns clipboard behavior: the Clipboard API with a legacy `execCommand` fallback, icon or inline-label swap, the `data-copied` state, and screen-reader status messages. Use its `icon` variant for icon-only actions and its `bare` variant for an inline label with no background. `src/components/links/CopyLinkButton.astro` and `src/components/BuildYourOwn.astro` are thin wrappers that pass text and labels.

## Working rules and verification

- Prefer content edits for personalizing or rearranging links. Preserve the reusable components and unrelated work in the checkout.
- Keep `src/content/schemas.ts`, the validated registry, and component props in sync when introducing new content options.
- Give interactive elements descriptive classes, data attributes, or unique IDs. Preserve keyboard access, focus restoration, ARIA state, and reduced-motion behavior.
- For URL or link-list edits, run `bun run build` to refresh previews and validate the site. Review generated cache changes along with the content.
- For component, schema, or styling edits that do not change URLs, run `bun run astro build` with the existing cache, plus `bun run check`.
- When changing metadata fetching or parsing, also run `node --test scripts/card-preview.test.mts` and exercise the refresh. Network failures should warn and preserve usable cached data rather than break the site build.
- Documentation-only changes need formatting checks, not a metadata refresh.
- The site owner handles visual checks. Do not launch or automate a browser unless explicitly asked.

## Build your own with an AI agent

The footer's **Build Your Own** button copies the prompt below from this file, so the copy button and this document never drift apart. A separate GitHub icon beside it links to the source repository. The start and end markers are required: `src/content/build-prompt.ts` reads the text between them at build time. Do not remove or rename the markers.

<!-- build-prompt:start -->

Build a personal links page for me from this repository (Astro 7, TypeScript, Tailwind CSS v4, and Bun), then deploy it to GitHub Pages.

Work step by step. Ask me one short group of questions at a time, wait for my answers, and only then change files. Do not invent my name, bio, links, or profile data.

1. Profile

- Ask for my display name, GitHub username, one-sentence bio, page title, meta description, and a short closing slogan with the words you should highlight.
- Ask whether to keep the GitHub avatar or use a different image URL.
- Ask for a favicon preference only if I already have artwork; otherwise keep the template favicon for now.

2. Links

- Ask me for every link I want, in the order I want them displayed. For each link, collect its label or title, URL, icon name, and any optional description.
- Then ask which section each link belongs to:
  - quick link: a compact pill below the hero, best for email, Telegram, WhatsApp, and short contact links.
  - rich link card: a large preview card with fetched metadata, best for websites, GitHub, X, LinkedIn, Facebook, and Instagram profiles.
  - small card: a simple card with a title, an authored description, and a copy button.
- A link belongs in only one list. Recommend the best section for each URL, but let me decide. Use `src/content/quick-links/quick-links.json`, `src/content/link-cards/link-cards.json`, and `src/content/links/links.json`. Check `public/icons/` before adding an icon, and add a clean SVG only when needed.

3. Base style

- Run `bun install` and `bun run dev`, then open the local site in my browser.
- Ask me to open Theme Lab and choose my base style: light or dark mode, palette or ink color, title and body fonts, avatar shape, borders, and shadows.
- If I want a font that is not listed, offer to add it. For a local font, place the file in `src/assets/fonts/`, add an `@font-face` rule in `src/styles/global.css`, and register it in `src/features/theme/registry.ts`. For a Google font, add it to the Theme Lab registry and to the Google Fonts URL in that registry.
- When I confirm the look, save it as the site default in source, not only in browser local storage. Update `DEFAULT_FONT_ID`, `DEFAULT_PALETTE_ID`, and `DEFAULT_AVATAR_ID` in `src/features/theme/registry.ts`; persist the chosen palette tokens and mode defaults so every visitor sees them; and keep the values consistent between `Layout.astro` and the theme controller.
- Ask whether Theme Lab should stay visible to visitors. If I say no, remove the `ThemeLab` component and its trigger from `src/pages/index.astro` and `src/pages/share.astro` while keeping the saved base style as the default.

4. Build and verify

- Replace `src/content/personal/profile.json`, then fill all three link lists. Remove template links and the original owner's details.
- Run `bun run build` to refresh rich-card metadata and validate the site, then run `bun run check` and fix anything that fails.
- Refresh the metadata cache after changing URLs. If a site blocks public fetching, keep usable cached data and tell me which preview is incomplete instead of inventing details.
- Confirm the home page, `/share/`, Theme Lab when enabled, and the copy buttons work locally.

5. Deploy to GitHub Pages

- Ask whether I have a custom domain.
- If I do not: create or use a GitHub repository, set Astro's `site` and `base` for the repository subpath (for example `base: "/my-links/"`), keep the GitHub Actions workflow that builds with Bun and deploys `dist/`, enable Pages with GitHub Actions as the source, and give me the final `https://<username>.github.io/<repo>/` URL.
- If I do: ask for the domain, set `site` and `base` for the root domain, add the domain to `public/CNAME`, and explain the DNS records: A and AAAA records for an apex domain, or a CNAME for `www`. Tell me to enable HTTPS in GitHub Pages after DNS resolves.
- Update `siteUrl`, `githubUsername`, and `codeRepository` in `src/content/personal/profile.json` to match the live deployment before the final build.
- Finish by giving me the live URL, the repository URL, and a short checklist of what I should customize later.

Keep the existing components, accessibility behavior, reduced-motion support, and license attribution. Prefer content edits over rewriting components.
<!-- build-prompt:end -->
