import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';

// Check if we're running the admin server (via npm run admin)
const isAdminMode = process.env.ADMIN_MODE === 'true';

export default defineConfig({
  site: 'https://fosbrader.github.io',
  base: '/ae-expressions-library',
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  },
  // Server mode only when running admin portal, static for production build
  // Admin pages are excluded via .astroignore in production builds
  ...(isAdminMode ? {
    output: 'server',
    adapter: node({ mode: 'standalone' })
  } : {
    output: 'static'
  })
});
