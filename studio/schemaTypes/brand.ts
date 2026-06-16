import { defineField, defineType } from 'sanity';

export const brand = defineType({
  name: 'brand',
  title: 'Marke',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'region', title: 'Herkunftsregion', type: 'string' }),
    defineField({ name: 'shortDescription', title: 'Kurzbeschreibung', type: 'text', rows: 3 }),
    defineField({ name: 'description', title: 'Beschreibung', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'heroImage', title: 'Titelbild', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'sortOrder', title: 'Sortierreihenfolge', type: 'number', initialValue: 0 }),
  ],
  orderings: [
    { title: 'Sortierreihenfolge', name: 'sortOrderAsc', by: [{ field: 'sortOrder', direction: 'asc' }] },
  ],
});
