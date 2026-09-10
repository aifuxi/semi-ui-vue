import { addDevServerHandler, addPluginTemplate, defineNuxtModule } from 'nuxt/kit';
import { createEventStream, defineEventHandler } from 'h3';

export default defineNuxtModule({
  meta: { name: 'docs-content-rspack-hmr' },
  setup(_options, nuxt) {
    if (!nuxt.options.dev || nuxt.options.builder !== '@nuxt/rspack-builder') return;
    const streams = new Set<ReturnType<typeof createEventStream>>();
    const route = `${nuxt.options.app.baseURL.replace(/\/$/, '')}/_docs/content-hmr`;
    let started = false;
    let contentChanged = false;
    let rebuildContent: (() => Promise<void>) | undefined;

    addDevServerHandler({
      route,
      handler: defineEventHandler((event) => {
        const stream = createEventStream(event);
        streams.add(stream);
        stream.onClosed(() => {
          streams.delete(stream);
        });
        void stream.push({ event: 'connected', data: 'ready' });
        return stream.send();
      }),
    });
    // Content 3.16 updates its database and templates, but its browser transport is Vite-only.
    nuxt.hook('app:templatesGenerated', async (_app, templates) => {
      if (
        started &&
        templates.some((template) => template.filename === 'content/database.compressed.mjs')
      ) {
        contentChanged = true;
        // The dump is a Nitro virtual dependency; Rspack may have no module to invalidate.
        await rebuildContent?.();
      }
    });
    nuxt.hook('nitro:init', (nitro) => {
      rebuildContent = () => nitro.hooks.callHook('rollup:reload');
      nitro.hooks.hookOnce('compiled', () => {
        started = true;
        // Register after Nitro's worker reload handler, so requests wait for the new worker.
        nitro.hooks.hook('dev:reload', async () => {
          if (!contentChanged) return;
          contentChanged = false;
          await Promise.allSettled(
            [...streams].map((stream) => stream.push({ event: 'content', data: 'reload' })),
          );
        });
      });
    });
    nuxt.hook('close', async () => {
      await Promise.allSettled([...streams].map((stream) => stream.close()));
      streams.clear();
    });
    addPluginTemplate({
      filename: 'docs-content-hmr.client.mjs',
      mode: 'client',
      getContents: () => `
        import { defineNuxtPlugin } from '#app';
        export default defineNuxtPlugin((app) => {
          const stream = new EventSource(${JSON.stringify(route)});
          const close = () => { stream.close(); window.removeEventListener('pagehide', close); };
          stream.addEventListener('content', () => { close(); window.location.reload(); });
          window.addEventListener('pagehide', close, { once: true });
          app.vueApp.onUnmount(close);
          if (import.meta.webpackHot) import.meta.webpackHot.dispose(close);
        });
      `,
    });
  },
});
