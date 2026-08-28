import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const vendorPackages = path.join(workspaceRoot, 'vendor', 'semi-design', 'packages');
const foundationRoot = path.join(vendorPackages, 'semi-foundation');
const entryPath = path.join(workspaceRoot, 'packages', 'theme-default', 'src', 'index.scss');
const cssPath = path.join(workspaceRoot, 'packages', 'theme-default', 'dist', 'index.css');
const anchorEntryPath = path.join(workspaceRoot, 'packages', 'theme-default', 'src', 'anchor.scss');
const anchorCssPath = path.join(workspaceRoot, 'packages', 'theme-default', 'dist', 'anchor.css');
const avatarEntryPath = path.join(workspaceRoot, 'packages', 'theme-default', 'src', 'avatar.scss');
const avatarCssPath = path.join(workspaceRoot, 'packages', 'theme-default', 'dist', 'avatar.css');
const badgeEntryPath = path.join(workspaceRoot, 'packages', 'theme-default', 'src', 'badge.scss');
const badgeCssPath = path.join(workspaceRoot, 'packages', 'theme-default', 'dist', 'badge.css');
const calendarEntryPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'src',
  'calendar.scss',
);
const calendarCssPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'dist',
  'calendar.css',
);
const cardEntryPath = path.join(workspaceRoot, 'packages', 'theme-default', 'src', 'card.scss');
const cardCssPath = path.join(workspaceRoot, 'packages', 'theme-default', 'dist', 'card.css');
const carouselEntryPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'src',
  'carousel.scss',
);
const carouselCssPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'dist',
  'carousel.css',
);
const collapsibleEntryPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'src',
  'collapsible.scss',
);
const collapsibleCssPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'dist',
  'collapsible.css',
);
const descriptionsEntryPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'src',
  'descriptions.scss',
);
const descriptionsCssPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'dist',
  'descriptions.css',
);
const backTopEntryPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'src',
  'back-top.scss',
);
const backTopCssPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'dist',
  'back-top.css',
);
const breadcrumbEntryPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'src',
  'breadcrumb.scss',
);
const breadcrumbCssPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'dist',
  'breadcrumb.css',
);
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
const paginationEntryPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'src',
  'pagination.scss',
);
const paginationCssPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'dist',
  'pagination.css',
);
const radioEntryPath = path.join(workspaceRoot, 'packages', 'theme-default', 'src', 'radio.scss');
const radioCssPath = path.join(workspaceRoot, 'packages', 'theme-default', 'dist', 'radio.css');
const ratingEntryPath = path.join(workspaceRoot, 'packages', 'theme-default', 'src', 'rating.scss');
const ratingCssPath = path.join(workspaceRoot, 'packages', 'theme-default', 'dist', 'rating.css');
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
const sliderEntryPath = path.join(workspaceRoot, 'packages', 'theme-default', 'src', 'slider.scss');
const sliderCssPath = path.join(workspaceRoot, 'packages', 'theme-default', 'dist', 'slider.css');
const spaceEntryPath = path.join(workspaceRoot, 'packages', 'theme-default', 'src', 'space.scss');
const spaceCssPath = path.join(workspaceRoot, 'packages', 'theme-default', 'dist', 'space.css');
const stepsEntryPath = path.join(workspaceRoot, 'packages', 'theme-default', 'src', 'steps.scss');
const stepsCssPath = path.join(workspaceRoot, 'packages', 'theme-default', 'dist', 'steps.css');
const tabsEntryPath = path.join(workspaceRoot, 'packages', 'theme-default', 'src', 'tabs.scss');
const tabsCssPath = path.join(workspaceRoot, 'packages', 'theme-default', 'dist', 'tabs.css');
const treeEntryPath = path.join(workspaceRoot, 'packages', 'theme-default', 'src', 'tree.scss');
const treeCssPath = path.join(workspaceRoot, 'packages', 'theme-default', 'dist', 'tree.css');
const switchEntryPath = path.join(workspaceRoot, 'packages', 'theme-default', 'src', 'switch.scss');
const switchCssPath = path.join(workspaceRoot, 'packages', 'theme-default', 'dist', 'switch.css');
const tagInputEntryPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'src',
  'tag-input.scss',
);
const tagInputCssPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'dist',
  'tag-input.css',
);
const timePickerEntryPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'src',
  'time-picker.scss',
);
const timePickerCssPath = path.join(
  workspaceRoot,
  'packages',
  'theme-default',
  'dist',
  'time-picker.css',
);
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
  '.semi-anchor',
  '.semi-backtop',
  '.semi-breadcrumb',
  '.semi-autocomplete',
  '.semi-button',
  '.semi-checkbox',
  '.semi-card',
  '.semi-carousel',
  '.semi-collapsible-transition',
  '.semi-descriptions-horizontal',
  '.semi-divider',
  '.semi-floatButton',
  '.semi-row',
  '.semi-col-24',
  '.semi-icon',
  '.semi-layout',
  '.semi-resizable-resizable',
  '.semi-select',
  '.semi-space',
  '.semi-steps',
  '.semi-tabs',
  '.semi-switch',
  '.semi-tagInput',
  '.semi-typography',
  '.semi-input-wrapper',
  '.semi-input-number',
  '.semi-pincode-wrapper',
  '.semi-page',
  '.semi-radioGroup',
  '.semi-rating',
  '.semi-input-textarea-wrapper',
  '.semi-modal',
];

for (const selector of requiredSelectors) {
  if (!css.includes(selector)) {
    throw new Error(`默认主题产物缺少代表性组件选择器：${selector}`);
  }
}

const expectedAnchorImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/_portal/portal.scss'),
  vendorImport('semi-foundation/popover/popover.scss'),
  vendorImport('semi-foundation/tooltip/tooltip.scss'),
  vendorImport('semi-foundation/typography/typography.scss'),
  vendorImport('semi-foundation/anchor/anchor.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const anchorEntrySource = await readFile(anchorEntryPath, 'utf8');
const actualAnchorImports = [...anchorEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualAnchorImports) !== JSON.stringify(expectedAnchorImports)) {
  throw new Error('Anchor 逐组件样式入口顺序未与固定源码依赖对齐');
}
const anchorCss = await readFile(anchorCssPath, 'utf8');
for (const selector of [
  '.semi-anchor-link-title-active',
  '.semi-anchor-link-title-disabled',
  '.semi-anchor-link-tooltip',
  '.semi-rtl .semi-anchor',
  '.semi-typography-ellipsis',
  '.semi-tooltip-wrapper',
]) {
  if (!anchorCss.includes(selector)) {
    throw new Error(`Anchor 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedBackTopImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/button/button.scss'),
  vendorImport('semi-foundation/button/iconButton.scss'),
  vendorImport('semi-foundation/backtop/backtop.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const backTopEntrySource = await readFile(backTopEntryPath, 'utf8');
const actualBackTopImports = [...backTopEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualBackTopImports) !== JSON.stringify(expectedBackTopImports)) {
  throw new Error('BackTop 逐组件样式入口顺序未与固定源码依赖对齐');
}
const backTopCss = await readFile(backTopCssPath, 'utf8');
for (const selector of [
  '.semi-backtop',
  '.semi-rtl .semi-backtop',
  '.semi-button-with-icon-only',
  '.semi-icon-default',
]) {
  if (!backTopCss.includes(selector)) {
    throw new Error(`BackTop 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedBreadcrumbImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/_portal/portal.scss'),
  vendorImport('semi-foundation/tooltip/tooltip.scss'),
  vendorImport('semi-foundation/popover/popover.scss'),
  vendorImport('semi-foundation/typography/typography.scss'),
  vendorImport('semi-foundation/breadcrumb/breadcrumb.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const breadcrumbEntrySource = await readFile(breadcrumbEntryPath, 'utf8');
const actualBreadcrumbImports = [
  ...breadcrumbEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualBreadcrumbImports) !== JSON.stringify(expectedBreadcrumbImports)) {
  throw new Error('Breadcrumb 逐组件样式入口顺序未与固定源码依赖对齐');
}
const breadcrumbCss = await readFile(breadcrumbCssPath, 'utf8');
for (const selector of [
  '.semi-breadcrumb-wrapper-compact',
  '.semi-breadcrumb-item-active',
  '.semi-breadcrumb-collapse',
  '.semi-rtl .semi-breadcrumb-wrapper',
  '.semi-typography-ellipsis',
  '.semi-popover-wrapper',
  '.semi-icon-default',
]) {
  if (!breadcrumbCss.includes(selector)) {
    throw new Error(`Breadcrumb 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedPaginationImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/_portal/portal.scss'),
  vendorImport('semi-foundation/tooltip/tooltip.scss'),
  vendorImport('semi-foundation/popover/popover.scss'),
  vendorImport('semi-foundation/input/input.scss'),
  vendorImport('semi-foundation/inputNumber/inputNumber.scss'),
  vendorImport('semi-foundation/tag/tag.scss'),
  vendorImport('semi-foundation/overflowList/overflowList.scss'),
  vendorImport('semi-foundation/spin/spin.scss'),
  vendorImport('semi-foundation/select/select.scss'),
  vendorImport('semi-foundation/pagination/pagination.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const paginationEntrySource = await readFile(paginationEntryPath, 'utf8');
const actualPaginationImports = [
  ...paginationEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualPaginationImports) !== JSON.stringify(expectedPaginationImports)) {
  throw new Error('Pagination 逐组件样式入口顺序未与固定源码依赖对齐');
}
const paginationCss = await readFile(paginationCssPath, 'utf8');
for (const selector of [
  '.semi-page-item-active',
  '.semi-page-quickjump',
  '.semi-page-rest-list',
  '.semi-rtl .semi-page',
  '.semi-select-selection',
  '.semi-input-number',
  '.semi-popover-wrapper',
  '.semi-icon-default',
]) {
  if (!paginationCss.includes(selector)) {
    throw new Error(`Pagination 逐组件样式产物缺少选择器：${selector}`);
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

const expectedRadioImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/radio/radio.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const radioEntrySource = await readFile(radioEntryPath, 'utf8');
const actualRadioImports = [...radioEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualRadioImports) !== JSON.stringify(expectedRadioImports)) {
  throw new Error('Radio 逐组件样式入口顺序未与固定源码依赖对齐');
}
const radioCss = await readFile(radioCssPath, 'utf8');
for (const selector of [
  '.semi-radio-inner-checked',
  '.semi-radio-buttonRadioGroup-large',
  '.semi-radio-cardRadioGroup_checked',
  '.semi-radioGroup-horizontal',
  '.semi-rtl .semi-radio',
  '.semi-icon-default',
]) {
  if (!radioCss.includes(selector)) {
    throw new Error(`Radio 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedRatingImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/rating/rating.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const ratingEntrySource = await readFile(ratingEntryPath, 'utf8');
const actualRatingImports = [...ratingEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualRatingImports) !== JSON.stringify(expectedRatingImports)) {
  throw new Error('Rating 逐组件样式入口顺序未与固定源码依赖对齐');
}
const ratingCss = await readFile(ratingCssPath, 'utf8');
for (const selector of [
  '.semi-rating-star-half',
  '.semi-rating-star-full',
  '.semi-rating-star-small',
  '.semi-rating-disabled',
  '.semi-rtl .semi-rating',
  '.semi-icon-extra-large',
]) {
  if (!ratingCss.includes(selector)) {
    throw new Error(`Rating 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedSliderImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/_portal/portal.scss'),
  vendorImport('semi-foundation/tooltip/tooltip.scss'),
  vendorImport('semi-foundation/slider/slider.scss'),
];
const sliderEntrySource = await readFile(sliderEntryPath, 'utf8');
const actualSliderImports = [...sliderEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualSliderImports) !== JSON.stringify(expectedSliderImports)) {
  throw new Error('Slider 逐组件样式入口顺序未与固定源码依赖对齐');
}
const sliderCss = await readFile(sliderCssPath, 'utf8');
for (const selector of [
  '.semi-slider-wrapper',
  '.semi-slider-handle-clicked',
  '.semi-slider-vertical-wrapper',
  '.semi-slider-disabled',
  '.semi-rtl .semi-slider',
  '.semi-tooltip-wrapper',
]) {
  if (!sliderCss.includes(selector)) {
    throw new Error(`Slider 逐组件样式产物缺少选择器：${selector}`);
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

const expectedStepsImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/grid/grid.scss'),
  vendorImport('semi-foundation/steps/steps.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const stepsEntrySource = await readFile(stepsEntryPath, 'utf8');
const actualStepsImports = [...stepsEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualStepsImports) !== JSON.stringify(expectedStepsImports)) {
  throw new Error('Steps 逐组件样式入口顺序未与固定源码依赖对齐');
}
const stepsCss = await readFile(stepsCssPath, 'utf8');
for (const selector of [
  '.semi-steps-item-process',
  '.semi-steps-basic',
  '.semi-steps-nav',
  '.semi-steps-vertical',
  '.semi-row-flex',
  '.semi-rtl .semi-steps',
  '.semi-icon-default',
]) {
  if (!stepsCss.includes(selector)) {
    throw new Error(`Steps 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedTabsImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/_portal/portal.scss'),
  vendorImport('semi-foundation/tooltip/tooltip.scss'),
  vendorImport('semi-foundation/dropdown/dropdown.scss'),
  vendorImport('semi-foundation/button/button.scss'),
  vendorImport('semi-foundation/overflowList/overflowList.scss'),
  vendorImport('semi-foundation/tabs/tabs.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const tabsEntrySource = await readFile(tabsEntryPath, 'utf8');
const actualTabsImports = [...tabsEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualTabsImports) !== JSON.stringify(expectedTabsImports)) {
  throw new Error('Tabs 逐组件样式入口顺序未与固定源码依赖对齐');
}
const tabsCss = await readFile(tabsCssPath, 'utf8');
for (const selector of [
  '.semi-tabs-tab-active',
  '.semi-tabs-bar-card',
  '.semi-tabs-bar-button',
  '.semi-tabs-bar-slash',
  '.semi-tabs-bar-overflow-list',
  '.semi-dropdown-menu',
  '.semi-rtl .semi-tabs',
  '.semi-icon-default',
]) {
  if (!tabsCss.includes(selector)) {
    throw new Error(`Tabs 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedTreeImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/checkbox/checkbox.scss'),
  vendorImport('semi-foundation/collapsible/collapsible.scss'),
  vendorImport('semi-foundation/highlight/highlight.scss'),
  vendorImport('semi-foundation/input/input.scss'),
  vendorImport('semi-foundation/spin/spin.scss'),
  vendorImport('semi-foundation/tree/tree.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const treeEntrySource = await readFile(treeEntryPath, 'utf8');
const actualTreeImports = [...treeEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualTreeImports) !== JSON.stringify(expectedTreeImports)) {
  throw new Error('Tree 逐组件样式入口顺序未与固定源码依赖对齐');
}
const treeCss = await readFile(treeCssPath, 'utf8');
for (const selector of [
  '.semi-tree-option-list-block',
  '.semi-tree-option-selected',
  '.semi-tree-option-indent-show-line',
  '.semi-tree-option-draggable',
  '.semi-checkbox',
  '.semi-collapsible-transition',
  '.semi-input-wrapper',
  '.semi-rtl .semi-tree',
  '.semi-icon-default',
]) {
  if (!treeCss.includes(selector)) {
    throw new Error(`Tree 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedAvatarImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/avatar/avatar.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const avatarEntrySource = await readFile(avatarEntryPath, 'utf8');
const actualAvatarImports = [...avatarEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualAvatarImports) !== JSON.stringify(expectedAvatarImports)) {
  throw new Error('Avatar 逐组件样式入口顺序未与固定源码依赖对齐');
}
const avatarCss = await readFile(avatarCssPath, 'utf8');
for (const selector of [
  '.semi-avatar-group',
  '.semi-avatar-additionalBorder',
  '.semi-avatar-top_slot',
  '.semi-avatar-bottom_slot',
  '.semi-rtl .semi-avatar',
]) {
  if (!avatarCss.includes(selector)) {
    throw new Error(`Avatar 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedBadgeImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/badge/badge.scss'),
];
const badgeEntrySource = await readFile(badgeEntryPath, 'utf8');
const actualBadgeImports = [...badgeEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualBadgeImports) !== JSON.stringify(expectedBadgeImports)) {
  throw new Error('Badge 逐组件样式入口顺序未与固定源码依赖对齐');
}
const badgeCss = await readFile(badgeCssPath, 'utf8');
for (const selector of [
  '.semi-badge-dot',
  '.semi-badge-count',
  '.semi-badge-rightTop',
  '.semi-badge-leftBottom',
  '.semi-badge-custom',
  '.semi-badge-block',
  '.semi-badge-success',
  '.semi-rtl .semi-badge',
]) {
  if (!badgeCss.includes(selector)) {
    throw new Error(`Badge 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedCalendarImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/_portal/portal.scss'),
  vendorImport('semi-foundation/button/button.scss'),
  vendorImport('semi-foundation/popover/popover.scss'),
  vendorImport('semi-foundation/calendar/calendar.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
  vendorImport('semi-foundation/button/iconButton.scss'),
];
const calendarEntrySource = await readFile(calendarEntryPath, 'utf8');
const actualCalendarImports = [...calendarEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualCalendarImports) !== JSON.stringify(expectedCalendarImports)) {
  throw new Error('Calendar 逐组件样式入口顺序未与固定源码依赖对齐');
}
const calendarCss = await readFile(calendarCssPath, 'utf8');
for (const selector of [
  '.semi-calendar-day',
  '.semi-calendar-week',
  '.semi-calendar-month',
  '.semi-calendar-event-day',
  '.semi-calendar-month-event-card',
  '.semi-popover',
  '.semi-rtl .semi-calendar',
]) {
  if (!calendarCss.includes(selector)) {
    throw new Error(`Calendar 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedCardImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/_portal/portal.scss'),
  vendorImport('semi-foundation/card/card.scss'),
  vendorImport('semi-foundation/skeleton/skeleton.scss'),
  vendorImport('semi-foundation/space/space.scss'),
  vendorImport('semi-foundation/popover/popover.scss'),
  vendorImport('semi-foundation/tooltip/tooltip.scss'),
  vendorImport('semi-foundation/typography/typography.scss'),
];
const cardEntrySource = await readFile(cardEntryPath, 'utf8');
const actualCardImports = [...cardEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualCardImports) !== JSON.stringify(expectedCardImports)) {
  throw new Error('Card 逐组件样式入口顺序未与固定源码依赖对齐');
}
const cardCss = await readFile(cardCssPath, 'utf8');
for (const selector of [
  '.semi-card-header-bordered',
  '.semi-card-body-actions',
  '.semi-card-meta-wrapper-description',
  '.semi-card-group-grid',
  '.semi-skeleton-active',
  '.semi-space',
  '.semi-typography-h6',
  '.semi-rtl .semi-card',
]) {
  if (!cardCss.includes(selector)) {
    throw new Error(`Card 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedCarouselImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/carousel/carousel.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const carouselEntrySource = await readFile(carouselEntryPath, 'utf8');
const actualCarouselImports = [...carouselEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualCarouselImports) !== JSON.stringify(expectedCarouselImports)) {
  throw new Error('Carousel 逐组件样式入口顺序未与固定源码依赖对齐');
}
const carouselCss = await readFile(carouselCssPath, 'utf8');
for (const selector of [
  '.semi-carousel-content-slide',
  '.semi-carousel-indicator-dot',
  '.semi-carousel-arrow-prev',
  '.semi-rtl .semi-carousel',
  '.semi-icon',
]) {
  if (!carouselCss.includes(selector)) {
    throw new Error(`Carousel 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedCollapsibleImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/collapsible/collapsible.scss'),
];
const collapsibleEntrySource = await readFile(collapsibleEntryPath, 'utf8');
const actualCollapsibleImports = [
  ...collapsibleEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualCollapsibleImports) !== JSON.stringify(expectedCollapsibleImports)) {
  throw new Error('Collapsible 逐组件样式入口顺序未与固定源码依赖对齐');
}
const collapsibleCss = await readFile(collapsibleCssPath, 'utf8');
if (
  !collapsibleCss.includes('.semi-collapsible-transition') ||
  !collapsibleCss.includes('transition: height') ||
  !collapsibleCss.includes('opacity')
) {
  throw new Error('Collapsible 逐组件样式产物缺少高度或透明度过渡');
}

const expectedDescriptionsImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/descriptions/descriptions.scss'),
];
const descriptionsEntrySource = await readFile(descriptionsEntryPath, 'utf8');
const actualDescriptionsImports = [
  ...descriptionsEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualDescriptionsImports) !== JSON.stringify(expectedDescriptionsImports)) {
  throw new Error('Descriptions 逐组件样式入口顺序未与固定源码依赖对齐');
}
const descriptionsCss = await readFile(descriptionsCssPath, 'utf8');
if (
  !descriptionsCss.includes('.semi-descriptions-horizontal') ||
  !descriptionsCss.includes('.semi-descriptions-double-large') ||
  !descriptionsCss.includes('.semi-rtl .semi-descriptions')
) {
  throw new Error('Descriptions 逐组件样式产物缺少横向、双行或 RTL 样式');
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

const expectedTagInputImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/_portal/portal.scss'),
  vendorImport('semi-foundation/tooltip/tooltip.scss'),
  vendorImport('semi-foundation/popover/popover.scss'),
  vendorImport('semi-foundation/input/input.scss'),
  vendorImport('semi-foundation/tag/tag.scss'),
  vendorImport('semi-foundation/typography/typography.scss'),
  vendorImport('semi-foundation/tagInput/tagInput.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const tagInputEntrySource = await readFile(tagInputEntryPath, 'utf8');
const actualTagInputImports = [...tagInputEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualTagInputImports) !== JSON.stringify(expectedTagInputImports)) {
  throw new Error('TagInput 逐组件样式入口顺序未与固定源码依赖对齐');
}
const tagInputCss = await readFile(tagInputCssPath, 'utf8');
for (const selector of [
  '.semi-tagInput-wrapper-input',
  '.semi-tagInput-wrapper-n',
  '.semi-tagInput-disabled',
  '.semi-tagInput-warning',
  '.semi-rtl .semi-tagInput',
  '.semi-tag-close',
  '.semi-popover-wrapper',
  '.semi-portal-inner',
]) {
  if (!tagInputCss.includes(selector)) {
    throw new Error(`TagInput 逐组件样式产物缺少选择器：${selector}`);
  }
}

const expectedTimePickerImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/_portal/portal.scss'),
  vendorImport('semi-foundation/tooltip/tooltip.scss'),
  vendorImport('semi-foundation/popover/popover.scss'),
  vendorImport('semi-foundation/input/input.scss'),
  vendorImport('semi-foundation/scrollList/scrollList.scss'),
  vendorImport('semi-foundation/timePicker/timePicker.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const timePickerEntrySource = await readFile(timePickerEntryPath, 'utf8');
const actualTimePickerImports = [
  ...timePickerEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualTimePickerImports) !== JSON.stringify(expectedTimePickerImports)) {
  throw new Error('TimePicker 逐组件样式入口顺序未与固定源码依赖对齐');
}
const timePickerCss = await readFile(timePickerCssPath, 'utf8');
for (const selector of [
  '.semi-timepicker',
  '.semi-timepicker-panel-list-hour',
  '.semi-timepicker-range-panel',
  '.semi-scrolllist-body',
  '.semi-popover-wrapper',
  '.semi-portal-inner',
  '.semi-rtl .semi-timepicker-panel',
]) {
  if (!timePickerCss.includes(selector)) {
    throw new Error(`TimePicker 逐组件样式产物缺少选择器：${selector}`);
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
  `默认主题入口与 Anchor/Avatar/Badge/Calendar/Card/Carousel/Collapsible/Descriptions/BackTop/Breadcrumb/AutoComplete/Button/Checkbox/ConfigProvider/Divider/FloatButton/Grid/Icon/Input/InputNumber/PinCode/Pagination/Radio/Rating/Layout/Resizable/Select/Slider/Space/Steps/Tabs/Tree/Switch/TagInput/TimePicker/Tooltip/Typography 逐组件产物通过：${expectedImports.length} 个根入口，${css.length + anchorCss.length + avatarCss.length + badgeCss.length + calendarCss.length + cardCss.length + carouselCss.length + collapsibleCss.length + descriptionsCss.length + backTopCss.length + breadcrumbCss.length + autoCompleteCss.length + buttonCss.length + checkboxCss.length + configProviderCss.length + dividerCss.length + floatButtonCss.length + gridCss.length + iconCss.length + inputCss.length + inputNumberCss.length + pinCodeCss.length + paginationCss.length + radioCss.length + ratingCss.length + layoutCss.length + resizableCss.length + selectCss.length + sliderCss.length + spaceCss.length + stepsCss.length + tabsCss.length + treeCss.length + switchCss.length + tagInputCss.length + timePickerCss.length + tooltipCss.length + typographyCss.length} 字节 CSS\n`,
);
