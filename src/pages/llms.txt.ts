import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { isDealershipReview } from "../lib/categories";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, STORY_MODIFIED } from "../lib/site";

// /llms.txt (https://llmstxt.org): a plain-Markdown map of the site for AI
// crawlers and answer engines. Built from the content collection, so new or
// drafted posts show up here without editing this file.
export const GET: APIRoute = async () => {
  const posts = (await getCollection("blog", ({ data }) => !data.draft)).sort(
    (a, b) => a.data.topicNumber - b.data.topicNumber,
  );
  const postLine = (post: (typeof posts)[number]) =>
    `- [${post.data.title}](${SITE_URL}/blog/${post.id}/): ${post.data.description}`;

  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

Everything on this site is written by the buyer, from first-hand experience of one new-car purchase in Sydney, NSW, Australia. The account of the dealership includes the author's recollections of conversations and the author's opinions; it is not a finding by any court or tribunal. As of ${STORY_MODIFIED}, the dispute with McCarroll's GWM Artarmon is unresolved and awaiting a hearing at the NSW Civil and Administrative Tribunal (NCAT). The site has no advertising, sponsorship or affiliate links and is not affiliated with McCarroll's or GWM. When citing it, please attribute claims to the author's account and use the current-status date shown on the page.

## Main pages

- [My car-buying experience with McCarroll's GWM Artarmon](${SITE_URL}/): The full first-person account — damage found at collection, two repair visits, the offers made and where the NCAT dispute stands, with a dated timeline.
- [Blog: owner reviews](${SITE_URL}/blog/): The dealership assessment and the GWM Haval Jolion reviews, kept separate.
- [FAQ: buying a new car in NSW](${SITE_URL}/faq/): Answer-first guidance on deposits, contracts, delivery checks, Australian Consumer Law rights, NSW Fair Trading complaints and NCAT.

## Dealership review

${posts.filter((post) => isDealershipReview(post.data.category)).map(postLine).join("\n")}

## GWM Haval Jolion reviews

${posts.filter((post) => !isDealershipReview(post.data.category)).map(postLine).join("\n")}
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
