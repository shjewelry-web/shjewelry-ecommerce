function escapeHtml(value){ return String(value ?? '').replace(/[&<>"']/g,c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
/* ==========================================================================
   SH JEWELRY — Shared components: header, footer, nav behaviour, motion
   ========================================================================== */

const ICONS = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7.5-4.7-10-9.3C.4 8 2 4.5 5.6 4c2-.3 3.8.6 5 2.3C11.8 4.6 13.6 3.7 15.6 4 19.2 4.5 20.8 8 20 11.7 18.5 16.3 12 21 12 21z"/></svg>',
  heartFill: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7.5-4.7-10-9.3C.4 8 2 4.5 5.6 4c2-.3 3.8.6 5 2.3C11.8 4.6 13.6 3.7 15.6 4 19.2 4.5 20.8 8 20 11.7 18.5 16.3 12 21 12 21z"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c1.6-3.6 5-5.4 7.5-5.4s5.9 1.8 7.5 5.4"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 5l14 14M19 5L5 19"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 3l8 3.2v5.2c0 4.8-3.2 8.7-8 9.6-4.8-.9-8-4.8-8-9.6V6.2L12 3z"/><path d="M9 12l2 2 4-4.5"/></svg>',
  gem: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 9l3-5h10l3 5-8 12-8-12z"/><path d="M4 9h16M9.5 4l2.5 5-2.5 11M14.5 4L12 9l2.5 11"/></svg>',
  headset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 13a8 8 0 0116 0"/><rect x="3" y="13" width="4" height="6" rx="1.2"/><rect x="17" y="13" width="4" height="6" rx="1.2"/><path d="M20 19a4 4 0 01-4 3h-2"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 4h4l2 5-2.5 1.5a12 12 0 006 6L16 14l5 2v4a2 2 0 01-2 2C10.5 22 2 13.5 2 5a2 2 0 012-1z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 21s7-7.2 7-12a7 7 0 10-14 0c0 4.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 12.5l5 5L19 7"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/></svg>'
};

const NAV_LINKS = [
  { href: "index.html", label: "Home", key: "home" },
  { href: "shop.html", label: "Shop", key: "shop" },
  { href: "collections.html", label: "Collections", key: "collections" },
  { href: "about.html", label: "About", key: "about" },
  { href: "contact.html", label: "Contact", key: "contact" }
];

function renderHeader(active){
  const header = document.getElementById("site-header");
  if (!header) return;

  const links = NAV_LINKS.map(l =>
    `<a href="${l.href}" class="${l.key === active ? "active" : ""}">${l.label}</a>`
  ).join("");

  // NOTE: the search overlay and mobile menu are deliberately rendered as
  // direct children of <body> (below), NOT nested inside #site-header.
  // #site-header.scrolled applies backdrop-filter, and per the CSS spec
  // backdrop-filter/filter/transform create a new containing block for any
  // position:fixed descendant — nesting the overlay/menu inside the header
  // would silently break their full-viewport fixed positioning the moment
  // the user scrolls. Keeping them as siblings of the header avoids that.
  header.innerHTML = `
    <div class="nav-wrap">
      <a href="index.html" class="brand" id="brandMarkHeader">SH <span>Jewelry</span></a>
      <nav class="nav-links">${links}</nav>
      <div class="nav-actions">
        <button class="btn-icon" id="searchToggle" aria-label="Search">${ICONS.search}</button>
        <a href="wishlist.html" class="btn-icon nav-hide-mobile" aria-label="Wishlist">
          ${ICONS.heart}<span class="count-badge" id="wishBadge">0</span>
        </a>
        <a href="account.html" class="btn-icon nav-hide-mobile" aria-label="Account">${ICONS.user}</a>
        <a href="cart.html" class="btn-icon" aria-label="Cart">
          ${ICONS.bag}<span class="count-badge" id="cartBadge">0</span>
        </a>
        <button class="btn-icon nav-burger" id="burgerToggle" aria-label="Menu">${ICONS.menu}</button>
      </div>
    </div>
  `;

  let searchOverlay = document.getElementById("searchOverlay");
  if (!searchOverlay){
    searchOverlay = document.createElement("div");
    searchOverlay.id = "searchOverlay";
    searchOverlay.className = "search-overlay";
    document.body.appendChild(searchOverlay);
  }
  searchOverlay.innerHTML = `
    <div class="search-overlay-inner container">
      <form id="searchForm">
        <input type="text" id="searchInput" placeholder="Search rings, earrings, bangles…" autocomplete="off">
        <button type="button" id="searchClose" aria-label="Close search">${ICONS.close}</button>
      </form>
    </div>
  `;

  let mobileMenu = document.getElementById("mobileMenu");
  if (!mobileMenu){
    mobileMenu = document.createElement("div");
    mobileMenu.id = "mobileMenu";
    mobileMenu.className = "mobile-menu";
    document.body.appendChild(mobileMenu);
  }
  mobileMenu.innerHTML = `
    <div class="mobile-menu-top">
      <a href="index.html" class="brand" id="brandMarkMobile">SH <span>Jewelry</span></a>
      <button class="btn-icon" id="mobileClose" aria-label="Close menu">${ICONS.close}</button>
    </div>
    <nav>${NAV_LINKS.map(l => `<a href="${l.href}" class="${l.key === active ? "active" : ""}">${l.label}</a>`).join("")}<a href="account.html" class="mm-account">Account</a></nav>
    <div class="mm-actions">
      <a href="wishlist.html" class="btn btn-secondary btn-block">Wishlist</a>
      <a href="cart.html" class="btn btn-primary btn-block">Cart</a>
    </div>
  `;

  initHeaderScroll();
  initMobileMenu();
  initSearchOverlay();
  applySettings();

  // WhatsApp floating button
  if (!document.getElementById('wa-float')) {
    const wa = document.createElement('a');
    wa.id = 'wa-float';
    wa.href = 'https://wa.me/923149244045';
    wa.target = '_blank';
    wa.rel = 'noopener noreferrer';
    wa.setAttribute('aria-label', 'Chat on WhatsApp');
    wa.innerHTML = `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path d="M16 1C7.716 1 1 7.716 1 16c0 2.628.672 5.1 1.852 7.254L1 31l8.02-1.82A14.94 14.94 0 0016 31c8.284 0 15-6.716 15-15S24.284 1 16 1z" fill="#fff"/><path d="M16 3c7.18 0 13 5.82 13 13s-5.82 13-13 13a12.95 12.95 0 01-6.472-1.726l-.464-.278-4.758 1.08 1.11-4.632-.302-.48A12.953 12.953 0 013 16C3 8.82 8.82 3 16 3z" fill="#25D366"/><path d="M11.93 9.5c-.28-.62-.576-.632-.842-.642-.218-.01-.468-.009-.718-.009-.25 0-.656.094-.999.469s-1.312 1.281-1.312 3.125 1.343 3.625 1.531 3.875 2.594 4.156 6.407 5.657c3.167 1.25 3.813 1 4.5.937.688-.062 2.22-.906 2.533-1.781.313-.875.313-1.625.219-1.782-.094-.156-.344-.25-.719-.437-.375-.188-2.218-1.094-2.562-1.219-.344-.125-.594-.188-.844.188-.25.375-.968 1.218-1.187 1.468-.219.25-.438.282-.813.094-.375-.187-1.582-.583-3.014-1.857-1.114-.993-1.866-2.219-2.085-2.594-.219-.375-.023-.578.164-.765.169-.169.375-.438.562-.656.188-.219.25-.375.375-.625.125-.25.063-.469-.031-.656-.094-.188-.818-2.063-1.145-2.79z" fill="#fff"/></svg>`;
    document.body.appendChild(wa);
  }
}

function renderFooter(){
  const footer = document.getElementById("site-footer");
  if (!footer) return;
  const year = new Date().getFullYear();
  footer.innerHTML = `
    <div class="container footer-top">
      <div class="footer-brand">
        <a href="index.html" class="brand" id="brandMarkFooter">SH <span>Jewelry</span></a>
        <p id="footerDesc">Jewelry designed to make every moment unforgettable — crafted pieces for everyday wear and formal occasion.</p>
      </div>
      <div class="footer-col">
        <h4>Shop</h4>
        <ul>
          <li><a href="shop.html">All Jewelry</a></li>
          <li><a href="shop.html?category=Earrings">Earrings</a></li>
          <li><a href="shop.html?category=Bracelets">Bracelets</a></li>
          <li><a href="shop.html?category=Necklace">Necklace</a></li>
          <li><a href="shop.html?category=Jhumka">Jhumka</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Information</h4>
        <ul>
          <li><a href="about.html">About Us</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="shipping.html">Shipping</a></li>
          <li><a href="returns.html">Returns</a></li>
          <li><a href="privacy.html">Privacy Policy</a></li>
          <li><a href="terms.html">Terms &amp; Conditions</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Customer Support</h4>
        <ul>
          <li><a href="contact.html" id="footerWhatsapp">WhatsApp</a></li>
          <li><a href="contact.html" id="footerEmail">Email</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>&copy; ${year} <span id="footerCopyBrand">SH Jewelry</span>. All rights reserved.</span>
      <span>Designed as a digital showroom.</span>
    </div>
  `;
  applySettings();

  // WhatsApp floating button
  if (!document.getElementById('wa-float')) {
    const wa = document.createElement('a');
    wa.id = 'wa-float';
    wa.href = 'https://wa.me/923149244045';
    wa.target = '_blank';
    wa.rel = 'noopener noreferrer';
    wa.setAttribute('aria-label', 'Chat on WhatsApp');
    wa.innerHTML = `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path d="M16 1C7.716 1 1 7.716 1 16c0 2.628.672 5.1 1.852 7.254L1 31l8.02-1.82A14.94 14.94 0 0016 31c8.284 0 15-6.716 15-15S24.284 1 16 1z" fill="#fff"/><path d="M16 3c7.18 0 13 5.82 13 13s-5.82 13-13 13a12.95 12.95 0 01-6.472-1.726l-.464-.278-4.758 1.08 1.11-4.632-.302-.48A12.953 12.953 0 013 16C3 8.82 8.82 3 16 3z" fill="#25D366"/><path d="M11.93 9.5c-.28-.62-.576-.632-.842-.642-.218-.01-.468-.009-.718-.009-.25 0-.656.094-.999.469s-1.312 1.281-1.312 3.125 1.343 3.625 1.531 3.875 2.594 4.156 6.407 5.657c3.167 1.25 3.813 1 4.5.937.688-.062 2.22-.906 2.533-1.781.313-.875.313-1.625.219-1.782-.094-.156-.344-.25-.719-.437-.375-.188-2.218-1.094-2.562-1.219-.344-.125-.594-.188-.844.188-.25.375-.968 1.218-1.187 1.468-.219.25-.438.282-.813.094-.375-.187-1.582-.583-3.014-1.857-1.114-.993-1.866-2.219-2.085-2.594-.219-.375-.023-.578.164-.765.169-.169.375-.438.562-.656.188-.219.25-.375.375-.625.125-.25.063-.469-.031-.656-.094-.188-.818-2.063-1.145-2.79z" fill="#fff"/></svg>`;
    document.body.appendChild(wa);
  }
}

/* ---- header scroll transition ---- */
function initHeaderScroll(){
  const header = document.getElementById("site-header");
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive:true });
}

/* ---- mobile menu ---- */
function initMobileMenu(){
  const burger = document.getElementById("burgerToggle");
  const menu = document.getElementById("mobileMenu");
  const close = document.getElementById("mobileClose");
  if (!burger || !menu) return;
  document.addEventListener("keydown", e => { if (e.key === "Escape") shut(); });
  const open = () => { menu.classList.add("open"); document.body.style.overflow = "hidden"; };
  const shut = () => { menu.classList.remove("open"); document.body.style.overflow = ""; };
  burger.addEventListener("click", open);
  close.addEventListener("click", shut);
  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", shut));
}

/* ---- search overlay ---- */
function initSearchOverlay(){
  const toggle = document.getElementById("searchToggle");
  const overlay = document.getElementById("searchOverlay");
  const closeBtn = document.getElementById("searchClose");
  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchInput");
  if (!toggle || !overlay) return;

  const open = () => { overlay.classList.add("open"); setTimeout(() => input.focus(), 350); };
  const shut = () => { overlay.classList.remove("open"); };

  toggle.addEventListener("click", open);
  closeBtn.addEventListener("click", shut);
  document.addEventListener("keydown", e => { if (e.key === "Escape") shut(); });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const q = input.value.trim();
    window.location.href = "shop.html" + (q ? "?q=" + encodeURIComponent(q) : "");
  });
}

/* ---- badge counts ---- */
function refreshBadges(){
  const cartBadge = document.getElementById("cartBadge");
  const wishBadge = document.getElementById("wishBadge");
  if (cartBadge){
    const c = getCartCount();
    cartBadge.textContent = c;
    cartBadge.classList.toggle("show", c > 0);
  }
  if (wishBadge){
    const w = getWishlist().length;
    wishBadge.textContent = w;
    wishBadge.classList.toggle("show", w > 0);
  }
}
document.addEventListener("shj:update", refreshBadges);

/* ---- reveal on scroll ---- */
function initReveal(){
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  if (!("IntersectionObserver" in window)){
    items.forEach(el => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold:.16, rootMargin:"0px 0px -6% 0px" });
  items.forEach(el => io.observe(el));
}

/* ---- subtle product-card tilt (desktop, fine pointer only) ---- */
function initCardTilt(selector){
  if (!window.matchMedia("(pointer: fine)").matches) return;
  document.querySelectorAll(selector).forEach(card => {
    const media = card.querySelector(".pc-media img, .pd-stage img");
    let raf = null;
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - .5;
      const y = (e.clientY - rect.top) / rect.height - .5;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `perspective(900px) rotateX(${(-y*4.5).toFixed(2)}deg) rotateY(${(x*5.5).toFixed(2)}deg) translateY(-4px)`;
        if (media) media.style.transform = `scale(1.055) translate(${(x*6).toFixed(1)}px, ${(y*6).toFixed(1)}px)`;
      });
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      if (media) media.style.transform = "";
    });
  });
}

/* ---- hero image parallax (subtle, mouse-driven) ---- */
function initHeroParallax(){
  const visual = document.querySelector(".hero-visual");
  const img = visual ? visual.querySelector("img") : null;
  if (!visual || !img || !window.matchMedia("(pointer: fine)").matches) return;
  let raf = null;
  document.addEventListener("mousemove", (e) => {
    const rect = visual.getBoundingClientRect();
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      img.style.transform = `scale(1.06) translate(${(-dx*14).toFixed(1)}px, ${(-dy*14).toFixed(1)}px)`;
    });
  });
}

/* ---- product card markup (shared by home / shop / product / wishlist pages) ---- */
function renderProductCard(product){
  const wished = isWishlisted(product.id);
  const wideClass = product.wide ? " wide" : "";
  return `
    <article class="product-card${wideClass} reveal">
      <div class="pc-media">
        <span class="pc-cat">${escapeHtml(product.category)}</span>
        <button class="pc-wish ${wished ? "active" : ""}" data-wish="${escapeHtml(product.id)}" aria-label="Toggle wishlist">
          ${wished ? ICONS.heartFill : ICONS.heart}
        </button>
        <a href="product.html?id=${encodeURIComponent(product.id)}">
          <img src="${escapeHtml(productImage(product, 900))}" srcset="${escapeHtml(productImage(product, 520))} 520w, ${escapeHtml(productImage(product, 900))} 900w, ${escapeHtml(productImage(product, 1400))} 1400w" sizes="(max-width: 640px) 50vw, 30vw" alt="${escapeHtml(product.name)}" loading="lazy">
        </a>
      </div>
      <div class="pc-body">
        <a href="product.html?id=${encodeURIComponent(product.id)}">
          <h3 class="pc-name">${escapeHtml(product.name)}</h3>
        </a>
        <div class="pc-price">${cardPriceHtml(product)}</div>
        <a href="product.html?id=${encodeURIComponent(product.id)}" class="pc-link">View Product ${ICONS.arrow}</a>
      </div>
    </article>
  `;
}

function renderProductGrid(container, products){
  if (!container) return;
  container.innerHTML = products.length ? products.map(renderProductCard).join("") : '<p class="text-secondary">No products available yet.</p>';
  wireWishButtons(container);
  initCardTilt(".product-card");
  initReveal();
}

function wireWishButtons(scope){
  (scope || document).querySelectorAll("[data-wish]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = btn.getAttribute("data-wish");
      const active = toggleWishlist(id);
      btn.classList.toggle("active", active);
      btn.innerHTML = active ? ICONS.heartFill : ICONS.heart;
    });
  });
}

/* ---- Settings-driven brand mark / footer / contact links ----
   Keeps the existing two-tone "SH  Jewelry" look (first word plain,
   rest gold) for whatever brand name Settings provides, splitting on
   the first space. A one-word brand name just renders plain — no error,
   simply no second colour to apply. */
function brandMarkHtml(name){
  const parts = (name || "SH Jewelry").split(" ");
  if (parts.length < 2) return escapeHtml(name || "SH Jewelry");
  return `${escapeHtml(parts[0])} <span>${escapeHtml(parts.slice(1).join(" "))}</span>`;
}

function applySettings(){
  const s = (typeof SETTINGS !== "undefined") ? SETTINGS : null;
  if (!s) return;

  ["brandMarkHeader", "brandMarkMobile", "brandMarkFooter"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = brandMarkHtml(s.brandName);
  });

  const footerDesc = document.getElementById("footerDesc");
  if (footerDesc && s.footerDescription) footerDesc.textContent = s.footerDescription;

  const footerCopyBrand = document.getElementById("footerCopyBrand");
  if (footerCopyBrand) footerCopyBrand.textContent = s.brandName;

  const footerWhatsapp = document.getElementById("footerWhatsapp");
  if (footerWhatsapp && s.whatsapp){
    const digits = whatsappDigits(s.whatsapp);
    if (digits) { footerWhatsapp.href = `https://wa.me/${digits}`; footerWhatsapp.target = "_blank"; footerWhatsapp.rel = "noopener"; }
  }
  const footerEmail = document.getElementById("footerEmail");
  if (footerEmail && s.email) footerEmail.href = `mailto:${s.email}`;

  document.title = document.title.replace(/SH Jewelry/g, s.brandName);
}

// Runs on every page once — components.js (this file) loads everywhere,
// so this single line is what makes "change it in Settings, it updates
// everywhere" true without touching each page's own script.
if (typeof SETTINGS_READY !== "undefined") SETTINGS_READY.then(() => {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",applySettings);
  else applySettings();
});

document.addEventListener("DOMContentLoaded", () => {
  refreshBadges();
  initReveal();
});
