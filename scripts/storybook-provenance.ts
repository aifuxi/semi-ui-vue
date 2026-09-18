import path from 'node:path';
import type { Plugin } from 'vite';

/** Associate requested Vite resources with the workspace modules they compile. */
export function storybookProvenance(workspaceRoot: string): Plugin {
  const sourcePath = (id: string | null | undefined) => {
    if (!id || id.startsWith('\0')) return undefined;
    const cleanId = id.split('?')[0]!;
    if (!path.isAbsolute(cleanId)) return undefined;
    const relative = path.relative(workspaceRoot, cleanId).split(path.sep).join('/');
    if (
      relative.startsWith('../') ||
      relative.startsWith('node_modules/') ||
      relative.includes('/node_modules/')
    )
      return undefined;
    return relative;
  };

  return {
    name: 'storybook-source-provenance',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url?.split('?')[0] !== '/parity-provenance.json') return next();
        const chunks: Record<string, string[]> = {};
        for (const module of server.environments.client.moduleGraph.urlToModuleMap.values()) {
          if (!module.url.startsWith('/') || module.url.startsWith('//')) continue;
          const source = sourcePath(module.id);
          if (source && module.transformResult) {
            chunks[new URL(module.url, 'http://localhost').pathname] = [source];
          }
        }
        response.setHeader('Content-Type', 'application/json');
        response.setHeader('Cache-Control', 'no-store');
        response.end(JSON.stringify({ version: 1, chunks }));
      });
    },
    generateBundle(_options, bundle) {
      const chunks: Record<string, string[]> = {};
      for (const output of Object.values(bundle)) {
        if (output.type !== 'chunk') continue;
        const sources = new Set<string>();
        const visited = new Set<string>();
        const visit = (id: string) => {
          if (visited.has(id)) return;
          visited.add(id);
          const info = this.getModuleInfo(id);
          if (
            !info ||
            ('isExternal' in info && info.isExternal) ||
            id.replaceAll('\\', '/').includes('/node_modules/')
          )
            return;
          const source = sourcePath(id);
          if (source) sources.add(source);
          // Follow static imports, including inlined re-export entries. Dynamic
          // stories require their own browser request before counting as evidence.
          for (const dependency of info?.importedIds ?? []) visit(dependency);
        };
        for (const id of Object.keys(output.modules)) visit(id);
        chunks[`/${output.fileName}`] = [...sources].sort();
      }
      this.emitFile({
        type: 'asset',
        fileName: 'parity-provenance.json',
        source: JSON.stringify({ version: 1, chunks }),
      });
    },
  };
}
