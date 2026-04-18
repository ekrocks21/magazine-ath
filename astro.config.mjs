// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Required by @astrojs/sitemap and @astrojs/rss to emit canonical URLs.
  site: 'https://magazine.abovethehook.com',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],
});