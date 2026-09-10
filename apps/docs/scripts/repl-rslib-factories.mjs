import { dirname, resolve, sep } from 'node:path';
import ts from 'typescript';

/** Register lazy CJS factories before evaluating consumers across shared ESM cycles. */
export default function replRslibFactories(source) {
  const { root } = this.getOptions();
  const path = this.resourcePath;
  const runtime = resolve(root, '_runtime') + sep;
  const isRegistration = path.startsWith(runtime);
  if (!isRegistration && !source.includes('_runtime/')) return source;
  const ast = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const imports = [];
  const body = [];
  const calls = [];
  for (const node of ast.statements) {
    if (ts.isImportDeclaration(node)) {
      const dependency = node.moduleSpecifier.text;
      if (resolve(dirname(path), dependency).startsWith(runtime)) {
        if (node.importClause) throw new Error(`Unexpected Rslib factory export: ${path}`);
        const local = `__replRegisterDependency${calls.length}`;
        imports.push(`import { __replRegister as ${local} } from ${JSON.stringify(dependency)};`);
        calls.push(`${local}();`);
      } else imports.push(node.getText(ast));
    } else body.push(node.getText(ast));
  }
  if (!isRegistration && !calls.length) return source;
  const statements = [...calls, ...body].join('\n');
  return isRegistration
    ? `${imports.join('\n')}
              // A shared chunk may call this before this module's body evaluates.
              // Hoisted var/function bindings avoid both TDZ and resetting an early registration.
              var __replRegistered;
              export function __replRegister() {
                if (__replRegistered) return;
                __replRegistered = true;
                ${statements}
              }`
    : `${imports.join('\n')}\n${statements}`;
}
