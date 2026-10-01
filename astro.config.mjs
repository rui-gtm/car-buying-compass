import { readdirSync, readFileSync } from "node:fs";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import { FAQ_MODIFIED, SITE_URL, STORY_MODIFIED } from "./src/lib/site.ts";

// Sitemap <lastmod> for each page: a post's updatedDate (or publishDate) from
// its frontmatter, the newest of those for the /blog/ listing, and
// STORY_MODIFIED / FAQ_MODIFIED for "/" and "/faq/". The config can't use
// content collections, so the two date fields are read straight from the .mdx
// files.
const BLOG_DIR = new URL("./src/content/blog/", import.meta.url);
const postDates = Object.fromEntries(
  readdirSync(BLOG_DIR)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => {
      const source = readFileSync(new URL(file, BLOG_DIR), "utf8");
      const field = (name) => source.match(new RegExp(`^${name}:\\s*"?([\\d-]+)`, "m"))?.[1];
      return [`/blog/${file.replace(/\.mdx?$/, "")}/`, field("updatedDate") ?? field("publishDate")];
    }),
);
const latestPostDate = Object.values(postDates).sort().at(-1);
const lastmodByPath = {
  "/": STORY_MODIFIED,
  "/blog/": latestPostDate,
  "/faq/": FAQ_MODIFIED,
  ...postDates,
};

export default defineConfig({
  site: SITE_URL,
  // Every page is built as a folder with index.html, so its canonical URL ends
  // in "/". Enforcing that in dev catches internal links missing the slash.
  trailingSlash: "always",
  // React is only for opt-in interactive islands (src/components/ui) — no
  // component ships JS unless a page actually hydrates it with client:*.
  // MDX powers the blog content collection so posts can mix markdown with
  // the layout components in src/components/blog (tables, cards, split
  // sections) without any client-side JS of their own.
  integrations: [
    react(),
    mdx(),
    sitemap({
      serialize(item) {
        const lastmod = lastmodByPath[new URL(item.url).pathname];
        return lastmod ? { ...item, lastmod: new Date(lastmod).toISOString() } : item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
