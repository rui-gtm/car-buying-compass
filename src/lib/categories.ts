// Fixed set of filter categories shown as chips on the /blog/ listing. Each
// post belongs to exactly one via its `category` frontmatter; the
// order here is the order the chips appear in.
export const REVIEW_CATEGORIES = [
  "Owner review",
  "Dealership review",
  "Safety",
  "Price & deal",
  "Exterior",
  "Interior",
  "Performance",
  "Comfort",
] as const;

export type ReviewCategory = (typeof REVIEW_CATEGORIES)[number];

// URL-safe form used in data attributes and the ?category= query param,
// e.g. "Price & deal" -> "price-and-deal".
export const categorySlug = (category: ReviewCategory) =>
  category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
