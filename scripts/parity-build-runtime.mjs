// Legacy Prism extensions use an implicit global; make core initialization explicit.
export function parityPrismOrder() {
  return {
    name: 'parity-prism-language-order',
    setup(api) {
      api.transform(
        {
          test: /[\\/]prismjs[\\/](?:components[\\/]prism-(jsx|tsx)\.js|plugins[\\/]line-numbers[\\/]prism-line-numbers\.min\.js)$/,
        },
        ({ code, resourcePath }) => ({
          code: `import Prism from '${resourcePath.includes('line-numbers') ? '../../prism.js' : '../prism.js'}';\n${resourcePath.endsWith('prism-tsx.js') ? "import './prism-jsx.js';\n" : ''}${code}`,
          map: null,
        }),
      );
    },
  };
}

export function parityWorkerEntry() {
  return {
    name: 'preserve-pinned-json-worker-handler',
    setup(api) {
      api.modifyRspackConfig((config) => {
        config.module ??= {};
        config.module.rules ??= [];
        config.module.rules.push({
          test: /[\\/]semi-json-viewer-core[\\/]src[\\/]worker[\\/]json\.worker\.ts$/,
          sideEffects: true,
        });
      });
    },
  };
}
