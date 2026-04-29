import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'leadMagnet',
  title: 'Lead magnet',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'fileUrl', title: 'File URL (PDF or hosted asset)', type: 'url' }),
    defineField({ name: 'kitFormId', title: 'Kit form ID', type: 'string', description: 'Inline form ID from Kit (formerly ConvertKit). E.g. 1234567' }),
    defineField({ name: 'cover', title: 'Cover image', type: 'image' }),
  ],
});
