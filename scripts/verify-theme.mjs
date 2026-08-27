import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const vendorPackages = path.join(workspaceRoot, 'vendor', 'semi-design', 'packages');
const foundationRoot = path.join(vendorPackages, 'semi-foundation');
const entryPath = path.join(workspaceRoot, 'packages', 'theme-default', 'src', 'index.scss');
const cssPath = path.join(workspaceRoot, 'packages', 'theme-default', 'dist', 'index.css');
const autoCompleteEntryPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'src',
  'auto-complete.scss',
);
const autoCompleteCssPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'dist',
  'auto-complete.css',
);
const buttonEntryPath = path.join(workspaceRoot, 'packages', 'theme-default', 'src', 'button.scss');
const buttonCssPath = path.join(workspaceRoot, 'packages', 'theme-default', 'dist', 'button.css');
const checkboxEntryPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'src',
  'checkbox.scss',
);
const checkboxCssPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'dist',
  'checkbox.css',
);
const configProviderEntryPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'src',
  'config-provider.scss',
);
const configProviderCssPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'dist',
  'config-provider.css',
);
const dividerEntryPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'src',
  'divider.scss',
);
const dividerCssPath = path.join(workspaceRoot, 'packages', 'theme-default', 'dist', 'divider.css');
const floatButtonEntryPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'src',
  'float-button.scss',
);
const floatButtonCssPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'dist',
  'float-button.css',
);
const iconEntryPath = path.join(workspaceRoot, 'packages', 'theme-default', 'src', 'icon.scss');
const iconCssPath = path.join(workspaceRoot, 'packages', 'theme-default', 'dist', 'icon.css');
const inputEntryPath = path.join(workspaceRoot, 'packages', 'theme-default', 'src', 'input.scss');
const inputCssPath = path.join(workspaceRoot, 'packages', 'theme-default', 'dist', 'input.css');
const inputNumberEntryPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'src',
  'input-number.scss',
);
const inputNumberCssPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'dist',
  'input-number.css',
);
const gridEntryPath = path.join(workspaceRoot, 'packages', 'theme-default', 'src', 'grid.scss');
const gridCssPath = path.join(workspaceRoot, 'packages', 'theme-default', 'dist', 'grid.css');
const layoutEntryPath = path.join(workspaceRoot, 'packages', 'theme-default', 'src', 'layout.scss');
const layoutCssPath = path.join(workspaceRoot, 'packages', 'theme-default', 'dist', 'layout.css');
const pinCodeEntryPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'src',
  'pin-code.scss',
);
const pinCodeCssPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'dist',
  'pin-code.css',
);
const resizableEntryPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'src',
  'resizable.scss',
);
const resizableCssPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'dist',
  'resizable.css',
);
const selectEntryPath = path.join(workspaceRoot, 'packages', 'theme-default', 'src', 'select.scss');
const selectCssPath = path.join(workspaceRoot, 'packages', 'theme-default', 'dist', 'select.css');
const spaceEntryPath = path.join(workspaceRoot, 'packages', 'theme-default', 'src', 'space.scss');
const spaceCssPath = path.join(workspaceRoot, 'packages', 'theme-default', 'dist', 'space.css');
const switchEntryPath = path.join(workspaceRoot, 'packages', 'theme-default', 'src', 'switch.scss');
const switchCssPath = path.join(workspaceRoot, 'packages', 'theme-default', 'dist', 'switch.css');
const tooltipEntryPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'src',
  'tooltip.scss',
);
const tooltipCssPath = path.join(workspaceRoot, 'packages', 'theme-default', 'dist', 'tooltip.css');
const typographyEntryPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'src',
  'typography.scss',
);
const typographyCssPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'dist',
  'typography.css',
);

function compareNames(left, right) {
  if (left.name < right.name) return -1;
  if (left.name > right.name) return 1;
  return 0;
}

function vendorImport(relativePath) {
  return `../../../vendor/semi-design/packages/${relativePath}`;
}

const expectedImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
];

const foundationEntries = (await readdir(foundationRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .sort(compareNames);

for (const entry of foundationEntries) {
  const scssFiles = (await readdir(path.join(foundationRoot, entry.name))).filter((fileName) =>
    fileName.endsWith('.scss'),
  );
  if (scssFiles.length === 0) continue;

  const mainFile =
    entry.name === '_portal'
      ? 'portal.scss'
      : entry.name === 'keyframes'
        ? 'rotate.scss'
        : `${entry.name}.scss`;

  if (!scssFiles.includes(mainFile)) {
    throw new Error(`Foundation 样式入口缺失：${entry.name}/${mainFile}`);
  }

  expectedImports.push(vendorImport(`semi-foundation/${entry.name}/${mainFile}`));
}

expectedImports.push(
  vendorImport('semi-icons/src/styles/icons.scss'),
  vendorImport('semi-foundation/button/iconButton.scss'),
  vendorImport('semi-foundation/input/textarea.scss'),
);

const entrySource = await readFile(entryPath, 'utf8');
const actualImports = [...entrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);

if (JSON.stringify(actualImports) !== JSON.stringify(expectedImports)) {
  const missing = expectedImports.filter((entry) => !actualImports.includes(entry));
  const extra = actualImports.filter((entry) => !expectedImports.includes(entry));
  throw new Error(
    `默认主题入口未与 v2.102.0 编译顺序对齐。缺失：${missing.join(', ') || '无'}；多余：${extra.join(', ') || '无'}`,
  );
}

const css = await readFile(cssPath, 'utf8');
const requiredSelectors = [
  '.semi-autocomplete',
  '.semi-button',
  '.semi-checkbox',
  '.semi-divider',
  '.semi-floatButton',
  '.semi-row',
  '.semi-col-24',
  '.semi-icon',
  '.semi-layout',
  '.semi-resizable-resizable',
  '.semi-select',
  '.semi-space',
  '.semi-switch',
  '.semi-typography',
  '.semi-input-wrapper',
  '.semi-input-number',
  '.semi-pincode-wrapper',
  '.semi-input-textarea-wrapper',
  '.semi-modal',
];

for (const selector of requiredSelectors) {
  if (!css.includes(selector)) {
    throw new Error(`默认主题产物缺少代表性组件选择器：${selector}`);
  }
}

const expectedButtonImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/button/button.scss'),
  vendorImport('semi-foundation/button/iconButton.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const buttonEntrySource = await readFile(buttonEntryPath, 'utf8');
const actualButtonImports = [...buttonEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualButtonImports) !== JSON.stringify(expectedButtonImports)) {
  throw new Error('Button 逐组件样式入口顺序未与固定源码对齐');
}
const buttonCss = await readFile(buttonCssPath, 'utf8');
for (const selector of ['.semi-button', '.semi-button-group', '.semi-button-split']) {
  if (!buttonCss.includes(selector)) {
    throw new Error(`Button 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedCheckboxImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/checkbox/checkbox.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const checkboxEntrySource = await readFile(checkboxEntryPath, 'utf8');
const actualCheckboxImports = [...checkboxEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualCheckboxImports) !== JSON.stringify(expectedCheckboxImports)) {
  throw new Error('Checkbox 逐组件样式入口顺序未与固定源码依赖对齐');
}
const checkboxCss = await readFile(checkboxCssPath, 'utf8');
for (const selector of [
  '.semi-checkbox-inner-checked',
  '.semi-checkbox-indeterminate',
  '.semi-checkbox-cardType_checked',
  '.semi-checkboxGroup-horizontal',
  '.semi-rtl .semi-checkbox',
  '.semi-icon-default',
]) {
  if (!checkboxCss.includes(selector)) {
    throw new Error(`Checkbox 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedDividerImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/divider/divider.scss'),
];
const dividerEntrySource = await readFile(dividerEntryPath, 'utf8');
const actualDividerImports = [...dividerEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualDividerImports) !== JSON.stringify(expectedDividerImports)) {
  throw new Error('Divider 逐组件样式入口顺序未与固定源码对齐');
}
const dividerCss = await readFile(dividerCssPath, 'utf8');
for (const selector of [
  '.semi-divider-horizontal',
  '.semi-divider-vertical',
  '.semi-divider-with-text',
]) {
  if (!dividerCss.includes(selector)) {
    throw new Error(`Divider 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedFloatButtonImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/floatButton/floatButton.scss'),
  vendorImport('semi-foundation/badge/badge.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const floatButtonEntrySource = await readFile(floatButtonEntryPath, 'utf8');
const actualFloatButtonImports = [
  ...floatButtonEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualFloatButtonImports) !== JSON.stringify(expectedFloatButtonImports)) {
  throw new Error('FloatButton 逐组件样式入口顺序未与固定源码对齐');
}
const floatButtonCss = await readFile(floatButtonCssPath, 'utf8');
for (const selector of [
  '.semi-floatButton-body',
  '.semi-floatButtonGroup-item',
  '.semi-badge-count',
]) {
  if (!floatButtonCss.includes(selector)) {
    throw new Error(`FloatButton 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedIconImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const iconEntrySource = await readFile(iconEntryPath, 'utf8');
const actualIconImports = [...iconEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualIconImports) !== JSON.stringify(expectedIconImports)) {
  throw new Error('Icon 逐组件样式入口顺序未与固定源码对齐');
}
const iconCss = await readFile(iconCssPath, 'utf8');
for (const selector of [
  '.semi-icon',
  '.semi-icon-default',
  '.semi-icon-extra-large',
  '.semi-icon-spinning',
]) {
  if (!iconCss.includes(selector)) {
    throw new Error(`Icon 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedInputImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/input/input.scss'),
  vendorImport('semi-foundation/input/textarea.scss'),
  vendorImport('semi-foundation/form/form.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const inputEntrySource = await readFile(inputEntryPath, 'utf8');
const actualInputImports = [...inputEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualInputImports) !== JSON.stringify(expectedInputImports)) {
  throw new Error('Input 逐组件样式入口顺序未与固定源码依赖对齐');
}
const inputCss = await readFile(inputCssPath, 'utf8');
for (const selector of [
  '.semi-input-wrapper',
  '.semi-input-clearbtn',
  '.semi-input-modebtn',
  '.semi-input-textarea-counter',
  '.semi-input-textarea-lineNumber',
  '.semi-input-group',
  '.semi-form-field-label',
  '.semi-rtl .semi-input',
  '.semi-icon-default',
]) {
  if (!inputCss.includes(selector)) {
    throw new Error(`Input 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedInputNumberImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/input/input.scss'),
  vendorImport('semi-foundation/inputNumber/inputNumber.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const inputNumberEntrySource = await readFile(inputNumberEntryPath, 'utf8');
const actualInputNumberImports = [
  ...inputNumberEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualInputNumberImports) !== JSON.stringify(expectedInputNumberImports)) {
  throw new Error('InputNumber 逐组件样式入口顺序未与固定源码依赖对齐');
}
const inputNumberCss = await readFile(inputNumberCssPath, 'utf8');
for (const selector of [
  '.semi-input-number',
  '.semi-input-number-suffix-btns',
  '.semi-input-number-button-up',
  '.semi-input-number-suffix-btns-inner',
  '.semi-rtl .semi-input-number',
  '.semi-icon-extra-small',
]) {
  if (!inputNumberCss.includes(selector)) {
    throw new Error(`InputNumber 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedPinCodeImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/input/input.scss'),
  vendorImport('semi-foundation/pincode/pincode.scss'),
];
const pinCodeEntrySource = await readFile(pinCodeEntryPath, 'utf8');
const actualPinCodeImports = [...pinCodeEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualPinCodeImports) !== JSON.stringify(expectedPinCodeImports)) {
  throw new Error('PinCode 逐组件样式入口顺序未与固定源码依赖对齐');
}
const pinCodeCss = await readFile(pinCodeCssPath, 'utf8');
for (const selector of [
  '.semi-pincode-wrapper',
  '.semi-input-wrapper-small',
  '.semi-input-wrapper-default',
  '.semi-input-wrapper-large',
]) {
  if (!pinCodeCss.includes(selector)) {
    throw new Error(`PinCode 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedGridImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/grid/grid.scss'),
];
const gridEntrySource = await readFile(gridEntryPath, 'utf8');
const actualGridImports = [...gridEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualGridImports) !== JSON.stringify(expectedGridImports)) {
  throw new Error('Grid 逐组件样式入口顺序未与固定源码对齐');
}
const gridCss = await readFile(gridCssPath, 'utf8');
for (const selector of ['.semi-row-flex', '.semi-col-24', '.semi-col-lg-24']) {
  if (!gridCss.includes(selector)) {
    throw new Error(`Grid 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedLayoutImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/layout/layout.scss'),
];
const layoutEntrySource = await readFile(layoutEntryPath, 'utf8');
const actualLayoutImports = [...layoutEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualLayoutImports) !== JSON.stringify(expectedLayoutImports)) {
  throw new Error('Layout 逐组件样式入口顺序未与固定源码对齐');
}
const layoutCss = await readFile(layoutCssPath, 'utf8');
for (const selector of [
  '.semi-layout-header',
  '.semi-layout-content',
  '.semi-layout-sider-children',
  '.semi-layout-has-sider',
]) {
  if (!layoutCss.includes(selector)) {
    throw new Error(`Layout 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedResizableImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/resizable/resizable.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const resizableEntrySource = await readFile(resizableEntryPath, 'utf8');
const actualResizableImports = [
  ...resizableEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualResizableImports) !== JSON.stringify(expectedResizableImports)) {
  throw new Error('Resizable 逐组件样式入口顺序未与固定源码对齐');
}
const resizableCss = await readFile(resizableCssPath, 'utf8');
for (const selector of [
  '.semi-resizable-resizableHandler-topRight',
  '.semi-resizable-group',
  '.semi-resizable-item',
  '.semi-resizable-handler-horizontal',
  '.semi-resizable-background',
  '.semi-icon-default',
]) {
  if (!resizableCss.includes(selector)) {
    throw new Error(`Resizable 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedSpaceImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/space/space.scss'),
];
const spaceEntrySource = await readFile(spaceEntryPath, 'utf8');
const actualSpaceImports = [...spaceEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualSpaceImports) !== JSON.stringify(expectedSpaceImports)) {
  throw new Error('Space 逐组件样式入口顺序未与固定源码对齐');
}
const spaceCss = await readFile(spaceCssPath, 'utf8');
for (const selector of [
  '.semi-space-horizontal',
  '.semi-space-vertical',
  '.semi-space-wrap',
  '.semi-space-tight-horizontal',
]) {
  if (!spaceCss.includes(selector)) {
    throw new Error(`Space 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedSwitchImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/switch/switch.scss'),
  vendorImport('semi-foundation/spin/spin.scss'),
];
const switchEntrySource = await readFile(switchEntryPath, 'utf8');
const actualSwitchImports = [...switchEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualSwitchImports) !== JSON.stringify(expectedSwitchImports)) {
  throw new Error('Switch 逐组件样式入口顺序未与固定源码依赖对齐');
}
const switchCss = await readFile(switchCssPath, 'utf8');
for (const selector of [
  '.semi-switch-checked',
  '.semi-switch-native-control',
  '.semi-switch-loading-spin',
  '.semi-spin-wrapper',
  '.semi-rtl .semi-switch',
]) {
  if (!switchCss.includes(selector)) {
    throw new Error(`Switch 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedTooltipImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/_portal/portal.scss'),
  vendorImport('semi-foundation/tooltip/tooltip.scss'),
];
const tooltipEntrySource = await readFile(tooltipEntryPath, 'utf8');
const actualTooltipImports = [...tooltipEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualTooltipImports) !== JSON.stringify(expectedTooltipImports)) {
  throw new Error('Tooltip 逐组件样式入口顺序未与固定源码依赖对齐');
}
const tooltipCss = await readFile(tooltipCssPath, 'utf8');
for (const selector of [
  '.semi-portal-inner',
  '.semi-tooltip-wrapper',
  '.semi-tooltip-icon-arrow',
  '.semi-tooltip-animation-show',
  '.semi-portal-rtl .semi-tooltip-wrapper',
]) {
  if (!tooltipCss.includes(selector)) {
    throw new Error(`Tooltip 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedAutoCompleteImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/_portal/portal.scss'),
  vendorImport('semi-foundation/tooltip/tooltip.scss'),
  vendorImport('semi-foundation/popover/popover.scss'),
  vendorImport('semi-foundation/input/input.scss'),
  vendorImport('semi-foundation/spin/spin.scss'),
  vendorImport('semi-foundation/autoComplete/autoComplete.scss'),
];
const autoCompleteEntrySource = await readFile(autoCompleteEntryPath, 'utf8');
const actualAutoCompleteImports = [
  ...autoCompleteEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualAutoCompleteImports) !== JSON.stringify(expectedAutoCompleteImports)) {
  throw new Error('AutoComplete 逐组件样式入口顺序未与固定源码依赖对齐');
}
const autoCompleteCss = await readFile(autoCompleteCssPath, 'utf8');
for (const selector of [
  '.semi-autocomplete',
  '.semi-autocomplete-option-list',
  '.semi-autocomplete-option-focused',
  '.semi-input-wrapper',
  '.semi-popover-wrapper',
  '.semi-spin-wrapper',
  '.semi-rtl .semi-autocomplete',
]) {
  if (!autoCompleteCss.includes(selector)) {
    throw new Error(`AutoComplete 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedSelectImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/_portal/portal.scss'),
  vendorImport('semi-foundation/tooltip/tooltip.scss'),
  vendorImport('semi-foundation/popover/popover.scss'),
  vendorImport('semi-foundation/input/input.scss'),
  vendorImport('semi-foundation/tag/tag.scss'),
  vendorImport('semi-foundation/overflowList/overflowList.scss'),
  vendorImport('semi-foundation/spin/spin.scss'),
  vendorImport('semi-foundation/select/select.scss'),
];
const selectEntrySource = await readFile(selectEntryPath, 'utf8');
const actualSelectImports = [...selectEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualSelectImports) !== JSON.stringify(expectedSelectImports)) {
  throw new Error('Select 逐组件样式入口顺序未与固定源码依赖对齐');
}
const selectCss = await readFile(selectCssPath, 'utf8');
for (const selector of [
  '.semi-select',
  '.semi-select-option-list',
  '.semi-select-option-selected',
  '.semi-input-wrapper',
  '.semi-tag',
  '.semi-popover-wrapper',
  '.semi-spin-wrapper',
  '.semi-rtl .semi-select',
]) {
  if (!selectCss.includes(selector)) {
    throw new Error(`Select 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedTypographyImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/_portal/portal.scss'),
  vendorImport('semi-foundation/popover/popover.scss'),
  vendorImport('semi-foundation/tooltip/tooltip.scss'),
  vendorImport('semi-foundation/typography/typography.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const typographyEntrySource = await readFile(typographyEntryPath, 'utf8');
const actualTypographyImports = [
  ...typographyEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualTypographyImports) !== JSON.stringify(expectedTypographyImports)) {
  throw new Error('Typography 逐组件样式入口顺序未与固定源码依赖对齐');
}
const typographyCss = await readFile(typographyCssPath, 'utf8');
for (const selector of [
  '.semi-typography-h1',
  '.semi-typography-paragraph',
  '.semi-typography-action-copy',
  '.semi-typography-ellipsis-multiple-line',
  '.semi-tooltip-wrapper',
  '.semi-popover-wrapper',
  '.semi-icon-default',
]) {
  if (!typographyCss.includes(selector)) {
    throw new Error(`Typography 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedConfigProviderImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
];
const configProviderEntrySource = await readFile(configProviderEntryPath, 'utf8');
const actualConfigProviderImports = [
  ...configProviderEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualConfigProviderImports) !== JSON.stringify(expectedConfigProviderImports)) {
  throw new Error('ConfigProvider 逐组件样式入口未与固定源码的无组件 SCSS 契约对齐');
}
const configProviderCss = await readFile(configProviderCssPath, 'utf8');
if (!configProviderCss.includes('--semi-color-primary')) {
  throw new Error('ConfigProvider 逐组件样式产物缺少默认主题 Token');
}

process.stdout.write(
  `默认主题入口与 AutoComplete/Button/Checkbox/ConfigProvider/Divider/FloatButton/Grid/Icon/Input/InputNumber/PinCode/Layout/Resizable/Select/Space/Switch/Tooltip/Typography 逐组件产物通过：${expectedImports.length} 个根入口，${css.length + autoCompleteCss.length + buttonCss.length + checkboxCss.length + configProviderCss.length + dividerCss.length + floatButtonCss.length + gridCss.length + iconCss.length + inputCss.length + inputNumberCss.length + pinCodeCss.length + layoutCss.length + resizableCss.length + selectCss.length + spaceCss.length + switchCss.length + tooltipCss.length + typographyCss.length} 字节 CSS\n`,
);
