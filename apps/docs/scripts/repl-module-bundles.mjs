import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { build } from 'esbuild';
import ts from 'typescript';

const aggregatePrefix = 'repl-aggregate:';

async function exportedNames(file) {
  const source = await readFile(file, 'utf8');
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  if (ast.parseDiagnostics.length) throw new Error(`Cannot parse REPL entry ${file}`);
  const names = new Set();
  for (const node of ast.statements) {
    if (ts.isExportDeclaration(node)) {
      if (!node.exportClause || !ts.isNamedExports(node.exportClause))
        throw new Error(`REPL entries require explicit bundled exports: ${file}`);
      for (const item of node.exportClause.elements) names.add(item.name.text);
    } else if (ts.isExportAssignment(node)) names.add('default');
    else if (node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)) {
      if (node.modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword))
        names.add('default');
      else if (ts.isVariableStatement(node)) {
        for (const declaration of node.declarationList.declarations) {
          if (!ts.isIdentifier(declaration.name))
            throw new Error(`Unsupported REPL binding export: ${file}`);
          names.add(declaration.name.text);
        }
      } else if (node.name && ts.isIdentifier(node.name)) names.add(node.name.text);
      else throw new Error(`Unsupported REPL export: ${file}`);
    }
  }
  return [...names].sort();
}

/** Bound actual import-map traversal, including imports from UI into shared asset packages. */
export function staticModuleRequests(outputs, entry, importMap, root = process.cwd()) {
  const graph = new Map(Object.entries(outputs).map(([file, data]) => [resolve(root, file), data]));
  const visited = new Set();
  function visit(file) {
    if (visited.has(file)) return;
    visited.add(file);
    if (file === 'vue') return;
    const output = graph.get(file);
    if (!output) throw new Error(`Missing REPL module in output graph: ${file}`);
    for (const imported of output.imports) {
      if (imported.kind === 'dynamic-import') continue;
      if (imported.external) {
        const target = imported.path === 'vue' ? 'vue' : importMap[imported.path];
        if (!target) throw new Error(`Unmapped REPL external: ${imported.path}`);
        visit(target);
      } else visit(resolve(root, imported.path));
    }
  }
  visit(entry);
  return [...visited].sort();
}

/** Keep implementation identity across public entries without one chunk per individual icon. */
export async function buildReplModules({
  entryPoints,
  packageSpecifiers,
  outdir,
  assetDirectories = ['icons', 'icons-lab', 'illustrations'],
  assetGroupSize = 32,
  maxStaticRequests = 200,
}) {
  const entries = Object.entries(entryPoints).sort(([a], [b]) => a.localeCompare(b));
  const aggregates = new Map();
  const facades = new Map();
  const groupedEntries = {};
  const groupCounts = new Map();
  const contracts = new Map();
  for (const [index, [key, source]] of entries.entries()) {
    const names = await exportedNames(source);
    contracts.set(key, names);
    const directory = key.split('/')[0];
    if (!assetDirectories.includes(directory)) {
      groupedEntries[key] = source;
      continue;
    }
    const position = groupCounts.get(directory) ?? 0;
    const group =
      key === `${directory}/index` ? 'root' : `group-${Math.floor(position / assetGroupSize)}`;
    if (group !== 'root') groupCounts.set(directory, position + 1);
    const aggregate = `_assets/${directory}/${group}`;
    const symbols = names.map((name, item) => ({ name, symbol: `entry_${index}_${item}` }));
    const declarations = symbols
      .map(({ name, symbol }) => `${JSON.stringify(name)} as ${symbol}`)
      .join(', ');
    const exports = aggregates.get(aggregate) ?? [];
    exports.push(`export { ${declarations} } from ${JSON.stringify(source)};`);
    aggregates.set(aggregate, exports);
    facades.set(key, { aggregate, symbols });
  }
  for (const key of aggregates.keys()) groupedEntries[key] = `${aggregatePrefix}${key}`;
  const assetSpecifiers = assetDirectories.flatMap((directory) =>
    packageSpecifiers[directory]
      ? [packageSpecifiers[directory], `${packageSpecifiers[directory]}/*`]
      : [],
  );
  const result = await build({
    entryPoints: groupedEntries,
    outdir,
    bundle: true,
    splitting: true,
    format: 'esm',
    platform: 'browser',
    target: 'es2022',
    external: ['vue', ...assetSpecifiers],
    define: { 'process.env.NODE_ENV': '"production"' },
    minify: true,
    chunkNames: 'chunks/[name]-[hash]',
    metafile: true,
    write: false,
    logLevel: 'warning',
    plugins: [
      {
        name: 'repl-asset-groups',
        setup(plugin) {
          plugin.onResolve({ filter: /^repl-aggregate:/ }, ({ path }) => ({
            path,
            namespace: 'repl-aggregate',
          }));
          plugin.onLoad({ filter: /.*/, namespace: 'repl-aggregate' }, ({ path }) => ({
            contents: aggregates.get(path.slice(aggregatePrefix.length)).join('\n'),
            loader: 'js',
            resolveDir: process.cwd(),
          }));
        },
      },
    ],
  });
  const outputFiles = new Map(result.outputFiles.map((file) => [file.path, file.contents]));
  const outputs = result.metafile.outputs;
  for (const [key, { aggregate, symbols }] of facades) {
    const file = resolve(outdir, `${key}.js`);
    const target = resolve(outdir, `${aggregate}.js`);
    let imported = relative(dirname(file), target).replaceAll('\\', '/');
    if (!imported.startsWith('.')) imported = `./${imported}`;
    const declarations = symbols
      .map(({ name, symbol }) => `${symbol} as ${JSON.stringify(name)}`)
      .join(', ');
    outputFiles.set(file, `export { ${declarations} } from ${JSON.stringify(imported)};\n`);
    outputs[file] = {
      imports: [{ path: target, kind: 'import-statement' }],
      exports: symbols.map(({ name }) => name),
    };
  }
  const importMap = Object.fromEntries(
    entries.map(([key]) => {
      const [directory, ...subpath] = key.split('/');
      const suffix = subpath.join('/');
      return [
        packageSpecifiers[directory] + (suffix === 'index' ? '' : `/${suffix}`),
        resolve(outdir, `${key}.js`),
      ];
    }),
  );
  const outputContracts = new Map(
    Object.entries(outputs).map(([file, data]) => [resolve(file), [...data.exports].sort()]),
  );
  const graph = Object.fromEntries(
    entries.map(([key]) => {
      if (
        JSON.stringify(contracts.get(key)) !==
        JSON.stringify(outputContracts.get(resolve(outdir, `${key}.js`)))
      )
        throw new Error(`REPL public exports changed: ${key}`);
      const dependencies = staticModuleRequests(outputs, resolve(outdir, `${key}.js`), importMap);
      if (dependencies.length > maxStaticRequests)
        throw new Error(
          `REPL entry ${key} requires ${dependencies.length} static requests (budget ${maxStaticRequests})`,
        );
      return [
        key,
        dependencies.map((file) =>
          file === 'vue' ? file : relative(outdir, file).replaceAll('\\', '/'),
        ),
      ];
    }),
  );
  // Remove obsolete hashed chunks only after the new complete graph passes validation.
  await rm(outdir, { recursive: true, force: true });
  await Promise.all(
    [...outputFiles].map(async ([file, contents]) => {
      await mkdir(dirname(file), { recursive: true });
      await writeFile(file, contents);
    }),
  );
  return { graph, outputs };
}
