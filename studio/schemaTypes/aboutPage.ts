import { defineField, defineType } from 'sanity';

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'Über uns',
  type: 'document',
  fields: [
    defineField({ name: 'headline', title: 'Überschrift', type: 'string' }),
    defineField({ name: 'headlineIt', title: 'Überschrift Italienisch', type: 'string' }),

    defineField({ name: 'intro', title: 'Einleitung', type: 'text', rows: 3 }),
    defineField({ name: 'introIt', title: 'Einleitung Italienisch', type: 'text', rows: 3 }),

    defineField({ name: 'founderText', title: 'Text über Gründerin', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'founderTextIt',
      title: 'Text über Gründerin Italienisch',
      type: 'array',
      of: [{ type: 'block' }],
    }),

    defineField({ name: 'portrait', title: 'Portraitbild', type: 'image', options: { hotspot: true } }),

    defineField({ name: 'quote', title: 'Zitat', type: 'text', rows: 2 }),
    defineField({ name: 'quoteIt', title: 'Zitat Italienisch', type: 'text', rows: 2 }),
  ],
});