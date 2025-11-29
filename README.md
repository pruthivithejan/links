<h1 align="center">Links - A way for developers to link what's important</h1>

## Introduction

Welcome to **Links**, a website built with [Astro.js](https://astro.build/) and styled with [Tailwind CSS](https://tailwindcss.com/). This project provides a modern, fast, and customizable solution for developers and creators to showcase their links and social profiles on a single page.

**Why this project?**
- ⚡ **Ultra-fast** - Built with Astro for minimal JavaScript and blazing performance
- 🎨 **Fully customizable** - Easy to change colors, fonts, links, and layout
- 📱 **Responsive** - Works beautifully on all device sizes
- 🚀 **Easy deployment** - Deploy to GitHub Pages, Vercel, Netlify, or any static host
- 💻 **Developer-friendly** - Content managed via JSON files, no database needed

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/downloads) installed on your machine
- [Bun.js](https://bun.com/)


### Installation

1. Clone the repository:
```bash
git clone https://github.com/pruthivithejan/links.git
cd links
```

2. Install dependencies:
```bash
bun install
# or 
bun i
```

3. Start the development server:
```bash
bun run dev
# or
bun dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser to see your site.

## Configuration

### Personal Profile Information

Edit `src/content/personal/profile.json` to update your personal information:

```json
{
  "heading": "Your Name | Links",
  "slogan": {
    "words": "Your main text",
    "highlight": "highlighted part"
  },
  "githubUsername": "your-github-username",
  "codeRepository": "links",
  "ga4": "G-XXXXXXXXXX"
}
```

**Fields explained:**
- `heading`: Appears in the browser tab and page title
- `slogan.words`: Main slogan text
- `slogan.highlight`: Part of the slogan that gets highlighted (shown in different styling)
- `githubUsername`: Used to fetch your GitHub avatar automatically
- `codeRepository`: Repository name (used for GitHub Pages deployment)
- `ga4`: (Optional) Google Analytics 4 tracking ID

### Managing Links

Edit `src/content/links/links.json` to add, remove, or modify your links:

```json
[
  {
    "href": "https://your-website.com",
    "icon": "link",
    "title": "Personal Website",
    "description": "Your website description"
  },
  {
    "href": "https://github.com/yourname",
    "icon": "github",
    "title": "GitHub",
    "description": "Check out my projects"
  }
]
```

**Fields explained:**
- `href`: The URL the link points to
- `icon`: Icon name (must match an SVG file in `public/` - see [Adding Icons](#adding-icons))
- `title`: Link title displayed on the card
- `description`: Short description of the link

## Customization

### Fonts

#### Using Local Fonts

The project comes with custom fonts loaded locally from `public/fonts/`:

```css
/* From src/styles/global.css */
@font-face {
  font-family: "Switzer-Regular";
  src: url("/fonts/Switzer-Regular.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}
```

To use your own fonts:

1. Place font files (`.woff2`, `.ttf`, `.otf`) in `public/fonts/`
2. Update `src/styles/global.css` with your `@font-face` declarations
3. Update the `font-family` references in the `:root` styles

#### Using Google Fonts

To use Google Fonts instead:

1. Go to [Google Fonts](https://fonts.google.com/)
2. Select your desired fonts and copy the import link
3. Add to `src/styles/global.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@layer base {
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
}
```

### Colors

Colors are defined using [OKLCH](https://oklch.com/) color space for modern, perceptually uniform colors. Edit `src/styles/global.css`:

```css
@layer base {
  :root {
    /* Light mode colors */
    --callout-rgb: 238, 240, 241;
    --card-rgb: 180, 185, 188;
    --background-start-rgb: 214, 219, 220;
    --background-end-rgb: 255, 255, 255;
  }

  html.dark {
    /* Dark mode colors */
    --callout-rgb: 20, 20, 20;
    --card-rgb: 100, 100, 100;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }

  html {
    background: linear-gradient(
      to bottom,
      oklch(0.86 0.005 283),
      oklch(1 0 0)
    );
  }
}
```

**Quick color changes:**
- **Background gradient**: Modify the `oklch()` values in the `background` property
- **Text color**: Update the `color` property in `body`
- **Card background**: Edit `--card-rgb` values
- **Dark mode**: Add/modify values in `html.dark` selector

### Adding Icons

Icons are stored as SVG files in the `public/` directory. To add new icons:

1. Download SVG icons from [Iconify](https://icon-sets.iconify.design/) or [Feather Icons](https://feathericons.com/)
2. Save the SVG file to `public/` with a simple name (e.g., `youtube.svg`)
3. Reference the icon name (without `.svg`) in your links JSON:

```json
{
  "href": "https://youtube.com/@yourname",
  "icon": "youtube",
  "title": "YouTube"
}
```

## Project Structure

```
src/
├── components/
│   ├── Hero.astro      # Hero section with profile
│   └── Links.astro     # Links card grid
├── content/
│   ├── config.ts       # Content collection schema
│   ├── links/
│   │   └── links.json  # Your links data
│   └── personal/
│       └── profile.json # Your profile data
├── layouts/
│   └── Layout.astro    # Main layout wrapper
├── pages/
│   └── index.astro     # Home page
└── styles/
    └── global.css      # Global styles & fonts
```

## Building & Deployment

### Build for Production

```bash
pnpm run build
# or
npm run build
```

This creates an optimized static site in the `dist/` folder.

### GitHub Pages

1. Enable GitHub Pages in repository settings
2. Go to **Settings** → **Pages** → **Build and deployment**
3. Select **Deploy from a branch** and choose `main` branch, `/root` folder

For more details, see [Astro GitHub Pages Deployment Guide](https://docs.astro.build/en/guides/deploy/github/).

## Troubleshooting

### Blank Page on Deployment

If you see a blank page after deploying:

1. Check browser console for errors (F12)
2. Verify `astro.config.mjs` has correct `base` path
3. Clear browser cache and hard refresh (Cmd+Shift+R on Mac)
4. Check [Astro Deployment Guide](https://docs.astro.build/en/guides/deploy/)

### Icons Not Loading

- Verify SVG files are in `public/` folder
- Check icon names in `links.json` match filename (without `.svg`)
- Ensure SVG files are valid (open in browser to test)

### Fonts Not Applying

- Check `@font-face` URLs are correct in `src/styles/global.css`
- Verify font files exist in `public/fonts/`
- Clear browser cache and restart dev server

## Scripts

```bash
bun run dev      # Start development server
bun run build    # Build for production
bun run preview  # Preview production build
```

## Contributing

Found a bug or have a feature idea? Feel free to open an issue or submit a pull request!

## License

[MIT](./LICENSE.md) © [Pruthivi Thejan](https://pruthivithejan.me/)

---

✨ **If you found this project helpful, please leave a star on GitHub!** ✨
