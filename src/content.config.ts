import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { REVIEW_CATEGORIES } from "./lib/categories";
import { AUTHOR_NAME } from "./lib/site";

// Each blog post is one .mdx file in src/content/blog/, written from the
// author's own experience. `topicNumber` orders the posts for the prev/next
// navigation on each post.
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    // Shorter <title> for search results (aim for 60 characters or fewer).
    // Falls back to `title`, which stays the on-page H1.
    seoTitle: z.string().optional(),
    description: z.string(),
    topic: z.string(),
    topicNumber: z.number().int().positive(),
    tags: z.array(z.string()).default([]),
    // The one filter chip this post appears under on the /blog/ listing; see
    // src/lib/categories.ts.
    category: z.enum(REVIEW_CATEGORIES),
    // Path under /public, e.g. "/blog/price-and-deal/hero.jpg". Leave unset
    // to show a placeholder box until a real photo is added.
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    // Byline shown on listing cards.
    author: z.string().default(AUTHOR_NAME),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
