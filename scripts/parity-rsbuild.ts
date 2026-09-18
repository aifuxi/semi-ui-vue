import { createRequire } from 'node:module';
import path from 'node:path';
import { createUnplugin, type UnpluginOptions } from 'unplugin';
import type { RsbuildPlugin } from '@rsbuild/core';

interface Alias {
  find: string | RegExp;
  replacement: string;
}

/** Share the pinned-source resolve/load contracts with Rspack, without a Vite server. */
export function pinnedSourcePlugins(
  root: string,
  plugins: unknown[],
  aliases: Alias[],
  singletons: string[],
): RsbuildPlugin {
  const require = createRequire(path.join(root, 'package.json'));
  return {
    name: 'pinned-parity-sources',
    setup(api) {
      api.resolve(({ resolveData }) => {
        const source = resolveData.request;
        for (const { find, replacement } of aliases) {
          if (typeof find === 'string') {
            if (source !== find && !source.startsWith(`${find}/`)) continue;
            resolveData.request = replacement + source.slice(find.length);
          } else {
            if (!find.test(source)) continue;
            resolveData.request = source.replace(find, replacement);
          }
          return;
        }
        for (const singleton of singletons) {
          if (source === singleton || source.startsWith(`${singleton}/`)) {
            resolveData.request = require.resolve(source);
            return;
          }
        }
      });
      api.modifyRspackConfig((config) => {
        config.plugins ??= [];
        config.plugins.push(
          createUnplugin(() => ({
            name: 'pinned-dedicated-json-worker',
            enforce: 'pre',
            transformInclude: (id: string) =>
              /(?:json-viewer-worker-manager|common\/worker)\.ts$/.test(id),
            transform(_code, id) {
              const native = this.getNativeBuildContext?.();
              if (
                native?.framework !== 'rspack' ||
                !native.compiler.name?.startsWith('rsbuild-worker ')
              )
                return;
              if (id.endsWith('/common/worker.ts'))
                return 'export function isInWorkerThread() { return true; }';
              // The Worker cannot create another manager. Prune its main-thread import
              // graph before the inline-worker loader starts recursive child builds.
              return 'export function getJsonWorkerManager() { throw new Error("Nested JsonViewer Worker is not supported"); }';
            },
          })).rspack(),
        );
        for (const plugin of plugins) {
          config.plugins.push(
            createUnplugin(() => ({
              loadInclude: (id: string) => id.startsWith('\0'),
              transformInclude: (id: string) => /\.[cm]?[jt]sx?(?:\?|$)/.test(id),
              ...(plugin as UnpluginOptions),
            })).rspack(),
          );
        }
      });
    },
  };
}
