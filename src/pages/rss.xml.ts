import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { AUTHOR_NAME, SITE_DESCRIPTION, SITE_NAME, SITE_URL, STORY_MODIFIED, STORY_PUBLISHED } from "../lib/site";

// /rss.xml: the story plus every published post, newest first, so feed
// readers and crawlers pick up new and updated pages quickly. Hand-written to
// avoid a dependency; every text value is XML-escaped.
const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const GET: APIRoute = async () => {
  const posts = await getCollection("blog", ({ data }) => !data.draft);

  const items = [
    {
      title: "My car-buying experience with McCarroll's GWM Artarmon",
      url: `${SITE_URL}/`,
      description:
        "The full first-person account: damage found at collection, two repair visits, the offers made and where the NCAT dispute stands.",
      published: new Date(STORY_PUBLISHED),
      updated: new Date(STORY_MODIFIED),
      category: "Story",
    },
    ...posts.map((post) => ({
      title: post.data.title,
      url: `${SITE_URL}/blog/${post.id}/`,
      description: post.data.description,
      published: post.data.publishDate,
      updated: post.data.updatedDate ?? post.data.publishDate,
      category: post.data.category,
    })),
  ].sort((a, b) => b.updated.getTime() - a.updated.getTime());

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escape(SITE_NAME)}</title>
    <link>${SITE_URL}/</link>
    <description>${escape(SITE_DESCRIPTION)}</description>
    <language>en-AU</language>
    <lastBuildDate>${items[0].updated.toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items
  .map(
    (item) => `    <item>
      <title>${escape(item.title)}</title>
      <link>${item.url}</link>
      <guid isPermaLink="true">${item.url}</guid>
      <description>${escape(item.description)}</description>
      <category>${escape(item.category)}</category>
      <dc:creator>${escape(AUTHOR_NAME)}</dc:creator>
      <pubDate>${item.published.toUTCString()}</pubDate>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
};
