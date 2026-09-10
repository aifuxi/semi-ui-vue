import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { defineNuxtConfig } from 'nuxt/config';
import pages from './src/data/pages.json';
import { nuxtTemplateLoaders } from './scripts/nuxt-template-loader.mjs';

const vueRequire = createRequire(createRequire(import.meta.url).resolve('vue'));

export default defineNuxtConfig({
  compatibilityDate: '2026-09-05',
  srcDir: 'src',
  builder: 'rspack',
  // Let Rspack's CSS resolver honor package exports for theme subpaths.
  postcss: { plugins: { 'postcss-import': false, 'postcss-url': false } },
  modules: ['@nuxt/content'],
  devtools: { enabled: false },
  telemetry: false,
  ssr: true,
  hooks: {
    'rspack:config'(configs) {
      for (const config of configs) {
        if (config.name === 'client') {
          // Rspack's inner-graph analysis turns Monaco's live undefined initializer into null.
          // Keep export tree-shaking, but preserve variable initialization in browser dependencies.
          config.optimization ??= {};
          config.optimization.innerGraph = false;
        }
        config.module ??= {};
        config.module.rules ??= [];
        config.module.rules.push({
          resourceQuery: /^\?raw$/,
          enforce: 'post',
          type: 'javascript/auto',
          use: [
            { loader: fileURLToPath(new URL('./scripts/raw-source-loader.mjs', import.meta.url)) },
          ],
        });
        // Virtual templates are populated after normal loaders; strip their TS last.
        config.module.rules.push({
          test: /[\\/]\.virtual[\\/].*(?:\.ts|mdc-(?:imports|highlighter)\.mjs)$/,
          enforce: 'post',
          use: nuxtTemplateLoaders(fileURLToPath(new URL('.', import.meta.url))),
        });
        config.module.rules.unshift({
          test: /[\\/]@vue[\\/]repl[\\/]dist[\\/](?:monaco-editor|vue-repl)\.js$/,
          enforce: 'pre',
          use: [
            {
              loader: fileURLToPath(
                new URL('./scripts/repl-isolation-loader.mjs', import.meta.url),
              ),
            },
          ],
        });
        if (config.name === 'server') {
          // Preserve the published ESM boundary and Rslib's CJS registrations.
          const externals = config.externals ?? [];
          config.externals = [
            ({ request, dependencyType }, callback) => {
              // Asset URLs (including Content's SQLite WASM) must reach the asset loader.
              if (dependencyType === 'url') return callback(null, false);
              if (request && /^@vue\/(?:shared|server-renderer)(?:\/|$)/.test(request)) {
                return callback(null, `module ${vueRequire.resolve(request)}`);
              }
              if (
                request &&
                /^(?:@aifuxi\/semi-(?:ui|icons(?:-lab)?|illustrations)-vue|vue)(?:\/|$)/.test(
                  request,
                )
              ) {
                return callback(null, `module ${request}`);
              }
              callback();
            },
            ...(Array.isArray(externals) ? externals : [externals]),
          ];
        }
      }
    },
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
  typescript: {
    strict: true,
    tsConfig: {
      exclude: ['../../../vendor/**'],
    },
  },
});
