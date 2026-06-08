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
│   ├── page.tsx                    # Home page (server component, fetches featured cars)
│   ├── globals.css                 # Global styles, CSS variables (brand colours)
│   ├── cars/
│   │   ├── page.tsx                # /cars — inventory listing
│   │   └── [slug]/page.tsx         # /cars/[slug] — car detail page
│   ├── import/page.tsx             # /import — import service + quote form
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
│   │   └── ImportQuoteForm.tsx     # 3-step multi-step import quote form
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
| is_import | boolean | `true` = appears in import catalogue |
| images | text[] | Array of Supabase Storage public URLs |
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
```

---

## Key Flows

### Visitor enquires about a car
1. Visits `/cars/[slug]` → fills in `EnquireForm`
2. Form POSTs to `/api/enquire` with `type: 'car_quote'` and `car_id`
3. API route inserts row into `enquiries` table (via service role key)
4. Sends email to `OWNER_EMAIL` via Resend with all details + `replyTo` set to visitor's email
5. Sends confirmation email to visitor

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

Brand colours (defined in `globals.css` and used as Tailwind arbitrary values throughout):
- **Navy** `#1a2744` — primary brand colour, nav, buttons, headings
- **Gold** `#e8b84b` — accent colour, CTAs, highlights
- **Dark navy** `#0f1a33` — footer, top bar
- **Light grey** `#f4f5f7` — section backgrounds

To rebrand: find/replace `#1a2744`, `#e8b84b`, `#0f1a33`, `#f4f5f7` across the codebase, and update the logo text `YOUR DEALER` in `Navbar.tsx` and `Footer.tsx`.

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

**Add a new page:** Create `app/your-page/page.tsx`. It automatically gets the public Navbar/Footer. No router config needed.

**Add a new field to cars:** 1) Add column to Supabase via SQL, 2) Add to `lib/types.ts` `Car` interface, 3) Add field to `AdminCarForm.tsx` schema + JSX, 4) Display it in `CarCard.tsx` or `/cars/[slug]/page.tsx` as needed.

**Change email template:** Edit the `buildEmailHtml()` function in `app/api/enquire/route.ts`.

**Add a new form:** Create the form component, POST to `/api/enquire` with appropriate `type` field. The API route handles all three enquiry types generically.

**Deploy a change:** `git push` to `main` — Vercel auto-deploys. No manual steps.
