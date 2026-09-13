import type { Plugin } from 'vite';

/** Pinned legacy Prism extensions rely on a global core and ordered grammars. */
export function pinnedPrismPlugin(): Plugin {
  return {
    name: 'pinned-prism-language-order',
    enforce: 'pre',
    transform(code, id) {
      const path = id.split('?')[0]?.replaceAll('\\', '/');
      if (
        !path ||
        !/\/prismjs\/(?:components\/prism-(jsx|tsx)\.js|plugins\/line-numbers\/prism-line-numbers\.min\.js)$/.test(
          path,
        )
      ) {
        return null;
      }
      const core = path.includes('/line-numbers/') ? '../../prism.js' : '../prism.js';
      const jsx = path.endsWith('/prism-tsx.js') ? "import './prism-jsx.js';\n" : '';
      return { code: `import Prism from '${core}';\n${jsx}${code}`, map: null };
    },
  };
}
