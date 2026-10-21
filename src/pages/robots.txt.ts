import type { APIContext } from "astro";

export function GET({ site }: APIContext) {
  const sitemap = new URL("sitemap-index.xml", site);
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`);
}
