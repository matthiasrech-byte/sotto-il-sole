import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sotto-il-sole.de',
  integrations: [sitemap()],
});
