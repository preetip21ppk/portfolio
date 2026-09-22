# Preeti Purnimaa Kannan — Portfolio

Next.js 15 (App Router) + Tailwind CSS v4, statically generated and ready to
deploy on Vercel.

## Content lives in `data/`, not in components

Every piece of copy on the site comes from five JSON files. Edit these and the
whole site updates — you should not need to touch a component to change text.

| File | What it drives |
|---|---|
| `data/profile.json` | Name, title, tagline, contact links, hero stats, About copy, education |
| `data/experience.json` | The four roles on `/experience` and the "most recent role" block on the home page |
| `data/projects.json` | All 20 projects: the `/projects` grid, filters, and every `/projects/[id]` page |
| `data/dashboards.json` | The 14 dashboards on `/dashboards`, plus the "Dashboard delivered" panel on linked project pages |
| `data/skills.json` | Skill groups on the home page and `/about` |

`portfolio-content.md` is the human-readable master reference — the full resume
breakdown the JSON was derived from.

### Adding a GitHub or demo link to a project

Set `github` or `demo` on that project in `data/projects.json` (they are `null`
by default). Buttons appear on the detail page automatically.

### Connecting a live dashboard

Each dashboard in `data/dashboards.json` has two link fields:

- **`embedUrl`** — an iframe source. The dashboard renders inline on the card,
  behind a click-to-load poster so nothing third-party loads until the visitor
  asks for it. Get this from **Power BI → File → Embed report → Publish to web
  (public)** or **Tableau Public → Share → Embed Code** (use the `src` URL only).
- **`liveUrl`** — a plain link, opened in a new tab. Use this when a report
  cannot be embedded (Power BI Pro/organisational reports refuse to render in a
  third-party iframe because they require a signed-in tenant account).

Setting either one adds a gold **Live** badge to the card.

> Note: Power BI "Publish to web" makes a report **publicly accessible to anyone
> with the link, with no authentication**. Only use it on dashboards built from
> synthetic or public data — never on anything containing real client data.

### Adding a dashboard screenshot

Drop the image in `public/dashboards/` and set `image` on that dashboard in
`data/dashboards.json`. It renders above the title. A dashboard with an
`embedUrl` shows the live embed instead.

## Running locally

```bash
npm run dev
```

Then open http://localhost:3000. Production build:

```bash
npm run build
```

## Deploying to Vercel

1. Push this directory to a GitHub repository.
2. At [vercel.com/new](https://vercel.com/new), import that repository.
3. Accept the defaults — Vercel detects Next.js, and no environment variables
   are needed.
4. Deploy.

After the first deploy, update `metadataBase` in `app/layout.tsx` to the real
production URL so Open Graph tags resolve correctly.

## Design notes

- **Accent** is `#4a3aa7`, taken from a validated categorical palette and checked
  against the light surface with a contrast/CVD validator.
- **Charts** (`components/BarList.tsx`) are single-series, so they use one hue
  and no legend, label every bar directly, and add share-of-total on hover.
- **Animations** are scroll-triggered (`components/Reveal.tsx`) and count-up
  (`components/CountUp.tsx`). Both check `prefers-reduced-motion` and render
  static for anyone who has it set. `CountUp` server-renders the real number, so
  the values are correct with JavaScript disabled and for crawlers.

## Structure

```
app/
  page.tsx              Home — hero, pipeline diagram, charts, featured work
  projects/             Grid with category filter + search
  projects/[id]/        20 statically generated detail pages
  dashboards/           Gallery of 14 dashboards + summary charts
  experience/           Timeline of roles + education
  about/                Long-form about, full skills, contact
components/             Header, footer, cards, charts, animation primitives
lib/content.ts          Typed loaders + derived counts over data/
```
