# Huz Trader — Redesign Specification (v2, Authoritative)

**Status:** Final. Supersedes the v1 specification and incorporates the consultant review. This is the single source of truth for the frontend redesign.

**Scope guardrails:** Every item in this document is presentational — markup, styling, and copy only. All data fetching, Supabase queries, API routes (`/api/enquire`, `/api/admin/cars`), form fields, Zod schemas, submission logic, page routes, anchors (`#enquire`, `#process`, `#quote`), and business workflows remain exactly as they are. The admin panel is untouched. No new backend features. If an item in this document appears to require new data flow or state logic, it is out of scope — flag it, don't build it.

---

## Decision Log (contradictions resolved in review)

These supersede anything you may have seen in v1:

| Topic | Decision |
|---|---|
| Containers | **One container only:** keep `max-w-7xl` for all pages, plus a narrow ~720px measure for forms/long text. The 1440px "wide" container is removed. |
| Homepage hero | Photo-led hero **only if a quality asset exists**. Fallback (build first): current gradient composition with the new typography, colours, and copy hierarchy. A bad stock photo is worse than no photo. |
| Hero search strip | **Cut.** `CarGrid` filters are client `useState`, not URL params — a working search strip would require new filter-state logic (scope creep). Do not build. |
| Navbar background | **Solid ink at all times.** No transparent-on-hero or blur-on-scroll variants. |
| Filter bar | Restyled **in place** (non-sticky, no bottom sheet, no dismissible chips). Sticky toolbar / bottom sheet / chips are Deferred. |
| Mobile menu | **Restyle the existing dropdown** (bigger type, more padding, pinned CTA). Full-height slide-in panel is Deferred. |
| Contact map | **No map.** Static map services need an API key. Use a styled address block with a "Get directions" link (plain Google Maps URL). |
| Hero headline copy | Final wording is the **owner's decision**. Use existing copy until the owner approves replacements; candidate options are listed in §6 as placeholders only. |
| Card click target | Whole-card click is approved, but must use the stretched-link pattern — anchors cannot nest. See §5.4 implementation note. |
| Pre-footer CTA band, skeleton loaders, dark-surface texture, gallery swipe hint | **Cut** (see Cut List at end). |

---

## 1. Design Philosophy

**"The quiet showroom."** A premium dealership doesn't shout — it presents.

1. **The car is the hero.** Photography gets maximum surface area; UI chrome recedes. Dark, low-saturation surfaces frame imagery the way a showroom floor frames paintwork.
2. **Confidence through restraint.** One accent colour, used scarcely — the primary action and the price. When gold appears once per viewport it means something; when it appears nine times it means nothing.
3. **Numbers are the product.** Price, kilometres, year — buyers scan these first. They get tabular figures, distinct weight, and consistent placement so a grid of cards scans like a table.
4. **Trust is typographic.** Generous whitespace, a disciplined type scale, prominent real contact details, and zero template-isms do more for credibility than any badge row.

Mood references: Carvana's clarity, Collecting Cars' photographic confidence, the restraint of a Lexus configurator — adapted to a family-run Australian dealer, so warm rather than cold.

---

## 2. Design System

### 2.1 Layout & Grid
- **Container:** `max-w-7xl` (1280px) everywhere. Forms and long-form text sit in a ~720px measure inside it.
- **Section rhythm:** replace uniform `py-14/16` with three tiers — major sections ≈96px desktop / 64px mobile; standard ≈80px / 56px; compact bands ≈48px / 40px. Alternate background tones (paper → mist → dark) to separate sections instead of relying on padding alone.
- **Card grids:** gutters move from `gap-6` to `gap-8` desktop.

### 2.2 Elevation & Surfaces
- **Level 0 — page background:** warm off-white `paper` (#FAFAF8), not pure white.
- **Level 1 — cards:** white, **no visible border**, soft ambient shadow (`0 1px 2px rgba(16,24,40,.04), 0 4px 16px rgba(16,24,40,.06)`).
- **Level 2 — hover / sticky panels:** deeper shadow (`0 8px 32px rgba(16,24,40,.12)`), 2–3px lift.
- **Dark surfaces** (hero, CTA bands, footer): flat `ink-900`/`ink-800` fills with a 1px hairline `rgba(255,255,255,.06)` top border for separation. No textures or vignettes.

### 2.3 Radii
Standardise: **6px** inputs/buttons/badges · **12px** cards and panels · **16px** large media blocks. Never round images independently of their card.

### 2.4 Iconography
Keep Lucide (no new dependencies). Stroke width **1.5** site-wide. Two sizes only: 16px inline, 20px feature rows. Icons are removed from card spec chips entirely (§5.4).

### 2.5 Motion
- One easing curve: `cubic-bezier(0.22, 1, 0.36, 1)`; 200ms hovers, 350ms image zooms.
- Card hover: image scales to 1.03, card lifts 2px, shadow deepens. Card titles **no longer turn gold on hover** — underline instead.
- Respect `prefers-reduced-motion` (disable lifts/zooms).

---

## 3. Typography

The single highest-impact change on the site.

### 3.1 Typefaces
- **Headings: `Archivo`** (Google Fonts, via `next/font`) — SemiBold/Bold, letter-spacing −1% to −2%, for all H1–H3 and prices.
- **Body/UI: keep Geist Sans** (already loaded).
- **Geist Mono** (already loaded) is used for exactly one thing: VINs and stock numbers.
- **Tabular figures** (`font-variant-numeric: tabular-nums`) on all prices, mileage, and spec values.

### 3.2 Type scale (desktop / mobile)
| Role | Size | Weight | Notes |
|---|---|---|---|
| H1 hero | 56–64px / 36px | 700 | Archivo, line-height 1.05 |
| H1 page | 40px / 30px | 700 | Archivo |
| H2 section | 32px / 26px | 600 | Archivo |
| H3 card title | 18px / 17px | 600 | Archivo, line-height 1.3 |
| Eyebrow | 12px | 600 | Geist, uppercase, +12% tracking, **stone grey — never gold** |
| Body | 16px | 400 | Geist, line-height 1.65; never below 15px for reading text |
| Price (card) | 22px | 700 | Archivo, tabular |
| Price (detail) | 36px | 700 | Archivo, tabular |
| Caption/meta | 13px | 500 | Geist, stone |

### 3.3 Rules
- Two weights per typeface maximum (400/500 body; 600/700 display).
- Section headers are always: eyebrow + heading + one-line subhead. Nothing more.
- **No gold text below 18px on white, ever** (contrast).

---

## 4. Colour

Evolve the brand, don't replace it. The fix is as much **ratio** as value.

### 4.1 Palette (define as CSS variables in `globals.css`, replacing current values)
| Token | Value | Replaces | Role |
|---|---|---|---|
| `ink-900` | `#0B1220` | `#0f1a33` | Footer, hero base |
| `ink-800` | `#111B2E` | `#1a2744` | Navbar, primary dark surfaces |
| `ink-700` | `#1C2A45` | `#243561` | Hovers on dark |
| `gold-500` | `#C9A227` | `#e8b84b` | The accent: primary CTA fill, price on dark, active states |
| `gold-600` | `#B38D1F` | `#d4a53a` | CTA hover |
| `paper` | `#FAFAF8` | `#ffffff` | Page background |
| `mist` | `#F1F2F0` | `#f4f5f7` | Alternate bands, input fills |
| `stone-500` | `#6E7480` | `#6b7280` | Secondary text |
| `stone-300` | `#D8DAD5` | `#e5e7eb` | Hairlines (rare — shadows replace most borders) |
| `signal-red` | `#B42318` | red pastels | Sold |
| `signal-green` | `#067647` | green-500 | Success |

### 4.2 Usage rules (this is the actual fix)
- **≈90% neutral / 8% ink / 2% gold.** Gold appears in at most two places per viewport: the primary CTA and the price.
- Gold is **removed** from: eyebrows, check icons, icon circles, link hovers, footer icons, gallery thumbnail borders.
- Checks/bullets: ink on light surfaces; white at 70% opacity on dark.
- Badges go **solid**: Sold = white on `signal-red`; Reserved = ink on `gold-500`; the blue "Import" badge becomes an outlined neutral chip labelled "Fresh Import" (blue leaves the palette entirely).
- Gold is fill-only on light backgrounds (WCAG AA policy; current gold-on-white price fails at ~1.9:1).

---

## 5. Components

### 5.1 Buttons (`components/ui/button.tsx` — same five variants, restyled)
- **accent:** gold fill, ink text, 6px radius, weight 600, 28px horizontal padding at `lg`. The only gold button style.
- **primary:** ink fill, white text.
- **outline:** 1.5px ink border, transparent fill; on dark surfaces white/80 border. Transition background-opacity on hover, not a colour swap.
- **ghost / danger:** same roles, retuned to the new palette.
- All buttons: ≥44px tap height; arrow icons shift 2px right on hover; visible focus ring (gold on dark, ink on light).

### 5.2 Inputs, Selects, Textareas (`components/ui/*`)
- `mist`-filled fields, borderless, 6px radius, **48px height**; 1.5px ink ring on focus (replaces the heavy 2px navy ring).
- Labels: 13px / 500 / stone, above the field (unchanged placement).
- Errors: same position, `signal-red` text + red ring on the field.

### 5.3 Badges (`components/ui/badge.tsx`)
Solid per §4.2. 11px uppercase, +8% tracking, 4px radius. Over photos, badges sit on a 60%-opacity ink scrim pill.

### 5.4 Car Card (`components/cars/CarCard.tsx`) — the most important component
Same data, same links, same `for_sale` conditional. Restructure:

1. **Image:** 3:2 ratio (replaces 4:3). Subtle bottom-edge gradient scrim. Badges top-left on scrim pills. Photo-count pill bottom-right ("12 photos" — from `images.length`).
2. **Title block:** Year above in stone 13px; **Make Model** in Archivo 600 18px; variant inline in 400/stone. Stock number leaves the header — 12px mono footnote at the card's bottom edge, or detail-page only.
3. **Specs:** delete the four icon chips. One meta line: `42,000 km · Automatic · Petrol · SUV` — 13px stone, interpunct-separated, tabular numerals.
4. **Price row:** hairline above; "Drive Away" 11px uppercase stone; price 22px Archivo bold ink.
5. **Actions:** remove both small buttons. The **whole card links to `/cars/[slug]`**; a single quiet "Enquire →" text link (same `#enquire` anchor, same `for_sale` condition) sits right-aligned in the price row.

> **Implementation note (from review):** anchors cannot nest. Use the stretched-link pattern — the title link gets an absolutely-positioned pseudo-element covering the card; the Enquire link sits above it with a higher z-index. Verify keyboard tab order (title link, then Enquire) and that both work with screen readers before shipping.

### 5.5 Filter Bar (`components/cars/CarGrid.tsx` — same filter state, options, and reset logic)
Restyled **in place** — not sticky, no bottom sheet:
- The boxed panel becomes a clean Level-1 card: result count left ("**14 vehicles**", Archivo 600), the same selects restyled as pill-shaped dropdowns, sort right.
- "Reset filters" stays as-is functionally but restyled: stone text link with × icon (drop the red).
- **Mobile:** the existing show/hide toggle becomes a proper "Filters" pill button with an active-count badge ("Filters · 2"), expanding the same panel inline. No new components.

### 5.6 Car Gallery (`components/cars/CarGallery.tsx`)
- Main image 16:9, full column width, 12px radius.
- Thumbnails 96×64; active = full opacity, inactive = 60% opacity (replaces the gold border).
- Lightbox: keep behaviour; restyle controls (ink scrims, 1.5-stroke icons), image counter top-centre.

### 5.7 Forms (Enquire / Contact / ImportQuote — same fields, schemas, endpoints)
- All forms adopt §5.2 fields inside a Level-1 card, with one reassurance line under the submit button: *"We reply within one business day. No spam, ever."*
- Submit buttons: gold accent style.
- ImportQuoteForm stepper, toggle-pill checkboxes, and success-state redesign are **Deferred/Polish** (see end) — ship the field/button/card restyle only in the main pass.

---

## 6. Homepage (`app/page.tsx`)

Same sections, same 6-car `for_sale` fetch, same links — recomposed:

1. **Hero.** Dark `ink-900`, ~80vh.
   - **Default build:** current gradient composition upgraded with the new palette and type scale — eyebrow ("Used cars & Japanese imports — family run"), H1 at 64px Archivo, two CTAs: gold "Browse cars for sale", outline-white "Import from Japan".
   - **If (and only if) the owner supplies a quality photo:** wide car/dealership shot anchored right, gradient-scrimmed to ink on the left text column.
   - **Headline copy:** keep existing wording until the owner approves a replacement. Candidates on file: "Good cars. Straight answers." / "Quality used cars, and the imports you can't find here." Do not invent others.
2. **Trust band.** Keep the four items; strip the gold icon circles. One quiet row on `ink-800` with thin dividers: stat first ("500+ vehicles sold", Archivo 600), label beneath in stone.
3. **Featured cars.** Same grid, new cards, on `paper`. Consolidate the duplicated "View all" into **one** outline button below the grid (all breakpoints).
4. **Import CTA band.** Keep the two-column ink panel concept but render it **full-bleed** (no rounded box inside a grey section). Checklist icons white/70. The 4-step column becomes a vertical timeline with a thin gold connecting line — the page's one decorative gold moment.
5. **Closing CTA.** One line, one button, on `mist`.

*(The v1 "recently sold strip" and "inline search strip" are not in this page — see Deferred and Cut List.)*

---

## 7. Cars Page (`app/cars/page.tsx`)

- **Header:** compact — H1 "Cars for sale" with the count as subhead ("14 vehicles available"). No eyebrow. Header shrinks so cars sit above the fold.
- **Filter bar** per §5.5, directly below.
- **Grid:** new cards, 3-up desktop / 2-up tablet / 1-up mobile (full-width cards), `gap-8`, in the standard container.
- **Empty states:** both (no inventory / no filter matches) restyled as Level-1 cards with an outline-button action; the no-match state lists active filters in plain text so users see why it's empty.

---

## 8. Car Details Page (`app/cars/[slug]/page.tsx`)

Same data, same sticky-panel architecture:

- **Breadcrumb row:** "← All cars" plus the car title repeated small (orients deep-linked visitors).
- **Title block moves above the gallery:** Year eyebrow, H1 Make Model Variant at 40px Archivo, status badges inline.
- **Gallery** per §5.6 in the left column.
- **Price appears exactly once.** Delete the gold price from the content column (this also removes a live WCAG failure). The sticky right panel owns it: "Drive away" label, 36px ink price, EnquireForm directly beneath, retitled **"Ask about this car"**. Its gold submit is the page's single gold CTA.
- **Specs:** replace the 8 grey tiles with a two-column definition list in one Level-1 card — label left (stone 13px), value right (ink 15px / 600 / tabular; VIN and stock number in Geist Mono).
- **Description:** "About this car" H2; body 16px / 1.7, max-width ~65ch (current 14px is too small for primary reading content).
- **Sold/Reserved state:** same logic; restyled as an ink panel — solid badge, "This one's gone — but we can find you another," existing Contact button plus a link to `/cars`.
- **Call panel:** keep below the form; phone number becomes a 20px Archivo tap target.
- **Mobile sticky action bar:** fixed bottom bar — price left, gold "Enquire" right, anchor-linking to `#enquire`. Display-only; no new logic. Ensure it doesn't overlap the footer (hide at page end or add scroll-margin).

---

## 9. Import Page (`app/import/page.tsx`)

- **Hero:** dark ink, new type scale. Add stat chips under the headline — "6–10 weeks door-to-door · Fixed landed quote · ADR complied & registered" — and a gold **"Get a quote"** button anchoring to `#quote` (the current hero has no CTA). Background photo optional, same asset rule as §6.
- **Why import:** keep the two-column structure. The inclusions panel becomes the visual anchor — ink card, white text, white/70 checks, retitled **"Every quote includes"**. Light column keeps prose + 5 benefits with ink checks.
- **Process (`#process`):** replace the five cramped cards with a **numbered vertical timeline** (desktop and mobile) — thin gold connecting line, large Archivo numerals, full descriptions. Fixes the awkward 2-col→5-col tablet break.
- **Vehicle preview:** keep the 3-car preview; retitle "Recently landed & available"; new cards; consolidate the two competing view-all CTAs into **one** outline button below the grid (same `/cars` destination).
- **Quote section (`#quote`):** two-column band on `mist` — left: header, a 3-line "What happens next" list (We confirm specs → You get a full landed cost → You approve before we bid), and the phone number; right: the restyled form. Same fields, same endpoint.

---

## 10. Contact Page (`app/contact/page.tsx`)

- **Compact ink hero** (~30vh): "Talk to us." plus one warm line. No eyebrow.
- **Layout flip:** info column **left**, form **right** — many visitors only want the phone number.
  - **Info column:** one Level-1 card — address with "Get directions" link (plain Google Maps URL, no API), phone as a 22px Archivo tap target, email, hours as a two-row mini table. No map embed. The separate "response time" grey box is deleted; that copy becomes the reassurance line under the form (§5.7).
  - **Form column:** restyled ContactForm — same department select, fields, endpoint. H2 "Send a message", gold submit.
- **Mobile order:** info card first, then form.

---

## 11. Navbar (`components/layout/Navbar.tsx`)

Same links, same dropdown structure, same mobile open/close state:

- **Main bar:** solid `ink-800`, 72px tall, hairline bottom border. **No scroll-transparency variants.**
- **Top utility bar:** keep on desktop (now `ink-900`). On **mobile**, add a phone icon button to the main bar — currently the phone number vanishes below `sm`, on the device where people actually call.
- **Logo:** retire the gold "A" square + two-line lockup. One-line wordmark in Archivo 700 white with a single gold detail (e.g., gold full-stop). Tagline moves to the footer only.
- **Links:** 15px / 500, white/75 → white on hover, **2px gold underline** for hover and active route (active state is currently missing — display-only addition via current pathname). Drop the grey hover pill.
- **Dropdown:** same hover behaviour; restyled as an `ink-800` panel (not a white card), 8px radius, items with one-line descriptions. Add ~150ms close delay to stop flicker on diagonal mouse travel.
- **CTA:** "Get a quote" — the bar's only gold element.
- **Mobile menu:** restyle the existing dropdown in place — 18–20px Archivo links, 16px vertical padding, indented children, gold CTA at the bottom next to an outline "Call us" button. (Full-height slide-in panel: Deferred.)

---

## 12. Footer (`components/layout/Footer.tsx`)

- **Surface:** `ink-900`. No pre-footer CTA band (cut in review — the homepage already ends with a CTA).
- **Columns:** keep four-column structure but rebalance — brand column wider (wordmark, two-line description, **phone number large in Archivo**), then **merge "Services" + "Import A Car" into one "Explore" column** (the current seven links across two lists are redundant), keep Contact column with the address linking to Google Maps directions.
- **Social:** replace the `Share2`/`ExternalLink` mystery icons with plain text links — "Facebook · Instagram" (Lucide 1.17 lacks the brand glyphs; honest text beats wrong icons).
- **Legal bar:** hairline-separated, 12px stone — copyright + LMCT dealer-licence placeholder (genuine trust signal for an Australian dealer) + Privacy link. **Delete "Built with Next.js · Hosted on Vercel."**

---

## 13. Implementation Plan (build in this order)

### Phase 1 — System foundation (~the 20% that delivers 80%)
1. Colour tokens in `globals.css` + site-wide gold-discipline pass (§4) — largely find-and-replace of the four legacy hex values.
2. Archivo via `next/font` + type scale + tabular numerals (§3).
3. Surface system: `paper` background, borderless shadow cards, section-rhythm pass (§2).
4. CarCard restructure (§5.4) — touches every commercial page at once.
5. Car detail page: single price, spec definition list, 16px body, mobile sticky enquire bar (§8).

**Checkpoint:** after Phase 1 the site should already read as a different tier. Review with the owner before continuing.

### Phase 2 — Components & chrome
6. Buttons, inputs, badges (§5.1–5.3).
7. Navbar: wordmark, active-link underline, mobile phone button, dropdown restyle + close delay (§11).
8. Footer: rebalance, text social links, legal bar cleanup (§12).
9. Filter bar restyle, simplified version (§5.5).
10. Gallery restyle (§5.6).

### Phase 3 — Pages
11. Homepage: hero (fallback composition first), trust band, consolidated CTAs, full-bleed import band with vertical timeline (§6).
12. Import page: hero CTA + stat chips, timeline, merged CTAs, two-column quote section (§9).
13. Cars page header + empty states (§7).
14. Contact page flip + info card (§10).

### Phase 4 — Verification
15. WCAG AA contrast audit (gold is fill-only on light; no gold text <18px on white).
16. `prefers-reduced-motion` pass.
17. Keyboard/screen-reader check on the stretched-link card and mobile sticky bar.
18. Mobile sweep at 360px, 390px, 768px: filter panel, sticky bar vs footer, nav phone button, form field heights.

---

## 14. Deferred (do not build now; revisit only with a demonstrated user need)

- ImportQuoteForm segmented progress bar (current stepper is functional; restyle colours only in the main pass).
- Dismissible active-filter chips on the cars page.
- Full-height slide-in mobile menu panel.
- Sticky/blurred filter toolbar.
- Mobile filter bottom sheet.
- Recently-sold strip on the homepage.
- **Polish-only batch** (acceptable in a final pass if time allows, never earlier): form success-state redesign, contact-pref toggle pills, custom select chevrons, mono VIN styling beyond the spec sheet, gallery keyboard arrows.

## 15. Cut List (decided against — do not build)

| Item | Reason |
|---|---|
| Transparent/blur navbar on scroll | Complexity and edge cases for an effect users don't consciously notice. |
| Homepage hero search strip | Would require new filter-state/URL logic in CarGrid — scope creep; a non-functional version is worse than nothing. |
| Pre-footer CTA band | CTA fatigue; homepage already ends with a contact CTA. |
| Skeleton shimmer cards | Pages are server-rendered; users rarely see an intermediate state. |
| Dark-surface texture/vignette | Imperceptible on consumer screens; fiddly to keep clean. |
| Gallery swipe-hint pulse | Gimmick; carousel affordance is universally understood. |
| 1440px wide container | Fragments the layout system for marginal gain. |

---

*End of specification. Questions about intent → design philosophy (§1). Questions about scope → guardrails at top. Anything not listed here is not part of the redesign.*
