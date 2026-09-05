// These legacy language scripts read a global without declaring their dependencies.
// Express the existing core -> JSX -> TSX order so shared-chunk hoisting cannot invert it.
export function parityPrismOrder() {
  return {
    name: 'parity-prism-language-order',
    apply: 'build',
    enforce: 'pre',
    transform(code, id) {
      const language = id
        .replaceAll('\\', '/')
        .match(/\/prismjs\/components\/prism-(jsx|tsx)\.js$/)?.[1];
      if (!language) return null;
      return {
        code: `import Prism from '../prism.js';\n${language === 'tsx' ? "import './prism-jsx.js';\n" : ''}${code}`,
        map: null,
      };
    },
  };
}

export function parityWorkerEntry() {
  return {
    name: 'preserve-pinned-json-worker-handler',
    transform(code, id) {
      // Preserve the message handler excluded by upstream package sideEffects metadata.
      if (!id.replaceAll('\\', '/').endsWith('/semi-json-viewer-core/src/worker/json.worker.ts'))
        return null;
      return { code, map: null, moduleSideEffects: true };
    },
  };
}
