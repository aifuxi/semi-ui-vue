import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));

function relativeImport(fromDirectory, target) {
  const relative = path.relative(fromDirectory, target).replaceAll(path.sep, '/');
  return relative.startsWith('.') ? relative : `./${relative}`;
}

function runtimeExportNames(source, fileName) {
  const sourceFile = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, false);
  const names = new Set();
  for (const statement of sourceFile.statements) {
    if (ts.isExportAssignment(statement) && !statement.isExportEquals) {
      names.add('default');
      continue;
    }
    if (ts.isExportDeclaration(statement)) {
      if (!statement.exportClause || !ts.isNamedExports(statement.exportClause)) {
        throw new Error(`browser wrapper 不支持 export * 产物：${fileName}`);
      }
      for (const element of statement.exportClause.elements) names.add(element.name.text);
      continue;
    }
    if (statement.modifiers?.some(({ kind }) => kind === ts.SyntaxKind.ExportKeyword)) {
      throw new Error(`browser wrapper 不支持声明式导出产物：${fileName}`);
    }
  }
  if (!names.size) throw new Error(`browser wrapper 没有运行时导出：${fileName}`);
  return [...names].sort();
}

function runtimeRootExports(source, uiRoot, browserDirectory, uiExports) {
  const sourceFile = ts.createSourceFile('index.ts', source, ts.ScriptTarget.Latest, false);
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  const statements = [];

  for (const statement of sourceFile.statements) {
    if (!ts.isExportDeclaration(statement) || statement.isTypeOnly) continue;
    if (!statement.moduleSpecifier || !ts.isStringLiteral(statement.moduleSpecifier)) {
      throw new Error('UI 根入口只允许从公开子路径转发运行时导出');
    }
    let exportClause = statement.exportClause;
    if (exportClause && ts.isNamedExports(exportClause)) {
      const elements = exportClause.elements.filter((element) => !element.isTypeOnly);
      if (!elements.length) continue;
      exportClause = ts.factory.createNamedExports(
        elements.map((element) =>
          ts.factory.createExportSpecifier(false, element.propertyName, element.name),
        ),
      );
    }

    const subpath = statement.moduleSpecifier.text;
    const contract = uiExports[subpath];
    const target = contract?.browser ?? contract?.import;
    if (typeof target !== 'string') throw new Error(`UI 根入口引用了未发布子路径：${subpath}`);
    const modulePath = relativeImport(browserDirectory, path.join(uiRoot, target));
    statements.push(
      ts.factory.createExportDeclaration(
        undefined,
        false,
        exportClause,
        ts.factory.createStringLiteral(modulePath),
        undefined,
      ),
    );
  }

  return `${statements.map((statement) => printer.printNode(ts.EmitHint.Unspecified, statement, sourceFile)).join('\n')}\n`;
}

export async function generateUiBrowserEntries({
  uiRoot = path.join(workspaceRoot, 'packages/ui'),
  themeRoot = path.join(workspaceRoot, 'packages/theme-default'),
} = {}) {
  const [uiManifest, themeManifest, rootSource] = await Promise.all([
    readFile(path.join(uiRoot, 'package.json'), 'utf8').then(JSON.parse),
    readFile(path.join(themeRoot, 'package.json'), 'utf8').then(JSON.parse),
    readFile(path.join(uiRoot, 'src/index.ts'), 'utf8'),
  ]);
  const uiExports = uiManifest.exports;
  const themeExports = themeManifest.exports;
  const styledSubpaths = Object.keys(uiExports).filter(
    (subpath) => subpath !== '.' && themeExports[`${subpath}.css`],
  );
  const browserDirectory = path.join(uiRoot, 'dist/_browser');

  if (uiExports['.']?.browser !== './dist/_browser/index.js') {
    throw new Error('UI 根入口缺少 browser 条件');
  }
  for (const subpath of styledSubpaths) {
    const name = subpath.slice(2);
    if (uiExports[subpath]?.browser !== `./dist/_browser/${name}.js`) {
      throw new Error(`UI 样式入口缺少 browser 条件：${subpath}`);
    }
  }
  const unexpected = Object.entries(uiExports).find(
    ([subpath, contract]) =>
      subpath !== '.' && contract?.browser && !styledSubpaths.includes(subpath),
  );
  if (unexpected) throw new Error(`UI browser 条件没有对应主题样式：${unexpected[0]}`);

  await rm(browserDirectory, { recursive: true, force: true });
  await mkdir(browserDirectory, { recursive: true });
  await Promise.all(
    styledSubpaths.map(async (subpath) => {
      const name = subpath.slice(2);
      const contract = uiExports[subpath];
      const sourcePath = path.join(uiRoot, contract.import);
      const source = await readFile(sourcePath, 'utf8');
      const importPath = relativeImport(browserDirectory, sourcePath);
      const exportNames = runtimeExportNames(source, sourcePath);
      const namedExports = exportNames.filter((name) => name !== 'default');
      const namedSource = namedExports.length
        ? `const { ${namedExports.join(', ')} } = componentModule;\nexport { ${namedExports.join(', ')} };\n`
        : '';
      const defaultSource = exportNames.includes('default')
        ? 'export default componentModule.default;\n'
        : '';
      await writeFile(
        path.join(browserDirectory, `${name}.js`),
        `import '@aifuxi/semi-theme-default/${name}.css';\nimport * as componentModule from '${importPath}';\n${namedSource}${defaultSource}`,
      );
    }),
  );
  await writeFile(
    path.join(browserDirectory, 'index.js'),
    runtimeRootExports(rootSource, uiRoot, browserDirectory, uiExports),
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await generateUiBrowserEntries();
}
