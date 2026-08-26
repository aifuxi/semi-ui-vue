import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
import sass from 'sass';

export const virtualButtonStyleId = 'virtual:workspace-button-styles.css';
const resolvedVirtualButtonStyleId = `\0${virtualButtonStyleId}`;
const buttonStyleEntry = fileURLToPath(new URL('./src/button.scss', import.meta.url));

/** Compile pinned legacy SCSS without asking Vite 8 to call a removed modern Sass API. */
export function compilePinnedButtonStyles(): Plugin {
  return {
    name: 'compile-pinned-button-styles',
    enforce: 'pre',
    resolveId(source) {
      return source === virtualButtonStyleId ? resolvedVirtualButtonStyleId : null;
    },
    load(id) {
      if (id !== resolvedVirtualButtonStyleId) return null;
      return sass
        .renderSync({
          file: buttonStyleEntry,
          outputStyle: 'expanded',
        })
        .css.toString();
    },
  };
}
