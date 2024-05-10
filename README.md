<h1 align="center">Links - Linktree Clone for Developers</h1>

<img src="public/preview/preview.png" alt="preview">

## 📖 Make your own

Prerequisites :

- Install [Git](https://git-scm.com/downloads).
- [Nodejs](https://nodejs.org/en/) and [pnpm(recommended)](https://pnpm.io/installation) installed.

Steps :

- Clone the repository, install the dependencies and start the application.

```bash
git clone https://github.com/pruthivithejan/links.git
cd links
pnpm install
pnpm run dev
```

This will start the project on your `localhost:5173`. Open the browser and see if it works.

- All you have to do is go to the `content.ts` file and replace everything with your information.

<img src="public/preview/content.png" alt="content file">

```typescript
export const codeRepository = "linktree"; //This is pointed to this repository, if you fork your own you can point to that or leave this as it is.
export const githubUsername = "pruthivithejan"; //*Required because the site will pull your Github avatar and use it on the website.
export const heading = "Pruthivi Thejan | Linktree"; //This is the heading that shows in the browser tab.
export const slogan = {
  words: "I'll be myself or", //This is the slogan, put whatever you like.
  hightlight: "die trying", //This part of the slogan will be highlighted.
};

export const Cards = [
{
href: "https://x.com/pruthivithejan", //Change the link here to your liking.
icon: "x", //Please check if the `public/` folder has the SVG to your link or place a one yourself, It must be a .svg file.
title: "X", //Change the title to your liking.
description: "I share thoughts and updates on various topics.", //Change the description to your liking.
}, //...add more

```

- Change the `meta` tags on index.html if needed.
- Save, come back and see if the changes are made.

- If you want any new Icons add them to `public` folder as SVGs. You can find SVG Icons [here](https://icon-sets.iconify.design/).

- If you're not using a custom domain delete the `CNAME` file and add your repository name to `vite.config.ts` as `base: "/links/,`

- Deploying is automatically set to GitHub Pages. make sure you [enable](https://docs.github.com/en/pages/quickstart) Github Pages for the repository.
- Make sure these things are correct if not deployed
  - https://stackoverflow.com/questions/74518887/blank-page-when-deploying-a-react-app-to-github-pages-and-vite
  - https://stackoverflow.com/questions/77348361/resolved-github-pages-deployment-blank-vite-react-ts

✨ Leave a Star on the repository if you like. ✨ <br>

## 📄 License

[MIT](./LICENSE.md) &copy; [Pruthivi Thejan](https://pruthivithejan.me/)
