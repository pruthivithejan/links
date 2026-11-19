<h1 align="center">Links - A way for developers to link what's important</h1>

## Introduction

Welcome to **Links**, a personal links page built with [Astro 7](https://astro.build/), TypeScript, [Tailwind CSS v4](https://tailwindcss.com/), and [Bun](https://bun.com/). It gives developers and creators a fast, customizable page for their profiles, projects, and contact links.

**Why this project?**

- ⚡ **Ultra-fast** - Astro ships minimal JavaScript, so the page loads quickly
- 🎨 **Fully customizable** - Theme Lab covers mode, palette, fonts, avatar shape, borders, shadows, and QR styles
- 🧩 **Composable UI** - Shared `components/ui` primitives keep buttons, cards, icons, avatars, previews, and copy controls consistent
- 📱 **Responsive** - Works on mobile and desktop
- 🚀 **Easy deployment** - GitHub Pages workflow included, with or without a custom domain
- 💻 **Content-first** - Profile and links live in JSON files; no database required

## Build your own with an AI agent

The fastest way to personalize this repo is to hand it to an AI coding agent. You can also open the deployed site, scroll to the footer, and click **Build Your Own**: it copies the prompt and changes its label to **Prompt copied**. The GitHub icon beside it opens the source repository.

The prompt walks the agent through:

- asking about your name, bio, page title, meta description, slogan, avatar, and favicon before changing files
- collecting every link, then choosing one of three presentations for each: quick link, rich link card, or small card
- running the site in dev so you can pick light or dark mode, a palette or ink color, title and body fonts, avatar shape, borders, and shadows, including adding a custom font
- saving that look as the default base style for every visitor, then asking whether Theme Lab should stay visible
- building, verifying, and deploying to GitHub Pages, with a separate path when you have a custom domain

The canonical prompt lives in [AGENTS.md](./AGENTS.md) under **Build your own with an AI agent**, between the `build-prompt:start` and `build-prompt:end` comments. `src/content/build-prompt.ts` extracts that text at build time, so the footer button always copies the current AGENTS.md version. **AGENTS.md is the source of truth**; if you edit the prompt, edit it there. The copy below is reference only and should stay identical to AGENTS.md.

```text
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
```

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/downloads)
- [Bun](https://bun.com/)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/pruthivithejan/links.git
cd links
```

2. Install dependencies:

```bash
bun install
```

3. Start the development server:

```bash
bun run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

### Commands

| Command | What it does |
| --- | --- |
| `bun run dev` | Start the local dev server |
| `bun run prebuild` | Fetch and cache public metadata for the configured links |
| `bun run build` | Refresh metadata, then build `dist/` |
| `bun run astro build` | Build with the existing metadata cache |
| `bun run preview` | Serve the production build |
| `bun run check` | Run Vite+ formatting and lint checks |
| `bun run fix` | Apply formatting and lint fixes |
| `node --test scripts/card-preview.test.mts` | Run metadata parsing and cache tests |

`bun run build` runs the `prebuild` script automatically. `bun run dev` and `bun run astro build` do not refresh preview metadata; run `bun run prebuild` after changing URLs. The generated cache at `src/features/link-previews/cache.json` is committed, so CI can build without network access to the metadata providers.

## Configuration

### Personal profile

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

**Fields explained:**

- `heading`: Browser tab and page title
- `description`: Meta description
- `favicon.light` / `favicon.dark`: SVG paths for light and dark color schemes
- `slogan.words` / `slogan.highlight`: Footer quote and the highlighted words
- `githubUsername`: Supplies the hero's remote GitHub avatar and the owner in the footer repository URL
- `profileName` / `profileBio`: Hero name and introduction on the home and share pages; both are optional, and the name falls back to `githubUsername`
- `siteUrl`: Full public homepage URL, including protocol and any deployment subpath. It supplies Astro's `site` setting and the `/share/` QR destination. It does not set Astro's `base`
- `codeRepository`: Repository name used by the footer GitHub icon

Changing `githubUsername` does not rewrite URLs in the link lists. Replace each configured URL with the account or website you want, since usernames can differ between services.

### Where each link appears

The page renders the hero, quick links, rich link cards, small cards, and footer in that order. There are three independent JSON lists; array order controls display order within each section. A link appears only where you configure it, and an icon never promotes a small card into a rich card. Remove an entry from its previous list when moving it.

| Section | File | Entry fields |
| --- | --- | --- |
| Quick links: compact pills below the hero | `src/content/quick-links/quick-links.json` | `href`, `icon`, `label` |
| Rich link cards: website previews and social profile cards | `src/content/link-cards/link-cards.json` | `href`, `icon`, `title` |
| Small cards: title, authored description, and copy button | `src/content/links/links.json` | `href`, `icon`, `title`, `description` |

Use `[]` when a list is not needed. `src/content/registry.ts` validates all three lists and the profile against `src/content/schemas.ts`.

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
  }
]
```

Quick links suit email, Telegram, WhatsApp, and other short contact links. They do not render hovercards or profile details.

#### Rich link cards

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

The URL chooses the card component, independently of its icon. GitHub, X, LinkedIn, Facebook, and Instagram profiles have dedicated cards; other URLs use the website preview. GitHub repository and X post URLs render as website previews rather than account cards. Routing lives in `src/features/link-previews/routing.ts`.

Website cards show the full OG image at its natural aspect ratio across the card width, with the URL and fetched description below. Social cards also render fetched metadata, so do not add manual bios, avatars, locations, or counts to rich-card JSON.

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

Small-card descriptions are your own copy, separate from fetched rich-card details. Any platform can go here, even one that has a rich card component.

### Fetched preview data

`bun run prebuild` fetches public metadata once per unique HTTP(S) URL and writes it to `src/features/link-previews/cache.json`. Non-web URLs such as `mailto:` are skipped. Website metadata comes from Open Graph tags and JSON-LD, GitHub profile data from the GitHub API, contributions from `github-contributions-api.jogruber.de`, and X profiles from FxTwitter with a public-page fallback.

Avatars and media stay as remote URLs; there are no downloaded profile images to maintain. When a site blocks fetching, the build keeps any previously cached metadata for that exact URL. Without cached details, unavailable bios, locations, counts, and contribution data are omitted, and a missing social avatar may reuse an image fetched for another configured card. Only the image is reused; another account's details are never copied. Zero is a valid fetched count. Removed URLs are pruned from the cache.

Rich previews render from the committed cache; the browser does not call metadata APIs. Remote images and fonts still load when someone visits the page.

### Share page

Visit `/share/` or use **Share profile** in the homepage footer. The page reuses the profile, avatar, fonts, palette, and surface preferences. Its QR code is generated at build time with [uqr](https://github.com/unjs/uqr) and opens `share/` relative to `siteUrl`. **All links** returns to the homepage.

Contact rows reuse your quick links, any `mailto:` or `tel:` links in the other lists, and the first HTTP(S) rich or small link with the `link` icon. Edit those lists to change the contact details; there is no separate contact profile.

On the share page, Theme Lab adds QR module shape, corner shape, and ink or theme color. The QR keeps a white background, a four-module quiet zone, fixed timing/alignment modules, and a dark foreground. **Save card** downloads a PNG of the avatar, name, bio, QR code, and contact details with [html-to-image](https://github.com/bubkoo/html-to-image), omitting navigation, action buttons, and Theme Lab. **Copy link** copies the share page URL. Progress, success, and errors appear inside the action buttons.

### Dev-time theme flow

Theme Lab is the quickest way to preview a look. Its choices are browser-local by default and persist under `links:theme-lab:v1`; they do not edit source files or change what other visitors see. Reset restores the source defaults, and Surprise me shuffles a random combination.

To make a chosen look the default for every visitor, change the source:

- Set `DEFAULT_FONT_ID`, `DEFAULT_PALETTE_ID`, `DEFAULT_AVATAR_ID`, `DEFAULT_QR_STYLE`, `DEFAULT_QR_CORNERS`, and `DEFAULT_QR_COLOR` in `src/features/theme/registry.ts`.
- Adjust the base tokens in `src/styles/global.css` and the palette-derived tokens in `src/features/theme/colors.ts` so the stored palette matches the intended design.
- Mode follows the visitor's system preference when they have no stored choice. Change the boot logic in `src/layouts/Layout.astro` and `src/features/theme/controller.ts` if you want to force light or dark by default.

If you want a fixed design, remove the `ThemeLab` component and its trigger from `src/pages/index.astro` and `src/pages/share.astro`, and keep the saved base style in the registry and CSS.

## Customization

### UI primitives

Content components compose the shared primitives in `src/components/ui/`:

- `Button.astro` for chip, ghost, icon, pill, and plain buttons or links
- `Card.astro` plus `CardHeader`, `CardContent`, `CardFooter`, `CardMedia`, `CardTitle`, and `CardDescription`
- `Icon.astro`, `Avatar.astro`, and `PreviewImage.astro` for icons, remote avatars, initials, and images with recovery
- `CopyButton.astro` for clipboard behavior

`CopyButton` owns the clipboard API with a legacy fallback, the icon or label swap, the copied state, and screen-reader status messages. The small-card copy control (`src/components/links/CopyLinkButton.astro`) and the footer's build-prompt control (`src/components/BuildYourOwn.astro`) are thin wrappers around it.

Reuse these primitives when adding UI instead of re-creating card, button, icon, or copy markup. `src/utils/cn.ts` is the small class-name helper the primitives use.

### Fonts

Local fonts live in `src/assets/fonts/` with `@font-face` rules in `src/styles/global.css`. Theme Lab options come from `THEME_FONTS` in `src/features/theme/registry.ts`.

To add a local font:

1. Place the font file (`.woff2`, `.ttf`, `.otf`) in `src/assets/fonts/`.
2. Add an `@font-face` rule in `src/styles/global.css`.
3. Register the font in `THEME_FONTS` with an `id`, `name`, `stack`, and its tracking/leading metrics.

To add a Google font, add a `googleFamily` value in the same registry entry. `GOOGLE_FONTS_HREF` collects those families into the stylesheet link loaded by `src/layouts/Layout.astro`.

### Colors and theme tokens

The light and dark surface colors, typography, radii, shadows, motion tokens, and layout spacing live in `src/styles/global.css`. Tailwind v4 uses CSS-first configuration; do not add a Tailwind v3 config file.

Use the existing tokens when changing the theme, including `--bg-page`, `--card-bg`, `--card-bg-hover`, `--card-border`, `--chip-bg`, `--text-strong`, `--text-muted`, `--primary`, `--radius-card`, `--radius-chip`, and `--shadow-card`. Dark mode overrides them under `html.dark`. Palette accents are defined in `THEME_PALETTES` in `src/features/theme/registry.ts`, and `src/features/theme/colors.ts` derives per-mode tokens from the selected accent.

### Icons

Icons are SVG files in `public/icons/`. An entry with `"icon": "whatsapp"` loads `/icons/whatsapp.svg`.

1. Download or draw a clean SVG with a `viewBox`, matching the existing monochrome style.
2. Save it to `public/icons/` with a simple name, for example `youtube.svg`.
3. Reference the filename without `.svg` in your link JSON.

Check for an existing icon first. Keep icons and reusable card components when removing someone's personal links, even for platforms the current profile does not use.

## Project Structure

```text
.
├── .github/workflows/deploy.yml   # GitHub Pages build and deploy workflow
├── public/
│   ├── icons/                     # Link and UI icons
│   └── *.svg                      # Favicons and other static art
├── scripts/
│   ├── fetch-card-previews.mts    # Metadata refresh script
│   └── card-preview.test.mts      # Parsing and cache tests
├── src/
│   ├── assets/
│   │   └── fonts/                 # Local font files bundled by Vite
│   ├── components/
│   │   ├── ui/                    # Button, Card family, CopyButton, Avatar, Icon, PreviewImage
│   │   ├── cards/                 # GitHub, X, LinkedIn, Facebook, Instagram, Website rich cards
│   │   ├── links/                 # CopyLinkButton wrapper for small cards
│   │   ├── BuildYourOwn.astro     # Footer copy-prompt control
│   │   ├── Hero.astro
│   │   ├── QuickLinks.astro
│   │   ├── LinkCards.astro        # Rich-card routing
│   │   ├── SmallLinks.astro
│   │   ├── ShareQr.astro
│   │   └── ThemeLab.astro
│   ├── content/
│   │   ├── personal/profile.json
│   │   ├── quick-links/quick-links.json
│   │   ├── link-cards/link-cards.json
│   │   ├── links/links.json
│   │   ├── schemas.ts             # Content validation
│   │   ├── registry.ts            # Validated profile and link sections
│   │   └── build-prompt.ts        # Extracts the prompt from AGENTS.md
│   ├── features/
│   │   ├── link-previews/         # Model, routing, fetch pipeline, cache.json
│   │   ├── theme/                 # Registry, model, color tokens, controller
│   │   └── share/                 # Contact selection, copy/download controller, export
│   ├── layouts/Layout.astro       # HTML shell, metadata, fonts, theme boot
│   ├── pages/
│   │   ├── index.astro
│   │   └── share.astro
│   ├── styles/global.css          # Theme tokens, fonts, layout, motion
│   └── utils/cn.ts                # Class-name helper
├── AGENTS.md                      # Agent guide and canonical build prompt
├── astro.config.mjs
└── vite.config.ts                 # Vite+ formatting, lint, and staged-file checks
```

## Building & Deployment

Build locally with `bun run build`, which refreshes preview metadata and writes `dist/`. Deploy that directory with any static host, or use the included GitHub Pages workflow.

### GitHub Pages

The repository includes `.github/workflows/deploy.yml`. On every push to `main` it checks out the repo, installs Bun, runs `bun install`, builds with `bunx astro build`, uploads `dist/`, and deploys with GitHub Pages. It builds from the committed `src/features/link-previews/cache.json`, so run `bun run build` locally after changing URLs and commit the updated cache.

1. Push the repository to GitHub.
2. Open **Settings** → **Pages** → **Build and deployment**.
3. Set **Source** to **GitHub Actions**.
4. Push to `main` and wait for the workflow to finish.

#### Project pages (`https://<username>.github.io/<repo>/`)

Set Astro's `base` for the repository subpath in `astro.config.mjs`, for example `base: "/my-links/"`, and set `siteUrl` in `src/content/personal/profile.json` to the full deployed URL. `astro.config.mjs` already derives Astro's `site` from `siteUrl`. Public icons and favicons resolve through `src/utils/asset.ts`, and local fonts are bundled from `src/assets/fonts/`, so they follow the configured base path.

#### Custom domain

1. Set `siteUrl` in `src/content/personal/profile.json` to the full domain, including `https://` and a trailing slash.
2. Keep the site at the domain root. If you use a subpath, set `base` to match.
3. Add the domain to `public/CNAME`, with no protocol or trailing slash.
4. Configure DNS:
   - Apex domain: GitHub's documented `A` and `AAAA` records for `@`.
   - `www` or another subdomain: a `CNAME` record pointing at `<username>.github.io`.
5. After DNS resolves, enable **Enforce HTTPS** in GitHub Pages settings.

`siteUrl` also drives the `/share/` QR destination, so update it before the final build whenever the live URL changes. For the current DNS values and edge cases, see [Astro's GitHub Pages guide](https://docs.astro.build/en/guides/deploy/github/) and [GitHub's custom domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Troubleshooting

### Blank page or missing assets after deployment

- Check the browser console for errors.
- Verify `base` in `astro.config.mjs` matches the deployment path.
- Confirm `siteUrl` matches the live URL.
- Review asset paths when adding new public files; use `src/utils/asset.ts` or the `Icon` primitive so they follow `base`.
- Clear the browser cache and hard refresh.

### Icons not loading

- Verify the SVG is in `public/icons/`.
- Confirm the JSON icon name matches the filename without `.svg`.
- Open the SVG directly in a browser to validate it.

### Fonts not applying

- Check the `@font-face` URLs in `src/styles/global.css`.
- Verify the font file exists in `src/assets/fonts/`.
- Register the font in `THEME_FONTS` in `src/features/theme/registry.ts` so Theme Lab can select it.
- Clear the browser cache and restart the dev server.

### Copy button copies an old prompt

- The prompt is read from `AGENTS.md` at build time. Keep the `build-prompt:start` and `build-prompt:end` markers intact, then rebuild.

## Contributing

Found a bug or have a feature idea? Feel free to open an issue or submit a pull request.

## License

[MIT](./LICENSE.md) © [Pruthivi Thejan](https://pruthivithejan.me/)

---

✨ **If you found this project helpful, please leave a star on GitHub!** ✨
