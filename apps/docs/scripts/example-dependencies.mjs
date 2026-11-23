import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, isAbsolute, relative, resolve, sep } from 'node:path';
import ts from 'typescript';
import { parse } from 'vue/compiler-sfc';

const demoAssetPattern = /\/demos\/(?:[\w-]+\/)*[\w.-]+\.[\w-]+/g;
const packagePattern = /^(@[^/]+\/[^/]+|[^/]+)/;

function inspect(source, isVueFile) {
  const { script, scriptSetup } = isVueFile ? parse(source).descriptor : {};
  const scripts = isVueFile ? [script?.content, scriptSetup?.content].filter(Boolean) : [source];
  return {
    imports: scripts.flatMap((text) =>
      ts.preProcessFile(text, true, true).importedFiles.map(({ fileName }) => fileName),
    ),
    assets: source.match(demoAssetPattern) ?? [],
  };
}

function inside(root, path) {
  const name = relative(root, path);
  return name !== '..' && !name.startsWith(`..${sep}`) && !isAbsolute(name);
}

function resolveExampleImport(file, specifier, files) {
  const base = resolve(dirname(file), specifier);
  const path = [base, `${base}.ts`, `${base}.vue`, resolve(base, 'index.ts')].find((item) =>
    files.has(item),
  );
  if (!path) throw new Error(`示例辅助文件无法解析：${specifier}（${file}）`);
  return path;
}

function dependencyPackage(specifier) {
  const name = specifier.match(packagePattern)?.[1];
  return name && !['vue', '@aifuxi/semi-ui-vue'].includes(name) ? name : undefined;
}

export async function prepareExampleDependencies({
  appRoot,
  examplesRoot,
  exampleFiles,
  codeSources,
  collectFiles,
}) {
  const manifest = JSON.parse(await readFile(resolve(appRoot, 'package.json'), 'utf8'));
  const { version } = JSON.parse(
    await readFile(resolve(appRoot, '../../packages/ui/package.json'), 'utf8'),
  );
  const publicRoot = resolve(appRoot, 'content/public');
  const downloadsRoot = resolve(publicRoot, 'example-files');
  const files = new Map();
  for (const path of await collectFiles(examplesRoot, (name) => /\.(?:ts|vue)$/.test(name))) {
    const source = await readFile(path, 'utf8');
    files.set(path, { source, ...inspect(source, extname(path) === '.vue') });
  }

  const examples = {};
  const downloads = new Set();
  const assets = new Set();

  function record(id, names, assetPaths, paths = []) {
    const packages = [...names].sort().map((name) => {
      const range = manifest.dependencies[name];
      if (!range) return name;
      return `${name}@${range.startsWith('workspace:') ? version : range}`;
    });
    if (!packages.length && !assetPaths.size && paths.length < 2) return;

    for (const path of assetPaths) assets.add(path);
    let directory = paths.length ? dirname(paths[0]) : examplesRoot;
    while (paths.some((path) => !inside(directory, path))) directory = dirname(directory);
    examples[id] = {
      packages,
      assets: [...assetPaths].sort(),
      files:
        paths.length > 1
          ? paths.map((path) => {
              downloads.add(path);
              return {
                name: relative(directory, path),
                url: `/example-files/${relative(examplesRoot, path)}`,
              };
            })
          : [],
    };
  }

  for (const entry of exampleFiles) {
    const paths = new Set([entry]);
    const names = new Set();
    const assetPaths = new Set();
    for (const path of paths) {
      const info = files.get(path);
      for (const asset of info.assets) assetPaths.add(asset);
      for (const specifier of info.imports) {
        if (specifier.startsWith('.')) paths.add(resolveExampleImport(path, specifier, files));
        else {
          const name = dependencyPackage(specifier);
          if (name) names.add(name);
        }
      }
    }
    record(basename(entry, '.vue'), names, assetPaths, [...paths]);
  }

  for (const [id, { language, source }] of Object.entries(codeSources)) {
    if (!['vue', 'ts', 'js', 'tsx', 'jsx'].includes(language)) continue;
    const info = inspect(source, language === 'vue');
    const names = info.imports
      .filter((specifier) => !specifier.startsWith('.'))
      .map(dependencyPackage)
      .filter(Boolean);
    record(id, new Set(names), new Set(info.assets));
  }

  for (const asset of assets) await access(resolve(publicRoot, `.${asset}`));
  await rm(downloadsRoot, { recursive: true, force: true });
  for (const path of downloads) {
    const target = resolve(downloadsRoot, relative(examplesRoot, path));
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, files.get(path).source);
  }
  return examples;
}
