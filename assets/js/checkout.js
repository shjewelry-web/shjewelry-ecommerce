const WA_NUMBER = "923149244045";

document.addEventListener("DOMContentLoaded", async () => {
  renderHeader("shop");
  renderFooter();
  await Promise.all([PRODUCTS_READY, SETTINGS_READY]);

  const contentEl = document.getElementById("checkoutContent");
  const emptyEl   = document.getElementById("checkoutEmpty");
  const lines     = getCartLines();

  if (!lines.length) {
    contentEl.style.display = "none";
    emptyEl.style.display   = "block";
    refreshBadges();
    return;
  }

  const subtotal = getCartSubtotal();

  const summaryRows = lines.map(l => `
    <div class="summary-row">
      <span>${escapeHtml(l.product.name)} × ${l.qty}</span>
      <span>${formatPrice(l.lineTotal)}</span>
    </div>
  `).join("");

  contentEl.innerHTML = `
    <div class="checkout-layout">
      <form id="checkoutForm">
        <h3 class="checkout-section-title">Contact Information</h3>
        <div class="form-row">
          <div class="form-group"><label for="fullName">Full Name</label><input type="text" id="fullName" required placeholder="Your full name"></div>
          <div class="form-group"><label for="phone">Phone Number</label><input type="tel" id="phone" required placeholder="03XXXXXXXXX"></div>
        </div>
        <div class="form-group"><label for="email">Email (optional)</label><input type="email" id="email" placeholder="your@email.com"></div>

        <h3 class="checkout-section-title">Shipping Address</h3>
        <div class="form-group"><label for="address">Street Address</label><input type="text" id="address" required placeholder="House/Street details"></div>
        <div class="form-row">
          <div class="form-group"><label for="city">City</label><input type="text" id="city" required placeholder="Lahore, Karachi..."></div>
          <div class="form-group"><label for="postal">Postal Code</label><input type="text" id="postal" placeholder="Optional"></div>
        </div>
        <div class="form-group"><label for="notes">Order Notes (optional)</label><textarea id="notes" placeholder="Any special requests..."></textarea></div>

        <h3 class="checkout-section-title">Payment Method</h3>
        <div class="pay-options">
          <label class="pay-option">
            <input type="radio" name="payment" value="cod" checked>
            <span><span class="po-name">Cash on Delivery</span><br><span class="po-sub">Pay when your order arrives.</span></span>
          </label>
          <label class="pay-option">
            <input type="radio" name="payment" value="bank">
            <span><span class="po-name">Bank Transfer</span><br><span class="po-sub">Details sent after confirmation.</span></span>
          </label>
        </div>

        <button type="submit" class="btn btn-primary btn-block" style="margin-top:32px;display:flex;align-items:center;justify-content:center;gap:10px;" id="placeOrderBtn">
          <svg viewBox="0 0 32 32" width="20" height="20" fill="none"><path d="M16 1C7.716 1 1 7.716 1 16c0 2.628.672 5.1 1.852 7.254L1 31l8.02-1.82A14.94 14.94 0 0016 31c8.284 0 15-6.716 15-15S24.284 1 16 1z" fill="#fff"/><path d="M16 3c7.18 0 13 5.82 13 13s-5.82 13-13 13a12.95 12.95 0 01-6.472-1.726l-.464-.278-4.758 1.08 1.11-4.632-.302-.48A12.953 12.953 0 013 16C3 8.82 8.82 3 16 3z" fill="#25D366"/><path d="M11.93 9.5c-.28-.62-.576-.632-.842-.642-.218-.01-.468-.009-.718-.009-.25 0-.656.094-.999.469s-1.312 1.281-1.312 3.125 1.343 3.625 1.531 3.875 2.594 4.156 6.407 5.657c3.167 1.25 3.813 1 4.5.937.688-.062 2.22-.906 2.533-1.781.313-.875.313-1.625.219-1.782-.094-.156-.344-.25-.719-.437-.375-.188-2.218-1.094-2.562-1.219-.344-.125-.594-.188-.844.188-.25.375-.968 1.218-1.187 1.468-.219.25-.438.282-.813.094-.375-.187-1.582-.583-3.014-1.857-1.114-.993-1.866-2.219-2.085-2.594-.219-.375-.023-.578.164-.765.169-.169.375-.438.562-.656.188-.219.25-.375.375-.625.125-.25.063-.469-.031-.656-.094-.188-.818-2.063-1.145-2.79z" fill="#fff"/></svg>
          Order via WhatsApp
        </button>
        <p class="text-secondary" style="margin-top:12px;font-size:.85rem;">Tapping the button opens WhatsApp with your order details pre-filled. Send the message to confirm your order.</p>
        <p id="orderStatus" role="status" style="margin-top:10px;font-weight:600;color:var(--gold)"></p>
      </form>

      <div class="summary-card">
        <h3 style="margin-bottom:20px;">Order Summary</h3>
        ${summaryRows}
        <div class="summary-row" style="border-top:1px solid var(--line);margin-top:8px;padding-top:14px;">
          <span>Subtotal</span><span>${formatPrice(subtotal)}</span>
        </div>
        <div class="summary-row"><span>Shipping</span><span>Confirmed on WhatsApp</span></div>
        <div class="summary-row total"><span>Total</span><span>${formatPrice(subtotal)}</span></div>
      </div>
    </div>
  `;

  document.getElementById("checkoutForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const val = id => document.getElementById(id)?.value.trim() || "";
    const payment = document.querySelector('[name="payment"]:checked').value;

    const itemLines = lines.map(l => `  • ${l.product.name} x${l.qty} — ${formatPrice(l.lineTotal)}`).join("\n");

    const msg = `🛍 *New Order — SH Jewelry*

*Items:*
${itemLines}

*Subtotal:* ${formatPrice(subtotal)}

*Customer Details:*
👤 Name: ${val("fullName")}
📞 Phone: ${val("phone")}
📧 Email: ${val("email") || "—"}
🏠 Address: ${val("address")}, ${val("city")} ${val("postal")}
📝 Notes: ${val("notes") || "—"}

💳 Payment: ${payment === "cod" ? "Cash on Delivery" : "Bank Transfer"}`;

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");

    document.getElementById("orderStatus").textContent = "✓ WhatsApp opened! Send the message to confirm your order.";
    window.scrollTo({ top: 0, behavior: "smooth" });
    refreshBadges();
  });

  refreshBadges();
});
