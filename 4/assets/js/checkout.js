document.addEventListener("DOMContentLoaded", async () => {
  renderHeader("shop");
  renderFooter();
  await PRODUCTS_READY;

  const contentEl = document.getElementById("checkoutContent");
  const emptyEl = document.getElementById("checkoutEmpty");
  const confirmEl = document.getElementById("confirmPanel");
  const lines = getCartLines();

  if (!lines.length){
    contentEl.style.display = "none";
    emptyEl.style.display = "block";
    refreshBadges();
    return;
  }

  const subtotal = getCartSubtotal();

  const summaryRows = lines.map(l => `
    <div class="summary-row"><span>${l.product.name} × ${l.qty}</span><span>${formatPrice(l.lineTotal)}</span></div>
  `).join("");

  contentEl.innerHTML = `
    <div class="checkout-layout">
      <form id="checkoutForm">
        <h3 class="checkout-section-title">Contact Information</h3>
        <div class="form-row">
          <div class="form-group"><label for="fullName">Full Name</label><input type="text" id="fullName" required></div>
          <div class="form-group"><label for="phone">Phone Number</label><input type="tel" id="phone" required></div>
        </div>
        <div class="form-group"><label for="email">Email</label><input type="email" id="email" required></div>

        <h3 class="checkout-section-title">Shipping Address</h3>
        <div class="form-group"><label for="address">Street Address</label><input type="text" id="address" required></div>
        <div class="form-row">
          <div class="form-group"><label for="city">City</label><input type="text" id="city" required></div>
          <div class="form-group"><label for="postal">Postal Code</label><input type="text" id="postal"></div>
        </div>
        <div class="form-group"><label for="notes">Order Notes (optional)</label><textarea id="notes"></textarea></div>

        <h3 class="checkout-section-title">Payment Method</h3>
        <div class="pay-options">
          <label class="pay-option">
            <input type="radio" name="payment" value="cod" checked>
            <span><span class="po-name">Cash on Delivery</span><br><span class="po-sub">Pay when your order arrives.</span></span>
          </label>
          <label class="pay-option">
            <input type="radio" name="payment" value="bank">
            <span><span class="po-name">Bank Transfer</span><br><span class="po-sub">Details sent after order confirmation.</span></span>
          </label>
          <label class="pay-option">
            <input type="radio" name="payment" value="card">
            <span><span class="po-name">Card Payment</span><br><span class="po-sub">Pay securely online.</span></span>
          </label>
        </div>

        <button type="submit" class="btn btn-primary btn-block" style="margin-top:32px;">Place Order</button>
      </form>

      <div class="summary-card">
        <h3 style="margin-bottom:20px;">Order Summary</h3>
        ${summaryRows}
        <div class="summary-row" style="border-top:1px solid var(--line); margin-top:8px; padding-top:14px;"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
        <div class="summary-row"><span>Shipping</span><span>Confirmed after order</span></div>
        <div class="summary-row total"><span>Total</span><span>${formatPrice(subtotal)}</span></div>
      </div>
    </div>
  `;

  document.getElementById("checkoutForm").addEventListener("submit", (e) => {
    e.preventDefault();
    clearCart();
    contentEl.style.display = "none";
    confirmEl.style.display = "block";
    refreshBadges();
    window.scrollTo({ top:0, behavior:"smooth" });
  });

  refreshBadges();
});
