import { readFile, readdir, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';
import { createJiti } from 'jiti';
import type { UnpluginOptions } from 'unplugin';

function compileJsx(code: string, filename: string): string {
  return ts.transpileModule(code, {
    fileName: filename,
    compilerOptions: {
      jsx: ts.JsxEmit.React,
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
}

const examplesId = 'virtual:pinned-documentation-examples';
const examplePrefix = 'virtual:pinned-documentation/';
async function publicImports(code: string, sourceRoot: string): Promise<string> {
  const index = await readFile(path.join(sourceRoot, 'packages/semi-ui/index.ts'), 'utf8');
  const exports = new Map(
    [...index.matchAll(/export\s*\{\s*default as (\w+)\s*\}\s*from\s*['"]([^'"]+)['"]/g)].map(
      (match) => [match[1], match[2]],
    ),
  );
  const localized = code.replace(
    /(['"])@douyinfe\/semi-ui\/(?:lib\/es\/)?locale\/source\/([A-Za-z0-9_]+)\1/g,
    (_, _quote: string, locale: string) =>
      JSON.stringify(path.join(sourceRoot, `packages/semi-ui/locale/source/${locale}.ts`)),
  );
  return localized.replace(
    /import\s*\{([^}]+)\}\s*from\s*['"]@douyinfe\/semi-ui['"];?/g,
    (_, names: string) =>
      names
        .split(',')
        .map((name) => {
          const [component, local = component] = name.trim().split(/\s+as\s+/);
          if (component === 'Layout')
            return `import { Layout as ${local} } from ${JSON.stringify(path.join(sourceRoot, 'packages/semi-ui/layout/index.tsx'))};`;
          if (component === 'Row' || component === 'Col')
            return `import { ${component} as ${local} } from ${JSON.stringify(path.join(sourceRoot, 'packages/semi-ui/grid/index.tsx'))};`;
          if (component === 'ImagePreview')
            return `import { Preview as ${local} } from ${JSON.stringify(path.join(sourceRoot, 'packages/semi-ui/image/index.tsx'))};`;
          if (component === 'Form')
            return `import { Form as ${local} } from ${JSON.stringify(path.join(sourceRoot, 'packages/semi-ui/form/index.tsx'))};`;
          if (component === 'Toast')
            return `import ${local} from ${JSON.stringify(path.join(sourceRoot, 'packages/semi-ui/toast/index.tsx'))};`;
          if (component === 'ConfigConsumer')
            return `import { ConfigConsumer as ${local} } from ${JSON.stringify(path.join(sourceRoot, 'packages/semi-ui/configProvider/index.tsx'))};`;
          const module = exports.get(component!);
          if (!module) throw new Error(`Unmapped reference import ${component}`);
          return `import ${local} from ${JSON.stringify(path.join(sourceRoot, 'packages/semi-ui', module))};`;
        })
        .join('\n'),
  );
}

/** Read live examples directly from the pinned Markdown; never maintain a second React copy. */
export function pinnedButtonDocumentation(options: { root?: string } = {}): UnpluginOptions {
  const root = options.root ?? fileURLToPath(new URL('../..', import.meta.url));
  const adaptersRoot = path.join(root, 'apps/reference-react/docs-adapters');
  const sourceRoot = path.join(root, 'vendor/semi-design');
  return {
    name: 'pinned-button-documentation',
    enforce: 'pre',
    async transform(code, id) {
      if (id.includes('/semi-site-header/dist/index.es.js')) return publicImports(code, sourceRoot);
    },
    resolveId(id) {
      if (id.startsWith(`\0${examplePrefix}`)) return id;
      if (
        [
          'virtual:pinned-doc-site.css',
          'virtual:pinned-doc-sidebar',
          'virtual:pinned-doc-icons',
          'virtual:pinned-doc-gatsby',
          'virtual:pinned-doc-locale',
          examplesId,
        ].includes(id) ||
        id.startsWith(examplePrefix)
      )
        return `\0${id}`;
    },
    async load(id) {
      if (id === `\0${examplesId}`) {
        const native = this.getNativeBuildContext?.();
        if (native?.framework === 'rspack')
          native.loaderContext?.addContextDependency(adaptersRoot);
        const adapters = (await readdir(adaptersRoot))
          .filter((file) => /^[a-z0-9-]+\.mjs$/.test(file))
          .sort();
        // The registry contains lazy loaders only. A new batch does not change any
        // existing adapter, and only the selected component's loader is evaluated.
        return `export default {${adapters
          .map((file) => {
            const component = file.slice(0, -4);
            return `${JSON.stringify(component)}:()=>import('${examplePrefix}${component}/examples')`;
          })
          .join(',')}}`;
      }
      if (id === '\0virtual:pinned-doc-gatsby')
        return `import React from 'react'; export const withPrefix = path => path; export const Link = ({to, children, ...props}) => React.createElement('a', {...props, href:to}, children);`;
      if (id === '\0virtual:pinned-doc-locale')
        return `export const getLocale = path => path.toLowerCase().startsWith('/en-us') ? 'en-US' : 'zh-CN';`;
      if (id === '\0virtual:pinned-doc-icons') {
        const icons = [];
        for (const filename of await readdir(path.join(sourceRoot, 'src/images/docIcons'))) {
          if (!filename.endsWith('.svg')) continue;
          const raw = await readFile(
            path.join(sourceRoot, 'src/images/docIcons', filename),
            'utf8',
          );
          // Match the fixed site's SVGR adapter without changing the SVG geometry or paints.
          const svg = raw
            .replace(/\s([\w:-]+)=/g, (all, name: string) => {
              if (name.startsWith('aria-') || name.startsWith('data-')) return all;
              return ` ${name.replace(/[-:]([a-z])/g, (_, letter: string) => letter.toUpperCase())}=`;
            })
            .replace(
              /style="([^"]*)"/g,
              (_, css: string) =>
                `style={${JSON.stringify(
                  Object.fromEntries(
                    css
                      .split(';')
                      .filter(Boolean)
                      .map((declaration) => {
                        const colon = declaration.indexOf(':');
                        return [
                          declaration
                            .slice(0, colon)
                            .trim()
                            .replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase()),
                          declaration.slice(colon + 1).trim(),
                        ];
                      }),
                  ),
                )}}`,
            );
          icons.push(`${JSON.stringify(filename.slice(0, -4))}:()=>(${svg})`);
        }
        return compileJsx(
          `import React from 'react';export default {${icons.join(',')}}`,
          'pinned-icons.jsx',
        );
      }
      if (id === '\0virtual:pinned-doc-sidebar') {
        const source = await readFile(path.join(sourceRoot, 'src/components/side-nav.js'), 'utf8');
        const adapted = (await publicImports(source, sourceRoot))
          .replace("'gatsby'", "'virtual:pinned-doc-gatsby'")
          .replace("'utils/locale'", "'virtual:pinned-doc-locale'")
          .replace("'../images/docIcons'", "'virtual:pinned-doc-icons'");
        return compileJsx(adapted, 'pinned-side-nav.jsx');
      }
      if (id === '\0virtual:pinned-doc-site.css') {
        const css = await readFile(path.join(root, 'apps/docs/public/upstream/site.css'), 'utf8');
        return css.replaceAll('/upstream/Inter-', 'http://127.0.0.1:4321/repl/fonts/Inter-');
      }
      if (!id.startsWith(`\0${examplePrefix}`)) return;
      const match = id
        .slice(examplePrefix.length + 1)
        .match(/^([a-z0-9-]+)\/(examples|([\w-]+)\/(\d+)\.jsx)$/);
      if (!match) throw new Error(`Invalid documentation reference ${id}`);
      const [, component, request, locale, number] = match;
      const adapterPath = await realpath(path.join(adaptersRoot, `${component}.mjs`));
      // A new evaluator owns each adapter graph: a changed two-hop helper must never
      // reuse Node's ESM cache. Watch every imported local file on its generated module.
      const evaluator = createJiti(pathToFileURL(adapterPath).href, {
        moduleCache: false,
        fsCache: false,
        tryNative: false,
      });
      const seen = new Set<string>();
      const watchDependencies = async (file: string): Promise<void> => {
        if (seen.has(file)) return;
        seen.add(file);
        this.addWatchFile(file);
        const source = await readFile(file, 'utf8');
        for (const dependency of ts.preProcessFile(source, true, true).importedFiles) {
          if (!dependency.fileName.startsWith('.')) continue;
          await watchDependencies(
            evaluator.resolve(path.resolve(path.dirname(file), dependency.fileName)),
          );
        }
      };
      await watchDependencies(adapterPath);
      const adapter = evaluator(adapterPath) as {
        upstream: string;
        exampleCount: Record<string, number>;
        adapt(
          code: string,
          context: { locale: string | undefined; number: number; entry: string | undefined },
        ): string;
      };
      if (request === 'examples')
        return `export default {${['zh-cn', 'en-us'].map((language) => `${JSON.stringify(language)}:[${Array.from({ length: adapter.exampleCount[language] ?? 0 }, (_, index) => `()=>import('${examplePrefix}${component}/${language}/${index + 1}.jsx')`).join(',')}]`).join(',')}}`;
      if (!['zh-cn', 'en-us'].includes(locale ?? '')) throw new Error('Invalid reference locale');
      const filename = locale === 'en-us' ? 'index-en-US.md' : 'index.md';
      const source = await readFile(
        path.join(sourceRoot, 'content', adapter.upstream, filename),
        'utf8',
      );
      const examples = [...source.matchAll(/```[^\n]*live=true[^\n]*\n([\s\S]*?)```/g)];
      const code = examples[Number(number) - 1]?.[1];
      if (!code) throw new Error(`Missing pinned ${component} example ${locale}/${number}`);
      const entry =
        code.match(/^class\s+(\w+)\s+extends/m)?.[1] ??
        code.match(/^render\((\w+)\);?$/m)?.[1] ??
        code.match(/^function\s+(\w+)\s*\(/m)?.[1];
      const adapted = adapter.adapt(code, { locale, number: Number(number), entry });
      return compileJsx(await publicImports(adapted, sourceRoot), `pinned-${component}.jsx`);
    },
  };
}
