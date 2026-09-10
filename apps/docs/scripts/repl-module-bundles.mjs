import { mkdir, mkdtemp, readFile, readdir, realpath, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { dirname, isAbsolute, matchesGlob, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRslib } from '@rslib/core';
import ts from 'typescript';

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
  infrastructurePrefixes = ['ui/_base', 'ui/_utils'],
  infrastructureEntries = ['ui/config-provider', 'ui/locale'],
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
    const infrastructure =
      infrastructureEntries.includes(key) ||
      infrastructurePrefixes.some((prefix) => key === prefix || key.startsWith(`${prefix}/`));
    if (!assetDirectories.includes(directory) && !infrastructure) {
      groupedEntries[key] = source;
      continue;
    }
    const position = groupCounts.get(directory) ?? 0;
    const group =
      key === `${directory}/index` ? 'root' : `group-${Math.floor(position / assetGroupSize)}`;
    if (group !== 'root') groupCounts.set(directory, position + 1);
    // Shared UI infrastructure is tiny and co-used. One implementation group
    // avoids extra browser requests while the original public facades stay intact.
    const aggregate = infrastructure ? '_infrastructure/ui' : `_assets/${directory}/${group}`;
    const symbols = names.map((name, item) => ({ name, symbol: `entry_${index}_${item}` }));
    const declarations = symbols
      .map(({ name, symbol }) => `${JSON.stringify(name)} as ${symbol}`)
      .join(', ');
    const exports = aggregates.get(aggregate) ?? [];
    exports.push(`export { ${declarations} } from ${JSON.stringify(source)};`);
    aggregates.set(aggregate, exports);
    facades.set(key, { aggregate, symbols });
  }
  const assetSpecifiers = assetDirectories.flatMap((directory) =>
    packageSpecifiers[directory]
      ? [packageSpecifiers[directory], `${packageSpecifiers[directory]}/*`]
      : [],
  );
  const staging = await mkdtemp(resolve(tmpdir(), 'repl-rslib-'));
  const outputFiles = new Map();
  const outputs = {};
  try {
    await writeFile(resolve(staging, 'package.json'), '{"type":"module"}');
    for (const [key, declarations] of aggregates) {
      const file = resolve(staging, 'entries', `${key}.js`);
      await mkdir(dirname(file), { recursive: true });
      await writeFile(file, declarations.join('\n'));
      groupedEntries[key] = file;
    }
    const uiRoot =
      entryPoints['ui/index'] && (await realpath(dirname(resolve(entryPoints['ui/index']))));
    const uiPackageRoot = uiRoot && dirname(uiRoot);
    const uiSideEffects =
      uiPackageRoot &&
      JSON.parse(
        await readFile(resolve(uiPackageRoot, 'package.json'), 'utf8').catch((error) => {
          if (error.code === 'ENOENT') return '{}';
          throw error;
        }),
      ).sideEffects;
    function canOmitBareImport(file) {
      if (!uiRoot || !file.startsWith(uiRoot + sep)) return false;
      if (uiSideEffects === false) return true;
      if (!Array.isArray(uiSideEffects)) return false;
      const path = `./${relative(uiPackageRoot, file).replaceAll('\\', '/')}`;
      return !uiSideEffects.some((pattern) => matchesGlob(path, pattern));
    }
    // Rslib moves shared modules into an unnamed chunk before splitChunks runs.
    // Derive sharing from the input graph so unrelated public entries stay separate.
    const owners = new Map();
    const dependencies = new Map();
    const canonicalPaths = new Map();
    const primitives = new Set();
    async function collect(file, owner, visited) {
      if (!canonicalPaths.has(file)) canonicalPaths.set(file, await realpath(file));
      file = canonicalPaths.get(file);
      if (visited.has(file)) return;
      visited.add(file);
      const usedBy = owners.get(file) ?? new Set();
      usedBy.add(owner);
      owners.set(file, usedBy);
      if (!dependencies.has(file)) {
        const source = await readFile(file, 'utf8');
        const ast = ts.createSourceFile(
          file,
          source,
          ts.ScriptTarget.Latest,
          true,
          ts.ScriptKind.JS,
        );
        if (
          Buffer.byteLength(source) <= 1024 &&
          canOmitBareImport(file) &&
          !ast.statements.some(
            (node) =>
              (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
              node.moduleSpecifier,
          )
        )
          primitives.add(file);
        dependencies.set(
          file,
          ast.statements.flatMap((node) => {
            const specifier =
              (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
              node.moduleSpecifier;
            if (!(
              specifier &&
              ts.isStringLiteral(specifier) &&
              (specifier.text.startsWith('.') || isAbsolute(specifier.text))
            ))
              return [];
            const dependency = resolve(dirname(file), specifier.text);
            // The published UI marks pure ESM facades as side-effect-free. Following
            // their ignored bare imports would incorrectly group most of the library.
            if (ts.isImportDeclaration(node) && !node.importClause && canOmitBareImport(dependency))
              return [];
            return [dependency];
          }),
        );
      }
      for (const dependency of dependencies.get(file)) await collect(dependency, owner, visited);
    }
    for (const [owner, file] of Object.entries(groupedEntries))
      await collect(file, owner, new Set());
    const sharedNames = new Map(
      [...owners].map(([file, usedBy]) => [
        file,
        `chunks/shared-${createHash('sha256')
          .update([...usedBy].sort().join('\n'))
          .digest('hex')
          .slice(0, 12)}`,
      ]),
    );
    // Bound tiny dependency-free helpers to 32 KiB of source per group. Their
    // per-component ownership would otherwise create dozens of 50–100 byte requests.
    [...primitives]
      .filter((file) => owners.get(file).size > 1)
      .sort()
      .forEach((file, index) => {
        sharedNames.set(file, `chunks/primitives-${Math.floor(index / 32)}`);
      });
    const compiled = resolve(staging, 'output');
    const rslib = await createRslib({
      config: {
        lib: [{ format: 'esm', syntax: 'es2022' }],
        source: {
          entry: groupedEntries,
          define: { 'process.env.NODE_ENV': '"production"' },
        },
        output: {
          target: 'web',
          distPath: { root: compiled },
          minify: true,
          autoExternal: false,
          cleanDistPath: false,
        },
        performance: { buildCache: false, printFileSize: false },
        tools: {
          rspack: {
            externals: [
              ({ request }, callback) => {
                if (
                  request === 'vue' ||
                  assetSpecifiers.some((name) =>
                    name.endsWith('/*') ? request?.startsWith(name.slice(0, -1)) : request === name,
                  )
                )
                  callback(null, `module ${request}`);
                else callback();
              },
            ],
            module: {
              parser: { javascript: { importDynamic: true } },
              rules: uiRoot
                ? [
                    {
                      test: /\.js$/,
                      include: uiRoot,
                      use: [
                        {
                          loader: fileURLToPath(
                            new URL('./repl-rslib-factories.mjs', import.meta.url),
                          ),
                          options: { root: uiRoot },
                        },
                      ],
                    },
                  ]
                : [],
            },
            output: { chunkFilename: 'chunks/[name]-[contenthash:8].js' },
            optimization: {
              concatenateModules: false,
              splitChunks: {
                chunks: 'all',
                minSize: 0,
                minChunks: 2,
                cacheGroups: {
                  default: false,
                  defaultVendors: false,
                  shared: {
                    test: (module) => (owners.get(module.resource)?.size ?? 0) > 1,
                    chunks: 'all',
                    minChunks: 2,
                    minSize: 0,
                    enforce: true,
                    name: (module) => sharedNames.get(module.resource),
                  },
                },
              },
            },
          },
        },
      },
    });
    await rslib.build();
    for (const name of await readdir(compiled, { recursive: true })) {
      if (!(await stat(resolve(compiled, name))).isFile()) continue;
      const file = resolve(outdir, name);
      // Preserve compiler-emitted assets, including third-party LICENSE companions.
      if (!name.endsWith('.js')) {
        outputFiles.set(file, await readFile(resolve(compiled, name)));
        continue;
      }
      const source = await readFile(resolve(compiled, name), 'utf8');
      const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
      const imports = [];
      function visit(node) {
        const specifier =
          ts.isImportDeclaration(node) || ts.isExportDeclaration(node)
            ? node.moduleSpecifier
            : ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword
              ? node.arguments[0]
              : undefined;
        if (specifier && ts.isStringLiteral(specifier)) {
          const external = !specifier.text.startsWith('.');
          imports.push({
            path: external ? specifier.text : resolve(dirname(file), specifier.text),
            external,
            kind: ts.isCallExpression(node) ? 'dynamic-import' : 'import-statement',
          });
        }
        ts.forEachChild(node, visit);
      }
      visit(ast);
      outputFiles.set(file, source);
      outputs[file] = { imports, exports: await exportedNames(resolve(compiled, name)) };
    }
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
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
