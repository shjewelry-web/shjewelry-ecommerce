document.addEventListener("DOMContentLoaded", async () => {
  renderHeader("shop");
  renderFooter();

  await PRODUCTS_READY;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const product = getProductById(id);

  const detailEl = document.getElementById("productDetail");
  const relatedSection = document.getElementById("relatedSection");
  const notFoundEl = document.getElementById("notFound");
  const crumbTrail = document.getElementById("crumbTrail");

  if (!product){
    detailEl.style.display = "none";
    crumbTrail.style.display = "none";
    notFoundEl.style.display = "block";
    refreshBadges();
    return;
  }

  document.title = product.name + " — SH Jewelry";
  document.getElementById("crumbName").textContent = product.name;

  const images = product.images; // array of {w1400,w900,w520}
  const wished = isWishlisted(product.id);

  const thumbsHtml = images.length > 1
    ? `<div class="pd-thumbs">${images.map((img, i) => `
        <button class="${i === 0 ? "active" : ""}" data-idx="${i}"><img src="${escapeHtml(img.w520)}" alt="${escapeHtml(product.name)} view ${i+1}"></button>
      `).join("")}</div>`
    : "";

  const fixedDetailsHtml = [
    ["Material", product.material],
    ["Color", product.color],
    ["Size", product.size],
    ["SKU", product.sku]
  ]
    .filter(([, value]) => !!value)
    .map(([label, value]) => `<div class="pd-meta-row"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(value)}</span></div>`)
    .join("");

  const detailsHtml = fixedDetailsHtml + product.details.map(d => `
    <div class="pd-meta-row"><strong>${escapeHtml(d.label)}</strong><span>${escapeHtml(d.value)}</span></div>
  `).join("");

  const priceHtml = cardPriceHtml(product);
  const inStock = stockLimit(product) > 0;
  const stockNote = !inStock
    ? `<p class="pd-note" style="color:var(--gold-soft);">${ICONS.info} ${escapeHtml(product.stock === 0 ? "Out of Stock" : product.availability || "Out of Stock")} — check back soon.</p>`
    : (typeof product.stock === "number" && product.stock > 0 && product.stock <= 5)
      ? `<p class="pd-note" style="color:var(--gold-soft);">${ICONS.info} Only ${product.stock} left in stock.</p>`
      : "";

  detailEl.innerHTML = `
    <div class="pd-gallery reveal">
      <div class="pd-stage" id="pdStage">
        <img src="${escapeHtml(images[0].w1400)}" id="pdMainImg" class="${images[0].wide ? "fit-contain" : ""}" alt="${escapeHtml(product.name)}">
      </div>
      ${thumbsHtml}
    </div>
    <div class="pd-info reveal">
      <span class="pc-cat">${escapeHtml(product.category)}</span>
      <h1>${escapeHtml(product.name)}</h1>
      <div class="pd-price">${priceHtml}</div>
      <p class="pd-desc">${escapeHtml(product.description)}</p>
      <div class="pd-meta">${detailsHtml}</div>

      <div class="pd-actions">
        <div class="qty-stepper">
          <button type="button" id="qtyMinus" aria-label="Decrease quantity">−</button>
          <input type="number" id="qtyInput" value="1" min="1" max="${Math.max(1,stockLimit(product))}" aria-label="Quantity">
          <button type="button" id="qtyPlus" aria-label="Increase quantity">+</button>
        </div>
        <button class="btn btn-primary" id="addToCartBtn" style="flex:2;" ${inStock ? "" : "disabled"}>${inStock ? "Add to Cart" : "Out of Stock"}</button>
        <button class="btn-icon" id="wishBtn" aria-label="Toggle wishlist">${wished ? ICONS.heartFill : ICONS.heart}</button>
      </div>
      <button class="btn btn-secondary btn-block" id="buyNowBtn" style="margin-top:14px;" ${inStock ? "" : "disabled"}>Buy Now</button>
      ${stockNote}
      <p class="pd-note">${ICONS.info} Product photography shown as captured — no digital retouching of the jewelry itself.</p>
    </div>
  `;

  initReveal();

  // gallery zoom + thumbnails
  const stage = document.getElementById("pdStage");
  const mainImg = document.getElementById("pdMainImg");
  stage.addEventListener("click", () => stage.classList.toggle("zoomed"));
  detailEl.querySelectorAll(".pd-thumbs button").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.idx);
      mainImg.src = images[idx].w1400;
      mainImg.classList.toggle("fit-contain", !!images[idx].wide);
      detailEl.querySelectorAll(".pd-thumbs button").forEach(b => b.classList.toggle("active", b === btn));
      stage.classList.remove("zoomed");
    });
  });

  // quantity stepper
  const qtyInput = document.getElementById("qtyInput");
  document.getElementById("qtyMinus").addEventListener("click", () => {
    qtyInput.value = Math.max(1, Number(qtyInput.value) - 1);
  });
  document.getElementById("qtyPlus").addEventListener("click", () => {
    qtyInput.value = Math.min(stockLimit(product), (Number(qtyInput.value) || 1) + 1);
  });

  qtyInput.addEventListener("change", () => { qtyInput.value = Math.min(Math.max(1,stockLimit(product)),Math.max(1,Math.floor(Number(qtyInput.value)) || 1)); });

  // wishlist
  const wishBtn = document.getElementById("wishBtn");
  wishBtn.addEventListener("click", () => {
    const active = toggleWishlist(product.id);
    wishBtn.innerHTML = active ? ICONS.heartFill : ICONS.heart;
  });

  // add to cart
  const addBtn = document.getElementById("addToCartBtn");
  addBtn.addEventListener("click", () => {
    if (!addToCart(product.id, Number(qtyInput.value))) return;
    const original = addBtn.textContent;
    addBtn.textContent = "Added ✓";
    addBtn.disabled = true;
    setTimeout(() => { addBtn.textContent = original; addBtn.disabled = false; }, 1400);
  });

  // buy now
  document.getElementById("buyNowBtn").addEventListener("click", () => {
    if (!addToCart(product.id, Number(qtyInput.value))) return;
    window.location.href = "checkout.html";
  });

  // related products
  let related = PRODUCTS.filter(p => p.id !== product.id && p.category === product.category);
  if (related.length < 3){
    const others = PRODUCTS.filter(p => p.id !== product.id && !related.includes(p));
    related = related.concat(others).slice(0, 3);
  } else {
    related = related.slice(0, 3);
  }
  if (related.length){
    relatedSection.style.display = "block";
    renderProductGrid(document.getElementById("relatedGrid"), related);
  }

  refreshBadges();
});
