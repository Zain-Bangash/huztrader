# Project Context — Huz Trader Car Dealership Website

## What This Is

A full-stack car dealership website built for a used car dealer + Japanese import business. Visitors can browse inventory, enquire about cars, and request import quotes. The owner manages everything through a password-protected admin panel.

**Live repo:** https://github.com/Zain-Bangash/huztrader  
**Deployed on:** Vercel (auto-deploys on push to `main`)  
**Database:** Supabase (project ID: `fwmmqpmtukvnweukddxe`)

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.7 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Database | Supabase (PostgreSQL) | — |
| File Storage | Supabase Storage (`car-images` bucket) | — |
| Auth | Supabase Auth (email/password) | — |
| Email | Resend | — |
| Forms | React Hook Form + Zod v4 | 7.78 / 4.4.3 |
| Icons | Lucide React | 1.17.0 |
| Runtime | Node.js on Vercel | — |

**Important quirks to know before editing:**
- **Next.js 16**: `params` in page/layout components is a `Promise` — always `await props.params`. Use `{ params: Promise<{ slug: string }> }` inline, NOT `PageProps<'/route'>` (types only exist after `next typegen`/`next dev`).
- **Zod v4**: `z.coerce.number()` infers as `unknown` — use `z.preprocess((v) => Number(v), z.number())` instead. When using `z.preprocess` with `zodResolver`, cast resolver as `as any` to avoid TS mismatch between input/output types.
- **Lucide React 1.17.0**: No `Facebook` or `Instagram` exports. Footer uses `Share2` and `ExternalLink` as placeholders.
- **Admin auth**: Protected by `middleware.ts` using Supabase SSR cookies. The middleware redirects unauthenticated users from any `/admin/*` route to `/admin/login`.
- **Public nav on admin**: Solved by `PublicLayout.tsx` client component that checks `usePathname()` and skips `<Navbar>` / `<Footer>` on `/admin` routes.

---

## Project Structure

```
car-dealer/
├── app/
│   ├── layout.tsx                  # Root layout — uses PublicLayout wrapper
│   ├── page.tsx                    # Home page — fetches latest 6 for_sale cars (no is_import filter), shows featured grid
│   ├── globals.css                 # Global styles, CSS variables (brand colours)
│   ├── cars/
│   │   ├── page.tsx                # /cars — full unified car list (ALL cars, no is_import filter)
│   │   └── [slug]/page.tsx         # /cars/[slug] — car detail page with enquire form
│   ├── import/
│   │   ├── page.tsx                # /import — service overview, 3-car preview (from all cars), quote form
│   │   └── catalogue/page.tsx      # redirects → /cars
│   ├── recently-sold/page.tsx      # /recently-sold — sold vehicles grid
│   ├── contact/page.tsx            # /contact — general contact form
│   ├── admin/
│   │   ├── layout.tsx              # Admin layout (minimal, no public nav)
│   │   ├── page.tsx                # Redirects to /admin/cars
│   │   ├── login/page.tsx          # Login page
│   │   ├── cars/
│   │   │   ├── page.tsx            # List all cars
│   │   │   ├── new/page.tsx        # Add new car
│   │   │   └── [id]/page.tsx       # Edit existing car
│   │   └── enquiries/page.tsx      # View all form submissions
│   └── api/
│       ├── enquire/route.ts        # POST: save enquiry to Supabase + email via Resend
│       └── admin/cars/
│           ├── route.ts            # POST: create car (auth required)
│           └── [id]/route.ts       # PUT: update car, DELETE: delete car (auth required)
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx              # Public navbar (desktop dropdown + mobile menu)
│   │   ├── Footer.tsx              # Public footer
│   │   └── PublicLayout.tsx        # Client wrapper: shows Navbar/Footer only on non-admin routes
│   ├── cars/
│   │   ├── CarCard.tsx             # Single car card (image, specs chips, price, buttons)
│   │   ├── CarGrid.tsx             # Client-side filtered/sorted grid of CarCards
│   │   ├── CarGallery.tsx          # Image carousel + lightbox for car detail page
│   │   └── EnquireForm.tsx         # Car enquiry form (posts to /api/enquire)
│   ├── import/
│   │   ├── ImportQuoteForm.tsx     # 3-step multi-step import quote form
│   │   └── ImportCatalogueGrid.tsx # Searchable/filterable grid of importable cars (preview prop for /import page)
│   ├── contact/
│   │   └── ContactForm.tsx         # General contact form (posts to /api/enquire)
│   ├── admin/
│   │   ├── AdminNav.tsx            # Admin sidebar navigation
│   │   ├── AdminLoginForm.tsx      # Supabase Auth login form
│   │   ├── AdminCarTable.tsx       # Searchable table of all cars with edit/delete
│   │   └── AdminCarForm.tsx        # Add/edit car form with Supabase Storage photo upload
│   └── ui/
│       ├── button.tsx              # Button component (variants: primary, outline, accent, ghost, danger)
│       ├── input.tsx               # Input component
│       ├── textarea.tsx            # Textarea component
│       ├── select.tsx              # Select/dropdown component
│       └── badge.tsx               # Badge component (variants: default, sold, reserved, import)
│
├── lib/
│   ├── types.ts                    # TypeScript types: Car, Enquiry, CarStatus, EnquiryType
│   ├── utils.ts                    # cn(), formatPrice(), formatMileage(), generateSlug()
│   └── supabase/
│       ├── client.ts               # Browser Supabase client (uses anon key)
│       └── server.ts               # Server Supabase client + createServiceClient() (uses service role key)
│
├── middleware.ts                   # Auth guard: redirects unauthenticated users from /admin/*
├── supabase/schema.sql             # Full DB schema + RLS policies + storage policies
└── .env.local                      # Local env vars (NOT committed to git)
```

---

## Database Schema

### `cars` table
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | Auto-generated |
| slug | text UNIQUE | URL-friendly ID e.g. `2020-toyota-supra-s001` |
| status | text | `for_sale` / `sold` / `reserved` |
| make | text | e.g. `Toyota` |
| model | text | e.g. `Supra` |
| variant | text | e.g. `GR Sport` |
| year | int | |
| price | numeric | Drive-away price in AUD |
| mileage | int | Kilometres |
| body_type | text | Sedan / SUV / Coupe / Van / Utility etc |
| transmission | text | Automatic / Manual / CVT etc |
| fuel_type | text | Petrol / Diesel / Hybrid / Electric |
| colour | text | |
| vin | text | |
| stock_number | text | |
| description | text | Free-text description |
| is_import | boolean | Legacy field — no longer used to filter public pages. All cars appear on `/cars` regardless. |
| year_from | text | Import eligibility start e.g. `09/2001` (scraped data only) |
| year_to | text | Import eligibility end e.g. `08/2005` or `CURRENT` (scraped data only) |
| images | text[] | Array of image URLs (Supabase Storage for admin-added cars; garageapex.com.au for scraped imports) |
| created_at | timestamptz | |
| updated_at | timestamptz | Auto-updated via trigger |

### `enquiries` table
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| type | text | `general` / `car_quote` / `import_quote` |
| car_id | uuid FK | References `cars.id`, nullable |
| department | text | Selected department from contact form |
| first_name / last_name | text | |
| email / phone | text | |
| message | text | |
| budget | text | For import quotes |
| location | text | State, for import quotes |
| contact_pref | text[] | e.g. `['Email', 'WhatsApp']` |
| preferred_time | text | Morning / Afternoon / Evening |
| created_at | timestamptz | |

---

## Environment Variables

All must be set in `.env.local` (local) and Vercel dashboard (production):

```
NEXT_PUBLIC_SUPABASE_URL        # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY   # Supabase anon/public key
SUPABASE_SERVICE_ROLE_KEY       # Supabase service role key (server-only, never expose to client)
RESEND_API_KEY                  # Resend API key for sending emails
OWNER_EMAIL                     # Email address that receives all form submissions
                                # ⚠️ Sandbox restriction: without a verified domain, Resend can only
                                # deliver to the email used to sign up for Resend. OWNER_EMAIL must
                                # match that address. Current account: zainhuzaifabusiness@gmail.com
```

---

## Key Flows

### Visitor enquires about a car
1. Visits `/cars/[slug]` → fills in `EnquireForm`
2. Form POSTs to `/api/enquire` with `type: 'car_quote'` and `car_id`
3. API route inserts row into `enquiries` table (via service role key)
4. Sends email to `OWNER_EMAIL` via Resend with all details + `replyTo` set to visitor's email
5. Sends confirmation email to visitor
   ⚠️ In sandbox mode both emails only deliver if the recipient matches the Resend account email.
   Errors are now logged to Vercel function logs. Fix: verify a domain in Resend and update `from`.

### Visitor browses cars
1. Visits `/cars` (or clicks "Browse All Cars" from the Import A Car dropdown) → sees ALL cars (no is_import filter)
2. Uses search/filter to find a vehicle, clicks "Enquire" → goes to `/cars/[slug]#enquire`
3. The `/import` page shows a 3-car preview (latest 3 cars) with a "View Full Car Catalogue →" link to `/cars`

### Visitor submits contact/import form
- Same flow as above but `type: 'general'` or `type: 'import_quote'`
- Import quote includes budget, location, timeline, contact preferences

### Admin adds a car
1. Admin logs in at `/admin/login` → Supabase Auth sets session cookie
2. Goes to `/admin/cars/new` → fills in `AdminCarForm`
3. Photos uploaded directly to Supabase Storage `car-images` bucket using browser client (authenticated session)
4. On submit, form POSTs to `/api/admin/cars` → server checks auth → inserts into `cars` table via service role
5. Slug is auto-generated from `year-make-model-stocknumber`

### Admin marks car as sold
- Edit the car at `/admin/cars/[id]` → change Status to "Sold" → Save
- Car disappears from `/cars`, appears on `/recently-sold`

---

## Brand / Styling

Design tokens are defined in `app/globals.css` as CSS custom properties under `:root`, then exposed to Tailwind v4 via `@theme inline`. Use the token utilities (`bg-ink-800`, `text-gold-500`, etc.) — do not hardcode hex values. To restyle the site, update the hex values in `globals.css`; all Tailwind utilities update automatically.

**Colour tokens:**
| Token | Value | Role |
|---|---|---|
| `--ink-900` | `#0B1220` | Deepest dark |
| `--ink-800` | `#111B2E` | Navbar, hero backgrounds, primary brand surface |
| `--ink-700` | `#1C2A45` | Secondary dark surface |
| `--gold-500` | `#C9A227` | Accent — see gold discipline below |
| `--gold-600` | `#B38D1F` | Gold hover state |
| `--paper` | `#FAFAF8` | Main page background |
| `--mist` | `#F1F2F0` | Section backgrounds, filter pill backgrounds |
| `--stone-text` | `#6E7480` | Secondary/muted text |
| `--hairline` | `#D8DAD5` | Subtle dividers |
| `--signal-red` | `#B42318` | Sold badge |
| `--signal-green` | `#067647` | Available indicator |

**Typography:** Archivo (Google Fonts) loaded via `next/font/google` in `app/layout.tsx`, assigned to `--font-display` / `font-display` Tailwind class. Geist Mono used for VIN, stock number, and numeric monospaced fields.

**Gold discipline (critical):** Gold is restricted to: `Button variant="accent"` fill, price displayed on dark backgrounds, and one decorative moment per page (e.g. the timeline line on the import page). Gold must NOT be used on link hovers, eyebrow text, check icons, or thumbnail borders — this is what prevents the "cheap gold trim" look.

**To rebrand:** Update hex values in `:root` in `app/globals.css`, and update the wordmark text `YOUR DEALER.` in `Navbar.tsx`.

---

## RLS Policies Summary

| Table / Bucket | Operation | Who |
|---|---|---|
| `cars` | SELECT | Public (anyone) |
| `cars` | INSERT / UPDATE / DELETE | Service role only (via API routes) |
| `enquiries` | INSERT | Public (anyone can submit a form) |
| `enquiries` | SELECT | Service role only |
| `car-images` storage | SELECT | Public (anyone can view images) |
| `car-images` storage | INSERT / UPDATE / DELETE | Authenticated users (logged-in admin) |

---

## Common Tasks for a Future Claude Instance

**Add a new page:** Create `app/your-page/page.tsx`. It automatically gets the public Navbar/Footer. No router config needed. Add a nav link in `components/layout/Navbar.tsx` → `navLinks` array.

**Add import catalogue vehicles:** Run `node scripts/scrape-imports.mjs` then `node scripts/bulk-insert-imports.mjs`. Both scripts are in `car-dealer/scripts/`. The scraper fetches SEVS-eligible vehicles from garageapex.com.au and outputs `scripts/import-catalogue.json`; the bulk-insert script upserts that JSON into Supabase.

**next.config.ts image domains:** Two domains are whitelisted — `*.supabase.co` (admin-uploaded photos) and `garageapex.com.au` (scraped import catalogue images). Add more under `images.remotePatterns` if other image sources are used.

**Add a new field to cars:** 1) Add column to Supabase via SQL, 2) Add to `lib/types.ts` `Car` interface, 3) Add field to `AdminCarForm.tsx` schema + JSX, 4) Display it in `CarCard.tsx` or `/cars/[slug]/page.tsx` as needed.

**Change email template:** Edit the `buildEmailHtml()` function in `app/api/enquire/route.ts`.

**Add a new form:** Create the form component, POST to `/api/enquire` with appropriate `type` field. The API route handles all three enquiry types generically.

**Deploy a change:** `git push` to `main` — Vercel auto-deploys to production. ⚠️ Known issue: after commit `a78be66` the production domain (`huztrader.vercel.app`) stopped reflecting new pushes while preview deployments work correctly. If changes don't appear on the production URL, go to Vercel dashboard → Deployments → promote the latest preview deployment to production, or verify the `main` branch is mapped to the production environment.
