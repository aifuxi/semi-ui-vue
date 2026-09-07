import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

const coreRoot = fileURLToPath(
  new URL('../../vendor/semi-design/packages/semi-json-viewer-core/src', import.meta.url),
);
const coreEntry = path.join(coreRoot, 'index.ts');
const pinnedWorkerManager = path.join(coreRoot, 'worker/jsonWorkerManager');
const pinnedNamespace = path.join(coreRoot, 'common/nameSpace');
const adaptedWorkerManager = fileURLToPath(
  new URL('./src/json-viewer-worker-manager.ts', import.meta.url),
);
const adaptedNamespace = fileURLToPath(new URL('./src/json-viewer-namespace.ts', import.meta.url));
const jsoncParserEntry = fileURLToPath(
  new URL('./node_modules/jsonc-parser/lib/esm/main.js', import.meta.url),
);

export function preservePinnedJsonViewerWorker(): Plugin {
  return {
    name: 'preserve-pinned-json-viewer-worker',
    transform(code, id) {
      // This plugin runs only in the dedicated Worker build. Prune the main-thread
      // branch, which otherwise retains the upstream nested-Worker placeholder.
      if (id.replaceAll('\\', '/') === path.join(coreRoot, 'common/worker.ts')) {
        return { code: 'export function isInWorkerThread() { return true; }', map: null };
      }
      // JSONModel imports the manager even in its Worker-only branch. A dedicated
      // Worker never starts another manager; exclude the unexpanded upstream template.
      if (id.replaceAll('\\', '/') === `${pinnedWorkerManager}.ts`) {
        return {
          code: 'export function getJsonWorkerManager() { throw new Error("Nested JsonViewer Worker is not supported"); }',
          map: null,
        };
      }
      // The pinned package marks every module side-effect-free, including its Worker handler.
      if (id.replaceAll('\\', '/') !== path.join(coreRoot, 'worker/json.worker.ts')) return null;
      return { code, map: null, moduleSideEffects: true };
    },
  };
}

export function adaptPinnedJsonViewerCore(): Plugin {
  return {
    name: 'adapt-pinned-json-viewer-core',
    enforce: 'pre',
    config: () => ({
      resolve: {
        alias: [{ find: /^jsonc-parser$/, replacement: jsoncParserEntry }],
      },
    }),
    resolveId(source, importer) {
      if (source === '@douyinfe/semi-json-viewer-core') return coreEntry;
      if (source === 'jsonc-parser') return jsoncParserEntry;
      if (!importer || source.startsWith('\0') || !source.startsWith('.')) return null;

      const cleanImporter = importer.split('?')[0];
      if (!cleanImporter?.startsWith(coreRoot)) return null;
      const candidate = path.resolve(path.dirname(cleanImporter), source).replace(/\.ts$/, '');
      if (candidate === pinnedWorkerManager) return adaptedWorkerManager;
      if (candidate === pinnedNamespace) return adaptedNamespace;
      return null;
    },
  };
}
