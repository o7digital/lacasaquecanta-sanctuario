import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL || 'https://lacasaquecanta-sanctuario.vercel.app',
  output: 'static',
  trailingSlash: 'always',
});
