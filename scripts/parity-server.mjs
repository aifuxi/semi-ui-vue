import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRsbuild, loadConfig, mergeRsbuildConfig } from '@rsbuild/core';

const root = fileURLToPath(new URL('../', import.meta.url));
export async function startParityServer(app, { mode, port, output, runtimeMode = 'development' }) {
  const cwd = path.join(root, 'apps', app);
  const loaded = await loadConfig({ cwd, path: path.join(cwd, 'rsbuild.config.ts') });
  const rsbuild = await createRsbuild({
    cwd,
    config: mergeRsbuildConfig(loaded.content, {
      mode: runtimeMode,
      dev: { writeToDisk: false },
      server: { host: '127.0.0.1', port, strictPort: true, printUrls: false },
      performance: { buildCache: false, printFileSize: false },
      output: { distPath: { root: path.join(output, 'dist') }, minify: false },
    }),
  });
  let build;
  if (mode === 'build') build = await rsbuild.build();
  const server = mode === 'build' ? await rsbuild.preview() : await rsbuild.startDevServer();
  return {
    resolvedUrls: { local: [`http://127.0.0.1:${port}/`] },
    async close() {
      await server.server.close();
      await build?.close();
    },
  };
}
