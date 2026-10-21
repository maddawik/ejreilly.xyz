# ejreilly.xyz

Personal site and blog, built with [Astro](https://astro.build) and hosted on
GitHub Pages.

## Development

Tooling (Node, pnpm) is managed with [mise](https://mise.jdx.dev).

```sh
mise install       # install pinned Node and pnpm
mise run dev       # dev server at http://localhost:4321 (shows drafts)
mise run build     # production build into dist/
mise run preview   # serve the production build
mise run check     # astro check + prettier --check
mise run fmt       # format everything
```

The home page bio is `src/content/bio.md`. Posts live in
`src/content/writing/` as Markdown. Front matter:

```yaml
---
title: "Post title"
date: 2026-01-01T12:00:00-05:00
description: "One-line summary"
draft: true # optional; drafts only render in dev
---
```

## Deployment

Pushes to `main` build and deploy to GitHub Pages via
`.github/workflows/deploy.yml`. Pull requests run the same checks without
deploying.

## License

Code is [MIT](LICENSE). Written content (posts and bio) is © EJ Reilly, all
rights reserved.
