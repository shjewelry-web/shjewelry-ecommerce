function renderCartPage(){
  const contentEl = document.getElementById("cartContent");
  const emptyEl = document.getElementById("cartEmpty");
  const lines = getCartLines();

  if (!lines.length){
    contentEl.style.display = "none";
    emptyEl.style.display = "block";
    return;
  }
  contentEl.style.display = "block";
  emptyEl.style.display = "none";

  const subtotal = getCartSubtotal();
  const shipping = 0; // Shipping cost not yet defined — left at 0, update once a rate is set.

  const rowsHtml = lines.map(l => `
    <div class="cart-row" data-id="${l.product.id}">
      <a href="product.html?id=${l.product.id}"><img src="${productImage(l.product, 520)}" alt="${l.product.name}"></a>
      <div class="cr-name-wrap">
        <a href="product.html?id=${l.product.id}" class="cr-name">${l.product.name}</a>
        <div class="cr-cat">${l.product.category}</div>
        <div class="qty-stepper" style="margin-top:12px;">
          <button type="button" class="cr-minus" aria-label="Decrease quantity">−</button>
          <input type="number" class="cr-qty" value="${l.qty}" min="1" max="10" aria-label="Quantity">
          <button type="button" class="cr-plus" aria-label="Increase quantity">+</button>
        </div>
        <button class="cr-remove" type="button">Remove</button>
      </div>
      <div></div>
      <div class="cr-price">${formatPrice(l.lineTotal)}</div>
    </div>
  `).join("");

  contentEl.innerHTML = `
    <div class="cart-layout">
      <div class="cart-items">${rowsHtml}</div>
      <div class="summary-card">
        <h3 style="margin-bottom:20px;">Order Summary</h3>
        <div class="summary-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
        <div class="summary-row"><span>Shipping</span><span>Calculated at checkout</span></div>
        <div class="summary-row total"><span>Total</span><span>${formatPrice(subtotal)}</span></div>
        <a href="checkout.html" class="btn btn-primary btn-block" style="margin-top:22px;">Proceed to Checkout</a>
        <a href="shop.html" class="btn btn-ghost btn-block" style="margin-top:12px;">Continue Shopping</a>
      </div>
    </div>
  `;

  contentEl.querySelectorAll(".cart-row").forEach(row => {
    const id = row.dataset.id;
    const qtyInput = row.querySelector(".cr-qty");
    row.querySelector(".cr-minus").addEventListener("click", () => {
      const v = Math.max(1, Number(qtyInput.value) - 1);
      qtyInput.value = v;
      updateCartQty(id, v);
      renderCartPage();
    });
    row.querySelector(".cr-plus").addEventListener("click", () => {
      const v = Math.min(10, Number(qtyInput.value) + 1);
      qtyInput.value = v;
      updateCartQty(id, v);
      renderCartPage();
    });
    qtyInput.addEventListener("change", () => {
      const v = Math.min(10, Math.max(1, Number(qtyInput.value) || 1));
      updateCartQty(id, v);
      renderCartPage();
    });
    row.querySelector(".cr-remove").addEventListener("click", () => {
      removeFromCart(id);
      renderCartPage();
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  renderHeader("shop");
  renderFooter();
  await PRODUCTS_READY;
  renderCartPage();
  refreshBadges();
});
