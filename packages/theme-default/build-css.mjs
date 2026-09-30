import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sass from 'sass';

const themeRoot = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(themeRoot, '../..');
const sourceRoot = path.join(themeRoot, 'src');
const vendorPackages = path.join(workspaceRoot, 'vendor/semi-design/packages');
const distRoot = path.join(themeRoot, 'dist');
const themeScssRoot = path.join(vendorPackages, 'semi-theme-default/scss');
const compileContext = [
  path.join(themeScssRoot, 'mixin.scss'),
  path.join(themeScssRoot, 'variables.scss'),
  path.join(themeScssRoot, '_font.scss'),
];

async function collectThemeVariables(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) return collectThemeVariables(target);
      return entry.name === 'variables.scss' ? [target] : [];
    }),
  );
  return files.flat().sort();
}

compileContext.push(...(await collectThemeVariables(path.join(vendorPackages, 'semi-foundation'))));

const sourceManifest = JSON.parse(
  await readFile(path.join(themeRoot, 'style-dependencies.json'), 'utf8'),
);
const sourceFiles = new Map(
  await Promise.all(
    Object.keys(sourceManifest.components).map(async (name) => [
      name,
      await readFile(path.join(sourceRoot, `${name}.scss`), 'utf8'),
    ]),
  ),
);

const sharedModules = new Set();
const moduleOwners = new Map();
for (const { main, modules } of Object.values(sourceManifest.components)) {
  for (const modulePath of modules) if (modulePath !== main) sharedModules.add(modulePath);
}
for (const [name, { main }] of Object.entries(sourceManifest.components)) {
  if (main) moduleOwners.set(main, name);
}

function moduleFile(modulePath) {
  return path.join(vendorPackages, modulePath);
}

function moduleAsset(modulePath) {
  if (modulePath.startsWith('semi-icons/')) return 'icons.css';
  const name = modulePath
    .replace(/^semi-foundation\//, '')
    .replace(/\.scss$/, '')
    .replaceAll('/', '-')
    .replaceAll('_', '')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-');
  return `foundation-${name}.css`;
}

function compile(data, fileName) {
  return sass
    .renderSync({
      data,
      file: fileName,
      outputStyle: 'expanded',
      sourceMap: false,
      includePaths: [sourceRoot],
    })
    .css.toString();
}

function compileComponent(name, modules) {
  const source = sourceFiles.get(name);
  const selected = new Set(modules);
  const transformed = source.replace(
    /@import\s+(['"])([^'"]+)\1\s*;?/g,
    (statement, _quote, specifier) => {
      const vendorMarker = 'vendor/semi-design/packages/';
      const markerIndex = specifier.indexOf(vendorMarker);
      if (markerIndex < 0) return statement;
      const modulePath = specifier.slice(markerIndex + vendorMarker.length);
      if (
        modulePath.startsWith('semi-theme-default/scss/') ||
        modulePath.startsWith('semi-foundation/') ||
        modulePath.startsWith('semi-icons/')
      ) {
        return selected.has(modulePath) ? `@import ${JSON.stringify(moduleFile(modulePath))};` : '';
      }
      return statement;
    },
  );
  const context = compileContext.map((file) => `@import ${JSON.stringify(file)};`).join('\n');
  return compile(`${context}\n${transformed}`, path.join(sourceRoot, `${name}.scss`));
}

function orderedUnique(values) {
  return [...new Set(values)];
}

await rm(distRoot, { recursive: true, force: true });
await mkdir(path.join(distRoot, 'shared'), { recursive: true });

const baseCss = compile(
  await readFile(path.join(sourceRoot, 'base.scss'), 'utf8'),
  path.join(sourceRoot, 'base.scss'),
);
await writeFile(path.join(distRoot, 'base.css'), baseCss);

const sharedAssets = new Map();
for (const modulePath of sharedModules) {
  if (moduleOwners.has(modulePath)) {
    sharedAssets.set(modulePath, `./${moduleOwners.get(modulePath)}.css`);
    continue;
  }
  const assetName = moduleAsset(modulePath);
  if ([...sharedAssets.values()].includes(`./shared/${assetName}`)) {
    throw new Error(`共享样式产物重名：${assetName}`);
  }
  sharedAssets.set(modulePath, `./shared/${assetName}`);
  const context = compileContext.map((file) => `@import ${JSON.stringify(file)};`).join('\n');
  const moduleCss = compile(
    `${context}\n@import ${JSON.stringify(moduleFile(modulePath))};`,
    path.join(sourceRoot, `_shared-${assetName}.scss`),
  );
  await writeFile(path.join(distRoot, 'shared', assetName), moduleCss);
}

const components = {};
for (const [name, { main, modules }] of Object.entries(sourceManifest.components)) {
  const ownModules = main ? [main] : [];
  const css = compileComponent(name, ownModules);
  await writeFile(path.join(distRoot, `${name}.css`), css);

  const imports = ['base.css'];
  for (const modulePath of orderedUnique(modules)) {
    if (sharedAssets.has(modulePath)) imports.push(sharedAssets.get(modulePath));
    else if (moduleOwners.has(modulePath)) imports.push(`./${moduleOwners.get(modulePath)}.css`);
  }
  if (!modules.length) imports.push(`./${name}.css`);
  components[name] = {
    css: `${name}.css`,
    main,
    modules: orderedUnique(modules),
    imports: orderedUnique(imports),
  };
}

const fullCss = compile(
  await readFile(path.join(sourceRoot, 'index.scss'), 'utf8'),
  path.join(sourceRoot, 'index.scss'),
);
await writeFile(path.join(distRoot, 'index.css'), fullCss);
await writeFile(
  path.join(distRoot, 'style-dependencies.json'),
  `${JSON.stringify({ version: sourceManifest.version, base: 'base.css', shared: Object.fromEntries(sharedAssets), components }, null, 2)}\n`,
);
