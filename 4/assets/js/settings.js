/* ==========================================================================
   SH JEWELRY — Store Settings (brand / contact / policies / homepage copy)
   --------------------------------------------------------------------------
   One centralized settings object, same pattern as products (data.js +
   sanity.js): fetch the single "siteSettings" document from Sanity, fall
   back to SETTINGS_FALLBACK below for anything missing or if Sanity isn't
   configured yet. Reuses SANITY_CONFIG from sanity.js — same project, one
   place to set the projectId, not two.

   Every page that shows brand name, contact info, a policy, or the
   homepage hero/featured copy awaits SETTINGS_READY once before rendering
   it — see components.js (header + footer), index.html's inline script,
   contact.html, and the four policy pages.

   Change a value in Sanity → every one of those locations updates. Change
   nothing in Sanity → the site shows exactly the copy it shows today
   (SETTINGS_FALLBACK matches current hardcoded values one-for-one).
   ========================================================================== */

const SETTINGS_FALLBACK = {
  // Brand
  brandName: "SH Jewelry",

  // Contact
  email: "hello@shjewelry.com",
  phone: "+92 3XX XXXXXXX",
  whatsapp: "+92 3XX XXXXXXX",
  instagram: "",
  facebook: "",

  // Business
  businessAddress: "Pakistan",
  supportHours: "",
  deliveryInfo: "",

  // Policies — each is plain text; blank lines become paragraph breaks on
  // the page. These match the placeholder prompts already on each policy
  // page today, just centralized instead of hardcoded per-file.
  returnPolicy:
    "[Add how many days after delivery a return can be requested.]\n\n[Add condition requirements — e.g. unworn, original packaging.]\n\n[Add refund method and expected processing time.]",
  exchangePolicy:
    "[Add whether exchanges for size/style are offered and how.]",
  shippingPolicy:
    "[Add which cities/regions you currently ship to.]\n\n[Add how long orders typically take to prepare before dispatch.]\n\n[Add your courier partner, estimated delivery windows, and shipping charges.]\n\n[Add how customers can track their order once it ships.]",
  privacyPolicy:
    "[Add what customer data is collected — e.g. name, address, contact details, order history.]\n\n[Add how the data is used — order fulfilment, support, communication.]\n\n[Add whether data is shared with couriers, payment processors, or others.]",
  termsConditions:
    "[Add how orders are confirmed and any conditions for cancellation.]\n\n[Add currency, whether prices include taxes, and how price changes are handled.]\n\n[Add any notes on colour variation, materials, or photography accuracy.]\n\n[Add the jurisdiction and any other legal terms that apply.]",

  // Homepage
  heroHeading: "Timeless Elegance",
  heroDescription: "Jewelry designed to make every moment unforgettable.",
  featuredHeading: "Featured Jewelry",
  featuredDescription: "Discover pieces designed to become part of your story.",
  announcementText: "",

  // Footer
  footerDescription:
    "Jewelry designed to make every moment unforgettable — crafted pieces for everyday wear and formal occasion."
};

let SETTINGS = SETTINGS_FALLBACK;

const SETTINGS_QUERY = `*[_type == "siteSettings"][0]`.trim();

async function fetchSettingsFromSanity(){
  if (typeof SANITY_CONFIG === "undefined" || SANITY_CONFIG.projectId === "YOUR_PROJECT_ID"){
    return null;
  }
  const res = await fetch(sanityQueryUrl(SETTINGS_QUERY));
  if (!res.ok){
    throw new Error(`Sanity settings query failed: ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  return json.result || null;
}

// Every page's init script may await this before rendering settings-driven
// text. Merges fetched settings over the fallback field-by-field, so a
// half-filled-in Settings document in Sanity doesn't blank out fields you
// haven't gotten to yet.
const SETTINGS_READY = (async function loadSettings(){
  try {
    const fetched = await fetchSettingsFromSanity();
    if (fetched){
      const merged = { ...SETTINGS_FALLBACK };
      Object.keys(SETTINGS_FALLBACK).forEach(key => {
        if (fetched[key] !== undefined && fetched[key] !== null && fetched[key] !== ""){
          merged[key] = fetched[key];
        }
      });
      SETTINGS = merged;
    }
  } catch (err) {
    console.warn("[Sanity] Falling back to local settings —", err.message);
  }
  return SETTINGS;
})();

// Turns "\n\n"-separated plain text from a Settings field into paragraph
// HTML. Used by the policy pages.
function policyHtml(text){
  if (!text) return "";
  return text
    .split(/\n\s*\n/)
    .map(p => `<p class="text-secondary" style="margin-top:18px; line-height:1.7;">${p.trim()}</p>`)
    .join("");
}

// wa.me needs digits only (no +, spaces, or dashes).
function whatsappDigits(raw){
  return (raw || "").replace(/[^\d]/g, "");
}
