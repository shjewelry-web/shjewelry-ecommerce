/* ==========================================================================
   SH JEWELRY — Cart & Wishlist (localStorage-backed)
   ========================================================================== */

const SHJ_CART_KEY = "shj_cart_v1";
const SHJ_WISH_KEY = "shj_wishlist_v1";

function shjRead(key){
  try{
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  }catch(e){ return []; }
}
function shjWrite(key, data){
  try{ localStorage.setItem(key, JSON.stringify(data)); }catch(e){ /* storage unavailable */ }
  document.dispatchEvent(new CustomEvent("shj:update", { detail:{ key } }));
}

/* ---- Cart: [{id, qty}] ---- */
function stockLimit(product){
  if (!product || product.status === 'inactive' || product.availability === 'Out of Stock') return 0;
  if (product.availability === 'Preorder') return 10;
  return product.stock == null ? 10 : Math.min(10,Math.max(0,Math.floor(product.stock)));
}
function getCart(){
  const merged = new Map();
  for (const item of shjRead(SHJ_CART_KEY)) {
    if (!item || typeof item.id !== 'string' || !Number.isFinite(Number(item.qty)) || Number(item.qty) < 1) continue;
    const limit = CATALOGUE_LOADED ? stockLimit(getProductById(item.id)) : 10;
    const qty = Math.min(limit,(merged.get(item.id) || 0)+Math.floor(Number(item.qty)));
    if (qty > 0) merged.set(item.id,qty);
  }
  return Array.from(merged,([id,qty]) => ({id,qty}));
}

function addToCart(id, qty){
  const limit = stockLimit(getProductById(id));
  if (!limit) return false;
  qty = Math.min(limit,Math.max(1,Math.floor(Number(qty)) || 1));
  const cart = getCart();
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty = Math.min(limit,existing.qty + qty);
  else cart.push({ id, qty });
  shjWrite(SHJ_CART_KEY, cart);
  return true;
}

function updateCartQty(id, qty){
  let cart = getCart();
  if (qty <= 0){
    cart = cart.filter(i => i.id !== id);
  } else {
    const item = cart.find(i => i.id === id);
    if (item) item.qty = Math.min(stockLimit(getProductById(id)),Math.max(1,Math.floor(Number(qty)) || 1));
  }
  shjWrite(SHJ_CART_KEY, cart);
}

function removeFromCart(id){
  const cart = getCart().filter(i => i.id !== id);
  shjWrite(SHJ_CART_KEY, cart);
}

function clearCart(){ shjWrite(SHJ_CART_KEY, []); }

function getCartCount(){
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function getCartLines(){
  return getCart()
    .map(i => {
      const product = getProductById(i.id);
      if (!product) return null;
      const unitPrice = effectivePrice(product);
      return { product, qty: i.qty, unitPrice, lineTotal: unitPrice * i.qty };
    })
    .filter(Boolean);
}

function getCartSubtotal(){
  return getCartLines().reduce((sum, l) => sum + l.lineTotal, 0);
}

/* ---- Wishlist: [id, id, ...] ---- */
function getWishlist(){ return [...new Set(shjRead(SHJ_WISH_KEY).filter(id => typeof id === "string"))]; }

function isWishlisted(id){ return getWishlist().includes(id); }

function toggleWishlist(id){
  let wish = getWishlist();
  if (wish.includes(id)) wish = wish.filter(w => w !== id);
  else wish.push(id);
  shjWrite(SHJ_WISH_KEY, wish);
  return wish.includes(id);
}
