import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const quickLinksPath = path.join(root, 'src', 'content', 'quick-links', 'quick-links.json');
const outputPath = path.join(root, 'src', 'data', 'link-previews.json');

const META_KEYS = {
  image: ['og:image', 'twitter:image', 'twitter:image:src'],
  title: ['og:title', 'twitter:title', 'title'],
  site: ['og:site_name', 'twitter:site', 'twitter:creator'],
};

const pickMeta = (html, names) => {
  for (const name of names) {
    const pattern = new RegExp(
      `<meta[^>]+(?:property|name)=["']${name}["'][^>]+content=["']([^"']+)["'][^>]*>`,
      'i'
    );
    const match = html.match(pattern);
    if (match?.[1]) return match[1];
  }
  return undefined;
};

const getTitleTag = (html) => {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1];
};

const sanitizeUrl = (input) => {
  try {
    const parsed = new URL(input);
    if (!['http:', 'https:'].includes(parsed.protocol)) return null;
    return parsed.toString();
  } catch {
    return null;
  }
};

const fetchPreview = async (url) => {
  const safeUrl = sanitizeUrl(url);
  if (!safeUrl) return null;

  const res = await fetch(safeUrl, {
    redirect: 'follow',
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0; +https://astro.build)',
      accept: 'text/html,application/xhtml+xml',
    },
  });

  if (!res.ok) return null;
  const html = await res.text();

  const image = pickMeta(html, META_KEYS.image);
  const title = pickMeta(html, META_KEYS.title) || getTitleTag(html);
  const site = pickMeta(html, META_KEYS.site) || new URL(safeUrl).hostname;

  return { title, image, site, url: safeUrl };
};

const main = async () => {
  const raw = await readFile(quickLinksPath, 'utf8');
  const links = JSON.parse(raw);

  const result = {};

  for (const link of links) {
    if (!link?.href || link.href.startsWith('mailto:') || link.href.startsWith('tel:')) continue;
    try {
      const preview = await fetchPreview(link.href);
      if (preview?.image || preview?.title || preview?.site) {
        result[link.href] = preview;
      }
    } catch (err) {
      console.warn(`Preview failed for ${link.href}`, err?.message || err);
    }
  }

  await writeFile(outputPath, JSON.stringify(result, null, 2), 'utf8');
  console.log(`Wrote previews for ${Object.keys(result).length} links -> ${outputPath}`);
};

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
