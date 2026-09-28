import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Each blog post is one .mdx file in src/content/blog/. `topicNumber` is the
// post's position in the ~40-topic GWM Haval Jolion review plan and drives
// both the listing order and the prev/next navigation on each post.
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    topic: z.string(),
    topicNumber: z.number().int().positive(),
    tags: z.array(z.string()).default([]),
    // Path under /public, e.g. "/reviews/price-and-deal/hero.jpg". Leave unset
    // to show a placeholder box until a real photo is added.
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    // Byline shown on listing cards.
    author: z.string().default("The author"),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
