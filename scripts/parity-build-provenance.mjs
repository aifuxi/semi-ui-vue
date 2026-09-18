import path from 'node:path';

// Both dev and preview bundle modules; evidence follows only requested output chunks.
export function parityBuildProvenance(workspaceRoot) {
  return {
    name: 'parity-build-provenance',
    setup(api) {
      api.processAssets({ stage: 'report' }, ({ compilation, sources }) => {
        const chunks = {};
        const members = (module) => [module, ...Array.from(module.modules ?? []).flatMap(members)];
        const emitted = new Set(
          Array.from(compilation.chunks)
            .flatMap((chunk) =>
              Array.from(compilation.chunkGraph.getChunkModulesIterable(chunk)).flatMap(members),
            )
            .map((module) => module.identifier()),
        );
        for (const chunk of compilation.chunks) {
          const modules = new Set(
            Array.from(compilation.chunkGraph.getChunkModulesIterable(chunk)).flatMap(members),
          );
          const visited = new Set([...modules].map((module) => module.identifier()));
          const visit = (module) => {
            for (const connection of compilation.moduleGraph.getOutgoingConnections(module)) {
              const dependency = connection.module;
              // Dynamic imports belong to their own request, even if optimized away.
              if (
                !dependency ||
                connection.dependency?.type?.includes('import()') ||
                visited.has(dependency.identifier()) ||
                emitted.has(dependency.identifier())
              )
                continue;
              visited.add(dependency.identifier());
              modules.add(dependency);
              visit(dependency);
            }
          };
          for (const module of modules) visit(module);
          const paths = [
            ...new Set(
              [...modules]
                .map((module) => module.resource?.split('?')[0])
                .filter(
                  (id) =>
                    id && path.isAbsolute(id) && !path.relative(workspaceRoot, id).startsWith('..'),
                )
                .map((id) => path.relative(workspaceRoot, id).split(path.sep).join('/')),
            ),
          ];
          for (const file of chunk.files) {
            if (/\.m?js$/.test(file)) chunks[`/${file}`] = paths;
          }
        }
        compilation.emitAsset(
          'parity-provenance.json',
          new sources.RawSource(JSON.stringify({ version: 1, chunks })),
        );
      });
    },
  };
}

export function requestedBuildSources(requestedUrls, baseUrl, manifest) {
  if (manifest?.version !== 1 || !manifest.chunks || typeof manifest.chunks !== 'object') {
    throw new Error('Invalid parity build provenance');
  }
  const origin = new URL(baseUrl).origin;
  const sources = new Set();
  for (const requested of requestedUrls) {
    const url = new URL(requested);
    if (url.origin !== origin) continue;
    const modules = manifest.chunks[url.pathname];
    if (modules === undefined) continue;
    if (!Array.isArray(modules) || modules.some((id) => typeof id !== 'string')) {
      throw new Error('Invalid parity chunk provenance');
    }
    for (const id of modules) sources.add(id);
  }
  return [...sources];
}
