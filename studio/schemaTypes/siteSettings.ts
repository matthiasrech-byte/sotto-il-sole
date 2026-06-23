import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Website-Einstellungen',
  type: 'document',
  fields: [
    defineField({ name: 'companyName', title: 'Unternehmensname', type: 'string' }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true } }),

    defineField({ name: 'heroTitle', title: 'Hero-Titel', type: 'string' }),
    defineField({ name: 'heroTitleIt', title: 'Hero-Titel Italienisch', type: 'string' }),

    defineField({ name: 'heroText', title: 'Hero-Text', type: 'text', rows: 4 }),
    defineField({ name: 'heroTextIt', title: 'Hero-Text Italienisch', type: 'text', rows: 4 }),

    defineField({ name: 'contactEmail', title: 'Kontakt-E-Mail', type: 'string' }),
    defineField({ name: 'phone', title: 'Telefon', type: 'string' }),
    defineField({ name: 'address', title: 'Adresse', type: 'text', rows: 3 }),
    defineField({ name: 'addressIt', title: 'Adresse Italienisch', type: 'text', rows: 3 }),
  ],
});
