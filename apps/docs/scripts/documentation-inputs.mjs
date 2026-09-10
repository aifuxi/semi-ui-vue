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

const foundationDirectory = 'packages/foundation-integration';
const foundationIndex = `${foundationDirectory}/src/index.ts`;
const scriptPattern = /\.(vue|[cm]?[jt]sx?)$/;

async function parseScript(file, root) {
  let source = await readFile(resolve(root, file), 'utf8');
  const fallback = [];
  if (file.endsWith('.vue')) {
    const scripts = [...source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
    if (scripts.some((match) => /\bsrc\s*=/.test(match[1])))
      fallback.push(`外部 SFC script ${file}`);
    source = scripts.map((match) => match[2]).join('\n');
  }
  const ast = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    /\.[jt]sx$/.test(file) ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  if (ast.parseDiagnostics.length) fallback.push(`脚本解析失败 ${file}`);
  return { ast, fallback };
}

async function resolveLocal(requested, root) {
  requested = requested.split('?')[0]; // Vite ?raw and ?worker still consume the source bytes.
  // TS source commonly imports its eventual .js output. Match the build resolver.
  const requests = /\.[cm]?js$/.test(requested)
    ? [requested.replace(/\.[cm]?js$/, '.ts'), requested.replace(/\.[cm]?js$/, '.tsx'), requested]
    : [requested];
  for (const request of requests)
    for (const suffix of [
      '',
      '.ts',
      '.tsx',
      '.js',
      '.mjs',
      '.vue',
      '.json',
      '/index.ts',
      '/index.tsx',
      '/index.js',
    ]) {
      const candidate = request + suffix;
      if (
        await stat(resolve(root, candidate)).then(
          (value) => value.isFile(),
          () => false,
        )
      )
        return candidate;
    }
}

// Only proven forwarding facades can be narrowed. Build aliases, plugins and executable
// helpers stay shared; adding executable code to an unselected barrel target expands safely.
async function foundationInputs(root) {
  const files = sourceFiles([foundationDirectory], root);
  const shared = new Set();
  const exports = new Map();
  const fallback = [];
  const pure = new Map();
  for (const file of files) {
    if (file.endsWith('.d.ts') || file.endsWith('.test.ts')) continue;
    if (!file.endsWith('.js') || !file.startsWith(`${foundationDirectory}/src/`)) {
      shared.add(file);
      continue;
    }
    let parsed;
    try {
      parsed = await parseScript(file, root);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      shared.add(file);
      fallback.push(`缺失 Foundation 输入 ${file}`);
      continue;
    }
    const forwarding =
      !parsed.fallback.length &&
      parsed.ast.statements.every(
        (node) =>
          ts.isExportDeclaration(node) &&
          node.moduleSpecifier &&
          ts.isStringLiteral(node.moduleSpecifier),
      );
    let pinnedForwarding = forwarding;
    if (forwarding) {
      for (const node of parsed.ast.statements) {
        const imported = node.moduleSpecifier.text;
        if (!imported.startsWith('.')) {
          pinnedForwarding = false;
          continue;
        }
        const requested = relative(root, resolve(root, dirname(file), imported));
        const dependency = await resolveLocal(requested, root);
        if (!requested.startsWith('vendor/semi-design/')) {
          pinnedForwarding = false;
          if (imported.includes('vendor/semi-design/'))
            fallback.push(`Foundation 转发越过固定 vendor 边界 ${file}: ${imported}`);
        } else if (!dependency || !/\.[cm]?[jt]sx?$/.test(dependency)) {
          pinnedForwarding = false;
          fallback.push(`非脚本或缺失的 Foundation 转发 ${file}: ${imported}`);
        }
      }
    }
    pure.set(file, forwarding ? parsed.ast : null);
    if (!pinnedForwarding) shared.add(file);
  }
  if (!files.includes(foundationIndex)) return { shared: [...shared], exports, fallback };
  let parsed;
  try {
    parsed = await parseScript(foundationIndex, root);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    fallback.push(`缺失 Foundation 根导出 ${foundationIndex}`);
    return { shared: [...shared], exports, fallback };
  }
  fallback.push(...parsed.fallback);
  for (const node of parsed.ast.statements) {
    if (node.isTypeOnly) continue;
    if (
      !ts.isExportDeclaration(node) ||
      !node.moduleSpecifier ||
      !ts.isStringLiteral(node.moduleSpecifier)
    ) {
      fallback.push(`非转发 Foundation 根导出 ${foundationIndex}`);
      continue;
    }
    const dependency = await resolveLocal(
      relative(root, resolve(root, dirname(foundationIndex), node.moduleSpecifier.text)),
      root,
    );
    if (!dependency || (dependency.endsWith('.js') && !pure.get(dependency))) {
      fallback.push(`无法证明无副作用的 Foundation 导出 ${node.moduleSpecifier.text}`);
      continue;
    }
    if (node.exportClause && ts.isNamedExports(node.exportClause)) {
      for (const exported of node.exportClause.elements)
        if (!exported.isTypeOnly) exports.set(exported.name.text, dependency);
    } else if (!node.exportClause) {
      if (!pure.get(dependency)) {
        fallback.push(`未解析 Foundation 星号导出 ${dependency}`);
        continue;
      }
      for (const declaration of pure.get(dependency).statements) {
        if (!declaration.exportClause || !ts.isNamedExports(declaration.exportClause)) {
          fallback.push(`未解析 Foundation 星号导出 ${dependency}`);
          continue;
        }
        for (const exported of declaration.exportClause.elements)
          if (!exported.isTypeOnly) exports.set(exported.name.text, dependency);
      }
    } else fallback.push(`未解析 Foundation 命名空间导出 ${foundationIndex}`);
  }
  return { shared: [...shared], exports, fallback };
}

// Unknown local/dynamic dependencies expand to UI, Foundation and reference adapters.
// Pinned vendor contents are covered by the submodule revision + dirty diff in fingerprint().
export async function uiDependencies(entries, root = workspace) {
  const visited = new Set();
  const reasons = new Set();
  const foundation = await foundationInputs(root);
  const files = new Set(foundation.shared);
  for (const reason of foundation.fallback) reasons.add(reason);
  async function visit(file, followLocal = false) {
    const traverseLocal =
      followLocal ||
      file.startsWith(`${foundationDirectory}/`) ||
      file.startsWith('apps/reference-react/docs-adapters/');
    const visitKey = `${file}:${traverseLocal}`;
    if (visited.has(visitKey)) return;
    visited.add(visitKey);
    files.add(file);
    if (!scriptPattern.test(file)) return;
    let parsed;
    try {
      parsed = await parseScript(file, root);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      reasons.add(`缺失依赖 ${file}`);
      return;
    }
    const { ast } = parsed;
    for (const reason of parsed.fallback) reasons.add(reason);
    const foundationNames = new Set();
    const imports = new Set();
    function inspect(node) {
      if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) {
        if (node.isTypeOnly || node.importClause?.isTypeOnly) return;
        if (ts.isStringLiteral(node.moduleSpecifier)) {
          if (node.moduleSpecifier.text === '@workspace/foundation-integration') {
            const bindings = node.importClause?.namedBindings ?? node.exportClause;
            if (bindings && (ts.isNamedImports(bindings) || ts.isNamedExports(bindings))) {
              for (const binding of bindings.elements)
                if (!binding.isTypeOnly)
                  foundationNames.add((binding.propertyName ?? binding.name).text);
            } else reasons.add(`Foundation 非命名导入 ${file}`);
          } else imports.add(node.moduleSpecifier.text);
        }
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
      if (
        ts.isNewExpression(node) &&
        node.expression.getText(ast) === 'URL' &&
        node.arguments?.[1]?.getText(ast) === 'import.meta.url'
      ) {
        if (ts.isStringLiteral(node.arguments[0])) imports.add(node.arguments[0].text);
        else reasons.add(`动态 URL 依赖 ${file}`);
      }
      ts.forEachChild(node, inspect);
    }
    inspect(ast);
    if (foundationNames.size) {
      for (const name of foundationNames) {
        const dependency = foundation.exports.get(name);
        if (dependency) await visit(dependency);
        else reasons.add(`未解析 Foundation 导出 ${name}: ${file}`);
      }
    }
    for (const imported of imports) {
      let requested;
      if (imported === '@aifuxi/semi-ui-vue') requested = 'packages/ui/src/index';
      else if (imported.startsWith('@aifuxi/semi-ui-vue/'))
        requested = `packages/ui/src/${imported.slice('@aifuxi/semi-ui-vue/'.length)}`;
      else if (imported.startsWith('.'))
        requested = relative(root, resolve(root, dirname(file), imported));
      else if (
        imported.startsWith('~') ||
        imported.startsWith('@/') ||
        imported.startsWith('@workspace/')
      ) {
        reasons.add(`未解析别名 ${file}: ${imported}`);
        continue;
      } else continue; // External packages are covered by lockfile and shared package inputs.
      // The fixed vendor source is fingerprinted as a whole. Following its aliases here
      // would duplicate the integration/build resolver and lose that stronger boundary.
      if (
        requested.startsWith('vendor/semi-design/') ||
        requested.split('/').includes('node_modules')
      )
        continue;
      const dependency = await resolveLocal(requested, root);
      if (!dependency) {
        reasons.add(`未解析依赖 ${file}: ${imported}`);
        continue;
      }
      // Generated site registries include every demo. Their generator is a shared input;
      // seed only the current batch plus the shell, rather than following that registry.
      if (
        traverseLocal ||
        dependency.startsWith('packages/ui/src/') ||
        dependency.startsWith(`${foundationDirectory}/src/`) ||
        dependency.startsWith('apps/reference-react/docs-adapters/') ||
        dependency.startsWith('apps/docs/src/demos/')
      )
        await visit(dependency, traverseLocal);
      else files.add(dependency);
    }
  }
  for (const file of foundation.shared)
    if (file !== foundationIndex && scriptPattern.test(file)) await visit(file, true);
  for (const entry of entries) await visit(entry);
  if (reasons.size)
    for (const file of sourceFiles(
      ['packages/ui/src', foundationDirectory, 'apps/reference-react/docs-adapters'],
      root,
    ))
      files.add(file);
  return { files: [...files].sort(), fallback: [...reasons].sort() };
}

export async function batchInputs(batch, root = workspace) {
  const explicit = sourceFiles(batch.inputs, root);
  if (!['imports-v1', 'imports-v2'].includes(batch.dependencyMode))
    return { files: explicit, fallback: [] };
  const entries = explicit.filter(
    (file) =>
      /\.(vue|[cm]?[jt]sx?)$/.test(file) &&
      (file.startsWith('apps/docs/src/demos/') ||
        file.startsWith('apps/docs/src/components/') ||
        file.startsWith('apps/docs/src/layouts/') ||
        file.startsWith('apps/docs/src/composables/') ||
        file.startsWith('apps/reference-react/docs-adapters/') ||
        file === 'apps/docs/src/app.vue'),
  );
  const dependencies = await uiDependencies(entries, root);
  return {
    files: [...new Set([...explicit, ...dependencies.files])].sort(),
    fallback: dependencies.fallback,
  };
}

/** Validate path spelling using directory entries, including on case-insensitive volumes. */
export async function assertExactPath(file, root, checked = new Set()) {
  let parent = root;
  for (const part of file.split('/')) {
    const path = resolve(parent, part);
    if (!checked.has(path)) {
      if (!(await readdir(parent)).includes(part))
        throw new Error(`文件路径大小写不一致或文件缺失：${file}`);
      checked.add(path);
    }
    parent = path;
  }
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
    await assertExactPath(file, root, checked);
  }
}
