# Coding Agent Guide for "Links" 🤖🚀

Welcome to the Developer Agent Handbook for **Links**! This document is specifically structured to help AI coding agents (such as Antigravity, Cursor, GitHub Copilot, Claude Engineer, or ChatGPT) understand this codebase instantly and assist you in customizing or building your own Linktree-style page.

---

## 🎯 How to Use This Guide

If you are using an AI coding assistant, **copy and paste the System Prompt block below** into your agent's instructions (e.g., in `.cursorrules`, your Custom Instructions, or at the start of your chat session). It primes the AI to understand exactly how the project is structured and what rules to follow.

---

## 🧠 System Prompt Addendum for AI Agents

> [!TIP]
> Copy the block below to give your AI Assistant instant expert knowledge of this repository.

```markdown
You are an expert AI developer assistant specialized in modern web development, Astro.js, Tailwind CSS v4, and TypeScript. You are helping build or customize a high-performance, aesthetically stunning developer Linktree named "Links".

Here is what you need to know about the project architecture:

1. Core Tech Stack:
   - Framework: Astro.js v6 (static site generation, content collections)
   - Styling: Tailwind CSS v4 (using the `@tailwindcss/vite` plugin inside Vite config)
   - Package Manager: Bun (use `bun run dev`, `bun run build`, and `bun i`)
2. Data & Content Structure:
   - Profile Details: Managed in `src/content/personal/profile.json` (heading, slogan, GitHub handle, GA4 tracking, repo name).
   - Core Links: Managed in `src/content/links/links.json` (href, icon, title, description).
   - Quick Header Links: Managed in `src/content/quick-links/quick-links.json` (href, icon, label, optional manual preview config).
   - Collections Schema: Defined in `src/content.config.ts` using Astro's `defineCollection` and Zod (`z.object`).

3. Link Preview Mechanics:
   - Scraper Script: `scripts/fetch-link-previews.mjs` runs prebuild, reads quick-links, fetches OG tags, and writes to `src/data/link-previews.json`.
   - Hovercard Mechanics: `src/components/QuickLinks.astro` handles hovercard rendering.
     - Server-side: Merges static metadata from `src/data/link-previews.json` with manual overrides from the JSON file.
     - GitHub Customization: Detects GitHub profile URLs and prebuilds a contribution chart using `https://ghchart.rshah.org/<username>`.
     - Client-side: If missing static data, fetches live metadata dynamically using the Microlink API (`https://api.microlink.io/?url=...`) with caching to prevent API spam.

4. Guidelines for Code Edits:
   - Preserve local styling and OKLCH color variables configured in `src/styles/global.css`.
   - Ensure all interactive elements have unique and descriptive IDs or classnames.
   - For icons, all SVG files must exist under the `public/icons/` folder, named `<name>.svg`. Refer to them in JSON files by `<name>` without the `.svg` extension.
   - Always run verification checks (`bun run build` or Astro typechecks) when making changes to Zod schemas or components.
```

---

## 📂 Codebase Architecture Map

Here is the directory outline and what each part does:

```
├── .zed/
│   └── settings.json           # Workspace settings for the Zed editor (tabs, Tailwind v4 class regex, format-on-save)
├── public/
│   ├── fonts/                  # Custom typographic fonts loaded locally
│   └── icons/                  # SVG social/web icons named identically to JSON 'icon' fields
├── scripts/
│   └── fetch-link-previews.mjs # Prebuild script fetching OG meta tags to avoid slow run-time loading
├── src/
│   ├── components/
│   │   ├── Hero.astro          # Personal identity banner and avatar loader
│   │   ├── Links.astro         # List of primary links (main vertical column layout)
│   │   └── QuickLinks.astro    # Pill-shaped quick links with premium hovercards and GH graph integration
│   ├── content/
│   │   ├── links/links.json    # JSON list of primary visual links
│   │   ├── personal/profile.json # Basic metadata, slogans, and analytics IDs
│   │   └── quick-links/        # Quick access pill links configurations
│   ├── data/
│   │   └── link-previews.json  # [AUTOMATED] Output of prebuild scraper
│   ├── layouts/
│   │   └── Layout.astro        # Base HTML wrapper, handles SEO metadata, Google Analytics, and dark mode base
│   ├── pages/
│   │   └── index.astro         # Root page mounting all sections and footer
│   ├── styles/
│   │   └── global.css          # Core CSS stylesheet utilizing Tailwind CSS v4 variables, OKLCH scales, and animations
│   └── content.config.ts       # Astro Content Collections schemas written in Zod
```

---

## 🛠️ Common Tasks & How to Guide Your Agent

Here are exact prompt templates you can feed to your AI coder to build your own custom version of the linktree:

### 1. Adding a New Social Link with Custom Icon

- **What it requires**: Downloading a new SVG icon to `public/icons/`, adding it to `src/content/links/links.json` or `src/content/quick-links/quick-links.json`.
- **Prompt to give your agent**:

  ```text
  I want to add a new quick link to my profile:
  URL: "https://x.com/myname"
  Label: "X / Twitter"
  Icon name: "twitter-x"

  Please do the following:
  1. Check if public/icons/twitter-x.svg exists. If not, fetch/create a clean SVG representation for it (or use standard svg elements).
  2. Add the entry to src/content/quick-links/quick-links.json.
  3. Make sure to run `bun run prebuild` (or the node prebuild script) afterwards to cache the link preview metadata.
  ```

### 2. Changing the App Theme Colors

- **What it requires**: Editing the CSS variables in `src/styles/global.css` using modern OKLCH color declarations.
- **Prompt to give your agent**:
  ```text
  Let's customize the visual style and colors of the links template.
  I want to switch to a luxurious emerald/emerald-dark color palette.
  1. Read src/styles/global.css to see current background gradients and custom properties.
  2. Suggest a gorgeous modern emerald-themed gradient using OKLCH colors for both light and dark mode.
  3. Modify global.css to update the background variables, link cards hover rings, and popover borders.
  ```

### 3. Adding an Interactive Feature (e.g. Share Button or Click Counter)

- **What it requires**: Creating a new client-side script or modifying an existing Astro component.
- **Prompt to give your agent**:
  ```text
  I want to add a "Copy Link" / "Share Profile" button inside the Hero component so users can easily copy my linktree URL to their clipboard.
  1. Open src/components/Hero.astro.
  2. Create a clean, responsive button with a copy-to-clipboard micro-animation and transition states.
  3. Ensure it uses public/icons/copy.svg (creating the icon if missing).
  4. Implement dynamic browser clipboard logic inside a client-side <script> tag in Hero.astro.
  ```

### 4. Customizing the Metadata Prebuild Scraper

- **What it requires**: Modifying `scripts/fetch-link-previews.mjs` to fetch additional metadata, increase retry logic, or skip specific domains.
- **Prompt to give your agent**:
  ```text
  I want to enhance our prebuild link-preview scraper script.
  1. Examine scripts/fetch-link-previews.mjs.
  2. Add support for extracting meta descriptions (e.g., 'og:description' or 'description') during prebuild and saving it under a 'description' key in src/data/link-previews.json.
  3. Ensure that if the scrape fails, we log a warning but don't break the build process.
  ```

---

## ⚠️ Important Coding Gotchas for Agents

Agents should be made aware of the following technical details to avoid breaking things:

1.  **Tailwind CSS v4 CSS-First Styling**:
    - This project uses Tailwind CSS v4. Unlike Tailwind v3, configuration is done directly in CSS files (`src/styles/global.css`) using `@theme`, rather than `tailwind.config.js`.
    - Custom themes, utilities, and components should be defined in `src/styles/global.css`.
2.  **Microlink API & Content Security Policies**:
    - `QuickLinks.astro` makes client-side API requests to `api.microlink.io` to gather real-time website previews. If deploying behind strict CSP headers, ensure `api.microlink.io` and `ghchart.rshah.org` are whitelisted.
3.  **Run Prebuild Scripts**:
    - `src/data/link-previews.json` is a git-tracked cache. Whenever you add or edit links, run `bun run dev` or `bun run build`. Astro runs `prebuild` automatically before each build to populate previews, but running `bun run prebuild` manually will force-update them.
4.  **Strict Astro Zod Schema**:
    - The file `src/content.config.ts` enforces type safety. Adding fields to `links.json` or `quick-links.json` without declaring them in `content.config.ts` will trigger Zod schema validation compile errors during `bun run build`.

---

✨ _Now you're fully equipped to work seamlessly with AI to build the ultimate developer bio page!_ ✨
