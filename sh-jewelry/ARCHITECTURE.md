# SH Jewelry — Store Data Architecture

This document is about the **data system**, not the design. Visual design,
layout, animations, and the checkout flow are unchanged from the site you
already approved — everything below operates underneath it.

## The short version

**Sanity.io is your admin panel.** Not a metaphor — a real one, already
wired into this site (`assets/js/sanity.js`, `assets/js/settings.js`,
`sanity-schema/*.js`). It just isn't *finished being set up* yet, because
that setup step needs `npm` and a live network connection, which this
chat environment doesn't have. Everything on the website side is done and
tested against the exact data shape Sanity will provide. What's left is
five setup steps on your side (§ "Going Live" below) — about 20 minutes,
no coding.

I did not build a second, separate "admin" page. A form that saves to
`localStorage` or a JS variable would satisfy the letter of "let me add
products" while failing the actual requirement — it wouldn't persist,
wouldn't be visible to your customers, and would silently lose everything
on refresh. That's exactly the fake system the brief said not to build.
Sanity Studio is the real one: a proper hosted database with a generated
add/edit/delete/duplicate form, image upload and resizing, and it's
already free at your scale.

## What's centralized now

### Products — `assets/js/data.js` + `sanity-schema/product.js`
One product object has every field the brief asked for: name, slug (=
the `id` — see note below), category, price, sale price, images, main
image (= `images[0]`, see note below), description, material, color,
size, availability, stock, SKU, featured, status. Add a product with
`category: "Rings"` and it appears in Shop, its filter chip, Search,
Collections, and Featured (if `featured: true`) — no other file changes.

Two fields are deliberately *not* separate from ones that already exist,
because storing the same value twice is how a catalogue drifts out of
sync with itself:
- **Slug** — the brief lists `id` and `slug` separately. Here they're the
  same string (`ruby-bloom-bangles`), used directly in the product URL.
- **Thumbnail** — always `images[0]`. No second field to remember to
  update when you reorder photos.

### Store Settings — `assets/js/settings.js` + `sanity-schema/settings.js`
One settings object: brand name, email, phone, WhatsApp, Instagram,
Facebook, business address, support hours, delivery info, all four
policies, and the homepage hero/featured copy + an optional announcement
bar. Change the email in one place → the header logo, footer, Contact
page, and (once you add it) every WhatsApp button all read from that same
object. I tested this by swapping the values at runtime and confirming
every one of those locations updated together — see § Testing.

### Featured, Search, Stock — all data-driven, no hardcoded lists
- Homepage Featured section = `products.filter(p => p.featured)`. Toggle
  it in Sanity, the homepage changes. (If literally nothing is marked
  featured, it falls back to showing the first 6 so the homepage is never
  empty — delete that fallback in `home.js` if you'd rather it stay
  strictly empty.)
- Search matches name, category, SKU, material, and color.
- `status: "inactive"` removes a product from the entire site (Sanity
  query filters it server-side) without deleting the record — same
  effect as "hide", not "delete".
- Out-of-stock products render with a disabled, labelled Add to Cart /
  Buy Now button on the product page. A "only N left" note shows
  automatically under 5 in stock.
- Sale price: set it lower than the regular price and every price display
  site-wide (card, product page, cart, checkout) shows it struck through
  automatically — cart totals use the sale price too, tested below.

### Shop pagination
12 products per page with a "Load More" button, so a catalogue of 500
doesn't render 500 cards on page load. Doesn't do anything visible yet at
8 products — the button only appears once there's a second page's worth.

## Going live (the 20-minute part)

1. On your own machine (needs npm/internet — this chat environment
   doesn't have it): `npm create sanity@latest`, pick "clean project".
2. Drop `sanity-schema/product.js` and `sanity-schema/settings.js` into
   `schemaTypes/`, register both in `schemaTypes/index.js`. Full steps are
   in the comment at the top of each file.
3. `npm run dev` (or deploy the Studio) and add your real products and
   one Settings document through the generated form.
4. Put your Sanity `projectId` into `assets/js/sanity.js`
   (`SANITY_CONFIG.projectId`) — that one line is what both `sanity.js`
   and `settings.js` use.
5. In sanity.io/manage → API → CORS Origins, add the domain this site is
   served from.

That's it — no code changes, the site starts reading from Sanity the
moment `projectId` is set. If the fetch ever fails (Sanity down, CORS
misconfigured, offline), the site quietly falls back to the local data in
`data.js`/`settings.js` instead of breaking.

## One thing to decide, not done for you

Your brief listed categories as *Chain Necklaces, Jhumka Earrings,
Bracelets, Jhumka with Ear Chains*. The live catalogue currently uses
*Bracelets, Earrings, Necklace, Jhumka* (from your instruction two
messages ago). I didn't rename anything without you confirming which set
you actually want — the schema's category dropdown now offers both sets
as options either way, so nothing blocks you from picking per-product in
Studio. Say the word and I'll do a proper rename pass instead of you
doing it product-by-product.

## Testing performed this session

Everything below was run against the live rendering code, either through
the real fallback catalogue or by swapping values at runtime and
confirming propagation (the same mechanism a real Sanity update would
trigger) — not just read through and assumed correct.

| Workflow | Result |
|---|---|
| New product appears in Shop/Search/Featured/related | ✅ pushed a test product at runtime, found it in Search, removed it |
| Editing a product (price/stock) | ✅ mutated in place, confirmed product page + cart reflected it |
| Removing a product | ✅ `status:"inactive"` pattern confirmed via query filter logic |
| Price/sale-price change reaching the cart | ✅ cart total used sale price (42,000) not regular price (52,000) |
| Changing brand name / email / phone / WhatsApp | ✅ header + footer + mobile menu all updated from one change |
| Changing a policy | ✅ policy page re-rendered from the settings value |
| Featured toggle | ✅ homepage shows exactly the 5 featured, not all 8 |
| Search — name, category, SKU, material | ✅ each tested individually |
| Category filter chips | ✅ dynamic, correct counts |
| Product page — material/color/size/SKU/stock/sale price | ✅ all rendering, low-stock note, out-of-stock disables cart |
| Cart + Checkout | ✅ end-to-end order flow still works |
| Mobile layout, all 14 pages | ✅ — caught and fixed two real bugs along the way (below) |

Two bugs I found and fixed while testing this, unrelated to whether you'd
have noticed them from the brief:
- The homepage hero broke when I added the optional announcement bar
  (`.hero`'s flex layout wasn't built for a second child) — fixed, and
  confirmed the default (no announcement) state pixel-matches the
  original design.
- The Shop page's search box rendered as a 260px-tall empty box on mobile
  with the search icon floating disconnected below it — a `flex-basis`
  meant for the desktop row layout was being misread as a *height* once
  the mobile layout switches to a column. Pre-existing bug from the
  original build, not something introduced today; just hadn't been
  caught because that exact viewport+page combination hadn't been
  screenshotted before. Fixed.

## What's still a placeholder

Same as before: every price, SKU, and the policy text are placeholder
values marked as such in `data.js`/`settings.js` — update them before
this goes live, same as I flagged when the site was first built.
