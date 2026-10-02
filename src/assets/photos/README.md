# Photos

Put every photo for the site in this folder. Astro resizes each one, converts
it to AVIF/WebP and strips its EXIF metadata (including the GPS location most
phones record) at build time, so upload the original JPEG/PNG straight from
the phone.

Before adding a photo:

- **Privacy:** crop or blur number plates, and anyone's face, name badge or
  name on paperwork. The site never names individual employees.
- **File name:** describe what it shows, with the month taken, e.g.
  `jolion-vanta-driver-door-scratch-2026-05.jpg` (lower case, hyphens).
- **Size:** at least 1200 px wide; landscape works best.

Where each photo goes:

| Photo for | Set it in | Alt text and caption |
|---|---|---|
| A post's main photo (also its social card) | the post's frontmatter: `heroImage: "../../assets/photos/<file>.jpg"` | `heroImageAlt` (already written for every post), optional `heroImageCaption` and `heroImageDate` |
| A photo beside text in a post | `import photo from "../../assets/photos/<file>.jpg";` at the top of the .mdx, then `<SplitSection image={photo} imageAlt="…">` | `imageAlt`, optional `caption` and `takenOn` |
| Evidence photos in the story at `/` | `src/lib/story.ts` → `evidencePhotos`: import the file and set `src` | already written for each slot; check they match the photo |

Alt text says specifically what the photo shows (which car, which panel, what
damage). It is read aloud by screen readers and read by search engines, so
keep it factual — no opinions.
