import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://example.com",
  // React is only for opt-in interactive islands (src/components/ui) — no
  // component ships JS unless a page actually hydrates it with client:*.
  // MDX powers the blog content collection so posts can mix markdown with
  // the layout components in src/components/blog (tables, cards, split
  // sections) without any client-side JS of their own.
  integrations: [react(), mdx(), sitemap()],
  // Posts moved from /blog/<slug> to /review/<slug>; the /blog listing was
  // folded into /reviews.
  redirects: {
    "/blog": "/reviews",
    "/blog/[slug]": "/review/[slug]",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
