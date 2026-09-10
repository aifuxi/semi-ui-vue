import { readFile, readdir, writeFile, stat } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { parse } from 'yaml';
import ts from 'typescript';
import { format, resolveConfig } from 'prettier';
import { assertExactPath } from './documentation-inputs.mjs';

const app = resolve(import.meta.dirname, '..');
const prettierConfig = (await resolveConfig(import.meta.filename)) ?? {};
const pages = [];
const search = [];
const demos = new Map();
const demoRoot = resolve(app, 'src/demos');
const checkedPaths = new Set();
async function registerDemo(id, page) {
  if (demos.has(id)) {
    demos.get(id).pages.push(page.path);
    return;
  }
  const entry = resolve(demoRoot, `${id}.vue`);
  if (!entry.startsWith(`${demoRoot}/`)) throw new Error(`Invalid demo ID: ${id}`);
  const visited = new Set();
  const dependencies = new Set();
  async function visit(file) {
    if (visited.has(file)) return;
    visited.add(file);
    await assertExactPath(relative(demoRoot, file), demoRoot, checkedPaths);
    const source = await readFile(file, 'utf8');
    const script = file.endsWith('.vue')
      ? [...source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
          .map((match) => match[1])
          .join('\n')
      : source;
    const imports = new Set();
    const ast = ts.createSourceFile(file, script, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    function inspect(node) {
      if (
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      )
        imports.add(node.moduleSpecifier.text);
      if (
        ts.isCallExpression(node) &&
        node.expression.kind === ts.SyntaxKind.ImportKeyword &&
        node.arguments[0] &&
        ts.isStringLiteral(node.arguments[0])
      )
        imports.add(node.arguments[0].text);
      ts.forEachChild(node, inspect);
    }
    inspect(ast);
    for (const imported of imports) {
      if (imported.startsWith('.')) {
        const requested = resolve(dirname(file), imported);
        let dependency;
        for (const suffix of ['', '.ts', '.js', '.vue', '.json', '/index.ts', '/index.js']) {
          const candidate = requested + suffix;
          if (
            await stat(candidate).then(
              (value) => value.isFile(),
              () => false,
            )
          ) {
            dependency = candidate;
            break;
          }
        }
        if (!dependency) throw new Error(`Unresolved demo dependency: ${file} → ${imported}`);
        if (!dependency.startsWith(`${demoRoot}/`))
          throw new Error(`Demo dependency must remain inside src/demos: ${file}`);
        await visit(dependency);
      } else dependencies.add(imported);
    }
  }
  await visit(entry);
  // Retain relative imports when bilingual examples share a helper in their parent folder.
  let virtualRoot = dirname(entry);
  for (const file of visited) {
    while (!file.startsWith(`${virtualRoot}/`)) virtualRoot = dirname(virtualRoot);
  }
  const files = Object.fromEntries(
    [...visited].map((file) => [relative(virtualRoot, file), relative(demoRoot, file)]),
  );
  demos.set(id, {
    id,
    entry: relative(virtualRoot, entry),
    files,
    dependencies: [...dependencies].sort(),
    pages: [page.path],
    upstream: page.upstream ?? null,
  });
}
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(path);
      continue;
    }
    if (!entry.name.endsWith('.md')) continue;
    const source = await readFile(path, 'utf8');
    const frontmatter = source.match(/^---\n([\s\S]*?)\n---/)?.[1];
    if (!frontmatter) throw new Error(`Missing frontmatter: ${path}`);
    const values = parse(frontmatter);
    if (values.upstream && !values.icon) {
      const upstream = await readFile(
        resolve(app, '../../vendor/semi-design/content', values.upstream, 'index.md'),
        'utf8',
      );
      const upstreamData = parse(upstream.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '');
      if (upstreamData.icon) values.icon = upstreamData.icon;
    }
    const route = `/${path
      .slice(resolve(app, 'content').length + 1)
      .replace(/\.md$/, '')
      .replace(/\/index$/, '')}/`;
    const page = { ...values, path: route };
    pages.push(page);
    for (const match of source.matchAll(/::demo-block\{[^}]*demo="([^"]+)"/g))
      await registerDemo(match[1], page);
    const text = source
      .replace(/^---\n[\s\S]*?\n---/, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/::[^\n]*/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[#*`|>]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    search.push({
      title: `${page.englishTitle} ${page.title}`,
      path: route,
      text,
      locale: page.locale,
    });
  }
}
await walk(resolve(app, 'content'));
pages.sort((a, b) => a.path.localeCompare(b.path));
await writeFile(
  resolve(app, 'src/data/pages.json'),
  await format(JSON.stringify(pages), { ...prettierConfig, parser: 'json' }),
);
await writeFile(
  resolve(app, 'src/data/demos.json'),
  await format(JSON.stringify([...demos.values()].sort((a, b) => a.id.localeCompare(b.id))), {
    ...prettierConfig,
    parser: 'json',
  }),
);
await writeFile(resolve(app, 'public/search-index.json'), JSON.stringify(search) + '\n');
const escape = (value) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&apos;',
      })[char],
  );
await writeFile(
  resolve(app, 'public/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map((page) => `<url><loc>${escape(`https://semi.fuxiaochen.com${page.path}`)}</loc></url>`).join('')}</urlset>\n`,
);
console.log(`内容注册表、搜索索引和 sitemap 已生成：${pages.length} 页。`);
