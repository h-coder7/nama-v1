# Namma Cargo — performance & motion pass (Nov 2026)

## How it was measured
- Production build (`next build` + `next start`) of the code **before** and **after** this pass, served locally.
- Lighthouse 12 (performance only), Chrome headless; default mobile throttling and `--preset=desktop`.
- Lighthouse varies run to run (±5–10 points on mobile here), so the figures below are single runs. Treat them as direction, not as precise values. No field (CrUX) data exists yet.
- Not available in this environment: Chrome DevTools trace UI, bundle analyzer UI, React Profiler, `vercel-react-best-practices` / `gsap-*` (non-cloud) skills. GSAP and React guidance came from the official docs and the installed cloud GSAP skills.

## Baseline: bottlenecks found (measured)
| Finding | Evidence |
|---|---|
| **The LCP element was hidden until JS ran.** It is the hero paragraph, kept at `opacity: 0` (`html.is-intro`) until the GSAP intro started after hydration. | Home mobile LCP 4.9–5.9 s, with **91% "render delay"**. |
| **Hydration ran one long main-thread task.** Every section's `useSectionMotion` (SplitText + ScrollTrigger measurements) ran in the same layout-effect pass. | Long task of 1,377 ms; TBT 0.74–1.24 s on mobile; "Style & Layout" 2.6 s. |
| **Render-blocking CSS.** | 5 CSS files, ~810 ms estimated (Lighthouse). |
| **Too many font faces.** Each Fontsource weight file also declared Cyrillic / Greek / Vietnamese / Latin-ext faces. The faces the hero paints with were discovered late (only after the CSS). | — |
| **Ambient loops kept running off-screen.** Ribbon / marquee loops, the badge swing, the map glow, the 3PL core pulse and the outlined "SINCE 1983" dashes. | — |
| **Animations on expensive properties.** A blur `filter` on the 10rem rolling year (About timeline). A clip-path wipe on the Freight hero photo, which is also its LCP. A scroll handler on Home Projects that read layout and wrote `width` on every scroll event. | — |

## Optimisations implemented
1. **Hero first paint without JS (Home).** The entrance is now a CSS animation that starts at first paint: photo settle, title lines rising out of their masks, dash, CTAs and stats. The LCP paragraph uses a transform-only settle, so it paints immediately. JS only runs the counters and the desktop parallax.
2. **Deferred section motion setup** (`hooks/useSectionMotion.ts`). Sections in or near the first viewport are set up at once. Sections further down are set up when they come within about one viewport, or when the browser is idle (`requestIdleCallback`, 4 s timeout). Until then they are simply shown in their final state, so nothing becomes invisible if setup is late.
3. **Pre-hydration hide is bounded.** A CSS animation reveals `[data-intro]` at 1.4 s even while the main thread is busy. Hero intros check `introExpired()` (`lib/motion.ts`) and skip their entrance instead of hiding content that is already visible. Client-side navigation is unaffected (verified).
4. **Inline CSS in production** (`experimental.inlineCss`). It is disabled for the static review export, because the export's MPA rewrite needs CSS files; with it enabled there, every page threw a React Flight error.
5. **Fonts.**
   - Latin families use the Latin subset only; Arabic families use the Arabic subset only. The visible typography and weights are unchanged.
   - The four faces the hero paints with are self-hosted in `/assets/namma/fonts`, using the same Fontsource files, and preloaded per locale.
6. **`loopWhileVisible()`** (`lib/reveal.ts`): ambient loops pause whenever their section is off-screen. Applied to 7 loops.
7. **Freight hero.** The photo paints at once and settles with a transform instead of the clip-path wipe. Only the split-flap text waits for the intro.
8. **Bleed heroes** (Packing, project pages): the photo paints at once. Air & Sea keeps its signature wipe through a `holdVisual` opt-in.
9. **Home Projects scroll thumb.** Sizes are read only on resize (ResizeObserver). On scroll the thumb moves by transform, with one write per animation frame.
10. **About timeline.** The blur filter was removed; the digit accent is now a transform-only stretch.

## Results (Lighthouse, production build, single runs)
| Page | Before (mobile / desktop) | After (mobile / desktop) |
|---|---|---|
| Home EN | 53–61 / 80–84 · LCP 4.9–5.6 s · TBT 0.74–1.24 s | 77–86 / 93–99 · LCP 2.6–3.0 s · TBT 0.41–0.69 s |
| Home AR | 50–54 / 80–83 · LCP 5.9 s · TBT 1.13 s | 67–74 / 98–99 · LCP 4.2–4.5 s · TBT 0.41–0.67 s |
| About EN | 79 / 96 · LCP 3.4 s | 82 / 99 · LCP 2.6 s |
| Freight AR | 62 / 88 · LCP 5.7 s | 88 / 97 · LCP 3.2 s |
| Packing EN | — | 81 / 99 · LCP 3.5 s |

CLS stays ≤ 0.011 everywhere that was measured.

## Motion changes by section
- **Hero (Home).** The CSS entrance starts at first paint: photo settle, staggered masked lines (whole lines, so Arabic stays joined), dash draw, then copy, CTAs and stats. It finishes in about 1.3 s, and content never waits for JS.
- **About timeline.** Odometer-style digits that roll on CSS transforms. A transform-only stretch accent. Story lines re-reveal from the travel direction. The rail fills progressively, the pill moves by FLIP, and the rail can be scrubbed with the pointer (built in the previous round, refined here).
- **Network, Careers, 3PL, Projects wall, Industries ribbons, About outline.** Ambient motion now pauses off-screen.
- **Freight.** The board photo settles instead of being wiped in, so the hero feels stable and paints sooner.

## Build & test results (actually run)
- `npm run lint` ✓ · `npm run typecheck` ✓ · `npm run build` ✓ · `npm run export:preview` ✓
- **All 76 static routes × 2 viewports (375, 1440):** no page errors and no failed requests. The only flag was Home at 375 px: 3 headings were still mid-reveal at capture time and were visible 2.5 s later.
- **Production server:** client-side navigation Home → About plays the About intro, with h1 opacity 1 afterwards. Browser back works.
- **Reduced motion (AR, 390 px):** the hero is fully visible with no intro.
- **Not run:** 430 / 768 / 1920 px sweeps, a real-device INP check and Safari/Firefox. Recommended before launch.

## Remaining limitations / next steps
- **Mobile Home AR LCP (~4.2 s)** is the slowest measured page. The Arabic body face (IBM Plex Sans Arabic, 42 KB) is preloaded alongside 3 Latin faces. Subsetting it to the glyphs actually used, or dropping one Latin preload on AR, should help.
- **Remaining TBT (~0.4–0.7 s mobile)** is mostly React hydration of the full client tree. Converting static sections (copy-only blocks) to Server Components would reduce it. This was not done here, to keep the architecture unchanged.
- **Inner-page heroes** (PageHero, SolutionHero, Industry heroes) still run their entrance in JS and are only time-bounded by the 1.4 s CSS safety. Moving them to the same CSS-first pattern as Home would bring their LCP in line.
- **Why Namma:** the active plate still tweens `height`. It is a single absolutely positioned element, so siblings do not reflow. A scaleY version would distort its rounded corners.
- **Three.js / Globe.GL** (requested skills) were not introduced. The brief forbids new frameworks, and a WebGL globe would undo the performance gains above.

## Architecture preservation
No folders, routes, file names, content, translations, brand assets or layouts were changed. Additions are internal: one helper in `lib/reveal.ts`, two exports in `lib/motion.ts`, 4 font files in `public/assets/namma/fonts`, and this report. Stack unchanged: Next 15, React 19, TypeScript, SCSS Modules, GSAP, Lenis.
