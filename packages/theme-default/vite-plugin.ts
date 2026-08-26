import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
import sass from 'sass';

export const virtualButtonStyleId = 'virtual:workspace-button-styles.css';
export const virtualDividerStyleId = 'virtual:workspace-divider-styles.css';
export const virtualFloatButtonStyleId = 'virtual:workspace-float-button-styles.css';
export const virtualIconStyleId = 'virtual:workspace-icon-styles.css';
export const virtualGridStyleId = 'virtual:workspace-grid-styles.css';
export const virtualLayoutStyleId = 'virtual:workspace-layout-styles.css';
export const virtualSpaceStyleId = 'virtual:workspace-space-styles.css';
const resolvedVirtualButtonStyleId = `\0${virtualButtonStyleId}`;
const resolvedVirtualDividerStyleId = `\0${virtualDividerStyleId}`;
const resolvedVirtualFloatButtonStyleId = `\0${virtualFloatButtonStyleId}`;
const resolvedVirtualIconStyleId = `\0${virtualIconStyleId}`;
const resolvedVirtualGridStyleId = `\0${virtualGridStyleId}`;
const resolvedVirtualLayoutStyleId = `\0${virtualLayoutStyleId}`;
const resolvedVirtualSpaceStyleId = `\0${virtualSpaceStyleId}`;
const buttonStyleEntry = fileURLToPath(new URL('./src/button.scss', import.meta.url));
const dividerStyleEntry = fileURLToPath(new URL('./src/divider.scss', import.meta.url));
const floatButtonStyleEntry = fileURLToPath(new URL('./src/float-button.scss', import.meta.url));
const iconStyleEntry = fileURLToPath(new URL('./src/icon.scss', import.meta.url));
const gridStyleEntry = fileURLToPath(new URL('./src/grid.scss', import.meta.url));
const layoutStyleEntry = fileURLToPath(new URL('./src/layout.scss', import.meta.url));
const spaceStyleEntry = fileURLToPath(new URL('./src/space.scss', import.meta.url));

const styleEntries = new Map([
  [resolvedVirtualButtonStyleId, buttonStyleEntry],
  [resolvedVirtualDividerStyleId, dividerStyleEntry],
  [resolvedVirtualFloatButtonStyleId, floatButtonStyleEntry],
  [resolvedVirtualIconStyleId, iconStyleEntry],
  [resolvedVirtualGridStyleId, gridStyleEntry],
  [resolvedVirtualLayoutStyleId, layoutStyleEntry],
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
      if (source === virtualFloatButtonStyleId) return resolvedVirtualFloatButtonStyleId;
      if (source === virtualIconStyleId) return resolvedVirtualIconStyleId;
      if (source === virtualGridStyleId) return resolvedVirtualGridStyleId;
      if (source === virtualLayoutStyleId) return resolvedVirtualLayoutStyleId;
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
