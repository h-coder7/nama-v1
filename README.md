# Namma Cargo — Website (Next.js)

Homepage built from the approved Figma page **"Home 1"** (PDF export, Nov 2026), following the same structure used on the Estidam site.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · SCSS Modules · GSAP 3.13 (ScrollTrigger + SplitText) · Lenis

```bash
npm install
npm run dev            # http://localhost:3000 → redirects to /en/
npm run build          # production build (Vercel)
npm run lint && npm run typecheck
npm run export:preview # static export in out/ (used for the review link)
```

## Structure

```
app/[locale]/layout.tsx      html lang/dir, LenisProvider, pre-hydration intro guard
app/[locale]/page.tsx        Home — section order = Figma order
components/layout/           Header (sticky, hide-on-scroll, dropdown, mobile menu), Footer
components/ui/               Button, Eyebrow, SectionHeader, RichText, Icon
components/sections/home/<section>/
  ├── <Section>.tsx          markup only
  ├── use<Section>Animation.ts   GSAP for this section only
  ├── <section>.data.ts      non-translated data (images, numbers, links)
  └── <section>.module.scss  namespaced styles
hooks/useSectionMotion.ts    gsap.matchMedia scope → auto cleanup + reduced-motion branch
lib/motion.ts                motion tokens (durations, easings, stagger, reveal start)
lib/reveal.ts                shared reveal helpers: revealUp, revealLines, revealHeader, countUp
lib/i18n.ts + messages/en.json   all copy lives in JSON (no text inside components)
providers/LenisProvider.tsx  the ONLY Lenis instance, driven by gsap.ticker → ScrollTrigger
styles/_tokens.scss          colours, type, container 1200 / gutter 24, radii, motion
public/assets/namma/         optimised assets (WebP images, PNG logos, SVG icons)
```

Sections: hero · solutions · about (+ milestones timeline) · numbers · featured-project · industries · why-namma · anniversary (40 years) · technology · projects · network · process · quote (+ footer in the same dark panel).

## Languages (EN primary + AR)

- `messages/en.json` is the source; `messages/ar.json` mirrors every key (checked for parity). Routes: `/en/...` and `/ar/...`; `/` → `/en/`.
- `<html dir="rtl">` for Arabic. Layout uses logical CSS (`margin-inline`, `inset-inline`, `--start`), cut corners and button slants mirror, arrows use `<Icon flow="back|forward">` and flip automatically, GSAP horizontal offsets go through `dirX()` (lib/motion.ts).
- Fonts: Latin always in Space Grotesk / Manrope; Arabic glyphs fall back to Readex Pro (display) / IBM Plex Sans Arabic (body). No letter-spacing on Arabic.
- Numbers, phones and emails stay LTR inside Arabic text (`[data-count]`, `dir="ltr"`). Western digits are used in both languages.
- Language switcher in the header keeps the current page (`swapLocale`), `hreflang` alternates are set per page (`lib/page.ts`).
- Arabic terminology (keep consistent on new pages): Project Logistics = لوجستيات المشاريع · Freight & Transport = الشحن والنقل · Warehousing & Distribution = التخزين والتوزيع · Customs Clearance = التخليص الجمركي · Duty Exemption Support = دعم الإعفاء الجمركي · Relocation & Exhibitions = خدمات الانتقال والمعارض · 3PL = الخدمات اللوجستية المتكاملة (3PL) · Industrial Equipment Packing = تغليف المعدات الصناعية · Air & Sea Chartering = استئجار الطائرات والسفن · Heavy & Oversized Cargo = البضائع الثقيلة وكبيرة الحجم · Freight ton (FRT) = طن شحن · Request a Quote = اطلب عرض سعر · Industries = القطاعات · Namma Cargo = نما للشحن.

## Routing (sitemap)

All 33 pages of `Namma_Cargo_Final_Sitemap_Visual_v1` + `/careers/{job-slug}` + 404 exist as routes.

- `lib/routes.ts` is the single source of truth: path, parent (breadcrumbs) and `status` (`built` / `pending`). Labels are in `messages/en.json → routes`.
- Every internal link goes through `<AppLink to="routeKey">` (or `<Button to="routeKey">`), which adds the locale prefix. Never hard-code `/en/...`.
- Header (Solutions mega menu = `SOLUTIONS_MENU`), footer columns (`FOOTER_COLUMNS`) and every homepage CTA/card point at real routes.
- Pages without a delivered design render `components/templates/PendingPage` (breadcrumb + title + child pages). To build a page: replace its `app/[locale]/<path>/page.tsx`, put its sections under `components/sections/<page>/`, and set its status to `"built"`.
- `/careers/[slug]` reads `lib/jobs.ts` (placeholder entry until the jobs feed exists).
- 404: `app/[locale]/not-found.tsx` (inside the locale layout) and `app/not-found.tsx` (URLs outside a locale).
- `/` redirects to `/en/` (next.config). The review link is a static export (`npm run export:preview`) where links are plain `<a>` (`NEXT_PUBLIC_PREVIEW_MPA=1`); production uses `next/link`.

## Motion rules (same as Estidam)

- Every section owns one `use<Section>Animation` hook, built on `useSectionMotion` → `gsap.matchMedia`, so tweens and ScrollTriggers are reverted on unmount / locale change.
- Hidden "from" states are set by GSAP, never by CSS, so content is visible without JS and with `prefers-reduced-motion`. The only exception is the hero intro (`html.is-intro [data-intro]`), with a 2.5 s safety timeout.
- Sections never create Lenis; ScrollTrigger is already bridged in `LenisProvider`.
- Only `transform` / `opacity` / `clip-path` are animated (plus one CSS `flex-grow` in Industries).
- Counters: server HTML holds the final number; `countUp` resets and counts on reveal.

| Section | Trigger | Effect | Reduced motion |
|---|---|---|---|
| Hero | load | photo settles 1.14→1, masked title lines, dash draws, stats bar lifts, counters | static |
| Hero | scroll (desktop) | photo parallax, copy drifts up/fades (scrub) | off |
| Solutions | top 78% / tab change | rows slide in, card clip-path wipe; tab swap = photo cross-fade + copy stagger | instant swap |
| About | top 78% / scrub | 1900→1983 counter, lead words fill 22%→100% with scroll, timeline pill glides | static |
| Numbers | top 78% | card scales in, stats + 8M count, logo slides on the diagonal | static |
| Featured project | scrub / top 78% | photo parallax, 800,000 counter, cards rise | static |
| Industries | hover/click | panel expands (CSS flex), copy enters after width settles | instant |
| Why Namma | row crosses 58% (desktop) / hover | dark plate glides between rows | instant |
| 40 Years | top 80% | diagonal wipe on photo slices, slash draws, 40 counts | static |
| Technology | in view | autoplay 5.2 s per item with progress bar, tooltip travels to hotspot, pause on hover/focus | no autoplay |
| Projects | top 78% / arrows | cards enter from the right, progress line follows scroll | instant scroll |
| Network | top 78% | pins drop + pulse, stats count, table rows stagger | static |
| Process | scrub | connecting line fills, step nodes switch on in order | all steps active |
| Quote | top 78% | options + form fields cascade, success state | static |

## To wire / confirm before launch

- **Quote form:** `components/sections/home/quote/quote.data.ts → endpoint` (currently simulated). Validation is client-side; keep server validation in Laravel.
- **Links:** all internal links follow the sitemap. Company profile PDF URL and LinkedIn URL are TODO (`lib/site.ts`). "Support" was removed from the footer (merged into Contact per the sitemap).
- **Copy marked as draft (not in the Figma):**
  - Solutions 2–4: descriptions and chips (only Project Logistics is in the design).
  - About timeline: only 1989 is in the design; 1983 and 2020 use facts already on the page; the other years show "Milestone details to be confirmed by Namma".
  - Industries 2–6 descriptions (only Oil & Gas is in the design).
  - Technology items 2–5 descriptions and tooltip statuses (only Shipment Tracking is in the design).
- **Solutions images 2–4** reuse other homepage photos until dedicated images are supplied.
- **Arabic:** `lib/i18n.ts` and the layout already handle `ar` + `dir="rtl"`; add `messages/ar.json` and `"ar"` to `locales`. Directional animations (`x: -24`) should be flipped for RTL at that point.
- **Fonts:** Space Grotesk + Manrope self-hosted via `@fontsource` (no Google request at runtime).

## Deployment (production server)

Requirements: Node.js 20 LTS or newer.

```bash
npm ci                 # install exactly the versions in package-lock.json
npm run build          # production build (.next/)
npm run start          # serves on port 3000 (use: npm run start -- -p 8080 for another port)
```

- Put it behind Nginx / a reverse proxy (or run it with PM2: `pm2 start npm --name namma -- start`).
- `/` redirects to `/en/`; Arabic lives under `/ar/`. URLs end with a trailing slash.
- Do **not** deploy `out/` from `npm run export:preview` — that build is only for the review link
  (it rewrites links for a static preview host).
- Vercel works as is: import the repo, framework "Next.js", no extra settings.
