import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';

export const workspace = resolve(import.meta.dirname, '../../..');
export function sourceFiles(inputs, root = workspace) {
  return [
    ...new Set(
      execFileSync(
        'git',
        ['ls-files', '--cached', '--others', '--exclude-standard', '-z', '--', ...inputs],
        { cwd: root, encoding: 'utf8' },
      )
        .split('\0')
        .filter(Boolean),
    ),
  ].sort();
}

// Keep this resolver conservative: unknown local/dynamic imports expand to all UI sources.
// Dependencies outside UI remain explicit shared inputs in each batch manifest.
export async function uiDependencies(entries, root = workspace) {
  const visited = new Set();
  const reasons = new Set();
  const files = new Set();
  async function visit(file) {
    if (visited.has(file)) return;
    visited.add(file);
    files.add(file);
    let source;
    try {
      source = await readFile(resolve(root, file), 'utf8');
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      reasons.add(`缺失依赖 ${file}`);
      return;
    }
    if (!/\.(vue|[cm]?[jt]sx?)$/.test(file)) return;
    if (file.endsWith('.vue')) {
      const scripts = [...source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
      if (scripts.some((match) => /\bsrc\s*=/.test(match[1])))
        reasons.add(`外部 SFC script ${file}`);
      source = scripts.map((match) => match[2]).join('\n');
    }
    const ast = ts.createSourceFile(
      file,
      source,
      ts.ScriptTarget.Latest,
      true,
      /\.[jt]sx$/.test(file) ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    );
    if (ast.parseDiagnostics.length) reasons.add(`脚本解析失败 ${file}`);
    const imports = new Set();
    function inspect(node) {
      if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) {
        if (node.isTypeOnly || node.importClause?.isTypeOnly) return;
        if (ts.isStringLiteral(node.moduleSpecifier)) imports.add(node.moduleSpecifier.text);
      }
      if (
        ts.isCallExpression(node) &&
        (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
          node.expression.getText(ast) === 'require' ||
          node.expression.getText(ast).startsWith('import.meta.glob'))
      ) {
        // These two registries select by current page/demo ID. The batch seeds below
        // cover that selection; hashing every matched file would reintroduce global invalidation.
        const registry =
          node.arguments[0] &&
          ts.isStringLiteral(node.arguments[0]) &&
          ((file === 'apps/docs/src/components/content/DemoBlock.vue' &&
            ['../../demos/**/*.{vue,ts,js,css,json}', '../../demos/**/*.vue'].includes(
              node.arguments[0].text,
            )) ||
            (file === 'apps/docs/src/components/content/ApiTable.vue' &&
              node.arguments[0].text === '../../data/api/*.ts'));
        if (registry && node.expression.getText(ast) === 'import.meta.glob') return;
        if (
          node.arguments[0] &&
          ts.isStringLiteral(node.arguments[0]) &&
          !node.expression.getText(ast).startsWith('import.meta.glob')
        )
          imports.add(node.arguments[0].text);
        else reasons.add(`动态依赖 ${file}`);
      }
      ts.forEachChild(node, inspect);
    }
    inspect(ast);
    for (const imported of imports) {
      let requested;
      if (imported === '@aifuxi/semi-ui-vue') requested = 'packages/ui/src/index';
      else if (imported.startsWith('@aifuxi/semi-ui-vue/'))
        requested = `packages/ui/src/${imported.slice('@aifuxi/semi-ui-vue/'.length)}`;
      else if (imported.startsWith('.'))
        requested = relative(root, resolve(root, dirname(file), imported));
      else if (imported.startsWith('~') || imported.startsWith('@/')) {
        reasons.add(`未解析别名 ${file}: ${imported}`);
        continue;
      } else continue; // External packages are covered by lockfile and shared package inputs.
      let dependency;
      for (const suffix of [
        '',
        '.ts',
        '.tsx',
        '.js',
        '.vue',
        '.json',
        '/index.ts',
        '/index.tsx',
        '/index.js',
      ]) {
        const candidate = requested + suffix;
        if (
          await stat(resolve(root, candidate)).then(
            (value) => value.isFile(),
            () => false,
          )
        ) {
          dependency = candidate;
          break;
        }
      }
      if (!dependency) {
        reasons.add(`未解析依赖 ${file}: ${imported}`);
        continue;
      }
      // Generated site registries include every demo. Their generator is a shared input;
      // seed only the current batch plus the shell, rather than following that registry.
      if (
        dependency.startsWith('packages/ui/src/') ||
        dependency.startsWith('apps/docs/src/demos/')
      )
        await visit(dependency);
      else files.add(dependency);
    }
  }
  for (const entry of entries) await visit(entry);
  if (reasons.size) for (const file of sourceFiles(['packages/ui/src'], root)) files.add(file);
  return { files: [...files].sort(), fallback: [...reasons].sort() };
}

export async function batchInputs(batch, root = workspace) {
  const explicit = sourceFiles(batch.inputs, root);
  if (batch.dependencyMode !== 'imports-v1') return { files: explicit, fallback: [] };
  const entries = explicit.filter(
    (file) =>
      /\.(vue|[cm]?[jt]sx?)$/.test(file) &&
      (file.startsWith('apps/docs/src/demos/') ||
        file.startsWith('apps/docs/src/components/') ||
        file.startsWith('apps/docs/src/layouts/') ||
        file.startsWith('apps/docs/src/composables/') ||
        file === 'apps/docs/src/app.vue'),
  );
  const dependencies = await uiDependencies(entries, root);
  return {
    files: [...new Set([...explicit, ...dependencies.files])].sort(),
    fallback: dependencies.fallback,
  };
}

/** Check the index AND real directory entries, even on case-insensitive macOS volumes. */
export async function preflightBatch(batch, root = workspace) {
  const files = sourceFiles(['apps/docs/src/demos'], root);
  const indexed = new Set(files);
  for (const example of batch.examples)
    for (const id of [example.zhCN, example.enUS]) {
      const file = `apps/docs/src/demos/${id}.vue`;
      if (!indexed.has(file)) throw new Error(`示例未按精确路径登记：${file}`);
    }
  const { files: inputs } = await batchInputs(batch, root);
  const checked = new Set();
  for (const file of inputs.filter((file) => file.startsWith('apps/docs/src/demos/'))) {
    let parent = root;
    for (const part of file.split('/')) {
      const path = resolve(parent, part);
      if (!checked.has(path)) {
        if (!(await readdir(parent)).includes(part))
          throw new Error(`Git 路径与磁盘大小写不一致或文件缺失：${file}`);
        checked.add(path);
      }
      parent = path;
    }
  }
}
