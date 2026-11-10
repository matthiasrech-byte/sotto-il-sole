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

    defineField({
      name: 'overviewImage',
      title: 'Produktbild – Übersicht',
      type: 'image',
      options: { hotspot: true },
      description: 'Bild auf der Produzentenseite und in der Produktübersicht.',
    }),
    defineField({
      name: 'detailImage',
      title: 'Produktbild – Detailseite',
      type: 'image',
      options: { hotspot: true },
      description: 'Großes Bild auf der eigenen Produktseite. Wenn leer, wird das Übersichtsbild angezeigt.',
    }),
    defineField({ name: 'image', title: 'Produktbild', type: 'image', options: { hotspot: true }, hidden: true, readOnly: true }),

    // Bestehende Texte für die Produzentenübersicht beibehalten.
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

    // Neue, eigenständige Texte nur für die deutsche Produktdetailseite.
    defineField({
      name: 'detailShortDescription',
      title: 'Detailseite – Kurzbeschreibung',
      type: 'text',
      rows: 4,
      description: 'Erscheint nur auf der separaten deutschen Produktseite. Die Kurzbeschreibung auf der Produzentenübersicht bleibt unverändert.',
    }),
    defineField({
      name: 'detailDescription',
      title: 'Detailseite – Ausführliche Beschreibung',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Verkaufsorientierter Produkttext nur für die separate deutsche Produktseite.',
    }),
    defineField({
      name: 'detailFeatures',
      title: 'Detailseite – Kaufargumente',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Kurze Besonderheiten oder Kaufargumente nur für die separate deutsche Produktseite.',
    }),

    defineField({
      name: 'shopEnabled',
      title: 'Shop aktiv',
      type: 'boolean',
      initialValue: false,
      description: 'Aktivieren, wenn dieses Produkt auf der Website gekauft werden kann.',
    }),
    defineField({
      name: 'shopifyProductId',
      title: 'Shopify Produkt-ID',
      type: 'string',
      description: 'Die Shopify Produkt-ID, z. B. 11273167864135.',
      hidden: ({ parent }) => !parent?.shopEnabled,
    }),
    defineField({
      name: 'shopifyVariantId',
      title: 'Shopify Variant-ID',
      type: 'string',
      description: 'Optional. Nur nötig, wenn direkt eine bestimmte Variante gekauft werden soll.',
      hidden: ({ parent }) => !parent?.shopEnabled,
    }),
    defineField({
      name: 'price',
      title: 'Verkaufspreis',
      type: 'string',
      description: 'Preis wie er auf der Website angezeigt werden soll, z. B. 24,50 €.',
      hidden: ({ parent }) => !parent?.shopEnabled,
    }),
    defineField({
      name: 'unit',
      title: 'Einheit / Inhalt',
      type: 'string',
      description: 'Zum Beispiel 500 ml.',
      hidden: ({ parent }) => !parent?.shopEnabled,
    }),
    defineField({
      name: 'basePrice',
      title: 'Grundpreis',
      type: 'string',
      description: 'Zum Beispiel 49,00 €/l.',
      hidden: ({ parent }) => !parent?.shopEnabled,
    }),
    defineField({
      name: 'shopButtonText',
      title: 'Buttontext',
      type: 'string',
      description: 'Optional. Wenn leer, wird „In den Warenkorb“ verwendet.',
      hidden: ({ parent }) => !parent?.shopEnabled,
    }),

    // SEO und Linkvorschau: gelten nur fuer die individuellen Produktseiten.
    defineField({
      name: 'seoTitle',
      title: 'SEO – Seitentitel',
      type: 'string',
      description: 'Optional: Titel fuer Google und Linkvorschauen. Beispiel: Cagnara Olivenoel von Ciccolella | SOTTO IL SOLE.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO – Meta-Beschreibung',
      type: 'text',
      rows: 3,
      description: 'Optional: ca. 140–160 Zeichen. Beschreibt das Produkt fuer Suchmaschinen und Linkvorschauen.',
    }),
    defineField({
      name: 'socialImage',
      title: 'SEO – Social-Media-Vorschaubild',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional: Querformat ca. 1200 x 630 px fuer WhatsApp, Facebook und LinkedIn. Wenn leer, wird das Detailbild verwendet.',
    }),

    defineField({ name: 'dataSheet', title: 'PDF-Datenblatt', type: 'file' }),
    defineField({ name: 'sortOrder', title: 'Sortierreihenfolge', type: 'number', initialValue: 0 }),
  ],
  orderings: [
    { title: 'Sortierreihenfolge', name: 'sortOrderAsc', by: [{ field: 'sortOrder', direction: 'asc' }] },
  ],
});
