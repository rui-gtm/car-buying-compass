import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { REVIEW_CATEGORIES } from "./lib/categories";
import { AUTHOR_NAME } from "./lib/site";

// Each blog post is one .mdx file in src/content/blog/, written from the
// author's own experience. `topicNumber` orders the posts for the prev/next
// navigation on each post.
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
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
      // Relative path to the photo in src/assets/photos/, e.g.
      // "../../assets/photos/driver-door-scratch-2026-06.jpg". Leave unset until
      // a real photo exists — nothing is shown in its place. When set, it is
      // also the post's social card and structured-data image.
      heroImage: image().optional(),
      // Required on every post so a photo can be dropped in at any time: say
      // specifically what it shows (car, panel, damage), not "image of car".
      heroImageAlt: z.string().min(10),
      // Optional visible caption, and when the photo was taken ("YYYY-MM" or
      // "YYYY-MM-DD").
      heroImageCaption: z.string().optional(),
      heroImageDate: z
        .string()
        .regex(/^\d{4}-\d{2}(-\d{2})?$/)
        .optional(),
      // Byline shown on listing cards.
      author: z.string().default(AUTHOR_NAME),
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog };
