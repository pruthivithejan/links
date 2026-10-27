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
  "slogan": {
    "words": "Your closing quote",
    "highlight": "highlighted words"
  },
  "githubUsername": "yourhandle",
  "profileName": "Your Name",
  "profileBio": "A short introduction to what you do.",
  "codeRepository": "links"
}
```

- `heading` sets the page title.
- `profileName` and `profileBio` supply the hero name and introduction. Both are optional; the name falls back to `githubUsername`.
- `githubUsername` supplies the hero's remote GitHub avatar and the owner in the footer repository URL.
- `codeRepository` supplies the repository name in the footer's “Build Your Own” link. It does not configure the deployment base path.
- `slogan.words` and `slogan.highlight` supply the footer quote.
- Replace or remove the original `ga4` value. This optional field currently has no analytics loader wired up in `Layout.astro`; changing it alone does not enable analytics.

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

The URL determines the rich card component, independently of its icon. GitHub and X profile URLs have dedicated cards; LinkedIn, Facebook, and Instagram hosts also have dedicated components. Other URLs use the website card. GitHub repository and X post URLs use website previews rather than the account profile card. Routing lives in `src/components/cards/preview.ts`.

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

`src/layouts/Layout.astro` still contains a personal fallback title, a hardcoded meta description, and favicon references. Update these for the new owner. The active favicon files are `public/pruthivi.svg` and `public/pruthivi-light.svg`; replace their artwork or point the layout to your own assets.

Review the configured links, email address, footer repository, and profile introduction for the original owner's information. Keep the project license and attribution intact.

### 5. Customize the theme

`src/styles/global.css` owns the light/dark surface colors, typography, radii, shadows, motion tokens, and layout spacing. Tailwind v4 uses CSS-first configuration; do not introduce a Tailwind v3 configuration file.

- Use the existing variables, including `--bg-page`, `--card-bg`, `--card-border`, `--text-strong`, `--text-muted`, and `--primary`, when changing the visual theme. Preserve the existing color conventions, including OKLCH where used.
- Local fonts live in `public/fonts/`. Additional Theme Lab fonts load through the stylesheet in `Layout.astro`. When adding a selectable font, update its loading, the Theme Lab font options, and its mappings in `global.css`.
- Theme Lab is implemented in `src/components/ThemeLab.astro`. Its choices persist in browser local storage under `links:theme-lab:v1`; they do not edit the source files or change the default theme for other visitors. Use Reset when checking source defaults.
- Theme Lab and its trigger have opaque surfaces. On mobile below `48rem`, the trigger sits at the bottom right and the panel opens upward to the viewport width minus the page's left and right padding, using `calc()` and safe-area insets. Desktop retains a compact panel at the top right.
- `--page-inline-padding` is shared by the page and the mobile panel: `1rem` by default, `1.5rem` from `40rem`, and `6rem` from `48rem`. Update this shared variable when changing the page gutters.

### 6. Build for your host

Run `bun run build` and deploy the generated `dist/` directory using your host's static-site workflow. Hosting settings belong in `astro.config.mjs` and the host configuration. If deploying under a subpath, review root-relative asset URLs as well as Astro's base setting; changing `codeRepository` alone does not handle this.

## Fetched preview data

`scripts/fetch-card-previews.mts` reads all three link lists and writes `src/data/link-card-previews.json`. Fetching and parsing live in `scripts/card-preview.mts`.

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
| `src/content/` | Personal profile and the three link lists |
| `src/content.config.ts` | Astro content schemas using `astro/zod` |
| `src/components/Hero.astro` | Profile introduction and remote GitHub avatar |
| `src/components/QuickLinks.astro` | Compact link pills |
| `src/components/LinkCards.astro` | Rich-card routing, fetched metadata, and image fallback handling |
| `src/components/cards/` | Shared card shell, platform components, types, and preview helpers |
| `src/components/Links.astro` | Small cards and copy-link behavior |
| `src/components/ThemeLab.astro` | Theme controls, persistence, and panel behavior |
| `src/layouts/Layout.astro` | HTML wrapper, metadata, icons, font loading, and initial theme restoration |
| `src/pages/index.astro` | Page section composition and footer |
| `src/styles/global.css` | Shared theme, layout, typography, and motion styles |
| `src/data/link-card-previews.json` | Generated preview cache |
| `scripts/card-preview.test.mts` | Preview parsing and cache regression tests |
| `astro.config.mjs` | Astro and Tailwind Vite plugin configuration |
| `vite.config.ts` | Vite+ formatting, lint, and staged-file checks |

## Working rules and verification

- Prefer content edits for personalizing or rearranging links. Preserve the reusable components and unrelated work in the checkout.
- Keep `src/content.config.ts`, component props, and shared types in sync when introducing new content options.
- Give interactive elements descriptive classes, data attributes, or unique IDs. Preserve keyboard access, focus restoration, ARIA state, and reduced-motion behavior.
- For URL or link-list edits, run `bun run build` to refresh previews and validate the site. Review generated cache changes along with the content.
- For component, schema, or styling edits that do not change URLs, run `bun run astro build` with the existing cache, plus `bun run check`.
- When changing metadata fetching or parsing, also run `node --test scripts/card-preview.test.mts` and exercise the refresh. Network failures should warn and preserve usable cached data rather than break the site build.
- Documentation-only changes need formatting checks, not a metadata refresh.
- The site owner handles visual checks. Do not launch or automate a browser unless explicitly asked.
