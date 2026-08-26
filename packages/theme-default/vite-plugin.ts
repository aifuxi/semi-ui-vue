import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
import sass from 'sass';

export const virtualButtonStyleId = 'virtual:workspace-button-styles.css';
export const virtualDividerStyleId = 'virtual:workspace-divider-styles.css';
export const virtualIconStyleId = 'virtual:workspace-icon-styles.css';
export const virtualSpaceStyleId = 'virtual:workspace-space-styles.css';
const resolvedVirtualButtonStyleId = `\0${virtualButtonStyleId}`;
const resolvedVirtualDividerStyleId = `\0${virtualDividerStyleId}`;
const resolvedVirtualIconStyleId = `\0${virtualIconStyleId}`;
const resolvedVirtualSpaceStyleId = `\0${virtualSpaceStyleId}`;
const buttonStyleEntry = fileURLToPath(new URL('./src/button.scss', import.meta.url));
const dividerStyleEntry = fileURLToPath(new URL('./src/divider.scss', import.meta.url));
const iconStyleEntry = fileURLToPath(new URL('./src/icon.scss', import.meta.url));
const spaceStyleEntry = fileURLToPath(new URL('./src/space.scss', import.meta.url));

const styleEntries = new Map([
  [resolvedVirtualButtonStyleId, buttonStyleEntry],
  [resolvedVirtualDividerStyleId, dividerStyleEntry],
  [resolvedVirtualIconStyleId, iconStyleEntry],
  [resolvedVirtualSpaceStyleId, spaceStyleEntry],
]);

/** Compile pinned legacy SCSS without asking Vite 8 to call a removed modern Sass API. */
export function compilePinnedComponentStyles(): Plugin {
  return {
    name: 'compile-pinned-component-styles',
    enforce: 'pre',
    resolveId(source) {
      if (source === virtualButtonStyleId) return resolvedVirtualButtonStyleId;
      if (source === virtualDividerStyleId) return resolvedVirtualDividerStyleId;
      if (source === virtualIconStyleId) return resolvedVirtualIconStyleId;
      if (source === virtualSpaceStyleId) return resolvedVirtualSpaceStyleId;
      return null;
    },
    load(id) {
      const styleEntry = styleEntries.get(id);
      if (!styleEntry) return null;
      return sass
        .renderSync({
          file: styleEntry,
          outputStyle: 'expanded',
        })
        .css.toString();
    },
  };
}
