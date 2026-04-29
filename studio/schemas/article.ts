import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'dek', title: 'Dek (subhead)', type: 'text', rows: 3 }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({ name: 'issue', title: 'Issue number', type: 'number' }),
    defineField({ name: 'hero', title: 'Hero image', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt text' }] }),
    defineField({ name: 'body', title: 'Body', type: 'array', of: [
      { type: 'block' },
      { type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt text' }, { name: 'caption', type: 'string', title: 'Caption' }] },
      { type: 'object', name: 'pullquote', title: 'Pull quote', fields: [
        { name: 'quote', type: 'text', title: 'Quote' },
        { name: 'attribution', type: 'string', title: 'Attribution' },
      ] },
    ]}),
    defineField({
      name: 'sport',
      title: 'Sport',
      type: 'string',
      options: { list: ['baseball','softball','soccer','basketball','football','hockey','lacrosse','volleyball','multi-sport'] },
    }),
    defineField({
      name: 'age',
      title: 'Age band',
      type: 'string',
      options: { list: ['5-7','8-10','11-12','13-14','15-plus','all-ages'] },
    }),
    defineField({
      name: 'phase',
      title: 'Phase (the drive)',
      type: 'string',
      options: { list: [
        { title: 'The Drive There', value: 'drive-there' },
        { title: 'The Game', value: 'game' },
        { title: 'The Drive Home', value: 'drive-home' },
      ]},
      validation: r => r.required(),
    }),
    defineField({
      name: 'seasonPhase',
      title: 'Season phase',
      type: 'string',
      options: { list: ['pre-season','early','mid','playoffs','off-season'] },
    }),
    defineField({ name: 'publishedAt', title: 'Published at', type: 'datetime', validation: r => r.required() }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
    defineField({ name: 'draft', title: 'Draft', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'phase', media: 'hero' },
  },
});
