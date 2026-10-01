// Site-wide identity and the entities the structured data refers to. Kept in
// one place so the header, <title> suffix, meta tags, JSON-LD and llms.txt
// never drift apart.

export const SITE_URL = "https://mccarrollsreview.com.au";
export const SITE_NAME = "My Car-Buying Experience with McCarroll's GWM Artarmon: What Happened";
export const SITE_DESCRIPTION =
  "A first-hand account of buying a new 2026 GWM Haval Jolion Vanta from McCarroll's GWM Artarmon in Sydney, plus owner reviews and a NSW car-buying FAQ. Not affiliated with McCarroll's or GWM.";

// The one byline used everywhere: <meta name="author">, post cards and the
// Person entity. No email or social profiles — the site deliberately offers no
// contact details.
export const AUTHOR_NAME = "The buyer";
export const AUTHOR_DESCRIPTION =
  "Bought a new 2026 GWM Haval Jolion Vanta from McCarroll's GWM Artarmon in May 2026 and writes only from that first-hand experience.";

// The story at "/" — bump STORY_MODIFIED whenever the status or timeline changes.
export const STORY_PUBLISHED = "2026-07-01";
export const STORY_MODIFIED = "2026-09-25";
// The FAQ at /faq/ — bump whenever an answer or source changes.
export const FAQ_MODIFIED = "2026-10-01";

export const DEFAULT_OG_IMAGE = "/og-image.png";
export const DEFAULT_OG_IMAGE_ALT = `${SITE_NAME} — a first-hand account of buying a 2026 Haval Jolion Vanta in Sydney`;

/** Appends the site name to a page title only when the result stays short enough not to be cut off in search results. */
export function pageTitle(title: string) {
  const full = `${title} | ${SITE_NAME}`;
  return full.length <= 65 ? full : title;
}

// --- Schema.org entities -----------------------------------------------------

export const ids = {
  website: `${SITE_URL}/#website`,
  author: `${SITE_URL}/#author`,
  dealer: `${SITE_URL}/#dealer`,
  car: `${SITE_URL}/#car`,
};

export const dealerEntity = {
  "@type": "AutoDealer",
  "@id": ids.dealer,
  name: "McCarroll's GWM Artarmon",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Artarmon",
    addressRegion: "NSW",
    postalCode: "2064",
    addressCountry: "AU",
  },
};

export const carEntity = {
  "@type": "Car",
  "@id": ids.car,
  name: "2026 GWM Haval Jolion Vanta",
  brand: { "@type": "Brand", name: "GWM" },
  model: "Haval Jolion",
  vehicleConfiguration: "Vanta",
  vehicleModelDate: "2026",
};

// The Jolion range in general, for posts not specific to the author's Vanta.
export const jolionRangeEntity = {
  "@type": "Car",
  name: "GWM Haval Jolion",
  brand: { "@type": "Brand", name: "GWM" },
  model: "Haval Jolion",
};

export const authorEntity = {
  "@type": "Person",
  "@id": ids.author,
  name: AUTHOR_NAME,
  description: AUTHOR_DESCRIPTION,
  url: `${SITE_URL}/`,
};

export const websiteEntity = {
  "@type": "WebSite",
  "@id": ids.website,
  name: SITE_NAME,
  alternateName: "mccarrollsreview.com.au",
  url: `${SITE_URL}/`,
  description: SITE_DESCRIPTION,
  inLanguage: "en-AU",
  publisher: { "@id": ids.author },
};

export interface Crumb {
  name: string;
  /** Site-relative path ending in "/". */
  path: string;
}

export function breadcrumbList(crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: new URL(crumb.path, SITE_URL).href,
    })),
  };
}
