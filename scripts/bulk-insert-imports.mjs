/**
 * Bulk insert import catalogue into Supabase `cars` table
 *
 * Reads:  scripts/import-catalogue.json
 * Writes: Supabase cars table (service role key — bypasses RLS)
 *
 * Usage:  node scripts/bulk-insert-imports.mjs
 *
 * Safe to re-run: uses upsert on `slug` so duplicates are updated, not doubled.
 */

import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ─── Config ───────────────────────────────────────────────────────────────────
const SUPABASE_URL      = 'https://fwmmqpmtukvnweukddxe.supabase.co'
const SERVICE_ROLE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3bW1xcG10dWt2bndldWtkZHhlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDkwNDYwOSwiZXhwIjoyMDk2NDgwNjA5fQ.bSqPnkIz04d6sCjnAL0UhF5GrU3QBaJkK1_DrG2Dknw'
const BATCH_SIZE        = 20   // rows per upsert call
const INPUT_FILE        = join(__dirname, 'import-catalogue.json')

// ─── Slug generator (matches lib/utils.ts) ────────────────────────────────────
function generateSlug(make, model, year, index) {
  const base = `${year ?? 'unknown'}-${make}-${model}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  // Use index as a stable unique suffix (no Date.now() so re-runs are idempotent)
  return `${base}-imp-${index}`
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

  const raw = JSON.parse(readFileSync(INPUT_FILE, 'utf-8'))
  console.log(`Loaded ${raw.length} vehicles from import-catalogue.json\n`)

  // Map to DB columns
  const rows = raw.map((v, i) => ({
    slug:         generateSlug(v.make, v.model, v.year, i),
    make:         v.make,
    model:        v.model,
    variant:      v.variant ?? null,
    year:         v.year ?? null,
    status:       'for_sale',
    price:        null,           // no price data from the catalogue
    mileage:      null,
    body_type:    v.body_type ?? null,
    transmission: v.transmission ?? null,
    fuel_type:    v.fuel_type ?? null,
    colour:       null,
    vin:          null,
    stock_number: null,
    description:  v.description ?? null,
    is_import:    true,
    images:       v.images ?? [],
  }))

  // Split into batches
  const batches = []
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    batches.push(rows.slice(i, i + BATCH_SIZE))
  }

  let inserted = 0
  let errors   = 0

  for (let b = 0; b < batches.length; b++) {
    const batch = batches[b]
    const from  = b * BATCH_SIZE + 1
    const to    = from + batch.length - 1
    process.stdout.write(`Batch ${b + 1}/${batches.length} (rows ${from}–${to}) ... `)

    const { error } = await supabase
      .from('cars')
      .upsert(batch, { onConflict: 'slug' })

    if (error) {
      console.log(`✗ ERROR: ${error.message}`)
      errors += batch.length
    } else {
      console.log(`✓`)
      inserted += batch.length
    }
  }

  console.log(`\n✅ Done! ${inserted} rows upserted, ${errors} errors.`)

  if (errors === 0) {
    console.log('\nAll import vehicles are now live in your database.')
    console.log('They will appear on the /import page with is_import = true.')
  }
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
