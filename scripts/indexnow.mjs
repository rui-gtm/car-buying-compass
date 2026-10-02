// Tells IndexNow search engines (Bing, Yandex, Seznam, Naver…) that pages have
// changed, so they recrawl quickly. Bing's index also feeds ChatGPT search and
// Copilot. Run AFTER a deploy, once the site is live:
//
//   npm run build && <deploy> && node scripts/indexnow.mjs
//   node scripts/indexnow.mjs https://mccarrollsreview.com.au/faq/   (only some URLs)
//
// With no arguments it submits every URL in the built sitemap. The key file
// public/<KEY>.txt must be live at the site root for the submission to count.
import { readFileSync } from "node:fs";

const SITE_URL = "https://mccarrollsreview.com.au";
const KEY = "03f04e134e1a9ea045894a7b0aa1824f";

const urlList =
  process.argv.length > 2
    ? process.argv.slice(2)
    : [...readFileSync(new URL("../dist/sitemap-0.xml", import.meta.url), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map(
        (match) => match[1],
      );

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(SITE_URL).host,
    key: KEY,
    keyLocation: `${SITE_URL}/${KEY}.txt`,
    urlList,
  }),
});

// 200 = accepted, 202 = accepted pending key check; anything else is an error.
console.log(`IndexNow: HTTP ${response.status} for ${urlList.length} URL(s)`);
if (!response.ok) process.exitCode = 1;
