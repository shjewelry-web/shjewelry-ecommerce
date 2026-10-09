/* Firebase is the authoritative product catalogue. */
let PRODUCTS = [];
let CATEGORIES = [];
let CATALOGUE_LOADED = false;
const PRODUCTS_READY = (async function loadProducts(){
  try {
    PRODUCTS = await fetchProductsFromSanity();
    CATALOGUE_LOADED = true;
  } catch (err) {
    console.error('[Firebase] Catalogue load failed:', err);
    const showError = () => {
      const banner = document.createElement('div');
      banner.setAttribute('role','alert');
      banner.style.cssText = 'padding:16px;text-align:center;background:#fff3cd;color:#513d00';
      banner.textContent = 'Products could not be loaded. Please refresh the page to try again.';
      document.body.prepend(banner);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',showError,{once:true});
    else showError();
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
  if (!product.images || !product.images[0]) return '';
  const img = product.images[0];
  // Support both Cloudinary (.url) and legacy Sanity (.w520 etc.)
  if (img.url) return img.url;
  const key = size === 1400 ? "w1400" : size === 900 ? "w900" : "w520";
  return img[key] || img.url || '';
}
