import { execFileSync } from 'node:child_process';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { format, resolveConfig } from 'prettier';
import ts from 'typescript';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const vendorRoot = path.join(workspaceRoot, 'vendor/semi-design');
const outputDirectory = path.join(workspaceRoot, 'docs/inventory');
const jsonOutputPath = path.join(outputDirectory, 'semi-v2.102.0.json');
const markdownOutputPath = path.join(outputDirectory, 'README.md');
const expectedCommit = 'cdfba6e520fc83ad871b30f51f36d8af3aaa5a21';
const expectedTag = 'v2.102.0';
const sourceExtensions = new Set(['.js', '.jsx', '.ts', '.tsx']);
const checkOnly = process.argv.includes('--check');

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function relativeToWorkspace(filePath) {
  return toPosix(path.relative(workspaceRoot, filePath));
}

function git(args) {
  return execFileSync('git', args, {
    cwd: workspaceRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function verifyVendor() {
  const commit = git(['-C', 'vendor/semi-design', 'rev-parse', 'HEAD']);
  const tag = git(['-C', 'vendor/semi-design', 'describe', '--tags', '--exact-match']);
  const changes = git([
    '-C',
    'vendor/semi-design',
    'status',
    '--porcelain',
    '--untracked-files=all',
  ]);

  if (commit !== expectedCommit || tag !== expectedTag) {
    throw new Error(
      `inventory 只能从 ${expectedTag} / ${expectedCommit} 生成，当前为 ${tag} / ${commit}`,
    );
  }
  if (changes) {
    throw new Error(`vendor/semi-design 不是只读干净状态：\n${changes}`);
  }
}

async function exists(filePath) {
  try {
    await readFile(filePath);
    return true;
  } catch (error) {
    if (error && typeof error === 'object' && error.code === 'EISDIR') {
      return true;
    }
    if (error && typeof error === 'object' && error.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function listFiles(directory, predicate = () => true) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(entryPath, predicate)));
    } else if (predicate(entryPath)) {
      files.push(entryPath);
    }
  }

  return files.sort((left, right) => left.localeCompare(right));
}

function scriptKind(filePath) {
  if (filePath.endsWith('.tsx')) return ts.ScriptKind.TSX;
  if (filePath.endsWith('.jsx')) return ts.ScriptKind.JSX;
  if (filePath.endsWith('.js')) return ts.ScriptKind.JS;
  return ts.ScriptKind.TS;
}

async function parseSource(filePath) {
  const source = await readFile(filePath, 'utf8');
  return {
    source,
    sourceFile: ts.createSourceFile(
      filePath,
      source,
      ts.ScriptTarget.Latest,
      true,
      scriptKind(filePath),
    ),
  };
}

function hasModifier(node, kind) {
  return node.modifiers?.some((modifier) => modifier.kind === kind) ?? false;
}

function declarationNames(name) {
  if (ts.isIdentifier(name)) return [name.text];
  if (ts.isObjectBindingPattern(name) || ts.isArrayBindingPattern(name)) {
    return name.elements.flatMap((element) =>
      ts.isBindingElement(element) ? declarationNames(element.name) : [],
    );
  }
  return [];
}

async function resolveRelativeModule(fromFile, specifier) {
  if (!specifier.startsWith('.')) return null;

  const base = path.resolve(path.dirname(fromFile), specifier);
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    `${base}.jsx`,
    path.join(base, 'index.ts'),
    path.join(base, 'index.tsx'),
    path.join(base, 'index.js'),
    path.join(base, 'index.jsx'),
  ];

  for (const candidate of candidates) {
    if (sourceExtensions.has(path.extname(candidate)) && (await exists(candidate))) {
      return candidate;
    }
  }

  return null;
}

function uniqueExports(exports) {
  const seen = new Set();
  return exports
    .filter((entry) => {
      const key = `${entry.name}\u0000${entry.typeOnly}\u0000${entry.source ?? ''}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort(
      (left, right) =>
        left.name.localeCompare(right.name) ||
        String(left.source).localeCompare(String(right.source)),
    );
}

async function collectExports(entryPath, visited = new Set()) {
  const realEntryPath = path.resolve(entryPath);
  if (visited.has(realEntryPath)) return [];
  visited.add(realEntryPath);

  const { sourceFile } = await parseSource(realEntryPath);
  const exported = [];

  for (const node of sourceFile.statements) {
    if (ts.isExportDeclaration(node)) {
      const source =
        node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)
          ? node.moduleSpecifier.text
          : null;
      if (node.exportClause && ts.isNamedExports(node.exportClause)) {
        for (const element of node.exportClause.elements) {
          exported.push({
            name: element.name.text,
            importedName: element.propertyName?.text ?? element.name.text,
            source,
            typeOnly: Boolean(node.isTypeOnly || element.isTypeOnly),
          });
        }
      } else if (!node.exportClause && source) {
        const resolved = await resolveRelativeModule(realEntryPath, source);
        if (resolved) {
          const nested = await collectExports(resolved, visited);
          exported.push(...nested.filter((entry) => entry.name !== 'default'));
        } else {
          exported.push({
            name: '*',
            importedName: '*',
            source,
            typeOnly: Boolean(node.isTypeOnly),
          });
        }
      }
      continue;
    }

    if (ts.isExportAssignment(node)) {
      exported.push({ name: 'default', importedName: 'default', source: null, typeOnly: false });
      continue;
    }

    if (!hasModifier(node, ts.SyntaxKind.ExportKeyword)) continue;

    const typeOnly =
      ts.isInterfaceDeclaration(node) ||
      ts.isTypeAliasDeclaration(node) ||
      ts.isModuleDeclaration(node);
    const isDefault = hasModifier(node, ts.SyntaxKind.DefaultKeyword);

    if (isDefault) {
      exported.push({ name: 'default', importedName: 'default', source: null, typeOnly });
    } else if (
      ts.isClassDeclaration(node) ||
      ts.isFunctionDeclaration(node) ||
      ts.isInterfaceDeclaration(node) ||
      ts.isTypeAliasDeclaration(node) ||
      ts.isEnumDeclaration(node) ||
      ts.isModuleDeclaration(node)
    ) {
      if (node.name) {
        exported.push({
          name: node.name.text,
          importedName: node.name.text,
          source: null,
          typeOnly,
        });
      }
    } else if (ts.isVariableStatement(node)) {
      for (const declaration of node.declarationList.declarations) {
        for (const name of declarationNames(declaration.name)) {
          exported.push({ name, importedName: name, source: null, typeOnly: false });
        }
      }
    }
  }

  return uniqueExports(exported);
}

function packageName(specifier) {
  if (specifier.startsWith('@')) return specifier.split('/').slice(0, 2).join('/');
  return specifier.split('/')[0];
}

async function collectImports(files) {
  const specifiers = new Set();

  for (const filePath of files) {
    const { source, sourceFile } = await parseSource(filePath);
    for (const node of sourceFile.statements) {
      if (
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      ) {
        specifiers.add(node.moduleSpecifier.text);
      }
    }

    for (const match of source.matchAll(/\b(?:require|import)\s*\(\s*['"]([^'"]+)['"]\s*\)/g)) {
      specifiers.add(match[1]);
    }
  }

  const all = [...specifiers].sort();
  return {
    externalPackages: [
      ...new Set(all.filter((specifier) => !specifier.startsWith('.')).map(packageName)),
    ].sort(),
    foundationModules: [
      ...new Set(
        all
          .filter((specifier) => specifier.startsWith('@douyinfe/semi-foundation/'))
          .map((specifier) => specifier.split('/')[2])
          .filter(Boolean),
      ),
    ].sort(),
    upstreamSpecifiers: all.filter((specifier) => specifier.startsWith('@douyinfe/')),
  };
}

function normalizeKey(value) {
  return value.toLowerCase().replaceAll(/[^a-z0-9]/g, '');
}

function rootModuleKey(source) {
  if (!source?.startsWith('./')) return null;
  return source.slice(2).split('/')[0];
}

function countMatches(source, expression) {
  return [...source.matchAll(expression)].length;
}

function extractApiSections(markdown) {
  const headings = markdown
    .split('\n')
    .map((line, index) => {
      const match = /^(#{2,6})\s+(.+?)\s*$/.exec(line);
      return match ? { level: match[1].length, title: match[2], line: index + 1 } : null;
    })
    .filter(Boolean);
  const sections = [];

  for (let index = 0; index < headings.length; index += 1) {
    const heading = headings[index];
    if (!/\bapi\b|api\s*参考|api参考/i.test(heading.title)) continue;
    const children = [];
    for (let childIndex = index + 1; childIndex < headings.length; childIndex += 1) {
      const child = headings[childIndex];
      if (child.level <= heading.level) break;
      children.push(child.title);
    }
    sections.push({ title: heading.title, line: heading.line, headings: children });
  }

  return sections;
}

async function collectDocumentation() {
  const contentRoot = path.join(vendorRoot, 'content');
  const markdownFiles = await listFiles(contentRoot, (filePath) => filePath.endsWith('.md'));
  const pageDirectories = [
    ...new Set(markdownFiles.map((filePath) => path.dirname(filePath))),
  ].sort();
  const pages = [];

  for (const directory of pageDirectories) {
    const zhPath = path.join(directory, 'index.md');
    const enPath = path.join(directory, 'index-en-US.md');
    if (!(await exists(zhPath)) && !(await exists(enPath))) continue;

    const relativeDirectory = toPosix(path.relative(contentRoot, directory));
    const [category, ...rest] = relativeDirectory.split('/');
    const zhSource = (await exists(zhPath)) ? await readFile(zhPath, 'utf8') : '';
    const enSource = (await exists(enPath)) ? await readFile(enPath, 'utf8') : '';
    pages.push({
      category,
      slug: rest.at(-1) ?? category,
      directory: relativeToWorkspace(directory),
      zhCN: zhSource
        ? {
            path: relativeToWorkspace(zhPath),
            apiSections: extractApiSections(zhSource),
            liveDemoCount: countMatches(zhSource, /^```jsx live=true/gm),
            markdownTableRowCount: countMatches(zhSource, /^\|.*\|\s*$/gm),
          }
        : null,
      enUS: enSource
        ? {
            path: relativeToWorkspace(enPath),
            apiSections: extractApiSections(enSource),
            liveDemoCount: countMatches(enSource, /^```jsx live=true/gm),
            markdownTableRowCount: countMatches(enSource, /^\|.*\|\s*$/gm),
          }
        : null,
    });
  }

  return pages.sort(
    (left, right) =>
      left.category.localeCompare(right.category) || left.slug.localeCompare(right.slug),
  );
}

async function collectPackage(packageDirectory, entryRelativePath) {
  const packageRoot = path.join(vendorRoot, 'packages', packageDirectory);
  const manifest = await readJson(path.join(packageRoot, 'package.json'));
  const entryPath = path.join(packageRoot, entryRelativePath);
  return {
    name: manifest.name,
    version: manifest.version,
    entry: relativeToWorkspace(entryPath),
    exports: await collectExports(entryPath),
    dependencies: manifest.dependencies ?? {},
    peerDependencies: manifest.peerDependencies ?? {},
  };
}

async function collectManifest(packageDirectory) {
  const manifestPath = path.join(vendorRoot, 'packages', packageDirectory, 'package.json');
  const manifest = await readJson(manifestPath);
  return {
    name: manifest.name,
    version: manifest.version,
    manifest: relativeToWorkspace(manifestPath),
    dependencies: manifest.dependencies ?? {},
    optionalDependencies: manifest.optionalDependencies ?? {},
    peerDependencies: manifest.peerDependencies ?? {},
  };
}

async function buildInventory() {
  verifyVendor();

  const uiRoot = path.join(vendorRoot, 'packages/semi-ui');
  const foundationRoot = path.join(vendorRoot, 'packages/semi-foundation');
  const themeRoot = path.join(vendorRoot, 'packages/semi-theme-default/scss');
  const uiManifest = await readJson(path.join(uiRoot, 'package.json'));
  const rootEntryPath = path.join(uiRoot, 'index.ts');
  const rootExports = await collectExports(rootEntryPath);
  const documentation = await collectDocumentation();
  const foundationDirectories = (await readdir(foundationRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const foundationByKey = new Map(
    foundationDirectories.map((directory) => [normalizeKey(directory), directory]),
  );
  const docsByKey = new Map();
  for (const page of documentation) {
    const key = normalizeKey(page.slug);
    docsByKey.set(key, [...(docsByKey.get(key) ?? []), page]);
  }

  const moduleKeys = [
    ...new Set(rootExports.map((entry) => rootModuleKey(entry.source)).filter(Boolean)),
  ].sort();
  const modules = [];

  for (const moduleKey of moduleKeys) {
    const adapterRoot = path.join(uiRoot, moduleKey);
    const adapterFiles = (
      await listFiles(adapterRoot, (filePath) => sourceExtensions.has(path.extname(filePath)))
    )
      .filter((filePath) => !filePath.includes(`${path.sep}__test__${path.sep}`))
      .filter((filePath) => !filePath.includes(`${path.sep}_story${path.sep}`));
    const moduleRootExports = rootExports.filter(
      (entry) => rootModuleKey(entry.source) === moduleKey,
    );
    const publicEntries = [];

    for (const entry of moduleRootExports) {
      const resolved = await resolveRelativeModule(rootEntryPath, entry.source);
      publicEntries.push({
        exportName: entry.name,
        source: entry.source,
        resolvedPath: resolved ? relativeToWorkspace(resolved) : null,
        entryExports: resolved ? await collectExports(resolved) : [],
      });
    }

    const foundationDirectory = foundationByKey.get(normalizeKey(moduleKey)) ?? null;
    const foundationFiles = foundationDirectory
      ? await listFiles(path.join(foundationRoot, foundationDirectory), (filePath) =>
          ['.scss', '.ts', '.tsx'].includes(path.extname(filePath)),
        )
      : [];
    const docKey = moduleKey === 'icons' ? 'icon' : normalizeKey(moduleKey);
    const matchedDocs = docsByKey.get(docKey) ?? [];
    const allModuleFiles = await listFiles(adapterRoot);
    const cypressFiles = await listFiles(path.join(vendorRoot, 'cypress/e2e'));
    const cypressKeys = new Set([
      normalizeKey(moduleKey),
      ...(moduleKey === 'input' ? ['textarea'] : []),
    ]);

    modules.push({
      key: moduleKey,
      rootExports: moduleRootExports.map((entry) => entry.name).sort(),
      publicEntries,
      adapter: {
        directory: relativeToWorkspace(adapterRoot),
        sourceFileCount: adapterFiles.length,
        imports: await collectImports(adapterFiles),
      },
      foundation: foundationDirectory
        ? {
            directory: relativeToWorkspace(path.join(foundationRoot, foundationDirectory)),
            sourceFileCount: foundationFiles.filter((filePath) =>
              sourceExtensions.has(path.extname(filePath)),
            ).length,
            scssFileCount: foundationFiles.filter((filePath) => filePath.endsWith('.scss')).length,
            imports: await collectImports(
              foundationFiles.filter((filePath) => sourceExtensions.has(path.extname(filePath))),
            ),
          }
        : null,
      documentation: matchedDocs.map((page) => page.directory),
      evidence: {
        unitTestFiles: allModuleFiles
          .filter((filePath) => filePath.includes(`${path.sep}__test__${path.sep}`))
          .map(relativeToWorkspace),
        storyFiles: allModuleFiles
          .filter((filePath) => filePath.includes(`${path.sep}_story${path.sep}`))
          .map(relativeToWorkspace),
        cypressFiles: cypressFiles
          .filter((filePath) => {
            const scenarioName = path.basename(filePath).replace(/\.spec\.[^.]+$/, '');
            return cypressKeys.has(normalizeKey(scenarioName));
          })
          .map(relativeToWorkspace),
      },
    });
  }

  const localeFiles = await listFiles(path.join(uiRoot, 'locale/source'), (filePath) =>
    filePath.endsWith('.ts'),
  );
  const themeFiles = await listFiles(themeRoot, (filePath) => filePath.endsWith('.scss'));
  const themeSource = (
    await Promise.all(themeFiles.map((filePath) => readFile(filePath, 'utf8')))
  ).join('\n');
  const cssTokens = [...new Set(themeSource.match(/--semi-[A-Za-z0-9_-]+/g) ?? [])].sort();
  const publishedAssetPackages = {
    icons: await collectPackage('semi-icons', 'src/index.ts'),
    iconsLab: await collectPackage('semi-icons-lab', 'src/index.ts'),
    illustrations: await collectPackage('semi-illustrations', 'src/index.ts'),
  };
  const assets = {
    locales: localeFiles.map((filePath) => path.basename(filePath, '.ts')).sort(),
    theme: {
      package: '@douyinfe/semi-theme-default',
      files: themeFiles.map(relativeToWorkspace),
      cssTokens,
    },
  };
  const publicSubpaths = Object.entries(uiManifest.typesVersions?.['*'] ?? {})
    .map(([subpath, targets]) => ({ subpath, targets }))
    .sort((left, right) => left.subpath.localeCompare(right.subpath));
  const externalRootExports = rootExports.filter(
    (entry) => entry.source && !entry.source.startsWith('.'),
  );

  return {
    schemaVersion: 1,
    source: {
      package: '@douyinfe/semi-ui',
      version: uiManifest.version,
      tag: expectedTag,
      commit: expectedCommit,
      rootEntry: relativeToWorkspace(rootEntryPath),
    },
    summary: {
      rootExportCount: rootExports.length,
      rootModuleCount: modules.length,
      externalRootExportCount: externalRootExports.length,
      publicSubpathCount: publicSubpaths.length,
      documentationPageCount: documentation.length,
      zhCNDocumentationCount: documentation.filter((page) => page.zhCN).length,
      enUSDocumentationCount: documentation.filter((page) => page.enUS).length,
      foundationDirectoryCount: foundationDirectories.length,
      localeCount: assets.locales.length,
      iconExportCount: publishedAssetPackages.icons.exports.filter(
        (entry) => entry.name !== 'default',
      ).length,
      iconLabExportCount: publishedAssetPackages.iconsLab.exports.filter(
        (entry) => entry.name !== 'default',
      ).length,
      illustrationExportCount: publishedAssetPackages.illustrations.exports.filter(
        (entry) => entry.name !== 'default',
      ).length,
      themeTokenCount: cssTokens.length,
    },
    publicApi: {
      rootExports,
      externalRootExports,
      publicSubpaths,
    },
    modules,
    documentation,
    upstreamPackages: {
      semiUi: await collectManifest('semi-ui'),
      semiFoundation: await collectManifest('semi-foundation'),
      semiThemeDefault: await collectManifest('semi-theme-default'),
      ...publishedAssetPackages,
    },
    assets,
  };
}

function markdownList(items) {
  return items.length ? items.map((item) => `- \`${item}\``).join('\n') : '- 无';
}

function renderMarkdown(inventory) {
  const modulesWithoutDocs = inventory.modules
    .filter((module) => module.documentation.length === 0)
    .map((module) => module.key);
  const modulesWithoutFoundation = inventory.modules
    .filter((module) => !module.foundation)
    .map((module) => module.key);
  const modulesWithoutUnitTests = inventory.modules
    .filter((module) => module.evidence.unitTestFiles.length === 0)
    .map((module) => module.key);
  const modulesWithoutStories = inventory.modules
    .filter((module) => module.evidence.storyFiles.length === 0)
    .map((module) => module.key);
  const summary = inventory.summary;

  return `# Semi Design v2.102.0 上游 Inventory

本目录由 \`pnpm inventory:generate\` 从只读 \`vendor/semi-design\` 生成。JSON 是后续组件对齐矩阵、里程碑规划和缺口检查的机器可读输入；不要手工修改生成文件。

## 固定来源

- Tag：\`${inventory.source.tag}\`
- Commit：\`${inventory.source.commit}\`
- 根入口：\`${inventory.source.rootEntry}\`

## 汇总

| 维度 | 数量 |
| --- | ---: |
| 根入口公开导出 | ${summary.rootExportCount} |
| 根入口模块组 | ${summary.rootModuleCount} |
| 外部 Foundation 根导出 | ${summary.externalRootExportCount} |
| \`typesVersions\` 公开子路径 | ${summary.publicSubpathCount} |
| 文档页面 | ${summary.documentationPageCount} |
| 中文 / 英文文档 | ${summary.zhCNDocumentationCount} / ${summary.enUSDocumentationCount} |
| Foundation 顶层目录 | ${summary.foundationDirectoryCount} |
| Locale | ${summary.localeCount} |
| 稳定图标 / Lab 图标 / 插画导出 | ${summary.iconExportCount} / ${summary.iconLabExportCount} / ${summary.illustrationExportCount} |
| 默认主题 CSS Token | ${summary.themeTokenCount} |

## Inventory 覆盖面

- \`publicApi.rootExports\`：\`semi-ui/index.ts\` 的运行时与类型导出。
- \`publicApi.publicSubpaths\`：发布清单声明的全部 TypeScript 子路径兼容面。
- \`modules\`：按根入口来源目录聚合 Adapter、entry API、Foundation、依赖、文档和测试资产。
- \`documentation\`：中英文页面、API 标题、live demo 与 Markdown 表格行统计。
- \`upstreamPackages\`：UI/Foundation/默认主题/图标/Lab/插画的依赖与公开导出。
- \`assets\`：全部 Locale、默认主题 SCSS 文件和 CSS Token。

## 需要人工归类的上游缺口

以下清单是源事实，不自动等同于 Vue 侧缺陷。技术导出、全局 Provider 或命令式 API 可能天然没有独立文档、Foundation 或测试，进入组件里程碑前必须逐项解释。

### 没有直接匹配文档的根模块

${markdownList(modulesWithoutDocs)}

### 没有同名 Foundation 目录的根模块

${markdownList(modulesWithoutFoundation)}

### 没有上游单元测试文件的根模块

${markdownList(modulesWithoutUnitTests)}

### 没有上游 Story 文件的根模块

${markdownList(modulesWithoutStories)}

## 校验

\`pnpm check:inventory\` 会重新读取固定 submodule 并逐字比较 JSON/Markdown；上游基线、生成逻辑或生成物不一致时直接失败。
`;
}

async function assertCurrent(filePath, expected) {
  let actual = '';
  try {
    actual = await readFile(filePath, 'utf8');
  } catch (error) {
    if (!(error && typeof error === 'object' && error.code === 'ENOENT')) throw error;
  }

  if (actual !== expected) {
    throw new Error(`${relativeToWorkspace(filePath)} 已过期，请运行 pnpm inventory:generate`);
  }
}

const inventory = await buildInventory();
const prettierConfig = (await resolveConfig(workspaceRoot)) ?? {};
const jsonOutput = await format(JSON.stringify(inventory), {
  ...prettierConfig,
  filepath: jsonOutputPath,
});
const markdownOutput = await format(renderMarkdown(inventory), {
  ...prettierConfig,
  filepath: markdownOutputPath,
});

if (checkOnly) {
  await assertCurrent(jsonOutputPath, jsonOutput);
  await assertCurrent(markdownOutputPath, markdownOutput);
  process.stdout.write(
    `Semi v2.102.0 inventory 已同步：${inventory.summary.rootExportCount} 个根导出、${inventory.summary.rootModuleCount} 个模块组\n`,
  );
} else {
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(jsonOutputPath, jsonOutput);
  await writeFile(markdownOutputPath, markdownOutput);
  process.stdout.write(
    `已生成 ${relativeToWorkspace(jsonOutputPath)} 与 ${relativeToWorkspace(markdownOutputPath)}\n`,
  );
}
