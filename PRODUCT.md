# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: React / frontend engineers evaluating or implementing guided tours, onboarding walkthroughs, and feature spotlights in React apps (React 16.8–19, including SSR frameworks).

## Product Purpose

react-joyride.com is the official **docs and demos** site for the React Joyride library. It helps developers understand the API, see tours working in realistic UI contexts, and get from install to a working tour without leaving the site.

Success: a visitor can find the right doc or demo, read it clearly, navigate the site without friction, and leave able to implement or migrate a tour.

## Positioning

The site’s job is documentation and interactive demonstration of React Joyride—not a marketing redesign surface. Proof is live demos (overview, chat, controlled dashboard, multi-route, carousel, custom components, scroll, modal) plus reference docs (props, step, events, hook, accessibility, migration).

## Operating Context

- Consumed in the browser at https://react-joyride.com (and local Next.js dev).
- Paired with npm package `react-joyride`, GitHub source, Algolia DocSearch, and an external StackBlitz playground.
- Library consumed via component (`<Joyride>`) or hook (`useJoyride`); site documents both.
- Demos use a shared ConfigPanel / ConfigContext so visitors can tweak tour options while viewing.

## Capabilities and Constraints

**Capabilities (site):** landing, MDX docs under `/docs`, interactive demos under `/demos`, light/dark theme, DocSearch, links to GitHub and npm.

**Constraints (confirmed):**
- This is a docs and demos site: **readability and navigation come first**.
- Do **not** change the stack (Next.js App Router, HeroUI, Tailwind, MDX, next-themes, DocSearch).
- Do **not** change the information architecture (existing `/docs` and `/demos` route structure and sidebar taxonomy).

**Undecided:** no separate secondary audience (designers/PMs) confirmed as a product priority; no formal site-level WCAG target beyond general readability.

## Brand Commitments

- Product name: **React Joyride**
- Site identity assets in use: Maze mark (header/home), wordmark SVG (`website/src/components/Logo.tsx`), crimson accent in existing UI, OG image at `/images/og-image.png`
- Author / maintainer context: Gil Barbara; OSS MIT library
- Tagline in use: “Create guided tours and walkthroughs for your React apps”

## Evidence on Hand

- Live demos: `/demos/*` (overview, chat, controlled, multi-route, carousel, custom-components, scroll, modal)
- Docs: `/docs/*` (getting started, new in v3, how it works, hook, props, step, events, custom components, exports, recipes, accessibility, migration)
- External: StackBlitz playground, npm, GitHub CI/coverage badges
- Do **not** fabricate testimonials, customer logos, benchmarks, or pricing claims

## Product Principles

1. **Docs and demos first** — every change should make reading and finding information easier, not louder.
2. **Preserve IA and stack** — extend within the current routes, sidebar, and Next/HeroUI/Tailwind/MDX setup.
3. **Show, don’t tell** — interactive demos are primary proof of the library.
4. **Developer clarity** — accurate API reference and migration paths beat promotional copy.
5. **Accessibility as library truth** — document and respect the library’s a11y model (focus trap, keyboard, ARIA); keep the site itself readable and navigable.

## Accessibility & Inclusion

Site priority: readability and clear navigation. Library docs commit to WAI-ARIA patterns (alertdialog, focus trap, keyboard). No separate formal WCAG level was set for the marketing shell itself.
