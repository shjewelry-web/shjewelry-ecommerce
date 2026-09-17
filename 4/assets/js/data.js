/* ==========================================================================
   SH JEWELRY — Product Data
   --------------------------------------------------------------------------
   Live product data comes from Sanity (see assets/js/sanity.js). This file
   wires Sanity into the shape the rest of the site (components.js, shop.js,
   product.js, cart*.js) expects, so none of that rendering code needs to
   change when the catalogue grows.

   FALLBACK_PRODUCTS below is the local safety-net catalogue: if
   SANITY_CONFIG.projectId in sanity.js is still the placeholder, or the
   fetch fails for any reason, the site falls back to this instead of
   showing an empty page. Once Sanity is wired up and has products in it,
   this is never used for rendering — but keep it in sync anyway, since it's
   what ships if Sanity is ever unreachable.

   FIELD NOTES (matches sanity-schema/product.js exactly):
   - id            → doubles as the URL slug (e.g. product.html?id=ruby-bloom-bangles).
                      No separate "slug" field — one string, one job.
   - price/salePrice → salePrice is optional. When set and lower than price,
                      the site shows salePrice as the real price with price
                      struck through as "was". When absent, price is just
                      the price. This IS the "sale price" field from the brief.
   - images[0]     → is the thumbnail everywhere (card, search result, cart
                      line). No separate "thumbnail" field — same reasoning
                      as slug: don't store the same image path twice.
   - material/color/size → their own fields (filterable/searchable later),
                      shown on the product page above the free-form `details`
                      rows. `details` stays for whatever doesn't fit a fixed
                      field (Closure, Care, Chain, Set includes, ...).
   - stock/availability → stock is the count; availability is the customer-
                      facing label ("In Stock" / "Out of Stock" / "Preorder").
                      Kept separate on purpose — a preorder item can have
                      stock 0 and still be orderable.
   - featured      → boolean. Only featured:true products render in the
                      homepage Featured Jewelry section (see home.js).
   - status        → "active" / "inactive". Sanity's query only fetches
                      active products (see sanity.js) — inactive ones don't
                      reach the site at all, same as deleting them would,
                      without losing the record in Sanity.

   PRODUCTS_READY is a promise every page's script awaits once before it
   reads PRODUCTS/CATEGORIES — see home.js, shop.js, product.js, cart-page.js,
   checkout.js, and the inline scripts in collections.html / wishlist.html.
   ========================================================================== */

const FALLBACK_PRODUCTS = [
  {
    id: "ruby-bloom-bangles",
    name: "Ruby Bloom Bangle Duo",
    category: "Bracelets",
    price: 68000, // PLACEHOLDER — update with real PKR price
    salePrice: null,
    sku: "SHJ-BRC-001",
    material: "Gold-plated brass, cubic zirconia",
    color: "Gold / Ruby Red",
    size: "Adjustable",
    stock: 12,
    availability: "In Stock",
    featured: true,
    status: "active",
    short: "A pair of gold bangles finished with a hand-set ruby and stone blossom.",
    description:
      "A pair of gold-tone bangles, each finished with a stone-set blossom motif in ruby-red and clear accents. Designed to be worn together or styled individually with everyday or occasion wear.",
    details: [
      { label: "Style", value: "Set of 2" },
      { label: "Care", value: "Store flat, avoid contact with perfume" }
    ],
    images: [
      { w1400: "assets/images/product-ruby-bangles-1800.jpg", w900: "assets/images/product-ruby-bangles-1100.jpg", w520: "assets/images/product-ruby-bangles-640.jpg" }
    ]
  },
  {
    id: "zircon-jhumka-drops",
    name: "Zircon Jhumka Drop Earrings",
    category: "Jhumka",
    price: 52000, // PLACEHOLDER
    salePrice: 42000, // PLACEHOLDER
    sku: "SHJ-JHM-001",
    material: "Gold-plated brass, cubic zirconia",
    color: "Gold / Clear",
    size: "One Size",
    stock: 8,
    availability: "In Stock",
    featured: true,
    status: "active",
    short: "Domed jhumka drops in gold with pavé stone detailing.",
    description:
      "Traditional jhumka-style drop earrings in a gold finish, with a domed silhouette detailed in pavé stones and finished with a delicate bead fringe. A statement piece for festive and formal wear.",
    details: [
      { label: "Closure", value: "Push-back post" },
      { label: "Care", value: "Keep dry, store in provided pouch" }
    ],
    images: [
      { w1400: "assets/images/product-jhumka-1400.jpg", w900: "assets/images/product-jhumka-900.jpg", w520: "assets/images/product-jhumka-520.jpg" }
    ]
  },
  {
    id: "emerald-heart-hoops",
    name: "Emerald Heart Hoop Earrings",
    category: "Earrings",
    price: 38500, // PLACEHOLDER
    salePrice: null,
    sku: "SHJ-EAR-001",
    material: "Gold-plated brass, cubic zirconia",
    color: "Gold / Green",
    size: "One Size",
    stock: 15,
    availability: "In Stock",
    featured: true,
    status: "active",
    short: "Gold hoops trimmed in green stone with a pavé heart charm.",
    description:
      "Gold-tone hoop earrings trimmed with faceted green stones and finished with a detachable-look heart charm in pavé crystal. A softer, colour-forward piece that still reads formal.",
    details: [
      { label: "Closure", value: "Hinged hoop with latch" },
      { label: "Care", value: "Avoid moisture, store separately" }
    ],
    images: [
      { w1400: "assets/images/product-hoops-1400.jpg", w900: "assets/images/product-hoops-900.jpg", w520: "assets/images/product-hoops-520.jpg" }
    ]
  },
  {
    id: "solitaire-halo-set",
    name: "Solitaire Halo Necklace Set",
    category: "Necklace",
    price: 145000, // PLACEHOLDER
    salePrice: null,
    sku: "SHJ-NCK-001",
    material: "Gold-tone base, cubic zirconia",
    color: "Gold-tone / Clear",
    size: "One Size",
    stock: 3,
    availability: "In Stock",
    featured: true,
    status: "active",
    short: "Baguette-and-round stone necklace with matching drop earrings.",
    description:
      "A statement necklace and earring set featuring a baguette-cut border with round halo clusters, on a tiered chain. Comes with matching drop earrings for a complete bridal or formal look.",
    details: [
      { label: "Set includes", value: "1 necklace, 1 pair of earrings" },
      { label: "Care", value: "Store in box, handle clasp gently" }
    ],
    images: [
      { w1400: "assets/images/product-diamond-set-1800.jpg", w900: "assets/images/product-diamond-set-1100.jpg", w520: "assets/images/product-diamond-set-640.jpg" }
    ]
  },
  {
    id: "ember-crystal-chandeliers",
    name: "Ember Crystal Chandelier Earrings",
    category: "Earrings",
    price: 31000, // PLACEHOLDER
    salePrice: null,
    sku: "SHJ-EAR-002",
    material: "Silver-tone alloy, glass crystal",
    color: "Silver-tone / Red",
    size: "One Size",
    stock: 20,
    availability: "In Stock",
    featured: true,
    status: "active",
    short: "Cascading baguette-cut crystal earrings in deep red.",
    description:
      "Long chandelier earrings built from cascading baguette-cut crystals in a deep ember red, set in a slim silver-tone lattice. Designed to catch the light with movement.",
    details: [
      { label: "Length", value: "Approx. 9.5cm drop" },
      { label: "Care", value: "Remove before sleeping or bathing" }
    ],
    images: [
      { w1400: "assets/images/product-rubycrystal-1400.jpg", w900: "assets/images/product-rubycrystal-900.jpg", w520: "assets/images/product-rubycrystal-520.jpg" },
      { w1400: "assets/images/product-ember-card-1800.jpg", w900: "assets/images/product-ember-card-1100.jpg", w520: "assets/images/product-ember-card-640.jpg", wide: true }
    ]
  },
  {
    id: "blossom-tassel-earrings",
    name: "Blossom Tassel Drop Earrings",
    category: "Earrings",
    price: 27500, // PLACEHOLDER
    salePrice: null,
    sku: "SHJ-EAR-003",
    material: "Silver-tone alloy, cat's eye stone, crystal",
    color: "Silver-tone / Pink",
    size: "One Size",
    stock: 6,
    availability: "In Stock",
    featured: false,
    status: "active",
    short: "Pink stone flower studs with a cascading crystal tassel fringe.",
    description:
      "A five-petal flower stud in soft pink stone, finished with a long cascading fringe of fine crystal chain. Lightweight despite the length, for a piece that moves with you.",
    details: [
      { label: "Closure", value: "Push-back post" },
      { label: "Care", value: "Handle fringe gently, store flat" }
    ],
    images: [
      { w1400: "assets/images/product-pink-blossom-1400.jpg", w900: "assets/images/product-pink-blossom-900.jpg", w520: "assets/images/product-pink-blossom-520.jpg" }
    ]
  },
  {
    id: "noir-heart-pendant-necklace",
    name: "Noir Heart Pendant Necklace",
    category: "Necklace",
    price: 34000, // PLACEHOLDER
    salePrice: null,
    sku: "SHJ-NCK-002",
    material: "Gold-plated brass, cubic zirconia",
    color: "Gold-tone / Black & Clear",
    size: "One Size",
    stock: 10,
    availability: "In Stock",
    featured: false,
    status: "active",
    short: "Fine gold-tone box chain with a pavé heart pendant.",
    description:
      "A fine box-chain necklace finished with a heart-shaped pendant, pavé-set in a mix of dark and clear stones with a beaded gold-tone border. Sits close to the collarbone.",
    details: [
      { label: "Chain", value: "Box chain, lobster clasp" },
      { label: "Care", value: "Store flat, avoid contact with perfume" }
    ],
    images: [
      { w1400: "assets/images/product-heart-necklace-1400.jpg", w900: "assets/images/product-heart-necklace-900.jpg", w520: "assets/images/product-heart-necklace-520.jpg" }
    ]
  },
  {
    id: "silver-filigree-pearl-jhumka",
    name: "Silver Filigree Pearl Jhumka",
    category: "Jhumka",
    price: 29500, // PLACEHOLDER
    salePrice: null,
    sku: "SHJ-JHM-002",
    material: "Silver-tone alloy, glass pearl beads",
    color: "Silver-tone / Pearl White",
    size: "One Size",
    stock: 9,
    availability: "In Stock",
    featured: false,
    status: "active",
    short: "Domed silver filigree jhumka with a pearl-bead fringe.",
    description:
      "A domed jhumka in openwork silver-tone filigree, finished with a fringe of pearl beads around the base. A quieter, silver-toned take on the traditional jhumka silhouette.",
    details: [
      { label: "Closure", value: "Hook back" },
      { label: "Care", value: "Handle fringe gently, keep dry" }
    ],
    images: [
      { w1400: "assets/images/product-silver-jhumka-1400.jpg", w900: "assets/images/product-silver-jhumka-900.jpg", w520: "assets/images/product-silver-jhumka-520.jpg" }
    ]
  }
];

let PRODUCTS = FALLBACK_PRODUCTS;
let CATEGORIES = [...new Set(FALLBACK_PRODUCTS.map(p => p.category))];

// Every page's init script awaits this once before its first render.
// Kicks off immediately when this file loads.
const PRODUCTS_READY = (async function loadProducts(){
  try {
    const fetched = await fetchProductsFromSanity();
    if (fetched && fetched.length){
      PRODUCTS = fetched;
    }
  } catch (err) {
    console.warn("[Sanity] Falling back to local product data —", err.message);
  }
  CATEGORIES = [...new Set(PRODUCTS.map(p => p.category))];
  return PRODUCTS;
})();

function getProductById(id){
  return PRODUCTS.find(p => p.id === id) || null;
}

function formatPrice(amount){
  if (amount === null || amount === undefined) return "Price on request";
  return "PKR " + Number(amount).toLocaleString("en-PK");
}

// Effective selling price — salePrice when it's set and actually lower,
// otherwise the regular price. Used anywhere a single "the price" number
// is needed (cart math, sort-by-price, etc.) so that logic lives in one place.
function effectivePrice(product){
  if (product.salePrice != null && product.salePrice < product.price) return product.salePrice;
  return product.price;
}

// Shared price markup — sale price highlighted with the regular price
// struck through, or just the regular price when there's no sale. Same
// markup used on product cards and the product detail page.
function cardPriceHtml(product){
  const onSale = product.salePrice != null && product.salePrice < product.price;
  return onSale
    ? `${formatPrice(product.salePrice)}<span class="was">${formatPrice(product.price)}</span>`
    : formatPrice(product.price);
}

function productImage(product, size){
  const key = size === 1400 ? "w1400" : size === 900 ? "w900" : "w520";
  return product.images[0][key];
}
