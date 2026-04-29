import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'gear',
  title: 'Gear item',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Product name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'ourTake', title: 'Our take', type: 'text', rows: 3 }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'sport',
      title: 'Sport',
      type: 'string',
      options: { list: ['baseball','softball','soccer','basketball','football','hockey','lacrosse','volleyball','all-sports'] },
    }),
    defineField({
      name: 'age',
      title: 'Age band',
      type: 'string',
      options: { list: ['5-7','8-10','11-12','13-14','15-plus','all-ages'] },
    }),
    defineField({ name: 'retailer', title: 'Retailer', type: 'string' }),
    defineField({ name: 'priceRange', title: 'Price range', type: 'string' }),
    defineField({ name: 'affiliateSlug', title: 'Affiliate slug (resolves to /go/[slug])', type: 'string', validation: r => r.required() }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
  ],
});
