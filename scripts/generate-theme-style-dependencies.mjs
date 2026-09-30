import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const themeRoot = path.join(workspaceRoot, 'packages/theme-default');
const sourceRoot = path.join(themeRoot, 'src');
const manifestPath = path.join(themeRoot, 'style-dependencies.json');
const vendorMarker = 'vendor/semi-design/packages/';

const primaryOverrides = {
  'back-top': 'semi-foundation/backtop/backtop.scss',
  icon: 'semi-icons/src/styles/icons.scss',
  'icon-button': 'semi-foundation/button/iconButton.scss',
  'pin-code': 'semi-foundation/pincode/pincode.scss',
  'config-provider': null,
  'drag-move': null,
  locale: null,
  lottie: null,
};

function camelCase(value) {
  return value.replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase());
}

function vendorPath(specifier) {
  const markerIndex = specifier.indexOf(vendorMarker);
  return markerIndex < 0 ? null : specifier.slice(markerIndex + vendorMarker.length);
}

function primaryModule(name, modules) {
  if (Object.hasOwn(primaryOverrides, name)) return primaryOverrides[name];
  const expectedFile = `${camelCase(name)}.scss`;
  return modules.find((modulePath) => modulePath.endsWith(`/${expectedFile}`)) ?? null;
}

const files = (await readdir(sourceRoot))
  .filter((file) => file.endsWith('.scss') && file !== 'index.scss' && file !== 'base.scss')
  .sort();
const components = {};

for (const file of files) {
  const name = file.slice(0, -'.scss'.length);
  const source = await readFile(path.join(sourceRoot, file), 'utf8');
  const imports = [...source.matchAll(/@import\s+['"]([^'"]+)['"];?/g)]
    .map((match) => vendorPath(match[1]))
    .filter(
      (value) => value && (value.startsWith('semi-foundation/') || value.startsWith('semi-icons/')),
    );
  const modules = [...new Set(imports)];
  const main = primaryModule(name, modules);
  if (main && !modules.includes(main)) {
    throw new Error(`${file} 声明的主样式不在现有依赖中：${main}`);
  }
  components[name] = { main, modules };
}

const packageManifest = JSON.parse(await readFile(path.join(themeRoot, 'package.json'), 'utf8'));
const mainOwners = new Map();
for (const [name, { main }] of Object.entries(components)) {
  if (!main) continue;
  const previousOwner = mainOwners.get(main);
  if (previousOwner)
    throw new Error(`Foundation 主样式重复归属：${previousOwner} 与 ${name} (${main})`);
  mainOwners.set(main, name);
}
const exportedComponents = Object.keys(packageManifest.exports)
  .filter(
    (key) =>
      key.endsWith('.css') && key !== './index.css' && key !== './base.css' && !key.includes('*'),
  )
  .map((key) => key.slice(2, -'.css'.length))
  .sort();
const sourceComponents = Object.keys(components).sort();
if (JSON.stringify(exportedComponents) !== JSON.stringify(sourceComponents)) {
  throw new Error(
    `主题 CSS exports 与源码入口不匹配。缺少源码：${exportedComponents.filter((name) => !components[name]).join(', ') || '无'}；缺少导出：${sourceComponents.filter((name) => !exportedComponents.includes(name)).join(', ') || '无'}`,
  );
}

await writeFile(
  manifestPath,
  await prettier.format(JSON.stringify({ version: '2.102.0', components }), {
    ...(await prettier.resolveConfig(manifestPath)),
    parser: 'json',
  }),
);
