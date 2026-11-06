import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { previewLinks } from "../src/content/registry.ts";
import { cardPreviewsSchema } from "../src/features/link-previews/model.ts";
import type { CardPreviews } from "../src/features/link-previews/model.ts";
import { updatePreviews } from "../src/features/link-previews/pipeline.ts";

const root = path.join(import.meta.dirname, "..");

const outputPath = path.join(
  root,
  "src",
  "features",
  "link-previews",
  "cache.json"
);

const readPreviousCache = async (): Promise<CardPreviews> => {
  try {
    return cardPreviewsSchema.parse(
      JSON.parse(await readFile(outputPath, "utf-8"))
    );
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return {};
    }

    throw error;
  }
};

const previous = await readPreviousCache();

const result = cardPreviewsSchema.parse(
  await updatePreviews(previewLinks, previous)
);

await mkdir(path.dirname(outputPath), { recursive: true });

await writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, "utf-8");

console.log(
  `Wrote fetched card metadata for ${Object.values(result).filter(Boolean).length} links -> ${outputPath}`
);
