/**
 * Scrape Garage Apex eligible import vehicles
 *
 * Extracts: name, make, model, variant, year (from), body_type, image
 * Only vehicles with SEVS status = "Eligible"
 *
 * Usage:  node scripts/scrape-imports.mjs
 * Output: scripts/import-catalogue.json
 */

import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const LISTING_URL = 'https://garageapex.com.au/list-of-cars-we-can-import-to-australia/'
const DELAY_MS = 400   // polite crawl delay between requests
const OUTPUT_FILE = join(__dirname, 'import-catalogue.json')

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// ─── 1. Fetch raw HTML ────────────────────────────────────────────────────────
async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36',
    },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.text()
}

// ─── 2. Parse the main table ──────────────────────────────────────────────────
// Table columns: Vehicle | SEVS Status | SEVS Expiry | Variant Details | From | To | Conditions
function parseMainTable(html) {
  const vehicles = []

  // Grab all <tr> blocks
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi
  let rowMatch

  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const row = rowMatch[1]

    // Each cell
    const cells = []
    const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi
    let cellMatch
    while ((cellMatch = cellRegex.exec(row)) !== null) {
      // Strip inner HTML tags to get plain text
      const text = cellMatch[1].replace(/<[^>]+>/g, '').trim()
      cells.push({ raw: cellMatch[1], text })
    }

    if (cells.length < 2) continue

    // Status is the second cell; only keep "Eligible"
    const status = cells[1]?.text?.toLowerCase() ?? ''
    if (!status.includes('eligible')) continue

    // Extract href from first cell
    const hrefMatch = cells[0]?.raw?.match(/href="([^"]+)"/)
    const url = hrefMatch ? hrefMatch[1] : null
    if (!url) continue

    const name       = cells[0]?.text ?? ''
    const variant    = cells[3]?.text ?? ''   // Variant Details column
    const yearFrom   = cells[4]?.text ?? ''   // From
    const yearTo     = cells[5]?.text ?? ''   // To
    const conditions = cells[6]?.text ?? ''   // Conditions

    vehicles.push({ name, url, variant, yearFrom, yearTo, conditions })
  }

  return vehicles
}

// ─── 3. Scrape a detail page ──────────────────────────────────────────────────
// Site-wide asset keywords to skip (logo, icons, banners that appear on every page)
const SKIP_IMAGE_PATTERNS = /logo|icon|banner|placeholder|sprite|arrow|button|badge|favicon/i

function scrapeDetailPage(html, url) {
  // Main image: first wp-content/uploads image that is NOT a site asset or thumbnail
  const imgMatches = [...html.matchAll(/src="(https:\/\/garageapex\.com\.au\/wp-content\/uploads\/[^"]+\.(?:jpg|jpeg|png|webp))"/gi)]

  let image = null
  for (const m of imgMatches) {
    const src = m[1]
    // Skip tiny thumbnails (e.g. -150x150)
    if (/\-\d{2,3}x\d{2,3}\./.test(src)) continue
    // Skip site-wide assets (logo, icons etc.)
    if (SKIP_IMAGE_PATTERNS.test(src)) continue
    image = src
    break
  }

  // Body type — look for common patterns in the page text
  const bodyTypeMap = {
    sedan: 'Sedan',
    coupe: 'Coupe',
    wagon: 'Wagon',
    suv: 'SUV',
    hatchback: 'Hatchback',
    van: 'Van',
    minivan: 'Van',
    'mini van': 'Van',
    ute: 'Utility',
    utility: 'Utility',
    convertible: 'Convertible',
    roadster: 'Convertible',
    'kei car': 'Hatchback',
    campervan: 'Van',
  }
  const lowerHtml = html.toLowerCase()
  let bodyType = ''
  for (const [keyword, label] of Object.entries(bodyTypeMap)) {
    if (lowerHtml.includes(keyword)) {
      bodyType = label
      break
    }
  }

  return { image, bodyType }
}

// ─── 3b. Parse fuel type + transmission from variant text ─────────────────────
// This is more reliable than scanning the full HTML (which includes nav/footer keywords)
function parseFuelAndTransmission(variantText) {
  const v = (variantText || '').toLowerCase()

  let fuelType = ''
  if (v.includes('plug-in hybrid') || v.includes('phev')) {
    fuelType = 'Hybrid'
  } else if (v.includes('e-power') || v.includes('e power')) {
    fuelType = 'Hybrid'
  } else if (v.includes('hybrid')) {
    fuelType = 'Hybrid'
  } else if (v.includes('electric') || v.includes('ev ') || v.includes(' ev') || v.includes('miev') || v.includes('e-tron') || v.includes('ariya') || v.includes('leaf')) {
    fuelType = 'Electric'
  } else if (v.includes('diesel')) {
    fuelType = 'Diesel'
  } else if (
    v.includes('petrol') ||
    v.includes('turbo') ||
    v.includes('naturally aspirated') ||
    v.includes('engine') ||
    v.includes('lt ') ||
    v.includes('.0lt') ||
    v.includes('.5lt') ||
    v.includes('.8lt') ||
    v.includes('.6lt')
  ) {
    fuelType = 'Petrol'
  }

  let transmission = ''
  if (v.includes('cvt')) {
    transmission = 'CVT'
  } else if (v.includes('manual') && !v.includes('automatic')) {
    transmission = 'Manual'
  } else if (v.includes('automatic') || v.includes('auto ') || v.includes(' auto')) {
    transmission = 'Automatic'
  }

  return { fuelType, transmission }
}

// ─── 4. Parse a make/model from the vehicle name ──────────────────────────────
// Names are like "Nissan GT-R R35", "Toyota Supra JZA80", "Mercedes-Benz S-Class S450"
function parseMakeModel(name) {
  const knownMakes = [
    'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Bugatti',
    'Chevrolet', 'Citroen', 'Daihatsu', 'DS Automobiles', 'Ferrari',
    'Harley Davidson', 'Hino', 'Honda', 'Lamborghini', 'Lexus',
    'Maybach', 'Mazda', 'McLaren', 'Mercedes-Benz', 'Mini', 'Mitsubishi',
    'Nissan', 'Novitec Rosso', 'Peugeot', 'Porsche', 'Subaru', 'Suzuki',
    'Toyota', 'Vauxhall', 'Volkswagen',
  ]

  let make = ''
  let rest = name

  for (const m of knownMakes) {
    if (name.toLowerCase().startsWith(m.toLowerCase())) {
      make = m
      rest = name.slice(m.length).trim()
      break
    }
  }

  if (!make) {
    // Fallback: first word is make
    const parts = name.split(' ')
    make = parts[0]
    rest = parts.slice(1).join(' ')
  }

  // The "model" is everything after make (the chassis code at end is variant)
  // e.g. rest = "GT-R R35" → model = "GT-R", variant hint = "R35"
  // We keep the full rest as model for simplicity; the variant column from table is better
  const model = rest

  return { make, model }
}

// ─── 5. Parse year from "From" column ────────────────────────────────────────
// Values like "11/2007", "2007", "April 1993", "1/2009"
function parseYear(yearStr) {
  if (!yearStr) return null
  const match = yearStr.match(/(\d{4})/)
  return match ? parseInt(match[1], 10) : null
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('Fetching main listing page...')
  const mainHtml = await fetchHtml(LISTING_URL)

  const eligible = parseMainTable(mainHtml)
  console.log(`Found ${eligible.length} eligible vehicles in the table.\n`)

  const results = []
  let i = 0

  for (const v of eligible) {
    i++
    process.stdout.write(`[${i}/${eligible.length}] ${v.name} ... `)

    let detailData = { image: null, bodyType: '' }

    try {
      await sleep(DELAY_MS)
      const detailHtml = await fetchHtml(v.url)
      detailData = scrapeDetailPage(detailHtml, v.url)
      console.log(detailData.image ? '✓ image' : '⚠ no image')
    } catch (err) {
      console.log(`✗ ERROR: ${err.message}`)
    }

    const { make, model } = parseMakeModel(v.name)
    const year = parseYear(v.yearFrom)
    const { fuelType, transmission } = parseFuelAndTransmission(v.variant)

    results.push({
      // DB-ready fields
      make,
      model,
      variant: v.variant || null,
      year: year || null,
      year_from: v.yearFrom || null,
      year_to: v.yearTo || null,
      body_type: detailData.bodyType || null,
      fuel_type: fuelType || null,
      transmission: transmission || null,
      is_import: true,
      status: 'for_sale',
      images: detailData.image ? [detailData.image] : [],
      description: v.conditions || null,
      // Meta
      source_name: v.name,
      source_url: v.url,
    })
  }

  writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), 'utf-8')

  const withImages = results.filter((r) => r.images.length > 0).length
  console.log(`\n✅ Done! ${results.length} vehicles scraped, ${withImages} with images.`)
  console.log(`📄 Output: ${OUTPUT_FILE}`)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
