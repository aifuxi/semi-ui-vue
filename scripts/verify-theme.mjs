import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const vendorPackages = path.join(workspaceRoot, 'vendor', 'semi-design', 'packages');
const foundationRoot = path.join(vendorPackages, 'semi-foundation');
const entryPath = path.join(workspaceRoot, 'packages', 'theme-default', 'src', 'index.scss');
const cssPath = path.join(workspaceRoot, 'packages', 'theme-default', 'dist', 'index.css');
const buttonEntryPath = path.join(workspaceRoot, 'packages', 'theme-default', 'src', 'button.scss');
const buttonCssPath = path.join(workspaceRoot, 'packages', 'theme-default', 'dist', 'button.css');
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
const spaceEntryPath = path.join(workspaceRoot, 'packages', 'theme-default', 'src', 'space.scss');
const spaceCssPath = path.join(workspaceRoot, 'packages', 'theme-default', 'dist', 'space.css');

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
  '.semi-button',
  '.semi-divider',
  '.semi-floatButton',
  '.semi-icon',
  '.semi-space',
  '.semi-input-wrapper',
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

process.stdout.write(
  `默认主题入口与 Button/Divider/FloatButton/Icon/Space 逐组件产物通过：${expectedImports.length} 个根入口，${css.length + buttonCss.length + dividerCss.length + floatButtonCss.length + iconCss.length + spaceCss.length} 字节 CSS\n`,
);
