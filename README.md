# SOTTO IL SOLE Starter

Dieses Projekt besteht aus zwei Teilen:

- `website`: Astro Website / One-Pager
- `studio`: Sanity CMS

## Website lokal starten

```bash
cd website
npm install
npm run dev
```

Die Website nutzt Platzhalterdaten, solange keine Sanity-Zugangsdaten hinterlegt sind.

## Sanity Studio lokal starten

1. In Sanity ein Projekt anlegen und die Project ID kopieren.
2. Im Ordner `studio` eine Datei `.env` erstellen. Inhalt siehe `.env.example`.
3. Danach:

```bash
cd studio
npm install
npm run dev
```

## Website mit Sanity verbinden

Im Ordner `website` eine Datei `.env` erstellen. Inhalt siehe `.env.example`.

```bash
PUBLIC_SANITY_PROJECT_ID=deine_project_id
PUBLIC_SANITY_DATASET=production
```

Danach Website neu starten:

```bash
npm run dev
```

Wenn in Sanity Marken und Produkte angelegt sind, werden diese automatisch auf der Website angezeigt.

## Rechtliches

`impressum.astro` und `datenschutz.astro` enthalten nur Platzhalter und muessen vor Veroeffentlichung rechtlich korrekt ersetzt werden.
