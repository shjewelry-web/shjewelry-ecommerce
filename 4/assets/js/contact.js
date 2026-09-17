document.addEventListener("DOMContentLoaded", async () => {
  renderHeader("contact");
  renderFooter();
  initReveal();
  refreshBadges();

  const form = document.getElementById("contactForm");
  const success = document.getElementById("contactSuccess");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.style.display = "none";
    success.style.display = "block";
  });

  await SETTINGS_READY;
  const s = SETTINGS;

  if (s.email){
    const el = document.getElementById("contactEmail");
    el.textContent = s.email;
    el.href = `mailto:${s.email}`;
  }
  if (s.phone || s.whatsapp){
    const el = document.getElementById("contactPhone");
    const shown = s.phone || s.whatsapp;
    el.textContent = shown;
    const digits = whatsappDigits(shown);
    if (digits) el.href = `tel:+${digits}`;
  }
  if (s.businessAddress){
    document.getElementById("contactAddress").textContent = s.businessAddress;
  }
  if (s.supportHours){
    document.getElementById("contactHours").textContent = s.supportHours;
    document.getElementById("contactHoursRow").style.display = "flex";
  }
  if (s.deliveryInfo){
    document.getElementById("contactDelivery").textContent = s.deliveryInfo;
    document.getElementById("contactDeliveryRow").style.display = "flex";
  }
  // Once real contact details are in Settings (not the fallback placeholders),
  // drop the "these are placeholders" note automatically.
  const stillPlaceholder = s.email === SETTINGS_FALLBACK.email && s.phone === SETTINGS_FALLBACK.phone;
  if (!stillPlaceholder){
    const note = document.getElementById("contactPlaceholderNote");
    if (note) note.style.display = "none";
  }
});
