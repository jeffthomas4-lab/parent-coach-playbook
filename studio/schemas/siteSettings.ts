import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Site title', type: 'string' }),
    defineField({ name: 'description', title: 'Site description', type: 'text' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({ name: 'nav', title: 'Primary navigation', type: 'array', of: [
      { type: 'object', fields: [
        { name: 'label', type: 'string' },
        { name: 'href', type: 'string' },
      ]},
    ]}),
    defineField({ name: 'footerLinks', title: 'Footer links', type: 'array', of: [
      { type: 'object', fields: [
        { name: 'label', type: 'string' },
        { name: 'href', type: 'string' },
      ]},
    ]}),
    defineField({ name: 'social', title: 'Social links', type: 'array', of: [
      { type: 'object', fields: [
        { name: 'platform', type: 'string' },
        { name: 'href', type: 'url' },
      ]},
    ]}),
  ],
});
