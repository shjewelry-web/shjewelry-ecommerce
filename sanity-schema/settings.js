/* ==========================================================================
   SH JEWELRY — Sanity Studio schema for "siteSettings"
   --------------------------------------------------------------------------
   Also not part of the website itself — goes in your Sanity Studio project
   alongside product.js (see the setup steps in that file).

   This is the ONE place that controls brand name, contact details, policy
   pages, and the homepage headline/description text. Change something here
   and every page that shows it updates — header logo, footer, Contact page,
   the four policy pages, and the homepage hero/featured copy. See
   assets/js/settings.js on the website side for exactly which element each
   field feeds.

   THIS SHOULD ONLY EVER HAVE ONE DOCUMENT. Sanity doesn't enforce
   singletons by default — the simplest way to keep it that way is: after
   creating the first "Site Settings" document, don't create a second one.
   (If you want Studio to hide the "create new" option for this type
   entirely, that's a Structure Builder customization — ask your developer,
   or ask Claude Code when you're back in that project.)

   Setup: same as product.js — drop this in schemaTypes/settings.js and
   register it in your schema index.
   ========================================================================== */

import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    // --- Brand ---
    defineField({
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      initialValue: 'SH Jewelry',
      validation: (Rule) => Rule.required(),
      group: 'brand',
    }),

    // --- Contact ---
    defineField({name: 'email', title: 'Email', type: 'string', group: 'contact'}),
    defineField({name: 'phone', title: 'Phone', type: 'string', group: 'contact'}),
    defineField({name: 'whatsapp', title: 'WhatsApp Number', description: 'Digits only with country code, e.g. 923001234567 — used to build wa.me links.', type: 'string', group: 'contact'}),
    defineField({name: 'instagram', title: 'Instagram URL', type: 'url', group: 'contact'}),
    defineField({name: 'facebook', title: 'Facebook URL', type: 'url', group: 'contact'}),

    // --- Business ---
    defineField({name: 'businessAddress', title: 'Business Address', type: 'text', rows: 2, group: 'business'}),
    defineField({name: 'supportHours', title: 'Customer Support Hours', type: 'string', group: 'business'}),
    defineField({name: 'deliveryInfo', title: 'Delivery Information', description: 'Short line shown on the Contact page — full detail still belongs on the Shipping policy page below.', type: 'text', rows: 2, group: 'business'}),

    // --- Policies (shown verbatim on their matching page) ---
    defineField({name: 'returnPolicy', title: 'Return Policy', type: 'text', rows: 8, group: 'policies'}),
    defineField({name: 'exchangePolicy', title: 'Exchange Policy', type: 'text', rows: 8, group: 'policies'}),
    defineField({name: 'shippingPolicy', title: 'Shipping Policy', type: 'text', rows: 8, group: 'policies'}),
    defineField({name: 'privacyPolicy', title: 'Privacy Policy', type: 'text', rows: 12, group: 'policies'}),
    defineField({name: 'termsConditions', title: 'Terms & Conditions', type: 'text', rows: 12, group: 'policies'}),

    // --- Homepage ---
    defineField({name: 'heroHeading', title: 'Hero Heading', description: 'e.g. "Timeless Elegance". Keep it short — this renders large.', type: 'string', group: 'homepage'}),
    defineField({name: 'heroDescription', title: 'Hero Description', type: 'string', group: 'homepage'}),
    defineField({name: 'featuredHeading', title: 'Featured Section Heading', type: 'string', group: 'homepage'}),
    defineField({name: 'featuredDescription', title: 'Featured Section Description', type: 'string', group: 'homepage'}),
    defineField({
      name: 'announcementText',
      title: 'Announcement Bar Text',
      description: 'Optional thin strip above the header (e.g. "Free delivery on orders over PKR 10,000"). Leave blank and it simply doesn\u2019t render — no empty bar.',
      type: 'string',
      group: 'homepage',
    }),

    // --- Footer ---
    defineField({name: 'footerDescription', title: 'Footer Description', type: 'text', rows: 3, group: 'footer'}),
  ],
  groups: [
    {name: 'brand', title: 'Brand'},
    {name: 'contact', title: 'Contact'},
    {name: 'business', title: 'Business'},
    {name: 'policies', title: 'Policies'},
    {name: 'homepage', title: 'Homepage'},
    {name: 'footer', title: 'Footer'},
  ],
  preview: {
    prepare(){ return {title: 'Site Settings'} },
  },
})
