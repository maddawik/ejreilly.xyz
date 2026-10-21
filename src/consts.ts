export const SITE_TITLE = "EJ Reilly";
export const SITE_DESCRIPTION =
  "EJ Reilly is a software engineer at VulnCheck. Writing about Neovim, infrastructure, and game dev.";

export const SOCIALS = [
  { name: "GitHub", href: "https://github.com/maddawik" },
  { name: "LinkedIn", href: "https://linkedin.com/in/ej-reilly/" },
  { name: "RSS", href: "/rss.xml" },
] as const;

/** Post dates are written in local time; render them the same way. */
export const TIME_ZONE = "America/New_York";
