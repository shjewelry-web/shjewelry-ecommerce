/* ==========================================================================
   SH JEWELRY — Sanity Studio schema for "product"
   --------------------------------------------------------------------------
   This is NOT part of the website — it doesn't get uploaded with the rest
   of the sh-jewelry folder. It goes in your separate Sanity Studio project
   (the one you get from `npm create sanity@latest`, run on your own
   machine — that needs npm/network, which is why it isn't built here).

   Field names below match exactly what assets/js/sanity.js queries for.
   If you rename a field here, update SANITY_PRODUCT_QUERY in sanity.js too,
   or the site will just silently get "undefined" for that field.

   This is your ADD PRODUCT / EDIT PRODUCT / DELETE PRODUCT screen — Sanity
   Studio generates that whole form from this file. Duplicate is built into
   Studio's document menu already, no extra work needed for that one.

   Setup:
   1. Drop this file in your Studio project as schemaTypes/product.js
   2. Also drop settings.js (next to this file) in as schemaTypes/settings.js
   3. Register both in your schema index, e.g. schemaTypes/index.js:
        import product from './product'
        import settings from './settings'
        export const schemaTypes = [product, settings]
   4. Deploy/run the Studio, add products through it.
   5. Put your projectId in assets/js/sanity.js AND assets/js/settings.js on
      the website side, and whitelist the site's origin under CORS in
      sanity.io/manage.
   ========================================================================== */

import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Used in the product URL — e.g. "ruby-bloom-bangles". Generate from the name. This doubles as the product ID; there is no separate ID field.',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      description: 'Shop filter chips and Collections tiles are generated from whatever categories your products actually use — pick an existing one, or type a new one and it shows up on the site automatically. The site currently has products in: Bracelets, Earrings, Necklace, Jhumka.',
      type: 'string',
      options: {
        list: [
          'Bracelets', 'Earrings', 'Necklace', 'Jhumka',
          'Chain Necklaces', 'Jhumka Earrings', 'Jhumka with Ear Chains',
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (PKR)',
      description: 'The regular price. Always shown — struck through if Sale Price is set below it.',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'salePrice',
      title: 'Sale Price (PKR)',
      description: 'Optional. Set this lower than Price to put the product on sale — the site shows Sale Price as the real price with Price struck through. Leave blank for no sale.',
      type: 'number',
      validation: (Rule) => Rule.positive(),
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      description: 'Your own stock-keeping code, e.g. SHJ-EAR-004. Searchable in the Shop search box.',
      type: 'string',
    }),
    defineField({
      name: 'material',
      title: 'Material',
      description: 'e.g. "Gold-plated brass, cubic zirconia". Shown on the product page and searchable.',
      type: 'string',
    }),
    defineField({
      name: 'color',
      title: 'Color',
      description: 'e.g. "Gold / Ruby Red". Shown on the product page and searchable.',
      type: 'string',
    }),
    defineField({
      name: 'size',
      title: 'Size',
      description: 'e.g. "One Size", "Adjustable". Shown on the product page.',
      type: 'string',
    }),
    defineField({
      name: 'stock',
      title: 'Stock Count',
      description: 'Number of units available. The product page shows a "only N left" note automatically when this is 5 or under.',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.required().min(0).integer(),
    }),
    defineField({
      name: 'availability',
      title: 'Availability Label',
      description: 'Shown to customers. Kept separate from Stock Count on purpose — a Preorder item can have 0 in Stock Count and still be orderable.',
      type: 'string',
      options: {list: ['In Stock', 'Out of Stock', 'Preorder']},
      initialValue: 'In Stock',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      description: 'On = shows in the homepage "Featured Jewelry" section. Off = it won\u2019t. Nothing else to configure — the homepage updates on its own.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      description: 'Inactive products are excluded from the live site entirely (shop, search, everywhere) without deleting the record — use this instead of Delete if you just want to pull something temporarily.',
      type: 'string',
      options: {list: ['active', 'inactive']},
      initialValue: 'active',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      description: 'Not shown on the site yet, but searchable in the Shop search box — kept for that and for future use.',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'Shown on the product page.',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'details',
      title: 'Additional Details',
      description: 'Free-form rows for anything that doesn\u2019t fit Material/Color/Size above — Closure, Care, Chain type, Set includes, etc. Add as many as you like.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'label', type: 'string', title: 'Label'},
            {name: 'value', type: 'string', title: 'Value'},
          ],
          preview: {select: {title: 'label', subtitle: 'value'}},
        },
      ],
    }),
    defineField({
      name: 'images',
      title: 'Images',
      description: 'Main image (first in the list) is used as the thumbnail everywhere — card, search results, cart, wishlist. There is no separate "thumbnail" field to keep in sync; it\u2019s always images[0]. Add up to a few more for the product page gallery. The site generates its own 1400/900/520px versions from whatever you upload — no need to upload multiple sizes. If a piece only has one photo, only upload one — the site does not invent extra images.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'galleryImage',
          fields: [
            {name: 'image', type: 'image', title: 'Image', options: {hotspot: true}, validation: (Rule) => Rule.required()},
            {
              name: 'wide',
              type: 'boolean',
              title: 'Landscape photo',
              description: 'Turn on for a wide/landscape shot (e.g. a flat-lay or a display-card photo) so the gallery shows it letterboxed instead of cropping it to the usual portrait frame.',
              initialValue: false,
            },
          ],
          preview: {select: {media: 'image'}},
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'category', media: 'images.0.image'},
  },
})
