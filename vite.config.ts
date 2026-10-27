import ultracite from "ultracite/oxfmt";
import antiSlop from "ultracite/oxlint/anti-slop";
import astro from "ultracite/oxlint/astro";
import core from "ultracite/oxlint/core";
import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    ...ultracite,
  },
  lint: {
    extends: [core, astro, antiSlop],
    ignorePatterns: [...(core.ignorePatterns ?? []), "dist/**", ".astro/**"],
    jsPlugins: [
      ...(antiSlop.jsPlugins ?? []),
      { name: "vite-plus", specifier: "vite-plus/oxlint-plugin" },
    ],
    rules: {
      // Astro components are PascalCase by convention in this project.
      "unicorn/filename-case": "off",
      "vite-plus/prefer-vite-plus-imports": "error",
    },
  },
  staged: {
    "*.{astro,css,js,json,jsonc,md,mjs,toml,ts,tsx}": "vp check --fix",
  },
});
