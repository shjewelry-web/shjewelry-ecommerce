document.addEventListener("DOMContentLoaded", async () => {
  renderHeader("contact");
  renderFooter();
  initReveal();
  refreshBadges();

  const form = document.getElementById("contactForm");
  const success = document.getElementById("contactSuccess");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = id => document.getElementById(id).value.trim();
    window.location.href = `mailto:${SETTINGS.email}?subject=${encodeURIComponent(value('cSubject') || 'SH Jewelry enquiry')}&body=${encodeURIComponent('Name: '+value('cName')+'\nEmail: '+value('cEmail')+'\n\n'+value('cMessage'))}`;
    success.textContent = 'Email prepared. Send your message from your email app. If no app opens, email ' + SETTINGS.email + '.';
    success.style.display = 'block';
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
  if (!s.phone && !s.whatsapp) document.getElementById("contactPhone").textContent = "Please contact us by email";
  const stillPlaceholder = false;
  if (!stillPlaceholder){
    const note = document.getElementById("contactPlaceholderNote");
    if (note) note.style.display = "none";
  }
});
