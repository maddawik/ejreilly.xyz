// @ts-check
import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";
import { createCssVariablesTheme } from "shiki/core";

// Syntax colors come from --shiki-* custom properties in global.css so code
// blocks follow the site palette in both light and dark mode.
const codeTheme = createCssVariablesTheme({
  name: "site",
  variablePrefix: "--shiki-",
});

export default defineConfig({
  site: "https://ejreilly.xyz",
  // Astro 7 defaults to JSX whitespace rules, which drop the space between
  // wrapped prose and inline links. Lossless compression keeps it.
  compressHTML: true,
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { theme: codeTheme },
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "IBM Plex Sans",
      cssVariable: "--font-sans",
      weights: [400, 600],
      styles: ["normal", "italic"],
      fallbacks: ["system-ui", "sans-serif"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "IBM Plex Mono",
      cssVariable: "--font-mono",
      weights: [400, 500],
      styles: ["normal"],
      fallbacks: ["ui-monospace", "monospace"],
    },
  ],
});
