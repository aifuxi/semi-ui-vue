import { readFile } from 'node:fs/promises';
import { dirname, resolve, sep } from 'node:path';
import ts from 'typescript';

/** Keep lazy CJS registration safe when esbuild creates cycles between shared chunks. */
export function replRslibFactories(entryPoints) {
  const root = entryPoints['ui/index'] && dirname(resolve(entryPoints['ui/index']));
  const runtime = root && resolve(root, '_runtime') + sep;
  return {
    name: 'repl-rslib-factories',
    setup(plugin) {
      if (!root) return;
      plugin.onLoad({ filter: /\.js$/ }, async ({ path }) => {
        if (!path.startsWith(root + sep)) return;
        const source = await readFile(path, 'utf8');
        const isRegistration = path.startsWith(runtime);
        if (!isRegistration && !source.includes('_runtime/')) return;
        const ast = ts.createSourceFile(
          path,
          source,
          ts.ScriptTarget.Latest,
          true,
          ts.ScriptKind.JS,
        );
        const imports = [];
        const body = [];
        const calls = [];
        for (const node of ast.statements) {
          if (ts.isImportDeclaration(node)) {
            const dependency = node.moduleSpecifier.text;
            if (resolve(dirname(path), dependency).startsWith(runtime)) {
              if (node.importClause) throw new Error(`Unexpected Rslib factory export: ${path}`);
              const local = `__replRegisterDependency${calls.length}`;
              imports.push(
                `import { __replRegister as ${local} } from ${JSON.stringify(dependency)};`,
              );
              calls.push(`${local}();`);
            } else imports.push(node.getText(ast));
          } else body.push(node.getText(ast));
        }
        if (!isRegistration && !calls.length) return;
        const statements = [...calls, ...body].join('\n');
        return {
          contents: isRegistration
            ? `${imports.join('\n')}
              // A shared chunk may call this before this module's body evaluates.
              // Hoisted var/function bindings avoid both TDZ and resetting an early registration.
              var __replRegistered;
              export function __replRegister() {
                if (__replRegistered) return;
                __replRegistered = true;
                ${statements}
              }`
            : `${imports.join('\n')}\n${statements}`,
          loader: 'js',
          resolveDir: dirname(path),
        };
      });
    },
  };
}
