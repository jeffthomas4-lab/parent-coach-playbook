import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'newsletterIssue',
  title: 'Newsletter issue (archive)',
  type: 'document',
  description: 'Mirror of an issue published in Kit, archived for the website.',
  fields: [
    defineField({ name: 'issueNumber', title: 'Issue number', type: 'number', validation: r => r.required() }),
    defineField({ name: 'subject', title: 'Subject line', type: 'string' }),
    defineField({ name: 'sentAt', title: 'Sent at', type: 'datetime' }),
    defineField({ name: 'kitUrl', title: 'Kit public URL', type: 'url' }),
    defineField({ name: 'body', title: 'Body (mirrored)', type: 'array', of: [{ type: 'block' }] }),
  ],
});
