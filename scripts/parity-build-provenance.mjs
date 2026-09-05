import path from 'node:path';

// Emit provenance from the bundler's actual output, not a hand-maintained component list.
export function parityBuildProvenance(workspaceRoot) {
  return {
    name: 'parity-build-provenance',
    generateBundle(_options, bundle) {
      const chunks = {};
      const emittedModules = new Set(
        Object.values(bundle).flatMap((output) =>
          output.type === 'chunk' ? output.moduleIds : [],
        ),
      );
      for (const output of Object.values(bundle)) {
        if (output.type !== 'chunk') continue;
        const sources = new Set(output.moduleIds);
        const visit = (id) => {
          for (const dependency of this.getModuleInfo(id)?.importedIds ?? []) {
            // Retain eliminated public re-export entries, but do not attribute another
            // emitted chunk (or a lazy import) to this request.
            if (sources.has(dependency) || emittedModules.has(dependency)) continue;
            sources.add(dependency);
            visit(dependency);
          }
        };
        for (const id of output.moduleIds) visit(id);
        chunks[`/${output.fileName}`] = [...sources]
          .filter((id) => path.isAbsolute(id) && !path.relative(workspaceRoot, id).startsWith('..'))
          .map((id) => path.relative(workspaceRoot, id).split(path.sep).join('/'));
      }
      this.emitFile({
        type: 'asset',
        fileName: 'parity-provenance.json',
        source: JSON.stringify({ version: 1, chunks }),
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
