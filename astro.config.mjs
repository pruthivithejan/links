import tailwind from "@tailwindcss/vite";
// @ts-check
import { defineConfig } from "astro/config";

import profile from "./src/content/personal/profile.json" with { type: "json" };

// https://astro.build/config
export default defineConfig({
  site: profile.siteUrl,
  vite: {
    plugins: [tailwind()],
  },
});
