import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { verifyThemeCss } from './theme-contracts.mjs';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const vendorPackages = path.join(workspaceRoot, 'vendor', 'semi-design', 'packages');
const foundationRoot = path.join(vendorPackages, 'semi-foundation');

function themeSource(file) {
  return path.join(workspaceRoot, 'packages/theme-default/src', file);
}

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

const entrySource = await readFile(themeSource('index.scss'), 'utf8');
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
const anchorEntrySource = await readFile(themeSource('anchor.scss'), 'utf8');
const actualAnchorImports = [...anchorEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualAnchorImports) !== JSON.stringify(expectedAnchorImports)) {
  throw new Error('Anchor 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedTagImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/_portal/portal.scss'),
  vendorImport('semi-foundation/avatar/avatar.scss'),
  vendorImport('semi-foundation/tooltip/tooltip.scss'),
  vendorImport('semi-foundation/popover/popover.scss'),
  vendorImport('semi-foundation/tag/tag.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const tagEntrySource = await readFile(themeSource('tag.scss'), 'utf8');
const actualTagImports = [...tagEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualTagImports) !== JSON.stringify(expectedTagImports)) {
  throw new Error('Tag 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedTimelineImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/timeline/timeline.scss'),
];
const timelineEntrySource = await readFile(themeSource('timeline.scss'), 'utf8');
const actualTimelineImports = [...timelineEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualTimelineImports) !== JSON.stringify(expectedTimelineImports)) {
  throw new Error('Timeline 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedScrollListImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/scrollList/scrollList.scss'),
];
const scrollListEntrySource = await readFile(themeSource('scroll-list.scss'), 'utf8');
const actualScrollListImports = [
  ...scrollListEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualScrollListImports) !== JSON.stringify(expectedScrollListImports)) {
  throw new Error('ScrollList 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedSideSheetImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/_portal/portal.scss'),
  vendorImport('semi-foundation/button/button.scss'),
  vendorImport('semi-foundation/sideSheet/sideSheet.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
  vendorImport('semi-foundation/button/iconButton.scss'),
];
const sideSheetEntrySource = await readFile(themeSource('side-sheet.scss'), 'utf8');
const actualSideSheetImports = [
  ...sideSheetEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualSideSheetImports) !== JSON.stringify(expectedSideSheetImports)) {
  throw new Error('SideSheet 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedTableImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/_portal/portal.scss'),
  vendorImport('semi-foundation/button/button.scss'),
  vendorImport('semi-foundation/checkbox/checkbox.scss'),
  vendorImport('semi-foundation/dropdown/dropdown.scss'),
  vendorImport('semi-foundation/input/input.scss'),
  vendorImport('semi-foundation/inputNumber/inputNumber.scss'),
  vendorImport('semi-foundation/pagination/pagination.scss'),
  vendorImport('semi-foundation/radio/radio.scss'),
  vendorImport('semi-foundation/select/select.scss'),
  vendorImport('semi-foundation/spin/spin.scss'),
  vendorImport('semi-foundation/table/table.scss'),
  vendorImport('semi-foundation/tooltip/tooltip.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
  vendorImport('semi-foundation/button/iconButton.scss'),
  vendorImport('semi-foundation/input/textarea.scss'),
];
const tableEntrySource = await readFile(themeSource('table.scss'), 'utf8');
const actualTableImports = [...tableEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualTableImports) !== JSON.stringify(expectedTableImports)) {
  throw new Error('Table 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedCropperImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/cropper/cropper.scss'),
];
const cropperEntrySource = await readFile(themeSource('cropper.scss'), 'utf8');
const actualCropperImports = [...cropperEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualCropperImports) !== JSON.stringify(expectedCropperImports)) {
  throw new Error('Cropper 逐组件样式入口顺序未与固定源码依赖对齐');
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
const backTopEntrySource = await readFile(themeSource('back-top.scss'), 'utf8');
const actualBackTopImports = [...backTopEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualBackTopImports) !== JSON.stringify(expectedBackTopImports)) {
  throw new Error('BackTop 逐组件样式入口顺序未与固定源码依赖对齐');
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
const breadcrumbEntrySource = await readFile(themeSource('breadcrumb.scss'), 'utf8');
const actualBreadcrumbImports = [
  ...breadcrumbEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualBreadcrumbImports) !== JSON.stringify(expectedBreadcrumbImports)) {
  throw new Error('Breadcrumb 逐组件样式入口顺序未与固定源码依赖对齐');
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
const paginationEntrySource = await readFile(themeSource('pagination.scss'), 'utf8');
const actualPaginationImports = [
  ...paginationEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualPaginationImports) !== JSON.stringify(expectedPaginationImports)) {
  throw new Error('Pagination 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedButtonImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/button/button.scss'),
  vendorImport('semi-foundation/button/iconButton.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const buttonEntrySource = await readFile(themeSource('button.scss'), 'utf8');
const actualButtonImports = [...buttonEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualButtonImports) !== JSON.stringify(expectedButtonImports)) {
  throw new Error('Button 逐组件样式入口顺序未与固定源码对齐');
}

const iconButtonEntrySource = await readFile(themeSource('icon-button.scss'), 'utf8');
const actualIconButtonImports = [
  ...iconButtonEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualIconButtonImports) !== JSON.stringify(expectedButtonImports)) {
  throw new Error('IconButton 逐组件样式入口顺序未与固定源码对齐');
}

const expectedCheckboxImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/checkbox/checkbox.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const checkboxEntrySource = await readFile(themeSource('checkbox.scss'), 'utf8');
const actualCheckboxImports = [...checkboxEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualCheckboxImports) !== JSON.stringify(expectedCheckboxImports)) {
  throw new Error('Checkbox 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedDividerImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/divider/divider.scss'),
];
const dividerEntrySource = await readFile(themeSource('divider.scss'), 'utf8');
const actualDividerImports = [...dividerEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualDividerImports) !== JSON.stringify(expectedDividerImports)) {
  throw new Error('Divider 逐组件样式入口顺序未与固定源码对齐');
}

const expectedFloatButtonImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/floatButton/floatButton.scss'),
  vendorImport('semi-foundation/badge/badge.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const floatButtonEntrySource = await readFile(themeSource('float-button.scss'), 'utf8');
const actualFloatButtonImports = [
  ...floatButtonEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualFloatButtonImports) !== JSON.stringify(expectedFloatButtonImports)) {
  throw new Error('FloatButton 逐组件样式入口顺序未与固定源码对齐');
}

const expectedIconImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const iconEntrySource = await readFile(themeSource('icon.scss'), 'utf8');
const actualIconImports = [...iconEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualIconImports) !== JSON.stringify(expectedIconImports)) {
  throw new Error('Icon 逐组件样式入口顺序未与固定源码对齐');
}

const expectedInputImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/input/input.scss'),
  vendorImport('semi-foundation/input/textarea.scss'),
  vendorImport('semi-foundation/form/form.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const inputEntrySource = await readFile(themeSource('input.scss'), 'utf8');
const actualInputImports = [...inputEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualInputImports) !== JSON.stringify(expectedInputImports)) {
  throw new Error('Input 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedInputNumberImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/input/input.scss'),
  vendorImport('semi-foundation/inputNumber/inputNumber.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const inputNumberEntrySource = await readFile(themeSource('input-number.scss'), 'utf8');
const actualInputNumberImports = [
  ...inputNumberEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualInputNumberImports) !== JSON.stringify(expectedInputNumberImports)) {
  throw new Error('InputNumber 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedPinCodeImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/input/input.scss'),
  vendorImport('semi-foundation/pincode/pincode.scss'),
];
const pinCodeEntrySource = await readFile(themeSource('pin-code.scss'), 'utf8');
const actualPinCodeImports = [...pinCodeEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualPinCodeImports) !== JSON.stringify(expectedPinCodeImports)) {
  throw new Error('PinCode 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedRadioImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/radio/radio.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const radioEntrySource = await readFile(themeSource('radio.scss'), 'utf8');
const actualRadioImports = [...radioEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualRadioImports) !== JSON.stringify(expectedRadioImports)) {
  throw new Error('Radio 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedRatingImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/rating/rating.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const ratingEntrySource = await readFile(themeSource('rating.scss'), 'utf8');
const actualRatingImports = [...ratingEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualRatingImports) !== JSON.stringify(expectedRatingImports)) {
  throw new Error('Rating 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedSliderImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/_portal/portal.scss'),
  vendorImport('semi-foundation/tooltip/tooltip.scss'),
  vendorImport('semi-foundation/slider/slider.scss'),
];
const sliderEntrySource = await readFile(themeSource('slider.scss'), 'utf8');
const actualSliderImports = [...sliderEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualSliderImports) !== JSON.stringify(expectedSliderImports)) {
  throw new Error('Slider 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedGridImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/grid/grid.scss'),
];
const gridEntrySource = await readFile(themeSource('grid.scss'), 'utf8');
const actualGridImports = [...gridEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualGridImports) !== JSON.stringify(expectedGridImports)) {
  throw new Error('Grid 逐组件样式入口顺序未与固定源码对齐');
}

const expectedLayoutImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/layout/layout.scss'),
];
const layoutEntrySource = await readFile(themeSource('layout.scss'), 'utf8');
const actualLayoutImports = [...layoutEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualLayoutImports) !== JSON.stringify(expectedLayoutImports)) {
  throw new Error('Layout 逐组件样式入口顺序未与固定源码对齐');
}

const expectedResizableImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/resizable/resizable.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const resizableEntrySource = await readFile(themeSource('resizable.scss'), 'utf8');
const actualResizableImports = [
  ...resizableEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualResizableImports) !== JSON.stringify(expectedResizableImports)) {
  throw new Error('Resizable 逐组件样式入口顺序未与固定源码对齐');
}

const expectedSpaceImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/space/space.scss'),
];
const spaceEntrySource = await readFile(themeSource('space.scss'), 'utf8');
const actualSpaceImports = [...spaceEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualSpaceImports) !== JSON.stringify(expectedSpaceImports)) {
  throw new Error('Space 逐组件样式入口顺序未与固定源码对齐');
}

const expectedStepsImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/grid/grid.scss'),
  vendorImport('semi-foundation/steps/steps.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const stepsEntrySource = await readFile(themeSource('steps.scss'), 'utf8');
const actualStepsImports = [...stepsEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualStepsImports) !== JSON.stringify(expectedStepsImports)) {
  throw new Error('Steps 逐组件样式入口顺序未与固定源码依赖对齐');
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
const tabsEntrySource = await readFile(themeSource('tabs.scss'), 'utf8');
const actualTabsImports = [...tabsEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualTabsImports) !== JSON.stringify(expectedTabsImports)) {
  throw new Error('Tabs 逐组件样式入口顺序未与固定源码依赖对齐');
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
const treeEntrySource = await readFile(themeSource('tree.scss'), 'utf8');
const actualTreeImports = [...treeEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualTreeImports) !== JSON.stringify(expectedTreeImports)) {
  throw new Error('Tree 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedTreeSelectImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/_portal/portal.scss'),
  vendorImport('semi-foundation/tooltip/tooltip.scss'),
  vendorImport('semi-foundation/popover/popover.scss'),
  vendorImport('semi-foundation/checkbox/checkbox.scss'),
  vendorImport('semi-foundation/collapsible/collapsible.scss'),
  vendorImport('semi-foundation/highlight/highlight.scss'),
  vendorImport('semi-foundation/input/input.scss'),
  vendorImport('semi-foundation/tag/tag.scss'),
  vendorImport('semi-foundation/overflowList/overflowList.scss'),
  vendorImport('semi-foundation/tagInput/tagInput.scss'),
  vendorImport('semi-foundation/tree/tree.scss'),
  vendorImport('semi-foundation/treeSelect/treeSelect.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const treeSelectEntrySource = await readFile(themeSource('tree-select.scss'), 'utf8');
const actualTreeSelectImports = [
  ...treeSelectEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualTreeSelectImports) !== JSON.stringify(expectedTreeSelectImports)) {
  throw new Error('TreeSelect 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedCascaderImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/_portal/portal.scss'),
  vendorImport('semi-foundation/tooltip/tooltip.scss'),
  vendorImport('semi-foundation/popover/popover.scss'),
  vendorImport('semi-foundation/input/input.scss'),
  vendorImport('semi-foundation/tag/tag.scss'),
  vendorImport('semi-foundation/overflowList/overflowList.scss'),
  vendorImport('semi-foundation/tagInput/tagInput.scss'),
  vendorImport('semi-foundation/checkbox/checkbox.scss'),
  vendorImport('semi-foundation/spin/spin.scss'),
  vendorImport('semi-foundation/cascader/cascader.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const cascaderEntrySource = await readFile(themeSource('cascader.scss'), 'utf8');
const actualCascaderImports = [...cascaderEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualCascaderImports) !== JSON.stringify(expectedCascaderImports)) {
  throw new Error('Cascader 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedColorPickerImports = [
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
  vendorImport('semi-foundation/button/button.scss'),
  vendorImport('semi-foundation/colorPicker/colorPicker.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const colorPickerEntrySource = await readFile(themeSource('color-picker.scss'), 'utf8');
const actualColorPickerImports = [
  ...colorPickerEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualColorPickerImports) !== JSON.stringify(expectedColorPickerImports)) {
  throw new Error('ColorPicker 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedDatePickerImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/_portal/portal.scss'),
  vendorImport('semi-foundation/tooltip/tooltip.scss'),
  vendorImport('semi-foundation/popover/popover.scss'),
  vendorImport('semi-foundation/input/input.scss'),
  vendorImport('semi-foundation/button/button.scss'),
  vendorImport('semi-foundation/button/iconButton.scss'),
  vendorImport('semi-foundation/scrollList/scrollList.scss'),
  vendorImport('semi-foundation/timePicker/timePicker.scss'),
  vendorImport('semi-foundation/datePicker/datePicker.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const datePickerEntrySource = await readFile(themeSource('date-picker.scss'), 'utf8');
const actualDatePickerImports = [
  ...datePickerEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualDatePickerImports) !== JSON.stringify(expectedDatePickerImports)) {
  throw new Error('DatePicker 逐组件样式入口顺序未与固定源码依赖对齐');
}

const formFieldStyles = [
  'auto-complete',
  'cascader',
  'checkbox',
  'date-picker',
  'input',
  'input-number',
  'pin-code',
  'radio',
  'rating',
  'select',
  'slider',
  'switch',
  'tag-input',
  'time-picker',
  'tree-select',
  'upload',
];
const formDependencies = new Set([
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/grid/grid.scss'),
  vendorImport('semi-foundation/form/form.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
]);
for (const entry of formFieldStyles) {
  const source = await readFile(themeSource(`${entry}.scss`), 'utf8');
  for (const match of source.matchAll(/@import\s+['"]([^'"]+)['"];/g)) {
    formDependencies.add(match[1]);
  }
}
const expectedFormImports = expectedImports.filter((entry) => formDependencies.has(entry));
const formEntrySource = await readFile(themeSource('form.scss'), 'utf8');
const actualFormImports = [...formEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (
  expectedFormImports.length !== formDependencies.size ||
  JSON.stringify(actualFormImports) !== JSON.stringify(expectedFormImports)
) {
  throw new Error('Form 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedAvatarImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/avatar/avatar.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const avatarEntrySource = await readFile(themeSource('avatar.scss'), 'utf8');
const actualAvatarImports = [...avatarEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualAvatarImports) !== JSON.stringify(expectedAvatarImports)) {
  throw new Error('Avatar 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedBadgeImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/badge/badge.scss'),
];
const badgeEntrySource = await readFile(themeSource('badge.scss'), 'utf8');
const actualBadgeImports = [...badgeEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualBadgeImports) !== JSON.stringify(expectedBadgeImports)) {
  throw new Error('Badge 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedBannerImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/button/button.scss'),
  vendorImport('semi-foundation/typography/typography.scss'),
  vendorImport('semi-foundation/banner/banner.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
  vendorImport('semi-foundation/button/iconButton.scss'),
];
const bannerEntrySource = await readFile(themeSource('banner.scss'), 'utf8');
const actualBannerImports = [...bannerEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualBannerImports) !== JSON.stringify(expectedBannerImports)) {
  throw new Error('Banner 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedFeedbackImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/_portal/portal.scss'),
  vendorImport('semi-foundation/button/button.scss'),
  vendorImport('semi-foundation/typography/typography.scss'),
  vendorImport('semi-foundation/input/input.scss'),
  vendorImport('semi-foundation/checkbox/checkbox.scss'),
  vendorImport('semi-foundation/modal/modal.scss'),
  vendorImport('semi-foundation/radio/radio.scss'),
  vendorImport('semi-foundation/sideSheet/sideSheet.scss'),
  vendorImport('semi-foundation/feedback/feedback.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
  vendorImport('semi-foundation/button/iconButton.scss'),
  vendorImport('semi-foundation/input/textarea.scss'),
];
const feedbackEntrySource = await readFile(themeSource('feedback.scss'), 'utf8');
const actualFeedbackImports = [...feedbackEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualFeedbackImports) !== JSON.stringify(expectedFeedbackImports)) {
  throw new Error('Feedback 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedNotificationImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/button/button.scss'),
  vendorImport('semi-foundation/notification/notification.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
  vendorImport('semi-foundation/button/iconButton.scss'),
];
const notificationEntrySource = await readFile(themeSource('notification.scss'), 'utf8');
const actualNotificationImports = [
  ...notificationEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualNotificationImports) !== JSON.stringify(expectedNotificationImports)) {
  throw new Error('Notification 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedPopconfirmImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/_portal/portal.scss'),
  vendorImport('semi-foundation/popover/popover.scss'),
  vendorImport('semi-foundation/button/button.scss'),
  vendorImport('semi-foundation/popconfirm/popconfirm.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
  vendorImport('semi-foundation/button/iconButton.scss'),
];
const popconfirmEntrySource = await readFile(themeSource('popconfirm.scss'), 'utf8');
const actualPopconfirmImports = [
  ...popconfirmEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualPopconfirmImports) !== JSON.stringify(expectedPopconfirmImports)) {
  throw new Error('Popconfirm 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedProgressImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/progress/progress.scss'),
];
const progressEntrySource = await readFile(themeSource('progress.scss'), 'utf8');
const actualProgressImports = [...progressEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualProgressImports) !== JSON.stringify(expectedProgressImports)) {
  throw new Error('Progress 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedSkeletonImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/skeleton/skeleton.scss'),
];
const skeletonEntrySource = await readFile(themeSource('skeleton.scss'), 'utf8');
const actualSkeletonImports = [...skeletonEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualSkeletonImports) !== JSON.stringify(expectedSkeletonImports)) {
  throw new Error('Skeleton 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedSpinImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/spin/spin.scss'),
];
const spinEntrySource = await readFile(themeSource('spin.scss'), 'utf8');
const actualSpinImports = [...spinEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualSpinImports) !== JSON.stringify(expectedSpinImports)) {
  throw new Error('Spin 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedTransferImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/button/button.scss'),
  vendorImport('semi-foundation/button/iconButton.scss'),
  vendorImport('semi-foundation/checkbox/checkbox.scss'),
  vendorImport('semi-foundation/collapsible/collapsible.scss'),
  vendorImport('semi-foundation/highlight/highlight.scss'),
  vendorImport('semi-foundation/input/input.scss'),
  vendorImport('semi-foundation/spin/spin.scss'),
  vendorImport('semi-foundation/tree/tree.scss'),
  vendorImport('semi-foundation/pagination/pagination.scss'),
  vendorImport('semi-foundation/transfer/transfer.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const transferEntrySource = await readFile(themeSource('transfer.scss'), 'utf8');
const actualTransferImports = [...transferEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualTransferImports) !== JSON.stringify(expectedTransferImports)) {
  throw new Error('Transfer 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedUploadImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/button/button.scss'),
  vendorImport('semi-foundation/button/iconButton.scss'),
  vendorImport('semi-foundation/cropper/cropper.scss'),
  vendorImport('semi-foundation/modal/modal.scss'),
  vendorImport('semi-foundation/progress/progress.scss'),
  vendorImport('semi-foundation/spin/spin.scss'),
  vendorImport('semi-foundation/tooltip/tooltip.scss'),
  vendorImport('semi-foundation/typography/typography.scss'),
  vendorImport('semi-foundation/upload/upload.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const uploadEntrySource = await readFile(themeSource('upload.scss'), 'utf8');
const actualUploadImports = [...uploadEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualUploadImports) !== JSON.stringify(expectedUploadImports)) {
  throw new Error('Upload 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedToastImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/button/button.scss'),
  vendorImport('semi-foundation/toast/toast.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
  vendorImport('semi-foundation/button/iconButton.scss'),
];
const toastEntrySource = await readFile(themeSource('toast.scss'), 'utf8');
const actualToastImports = [...toastEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualToastImports) !== JSON.stringify(expectedToastImports)) {
  throw new Error('Toast 逐组件样式入口顺序未与固定源码依赖对齐');
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
const calendarEntrySource = await readFile(themeSource('calendar.scss'), 'utf8');
const actualCalendarImports = [...calendarEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualCalendarImports) !== JSON.stringify(expectedCalendarImports)) {
  throw new Error('Calendar 逐组件样式入口顺序未与固定源码依赖对齐');
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
const cardEntrySource = await readFile(themeSource('card.scss'), 'utf8');
const actualCardImports = [...cardEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualCardImports) !== JSON.stringify(expectedCardImports)) {
  throw new Error('Card 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedCarouselImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/carousel/carousel.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const carouselEntrySource = await readFile(themeSource('carousel.scss'), 'utf8');
const actualCarouselImports = [...carouselEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualCarouselImports) !== JSON.stringify(expectedCarouselImports)) {
  throw new Error('Carousel 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedCollapsibleImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/collapsible/collapsible.scss'),
];
const expectedCollapseImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/collapsible/collapsible.scss'),
  vendorImport('semi-foundation/collapse/collapse.scss'),
];
const collapseEntrySource = await readFile(themeSource('collapse.scss'), 'utf8');
const actualCollapseImports = [...collapseEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualCollapseImports) !== JSON.stringify(expectedCollapseImports)) {
  throw new Error('Collapse 逐组件样式入口顺序未与固定源码依赖对齐');
}

const collapsibleEntrySource = await readFile(themeSource('collapsible.scss'), 'utf8');
const actualCollapsibleImports = [
  ...collapsibleEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualCollapsibleImports) !== JSON.stringify(expectedCollapsibleImports)) {
  throw new Error('Collapsible 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedDescriptionsImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/descriptions/descriptions.scss'),
];
const descriptionsEntrySource = await readFile(themeSource('descriptions.scss'), 'utf8');
const actualDescriptionsImports = [
  ...descriptionsEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualDescriptionsImports) !== JSON.stringify(expectedDescriptionsImports)) {
  throw new Error('Descriptions 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedDropdownImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/_portal/portal.scss'),
  vendorImport('semi-foundation/tooltip/tooltip.scss'),
  vendorImport('semi-foundation/dropdown/dropdown.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const dropdownEntrySource = await readFile(themeSource('dropdown.scss'), 'utf8');
const actualDropdownImports = [...dropdownEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualDropdownImports) !== JSON.stringify(expectedDropdownImports)) {
  throw new Error('Dropdown 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedEmptyImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/empty/empty.scss'),
  vendorImport('semi-foundation/typography/typography.scss'),
];
const emptyEntrySource = await readFile(themeSource('empty.scss'), 'utf8');
const actualEmptyImports = [...emptyEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualEmptyImports) !== JSON.stringify(expectedEmptyImports)) {
  throw new Error('Empty 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedHighlightImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/highlight/highlight.scss'),
];
const highlightEntrySource = await readFile(themeSource('highlight.scss'), 'utf8');
const actualHighlightImports = [
  ...highlightEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualHighlightImports) !== JSON.stringify(expectedHighlightImports)) {
  throw new Error('Highlight 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedCodeHighlightImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/codeHighlight/codeHighlight.scss'),
];
const codeHighlightEntrySource = await readFile(themeSource('code-highlight.scss'), 'utf8');
const actualCodeHighlightImports = [
  ...codeHighlightEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualCodeHighlightImports) !== JSON.stringify(expectedCodeHighlightImports)) {
  throw new Error('CodeHighlight 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedImageImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/_portal/portal.scss'),
  vendorImport('semi-foundation/image/image.scss'),
  vendorImport('semi-foundation/skeleton/skeleton.scss'),
  vendorImport('semi-foundation/spin/spin.scss'),
  vendorImport('semi-foundation/slider/slider.scss'),
  vendorImport('semi-foundation/tooltip/tooltip.scss'),
  vendorImport('semi-foundation/divider/divider.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const imageEntrySource = await readFile(themeSource('image.scss'), 'utf8');
const actualImageImports = [...imageEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualImageImports) !== JSON.stringify(expectedImageImports)) {
  throw new Error('Image 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedListImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/list/list.scss'),
  vendorImport('semi-foundation/grid/grid.scss'),
  vendorImport('semi-foundation/spin/spin.scss'),
];
const listEntrySource = await readFile(themeSource('list.scss'), 'utf8');
const actualListImports = [...listEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualListImports) !== JSON.stringify(expectedListImports)) {
  throw new Error('List 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedModalImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/_portal/portal.scss'),
  vendorImport('semi-foundation/button/button.scss'),
  vendorImport('semi-foundation/typography/typography.scss'),
  vendorImport('semi-foundation/modal/modal.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
  vendorImport('semi-foundation/button/iconButton.scss'),
];
const modalEntrySource = await readFile(themeSource('modal.scss'), 'utf8');
const actualModalImports = [...modalEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualModalImports) !== JSON.stringify(expectedModalImports)) {
  throw new Error('Modal 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedOverflowListImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/overflowList/overflowList.scss'),
];
const overflowListEntrySource = await readFile(themeSource('overflow-list.scss'), 'utf8');
const actualOverflowListImports = [
  ...overflowListEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualOverflowListImports) !== JSON.stringify(expectedOverflowListImports)) {
  throw new Error('OverflowList 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedPopoverImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/_portal/portal.scss'),
  vendorImport('semi-foundation/tooltip/tooltip.scss'),
  vendorImport('semi-foundation/popover/popover.scss'),
];
const popoverEntrySource = await readFile(themeSource('popover.scss'), 'utf8');
const actualPopoverImports = [...popoverEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualPopoverImports) !== JSON.stringify(expectedPopoverImports)) {
  throw new Error('Popover 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedSwitchImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/switch/switch.scss'),
  vendorImport('semi-foundation/spin/spin.scss'),
];
const switchEntrySource = await readFile(themeSource('switch.scss'), 'utf8');
const actualSwitchImports = [...switchEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualSwitchImports) !== JSON.stringify(expectedSwitchImports)) {
  throw new Error('Switch 逐组件样式入口顺序未与固定源码依赖对齐');
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
const tagInputEntrySource = await readFile(themeSource('tag-input.scss'), 'utf8');
const actualTagInputImports = [...tagInputEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualTagInputImports) !== JSON.stringify(expectedTagInputImports)) {
  throw new Error('TagInput 逐组件样式入口顺序未与固定源码依赖对齐');
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
const timePickerEntrySource = await readFile(themeSource('time-picker.scss'), 'utf8');
const actualTimePickerImports = [
  ...timePickerEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualTimePickerImports) !== JSON.stringify(expectedTimePickerImports)) {
  throw new Error('TimePicker 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedTooltipImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/_portal/portal.scss'),
  vendorImport('semi-foundation/tooltip/tooltip.scss'),
];
const tooltipEntrySource = await readFile(themeSource('tooltip.scss'), 'utf8');
const actualTooltipImports = [...tooltipEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualTooltipImports) !== JSON.stringify(expectedTooltipImports)) {
  throw new Error('Tooltip 逐组件样式入口顺序未与固定源码依赖对齐');
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
const autoCompleteEntrySource = await readFile(themeSource('auto-complete.scss'), 'utf8');
const actualAutoCompleteImports = [
  ...autoCompleteEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualAutoCompleteImports) !== JSON.stringify(expectedAutoCompleteImports)) {
  throw new Error('AutoComplete 逐组件样式入口顺序未与固定源码依赖对齐');
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
const selectEntrySource = await readFile(themeSource('select.scss'), 'utf8');
const actualSelectImports = [...selectEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualSelectImports) !== JSON.stringify(expectedSelectImports)) {
  throw new Error('Select 逐组件样式入口顺序未与固定源码依赖对齐');
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
const typographyEntrySource = await readFile(themeSource('typography.scss'), 'utf8');
const actualTypographyImports = [
  ...typographyEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualTypographyImports) !== JSON.stringify(expectedTypographyImports)) {
  throw new Error('Typography 逐组件样式入口顺序未与固定源码依赖对齐');
}

const expectedConfigProviderImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
];
const configProviderEntrySource = await readFile(themeSource('config-provider.scss'), 'utf8');
const actualConfigProviderImports = [
  ...configProviderEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualConfigProviderImports) !== JSON.stringify(expectedConfigProviderImports)) {
  throw new Error('ConfigProvider 逐组件样式入口未与固定源码的无组件 SCSS 契约对齐');
}

const expectedDragMoveImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
];
const dragMoveEntrySource = await readFile(themeSource('drag-move.scss'), 'utf8');
const actualDragMoveImports = [...dragMoveEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualDragMoveImports) !== JSON.stringify(expectedDragMoveImports)) {
  throw new Error('DragMove 逐组件样式入口未与固定源码的无组件 SCSS 契约对齐');
}

const expectedHotKeysImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/hotKeys/hotKeys.scss'),
];
const hotKeysEntrySource = await readFile(themeSource('hot-keys.scss'), 'utf8');
const actualHotKeysImports = [...hotKeysEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualHotKeysImports) !== JSON.stringify(expectedHotKeysImports)) {
  throw new Error('HotKeys 逐组件样式入口未按固定主题与 Foundation 顺序导入');
}

const expectedLottieImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
];
const lottieEntrySource = await readFile(themeSource('lottie.scss'), 'utf8');
const actualLottieImports = [...lottieEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualLottieImports) !== JSON.stringify(expectedLottieImports)) {
  throw new Error('Lottie 逐组件样式入口未与固定源码的无组件 SCSS 契约对齐');
}

const expectedAudioPlayerImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/audioPlayer/audioPlayer.scss'),
];
const audioPlayerEntrySource = await readFile(themeSource('audio-player.scss'), 'utf8');
const actualAudioPlayerImports = [
  ...audioPlayerEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualAudioPlayerImports) !== JSON.stringify(expectedAudioPlayerImports)) {
  throw new Error('AudioPlayer 逐组件样式入口未按固定主题与 Foundation 顺序导入');
}

const expectedVideoPlayerImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/audioPlayer/audioPlayer.scss'),
  vendorImport('semi-foundation/videoPlayer/videoPlayer.scss'),
];
const videoPlayerEntrySource = await readFile(themeSource('video-player.scss'), 'utf8');
const actualVideoPlayerImports = [
  ...videoPlayerEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualVideoPlayerImports) !== JSON.stringify(expectedVideoPlayerImports)) {
  throw new Error('VideoPlayer 逐组件样式入口未按固定主题、AudioSlider 与 Foundation 顺序导入');
}

const expectedUserGuideImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-theme-default/scss/animation.scss'),
  vendorImport('semi-foundation/_portal/portal.scss'),
  vendorImport('semi-foundation/button/button.scss'),
  vendorImport('semi-foundation/typography/typography.scss'),
  vendorImport('semi-foundation/popover/popover.scss'),
  vendorImport('semi-foundation/modal/modal.scss'),
  vendorImport('semi-foundation/userGuide/userGuide.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
  vendorImport('semi-foundation/button/iconButton.scss'),
];
const userGuideEntrySource = await readFile(themeSource('user-guide.scss'), 'utf8');
const actualUserGuideImports = [
  ...userGuideEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualUserGuideImports) !== JSON.stringify(expectedUserGuideImports)) {
  throw new Error('UserGuide 逐组件样式入口未按固定主题、Portal、Popover 与 Modal 顺序导入');
}

const expectedJsonViewerImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/button/button.scss'),
  vendorImport('semi-foundation/input/input.scss'),
  vendorImport('semi-foundation/jsonViewer/jsonViewer.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const jsonViewerEntrySource = await readFile(themeSource('json-viewer.scss'), 'utf8');
const actualJsonViewerImports = [
  ...jsonViewerEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualJsonViewerImports) !== JSON.stringify(expectedJsonViewerImports)) {
  throw new Error('JsonViewer 逐组件样式入口未按固定主题、Button、Input 与 Foundation 顺序导入');
}

const expectedAIChatInputImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/button/button.scss'),
  vendorImport('semi-foundation/select/select.scss'),
  vendorImport('semi-foundation/radio/radio.scss'),
  vendorImport('semi-foundation/dropdown/dropdown.scss'),
  vendorImport('semi-foundation/upload/upload.scss'),
  vendorImport('semi-foundation/progress/progress.scss'),
  vendorImport('semi-foundation/tooltip/tooltip.scss'),
  vendorImport('semi-foundation/popover/popover.scss'),
  vendorImport('semi-foundation/aiChatInput/aiChatInput.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const aiChatInputEntrySource = await readFile(themeSource('ai-chat-input.scss'), 'utf8');
const actualAIChatInputImports = [
  ...aiChatInputEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualAIChatInputImports) !== JSON.stringify(expectedAIChatInputImports)) {
  throw new Error('AIChatInput 逐组件样式入口未按固定主题与公开依赖顺序导入');
}

const expectedAIChatDialogueImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/button/button.scss'),
  vendorImport('semi-foundation/checkbox/checkbox.scss'),
  vendorImport('semi-foundation/avatar/avatar.scss'),
  vendorImport('semi-foundation/image/image.scss'),
  vendorImport('semi-foundation/collapsible/collapsible.scss'),
  vendorImport('semi-foundation/dropdown/dropdown.scss'),
  vendorImport('semi-foundation/modal/modal.scss'),
  vendorImport('semi-foundation/toast/toast.scss'),
  vendorImport('semi-foundation/typography/typography.scss'),
  vendorImport('semi-foundation/table/table.scss'),
  vendorImport('semi-foundation/pagination/pagination.scss'),
  vendorImport('semi-foundation/codeHighlight/codeHighlight.scss'),
  vendorImport('semi-foundation/markdownRender/markdownRender.scss'),
  vendorImport('semi-foundation/chat/chat.scss'),
  vendorImport('semi-foundation/aiChatDialogue/aiChatDialogue.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const aiChatDialogueEntrySource = await readFile(themeSource('ai-chat-dialogue.scss'), 'utf8');
const actualAIChatDialogueImports = [
  ...aiChatDialogueEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualAIChatDialogueImports) !== JSON.stringify(expectedAIChatDialogueImports)) {
  throw new Error('AIChatDialogue 逐组件样式入口未按固定主题与公开依赖顺序导入');
}

const expectedSidebarImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/button/button.scss'),
  vendorImport('semi-foundation/divider/divider.scss'),
  vendorImport('semi-foundation/input/input.scss'),
  vendorImport('semi-foundation/radio/radio.scss'),
  vendorImport('semi-foundation/tooltip/tooltip.scss'),
  vendorImport('semi-foundation/empty/empty.scss'),
  vendorImport('semi-foundation/resizable/resizable.scss'),
  vendorImport('semi-foundation/collapsible/collapsible.scss'),
  vendorImport('semi-foundation/collapse/collapse.scss'),
  vendorImport('semi-foundation/codeHighlight/codeHighlight.scss'),
  vendorImport('semi-foundation/jsonViewer/jsonViewer.scss'),
  vendorImport('semi-foundation/upload/upload.scss'),
  vendorImport('semi-foundation/sidebar/sidebar.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const sidebarEntrySource = await readFile(themeSource('sidebar.scss'), 'utf8');
const actualSidebarImports = [...sidebarEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualSidebarImports) !== JSON.stringify(expectedSidebarImports)) {
  throw new Error('Sidebar 逐组件样式入口未按固定主题与公开依赖顺序导入');
}

const expectedChatImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/button/button.scss'),
  vendorImport('semi-foundation/input/input.scss'),
  vendorImport('semi-foundation/input/textarea.scss'),
  vendorImport('semi-foundation/avatar/avatar.scss'),
  vendorImport('semi-foundation/divider/divider.scss'),
  vendorImport('semi-foundation/image/image.scss'),
  vendorImport('semi-foundation/progress/progress.scss'),
  vendorImport('semi-foundation/upload/upload.scss'),
  vendorImport('semi-foundation/tooltip/tooltip.scss'),
  vendorImport('semi-foundation/popover/popover.scss'),
  vendorImport('semi-foundation/popconfirm/popconfirm.scss'),
  vendorImport('semi-foundation/toast/toast.scss'),
  vendorImport('semi-foundation/chat/chat.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const chatEntrySource = await readFile(themeSource('chat.scss'), 'utf8');
const actualChatImports = [...chatEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualChatImports) !== JSON.stringify(expectedChatImports)) {
  throw new Error('Chat 逐组件样式入口未按固定主题与公开依赖顺序导入');
}

const expectedMarkdownRenderImports = [
  vendorImport('semi-theme-default/scss/index.scss'),
  vendorImport('semi-theme-default/scss/global.scss'),
  vendorImport('semi-foundation/typography/typography.scss'),
  vendorImport('semi-foundation/image/image.scss'),
  vendorImport('semi-foundation/table/table.scss'),
  vendorImport('semi-foundation/pagination/pagination.scss'),
  vendorImport('semi-foundation/codeHighlight/codeHighlight.scss'),
  vendorImport('semi-foundation/markdownRender/markdownRender.scss'),
  vendorImport('semi-icons/src/styles/icons.scss'),
];
const markdownRenderEntrySource = await readFile(themeSource('markdown-render.scss'), 'utf8');
const actualMarkdownRenderImports = [
  ...markdownRenderEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g),
].map((match) => match[1]);
if (JSON.stringify(actualMarkdownRenderImports) !== JSON.stringify(expectedMarkdownRenderImports)) {
  throw new Error('MarkdownRender 逐组件样式入口未按固定主题与默认渲染器依赖顺序导入');
}

const localeEntrySource = await readFile(themeSource('locale.scss'), 'utf8');
const actualLocaleImports = [...localeEntrySource.matchAll(/@import\s+['"]([^'"]+)['"];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(actualLocaleImports) !== JSON.stringify(expectedLottieImports)) {
  throw new Error('Locale 逐组件样式入口未与固定源码的无组件 SCSS 契约对齐');
}

const navigationEntrySource = await readFile(themeSource('navigation.scss'), 'utf8');
for (const dependency of [
  'semi-foundation/_portal/portal.scss',
  'semi-foundation/button/button.scss',
  'semi-foundation/collapsible/collapsible.scss',
  'semi-foundation/dropdown/dropdown.scss',
  'semi-foundation/navigation/navigation.scss',
  'semi-foundation/tooltip/tooltip.scss',
  'semi-icons/src/styles/icons.scss',
]) {
  if (!navigationEntrySource.includes(dependency)) {
    throw new Error(`Navigation 逐组件样式入口缺少固定依赖：${dependency}`);
  }
}

await verifyThemeCss(path.join(workspaceRoot, 'packages/theme-default/dist'));
process.stdout.write(`默认主题入口与逐组件样式通过：${expectedImports.length} 个根入口\n`);
