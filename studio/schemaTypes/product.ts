import { defineField, defineType } from 'sanity';

export const product = defineType({
  name: 'product',
  title: 'Produkt',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'nameIt', title: 'Name Italienisch', type: 'string' }),

    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'brand', title: 'Marke', type: 'reference', to: [{ type: 'brand' }], validation: (Rule) => Rule.required() }),

    defineField({ name: 'category', title: 'Kategorie', type: 'string' }),
    defineField({ name: 'categoryIt', title: 'Kategorie Italienisch', type: 'string' }),

    defineField({ name: 'image', title: 'Produktbild', type: 'image', options: { hotspot: true } }),

    defineField({ name: 'shortDescription', title: 'Kurzbeschreibung', type: 'text', rows: 3 }),
    defineField({
      name: 'shortDescriptionIt',
      title: 'Kurzbeschreibung Italienisch',
      type: 'text',
      rows: 3,
    }),

    defineField({ name: 'description', title: 'Beschreibung', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'descriptionIt',
      title: 'Beschreibung Italienisch',
      type: 'array',
      of: [{ type: 'block' }],
    }),

    defineField({ name: 'packSize', title: 'Gebindegroeße', type: 'string' }),

    defineField({ name: 'features', title: 'Besonderheiten', type: 'array', of: [{ type: 'string' }] }),
    defineField({
      name: 'featuresIt',
      title: 'Besonderheiten Italienisch',
      type: 'array',
      of: [{ type: 'string' }],
    }),

    defineField({ name: 'dataSheet', title: 'PDF-Datenblatt', type: 'file' }),
    defineField({ name: 'sortOrder', title: 'Sortierreihenfolge', type: 'number', initialValue: 0 }),
  ],
  orderings: [
    { title: 'Sortierreihenfolge', name: 'sortOrderAsc', by: [{ field: 'sortOrder', direction: 'asc' }] },
  ],
});
