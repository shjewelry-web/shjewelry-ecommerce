/* ==========================================================================
   SH JEWELRY — Sanity.io data-fetching layer
   --------------------------------------------------------------------------
   Plain fetch() against Sanity's HTTP "query" API (no @sanity/client, no
   npm install, no build step — works from a static file same as everything
   else on this site). data.js calls fetchProductsFromSanity() below and
   normalizes the result into the exact product shape the rest of the site
   already renders, so nothing in components.js / shop.js / product.js /
   cart*.js / the CSS needs to change.

   ⚠️ SET THIS before it does anything:
   ========================================================================== */
const SANITY_CONFIG = {
  projectId: "YOUR_PROJECT_ID",   // sanity.io/manage → your project → Project ID
  dataset: "production",          // must be a PUBLIC dataset — see note below
  apiVersion: "2024-01-01"
};

/* ---------------------------------------------------------------------------
 * Two things you have to do on Sanity's side, or every fetch below fails:
 *
 * 1. CORS — sanity.io/manage → your project → API → CORS Origins → Add
 *    Origin. Add the exact origin this site is served from (e.g.
 *    https://shjewelry.com, or http://localhost:5500 while testing).
 *    "Allow credentials" should stay OFF — this call sends no credentials.
 *
 * 2. Dataset visibility — this fetches with NO auth token, on purpose.
 *    Anything shipped in client-side JS is visible to anyone who views
 *    source, so an API token pasted here would be public regardless of
 *    intent. That's fine for a public, read-only product catalogue: keep
 *    the "production" dataset set to Public in Sanity, and do all writes
 *    from Sanity Studio (which is authenticated separately). If you need a
 *    private dataset later, that read has to go through a small server-side
 *    proxy instead of straight from the browser — a different piece of
 *    work from what's here.
 * ------------------------------------------------------------------------ */

const SANITY_PRODUCT_QUERY = `
*[_type == "product" && status == "active"] | order(_createdAt asc){
  "id": slug.current,
  "name": title,
  category,
  price,
  salePrice,
  sku,
  material,
  color,
  size,
  stock,
  availability,
  featured,
  status,
  "short": shortDescription,
  description,
  details,
  "images": images[]{ "url": image.asset->url, wide }
}`.trim();

function sanityQueryUrl(query){
  const base = `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/data/query/${SANITY_CONFIG.dataset}`;
  return `${base}?query=${encodeURIComponent(query)}`;
}

// Sanity's CDN resizes on the fly from query params on the asset URL, so one
// uploaded image gives us the same {w1400,w900,w520} shape productImage()
// already expects — no separate size uploads needed on the Sanity side.
function sanityImageVariants(url, wide){
  const at = (w) => `${url}?w=${w}&auto=format&fit=max`;
  return { w1400: at(1400), w900: at(900), w520: at(520), wide: !!wide };
}

function normalizeSanityProduct(doc){
  return {
    id: doc.id,
    name: doc.name,
    category: doc.category,
    price: doc.price,
    salePrice: doc.salePrice || null,
    sku: doc.sku || "",
    material: doc.material || "",
    color: doc.color || "",
    size: doc.size || "",
    stock: typeof doc.stock === "number" ? doc.stock : null,
    availability: doc.availability || "In Stock",
    featured: !!doc.featured,
    status: doc.status || "active",
    short: doc.short || "",
    description: doc.description || "",
    details: Array.isArray(doc.details) ? doc.details : [],
    images: (doc.images || [])
      .filter(img => img && img.url)
      .map(img => sanityImageVariants(img.url, img.wide))
  };
}

async function fetchProductsFromSanity(){
  if (SANITY_CONFIG.projectId === "YOUR_PROJECT_ID"){
    console.info("[Sanity] projectId not set in assets/js/sanity.js yet — using local fallback product data.");
    return [];
  }
  const res = await fetch(sanityQueryUrl(SANITY_PRODUCT_QUERY));
  if (!res.ok){
    throw new Error(`Sanity query failed: ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  const docs = Array.isArray(json.result) ? json.result : [];
  return docs
    .filter(d => d && d.id && d.images && d.images.length)
    .map(normalizeSanityProduct);
}
