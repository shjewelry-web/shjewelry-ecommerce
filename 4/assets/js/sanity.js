/* SH Jewelry: Firebase catalogue adapter.
 * Filename and function name preserve compatibility with existing pages.
 * Public reads only. Product writes remain in the authenticated admin panel.
 */
const SANITY_CONFIG = { projectId: 'YOUR_PROJECT_ID' }; // Existing site settings use their defaults.
function decodeFirestoreValue(value) {
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('nullValue' in value) return null;
  if ('timestampValue' in value) return value.timestampValue;
  if ('arrayValue' in value) return (value.arrayValue.values || []).map(decodeFirestoreValue);
  if ('mapValue' in value) return decodeFirestoreFields(value.mapValue.fields || {});
  return null;
}
function decodeFirestoreFields(fields) {
  return Object.fromEntries(Object.entries(fields).map(([key,value]) => [key,decodeFirestoreValue(value)]));
}
function normalizeFirebaseProduct(product) {
  const images = (Array.isArray(product.images) ? product.images : []).map(image => {
    const url = typeof image === 'string' ? image : image?.url || image?.w1400;
    if (!url || !/^https?:\/\//i.test(url)) return null;
    return {w1400:url,w900:url,w520:url,wide:!!image?.wide};
  }).filter(Boolean);
  return {...product, price:Number(product.price) || 0,
    salePrice:product.salePrice == null || product.salePrice === '' ? null : Number(product.salePrice),
    featured:product.featured === true, details:Array.isArray(product.details) ? product.details : [], images};
}
async function fetchProductsFromSanity() {
  const endpoint = 'https://firestore.googleapis.com/v1/projects/sh-jewelry/databases/(default)/documents/products';
  const products = [];
  let pageToken = '';
  do {
    const url = new URL(endpoint);
    url.searchParams.set('pageSize','300');
    if (pageToken) url.searchParams.set('pageToken',pageToken);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(),15000);
    let data;
    try {
      const response = await fetch(url, {cache:'no-store',signal:controller.signal});
      data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Unable to load products');
    } finally { clearTimeout(timer); }
    for (const document of data.documents || []) {
      const product = decodeFirestoreFields(document.fields || {});
      product.id = product.id || document.name.split('/').pop();
      if (product.status !== 'active') continue;
      const normalized = normalizeFirebaseProduct(product);
      if (normalized.id && normalized.name && normalized.images.length) products.push(normalized);
    }
    pageToken = data.nextPageToken || '';
  } while (pageToken);
  return products;
}
