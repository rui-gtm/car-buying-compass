import type { ImageMetadata } from "astro";
import { STORY_MODIFIED } from "./site";

// "25 September 2026" — the as-of date quoted in the answers, always the
// story's last-updated date.
const asOf = new Intl.DateTimeFormat("en-AU", { dateStyle: "long" }).format(new Date(STORY_MODIFIED));

// Facts from the story at "/" that are reused elsewhere: the page itself, the
// Quick answers FAQ (and its FAQPage data) and /llms.txt. Keep them in step
// with the timeline in src/pages/index.astro, and bump STORY_MODIFIED in
// lib/site.ts whenever they change.

export const CURRENT_STATUS =
  "The driver's door scratch has not been satisfactorily repaired. McCarroll's latest offer is to repaint the door and provide three services. An NCAT hearing is yet to be scheduled.";

// Short, factual answers lifted from the story — the block search engines and
// AI answer engines are most likely to quote.
export const quickAnswers = [
  {
    question: "What happened with my new car from McCarroll's GWM Artarmon?",
    answer:
      "I collected a brand-new 2026 Haval Jolion Vanta from McCarroll's GWM Artarmon in May 2026 and found two dents, a deep scratch above the driver's door handle, a paint stain on the bonnet and trapped protective wrapping on the day. After two repair visits in June 2026, the dents and stain were fixed but the scratch was not.",
  },
  {
    question: "Has the dispute been resolved?",
    answer:
      `No. As of ${asOf}, the driver's door scratch has not been satisfactorily repaired and an NCAT hearing is yet to be scheduled.`,
  },
  {
    question: "What has McCarroll's offered?",
    answer:
      "After the second repair, a sales manager offered two services, which he valued at about $400–$500, instead of further repairing the door. After we said we intended to go to NCAT, McCarroll's offered to repaint the driver's door and provide three services. That remains its latest offer.",
  },
  {
    question: "Why haven't you accepted the offer to repaint the door?",
    answer:
      "Two repair visits had already ended with assurances that the damage was fixed when it wasn't, and the offer does not address our concern that the damage and repainting could reduce the car's resale value.",
  },
  {
    question: "Has McCarroll's responded to this account?",
    answer:
      "Not yet. McCarroll's has not yet been invited to respond specifically to this account. Any response will be recorded on this page.",
  },
];

// --- Evidence photos ----------------------------------------------------------
// Slots for the dated photos that support the story, each shown in its story
// section once `src` is set; until then nothing is rendered. To add one:
//   1. Save the photo in src/assets/photos/ with a descriptive file name,
//      e.g. jolion-vanta-driver-door-scratch-2026-05.jpg. Crop or blur number
//      plates and anyone's face or name badge first.
//   2. Import it above this list and set `src`, e.g.
//        import driverDoorScratch from "../assets/photos/jolion-vanta-driver-door-scratch-2026-05.jpg";
//        …  src: driverDoorScratch,
//   3. Check the alt text and caption still match what the photo shows, and
//      set `takenOn` to the date the photo was taken.
// Photos with `src` also go into the story's Article structured data.

export interface EvidencePhoto {
  id: string;
  /** The id of the story section the photo belongs to. */
  section: "collection" | "second-collection";
  src?: ImageMetadata;
  alt: string;
  caption: string;
  /** "YYYY-MM" or "YYYY-MM-DD". */
  takenOn: string;
}

export const evidencePhotos: EvidencePhoto[] = [
  {
    id: "driver-door-scratch",
    section: "collection",
    alt: "Deep scratch in the paint above the driver's door handle of a new 2026 GWM Haval Jolion Vanta",
    caption: "The scratch above the driver's door handle, found at collection.",
    takenOn: "2026-05",
  },
  {
    id: "rear-door-dents",
    section: "collection",
    alt: "Two dents in the rear passenger door of a new 2026 GWM Haval Jolion Vanta",
    caption: "Two dents in the rear passenger door, found at collection.",
    takenOn: "2026-05",
  },
  {
    id: "bonnet-stain",
    section: "collection",
    alt: "Paint stain on the bonnet of a new 2026 GWM Haval Jolion Vanta",
    caption: "The paint stain on the bonnet, found at collection.",
    takenOn: "2026-05",
  },
  {
    id: "trapped-wrapping",
    section: "collection",
    alt: "Protective plastic wrapping trapped between a door's rubber seal and the door frame",
    caption: "Protective wrapping trapped between a door seal and the frame.",
    takenOn: "2026-05",
  },
  {
    id: "scratch-after-touch-up",
    section: "second-collection",
    alt: "Touch-up paint over the scratch above the driver's door handle, with the scratch still visible",
    caption: "The same scratch at the second collection: touch-up paint applied, damage still visible.",
    takenOn: "2026-06",
  },
];
