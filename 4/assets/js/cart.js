/* ==========================================================================
   SH JEWELRY — Cart & Wishlist (localStorage-backed)
   ========================================================================== */

const SHJ_CART_KEY = "shj_cart_v1";
const SHJ_WISH_KEY = "shj_wishlist_v1";

function shjRead(key){
  try{
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  }catch(e){ return []; }
}
function shjWrite(key, data){
  try{ localStorage.setItem(key, JSON.stringify(data)); }catch(e){ /* storage unavailable */ }
  document.dispatchEvent(new CustomEvent("shj:update", { detail:{ key } }));
}

/* ---- Cart: [{id, qty}] ---- */
function getCart(){ return shjRead(SHJ_CART_KEY); }

function addToCart(id, qty){
  qty = qty || 1;
  const cart = getCart();
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty += qty;
  else cart.push({ id, qty });
  shjWrite(SHJ_CART_KEY, cart);
}

function updateCartQty(id, qty){
  let cart = getCart();
  if (qty <= 0){
    cart = cart.filter(i => i.id !== id);
  } else {
    const item = cart.find(i => i.id === id);
    if (item) item.qty = qty;
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
function getWishlist(){ return shjRead(SHJ_WISH_KEY); }

function isWishlisted(id){ return getWishlist().includes(id); }

function toggleWishlist(id){
  let wish = getWishlist();
  if (wish.includes(id)) wish = wish.filter(w => w !== id);
  else wish.push(id);
  shjWrite(SHJ_WISH_KEY, wish);
  return wish.includes(id);
}
