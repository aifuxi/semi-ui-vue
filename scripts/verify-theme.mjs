import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const vendorPackages = path.join(workspaceRoot, 'vendor', 'semi-design', 'packages');
const foundationRoot = path.join(vendorPackages, 'semi-foundation');
const entryPath = path.join(workspaceRoot, 'packages', 'theme-default', 'src', 'index.scss');
const cssPath = path.join(workspaceRoot, 'packages', 'theme-default', 'dist', 'index.css');

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
  '.semi-icon',
  '.semi-input-wrapper',
  '.semi-input-textarea-wrapper',
  '.semi-modal',
];

for (const selector of requiredSelectors) {
  if (!css.includes(selector)) {
    throw new Error(`默认主题产物缺少代表性组件选择器：${selector}`);
  }
}

process.stdout.write(
  `默认主题入口与产物通过：${expectedImports.length} 个入口，${css.length} 字节 CSS\n`,
);
