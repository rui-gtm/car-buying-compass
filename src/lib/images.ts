import type { ImageMetadata } from "astro";
import { getImage } from "astro:assets";
import { DEFAULT_OG_IMAGE, SITE_URL } from "./site";

// Photos live in src/assets/photos/ and are referenced from frontmatter or
// imported, so Astro resizes them, converts them to AVIF/WebP and strips
// EXIF metadata (including phone GPS location) at build time. The helpers
// below derive the social-card and structured-data versions from the same
// source file.

/** "2026-06" → "June 2026"; "2026-06-12" → "12 June 2026". */
export function formatPhotoDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day ?? 1));
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: "UTC",
    ...(day ? { day: "numeric" } : {}),
    month: "long",
    year: "numeric",
  }).format(date);
}

/** A 1200×630 JPEG crop for og:image / twitter:image (site-relative path). */
export async function socialImagePath(src: ImageMetadata) {
  const image = await getImage({ src, width: 1200, height: 630, fit: "cover", format: "jpg" });
  return image.src;
}

/** A schema.org ImageObject at least 1200px wide, as Google recommends for articles. */
export async function imageObject(src: ImageMetadata, caption?: string) {
  const image = await getImage({ src, width: Math.min(1600, src.width), format: "jpg" });
  return {
    "@type": "ImageObject",
    url: new URL(image.src, SITE_URL).href,
    width: image.attributes.width,
    height: image.attributes.height,
    ...(caption ? { caption } : {}),
  };
}

/** The site-wide social card, as an ImageObject, for pages without a photo. */
export const defaultImageObject = {
  "@type": "ImageObject",
  url: new URL(DEFAULT_OG_IMAGE, SITE_URL).href,
  width: 1200,
  height: 630,
};
