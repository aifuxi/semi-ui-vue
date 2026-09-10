import { createRequire } from 'node:module';
import { basename, dirname, isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const contentRequire = createRequire(require.resolve('@nuxt/content'));
const mdcRequire = createRequire(contentRequire.resolve('@nuxtjs/mdc'));
const shikiRequire = createRequire(mdcRequire.resolve('shiki'));

// Rspack executes loaders right to left: resolve the generated imports before SWC.
export function nuxtTemplateLoaders(root) {
  return [
    {
      loader: 'builtin:swc-loader',
      options: { jsc: { parser: { syntax: 'typescript' }, target: 'es2022' } },
    },
    { loader: fileURLToPath(import.meta.url), options: { root } },
  ];
}

export default function resolveTemplateImports(code) {
  let template = this.resourcePath.split('/.virtual/')[1];
  while (template.includes('%')) template = decodeURIComponent(template);
  template = resolve(this.getOptions().root, template.replace(/^virtual:nuxt:/, ''));
  const fromMdc = /^mdc-(?:imports|highlighter)\.mjs$/.test(basename(template));
  const source = ts.createSourceFile(template, code, ts.ScriptTarget.Latest, true);
  const edits = [];
  function visit(node) {
    const specifier =
      ts.isImportDeclaration(node) || ts.isExportDeclaration(node)
        ? node.moduleSpecifier
        : ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword
          ? node.arguments[0]
          : undefined;
    if (specifier && ts.isStringLiteral(specifier)) {
      const path = specifier.text;
      let target;
      if (path.startsWith('.')) target = resolve(dirname(template), path);
      else if (fromMdc && !path.startsWith('#') && !isAbsolute(path)) {
        // Generated MDC imports retain their package owner's dependency resolution.
        try {
          target = mdcRequire.resolve(path);
        } catch {
          target = shikiRequire.resolve(path);
        }
      }
      if (target) edits.push([specifier.getStart(source), specifier.end, JSON.stringify(target)]);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  let resolved = code;
  for (const [start, end, value] of edits.sort((a, b) => b[0] - a[0])) {
    resolved = resolved.slice(0, start) + value + resolved.slice(end);
  }
  return resolved;
}
