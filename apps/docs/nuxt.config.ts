import { defineNuxtConfig } from 'nuxt/config';
import pages from './src/data/pages.json';

export default defineNuxtConfig({
  compatibilityDate: '2026-09-05',
  srcDir: 'src',
  modules: ['@nuxt/content'],
  devtools: { enabled: false },
  telemetry: false,
  ssr: true,
  hooks: {
    'build:manifest'(manifest) {
      // SSR sees every demo's dynamic import through the shared document route.
      // Keep current-page preload hints, but fetch other demos only when imported.
      for (const entry of Object.values(manifest)) entry.prefetch = false;
    },
  },
  experimental: {
    defaults: {
      // The shared document route exposes every lazy demo to route prefetching.
      // Load its resources on navigation instead of prefetching thousands of demos.
      nuxtLink: { prefetch: false },
    },
  },
  css: ['~~/public/upstream/site.css', '~/assets/site.css'],
  components: [{ path: '~/components', pathPrefix: false, global: true }],
  app: {
    head: {
      title: 'Semi UI Vue',
      link: [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
      script: [{ src: '/theme.js', tagPosition: 'head' }],
    },
  },
  content: {
    experimental: { sqliteConnector: 'native' },
    build: {
      markdown: {
        highlight: {
          theme: { default: 'github-light', dark: 'github-dark' },
          langs: ['vue', 'typescript', 'javascript', 'json', 'bash', 'css', 'html'],
        },
      },
    },
  },
  nitro: {
    prerender: {
      crawlLinks: false,
      failOnError: true,
      routes: pages.map((page) => page.path),
    },
  },
  vite: {
    // Workspace-linked libraries are otherwise inlined by Vite SSR. Keep the
    // published ESM boundary so Nitro does not discard Rslib's CJS registrations.
    ssr: { external: ['@aifuxi/semi-ui-vue'] },
    optimizeDeps: { exclude: ['@vue/repl'] },
    plugins: [
      {
        name: 'docs-repl-local-workers',
        enforce: 'pre',
        transform(code, id) {
          if (!id.includes('@vue/repl')) return;
          if (id.endsWith('/monaco-editor.js'))
            return code.replace(
              /new URL\("assets\/([^"/]+)", import\.meta\.url\)/g,
              'new URL("/repl/workers/$1", window.location.origin)',
            );
          if (id.endsWith('/vue-repl.js')) {
            // Edited code must not gain the documentation origin's DOM or storage access.
            const isolated = code.replace(
              /"allow-(?:same-origin|popups|top-navigation-by-user-activation)",?/g,
              '',
            );
            // REPL's load handler calls this function too; recreating an opaque-origin
            // iframe there would loop forever. Its existing message proxy can update it.
            return isolated
              .replace('sandbox.contentWindow?.location.reload();', 'createSandbox();')
              .replace(
                /function switchPreviewTheme\(\) \{[\s\S]*?\n\t\t\}/,
                `function switchPreviewTheme() {
            sandbox.contentWindow.postMessage({ action: 'docs-theme', theme: theme.value }, '*');
          }`,
              );
          }
        },
      },
    ],
  },
  typescript: {
    strict: true,
    tsConfig: {
      exclude: ['../../../vendor/**'],
    },
  },
});
