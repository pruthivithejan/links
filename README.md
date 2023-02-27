<h1 align="center">Linktree<img src="https://website.linktr.ee/favicon-32x32.png?v=0f096d2d5e3af7be669a0cba46df3a54"> Clone</h1>

<img src="https://pbs.twimg.com/media/FnzQuwMaQAEyLx4?format=jpg&name=large" alt="preview">

## 📖 Make your own

Prerequisites :
- Install [Git](https://git-scm.com/downloads).
- [Nodejs](https://nodejs.org/en/) and [pnpm(recommended)](https://pnpm.io/installation) installed.

Steps :

- Clone the repository, install the dependencies and start the application.

```bash
git clone git@github.com:pruthivithejan/linktree.git
pnpm install
pnpm run dev
```
This will start the project on your localhost:3000. Open the browser and see if it works.

- All you have to do is go to the ```app/content.ts``` file and replace everything with your information.

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
    href: "https://mobile.twitter.com/pruthivithejan", //Change the link here to your liking.
    icon: "twitter", //Please check if the `public/` folder has the SVG to your link or place a one yourself, It must be a .svg file.
    title: "Twitter", //Change the title to your liking.
    description: "I care about Twitter, I hope Elon Musk will not ruin it.", //Change the description to your liking.
  }, //...add more
```
- Save, come back and see if the changes are made.

- Deploy it on vercel for free or use a hosting service you like. <br>
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fhello-world)

 👏 Special Thanks to [Next.js](https://nextjs.org/) for creating such an awesome starting template. 👏 <br>
 ✨ Leave a Star on the repository if you like. ✨ <br>

## 📄 License

[MIT](./LICENSE.md) &copy; [Pruthivi Thejan](https://twitter.com/pruthivithejan)
