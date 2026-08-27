import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
import sass from 'sass';

export const virtualAutoCompleteStyleId = 'virtual:workspace-auto-complete-styles.css';
export const virtualButtonStyleId = 'virtual:workspace-button-styles.css';
export const virtualCheckboxStyleId = 'virtual:workspace-checkbox-styles.css';
export const virtualConfigProviderStyleId = 'virtual:workspace-config-provider-styles.css';
export const virtualDividerStyleId = 'virtual:workspace-divider-styles.css';
export const virtualFloatButtonStyleId = 'virtual:workspace-float-button-styles.css';
export const virtualIconStyleId = 'virtual:workspace-icon-styles.css';
export const virtualInputStyleId = 'virtual:workspace-input-styles.css';
export const virtualInputNumberStyleId = 'virtual:workspace-input-number-styles.css';
export const virtualGridStyleId = 'virtual:workspace-grid-styles.css';
export const virtualLayoutStyleId = 'virtual:workspace-layout-styles.css';
export const virtualPinCodeStyleId = 'virtual:workspace-pin-code-styles.css';
export const virtualResizableStyleId = 'virtual:workspace-resizable-styles.css';
export const virtualSelectStyleId = 'virtual:workspace-select-styles.css';
export const virtualSpaceStyleId = 'virtual:workspace-space-styles.css';
export const virtualSwitchStyleId = 'virtual:workspace-switch-styles.css';
export const virtualTooltipStyleId = 'virtual:workspace-tooltip-styles.css';
export const virtualTypographyStyleId = 'virtual:workspace-typography-styles.css';
const resolvedVirtualAutoCompleteStyleId = `\0${virtualAutoCompleteStyleId}`;
const resolvedVirtualButtonStyleId = `\0${virtualButtonStyleId}`;
const resolvedVirtualCheckboxStyleId = `\0${virtualCheckboxStyleId}`;
const resolvedVirtualConfigProviderStyleId = `\0${virtualConfigProviderStyleId}`;
const resolvedVirtualDividerStyleId = `\0${virtualDividerStyleId}`;
const resolvedVirtualFloatButtonStyleId = `\0${virtualFloatButtonStyleId}`;
const resolvedVirtualIconStyleId = `\0${virtualIconStyleId}`;
const resolvedVirtualInputStyleId = `\0${virtualInputStyleId}`;
const resolvedVirtualInputNumberStyleId = `\0${virtualInputNumberStyleId}`;
const resolvedVirtualGridStyleId = `\0${virtualGridStyleId}`;
const resolvedVirtualLayoutStyleId = `\0${virtualLayoutStyleId}`;
const resolvedVirtualPinCodeStyleId = `\0${virtualPinCodeStyleId}`;
const resolvedVirtualResizableStyleId = `\0${virtualResizableStyleId}`;
const resolvedVirtualSelectStyleId = `\0${virtualSelectStyleId}`;
const resolvedVirtualSpaceStyleId = `\0${virtualSpaceStyleId}`;
const resolvedVirtualSwitchStyleId = `\0${virtualSwitchStyleId}`;
const resolvedVirtualTooltipStyleId = `\0${virtualTooltipStyleId}`;
const resolvedVirtualTypographyStyleId = `\0${virtualTypographyStyleId}`;
const autoCompleteStyleEntry = fileURLToPath(new URL('./src/auto-complete.scss', import.meta.url));
const buttonStyleEntry = fileURLToPath(new URL('./src/button.scss', import.meta.url));
const checkboxStyleEntry = fileURLToPath(new URL('./src/checkbox.scss', import.meta.url));
const configProviderStyleEntry = fileURLToPath(
  new URL('./src/config-provider.scss', import.meta.url),
);
const dividerStyleEntry = fileURLToPath(new URL('./src/divider.scss', import.meta.url));
const floatButtonStyleEntry = fileURLToPath(new URL('./src/float-button.scss', import.meta.url));
const iconStyleEntry = fileURLToPath(new URL('./src/icon.scss', import.meta.url));
const inputStyleEntry = fileURLToPath(new URL('./src/input.scss', import.meta.url));
const inputNumberStyleEntry = fileURLToPath(new URL('./src/input-number.scss', import.meta.url));
const gridStyleEntry = fileURLToPath(new URL('./src/grid.scss', import.meta.url));
const layoutStyleEntry = fileURLToPath(new URL('./src/layout.scss', import.meta.url));
const pinCodeStyleEntry = fileURLToPath(new URL('./src/pin-code.scss', import.meta.url));
const resizableStyleEntry = fileURLToPath(new URL('./src/resizable.scss', import.meta.url));
const selectStyleEntry = fileURLToPath(new URL('./src/select.scss', import.meta.url));
const spaceStyleEntry = fileURLToPath(new URL('./src/space.scss', import.meta.url));
const switchStyleEntry = fileURLToPath(new URL('./src/switch.scss', import.meta.url));
const tooltipStyleEntry = fileURLToPath(new URL('./src/tooltip.scss', import.meta.url));
const typographyStyleEntry = fileURLToPath(new URL('./src/typography.scss', import.meta.url));

const styleEntries = new Map([
  [resolvedVirtualAutoCompleteStyleId, autoCompleteStyleEntry],
  [resolvedVirtualButtonStyleId, buttonStyleEntry],
  [resolvedVirtualCheckboxStyleId, checkboxStyleEntry],
  [resolvedVirtualConfigProviderStyleId, configProviderStyleEntry],
  [resolvedVirtualDividerStyleId, dividerStyleEntry],
  [resolvedVirtualFloatButtonStyleId, floatButtonStyleEntry],
  [resolvedVirtualIconStyleId, iconStyleEntry],
  [resolvedVirtualInputStyleId, inputStyleEntry],
  [resolvedVirtualInputNumberStyleId, inputNumberStyleEntry],
  [resolvedVirtualGridStyleId, gridStyleEntry],
  [resolvedVirtualLayoutStyleId, layoutStyleEntry],
  [resolvedVirtualPinCodeStyleId, pinCodeStyleEntry],
  [resolvedVirtualResizableStyleId, resizableStyleEntry],
  [resolvedVirtualSelectStyleId, selectStyleEntry],
  [resolvedVirtualSpaceStyleId, spaceStyleEntry],
  [resolvedVirtualSwitchStyleId, switchStyleEntry],
  [resolvedVirtualTooltipStyleId, tooltipStyleEntry],
  [resolvedVirtualTypographyStyleId, typographyStyleEntry],
]);

/** Compile pinned legacy SCSS without asking Vite 8 to call a removed modern Sass API. */
export function compilePinnedComponentStyles(): Plugin {
  return {
    name: 'compile-pinned-component-styles',
    enforce: 'pre',
    resolveId(source) {
      if (source === virtualAutoCompleteStyleId) return resolvedVirtualAutoCompleteStyleId;
      if (source === virtualButtonStyleId) return resolvedVirtualButtonStyleId;
      if (source === virtualCheckboxStyleId) return resolvedVirtualCheckboxStyleId;
      if (source === virtualConfigProviderStyleId) return resolvedVirtualConfigProviderStyleId;
      if (source === virtualDividerStyleId) return resolvedVirtualDividerStyleId;
      if (source === virtualFloatButtonStyleId) return resolvedVirtualFloatButtonStyleId;
      if (source === virtualIconStyleId) return resolvedVirtualIconStyleId;
      if (source === virtualInputStyleId) return resolvedVirtualInputStyleId;
      if (source === virtualInputNumberStyleId) return resolvedVirtualInputNumberStyleId;
      if (source === virtualGridStyleId) return resolvedVirtualGridStyleId;
      if (source === virtualLayoutStyleId) return resolvedVirtualLayoutStyleId;
      if (source === virtualPinCodeStyleId) return resolvedVirtualPinCodeStyleId;
      if (source === virtualResizableStyleId) return resolvedVirtualResizableStyleId;
      if (source === virtualSelectStyleId) return resolvedVirtualSelectStyleId;
      if (source === virtualSpaceStyleId) return resolvedVirtualSpaceStyleId;
      if (source === virtualSwitchStyleId) return resolvedVirtualSwitchStyleId;
      if (source === virtualTooltipStyleId) return resolvedVirtualTooltipStyleId;
      if (source === virtualTypographyStyleId) return resolvedVirtualTypographyStyleId;
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
