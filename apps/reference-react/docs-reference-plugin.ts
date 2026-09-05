import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformWithEsbuild, type Plugin } from 'vite';

const root = fileURLToPath(new URL('../..', import.meta.url));
const prefix = 'virtual:pinned-button-docs/';
const sourceRoot = path.join(root, 'vendor/semi-design');
async function publicImports(code: string): Promise<string> {
  const index = await readFile(path.join(sourceRoot, 'packages/semi-ui/index.ts'), 'utf8');
  const exports = new Map(
    [...index.matchAll(/export\s*\{\s*default as (\w+)\s*\}\s*from\s*['"]([^'"]+)['"]/g)].map(
      (match) => [match[1], match[2]],
    ),
  );
  return code.replace(
    /import\s*\{([^}]+)\}\s*from\s*['"]@douyinfe\/semi-ui['"];?/g,
    (_, names: string) =>
      names
        .split(',')
        .map((name) => {
          const [component, local = component] = name.trim().split(/\s+as\s+/);
          const module = exports.get(component!);
          if (!module) throw new Error(`Unmapped reference import ${component}`);
          return `import ${local} from ${JSON.stringify(path.join(sourceRoot, 'packages/semi-ui', module))};`;
        })
        .join('\n'),
  );
}

/** Read live examples directly from the pinned Markdown; never maintain a second React copy. */
export function pinnedButtonDocumentation(): Plugin {
  return {
    name: 'pinned-button-documentation',
    resolveId(id) {
      if (
        [
          'virtual:pinned-doc-site.css',
          'virtual:pinned-doc-sidebar',
          'virtual:pinned-doc-icons',
          'virtual:pinned-doc-gatsby',
          'virtual:pinned-doc-locale',
          'virtual:pinned-button-examples',
        ].includes(id)
      )
        return `\0${id}`;
      if (id.startsWith(prefix)) return `\0${id}`;
    },
    async load(id) {
      if (id === '\0virtual:pinned-button-examples')
        return `export default {${['zh-cn', 'en-us'].map((locale) => `${JSON.stringify(locale)}:[${Array.from({ length: 17 }, (_, index) => `()=>import('${prefix}${locale}/${index + 1}.jsx')`).join(',')}]`).join(',')}}`;
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
        return (
          await transformWithEsbuild(
            `import React from 'react';export default {${icons.join(',')}}`,
            'pinned-icons.jsx',
            { loader: 'jsx' },
          )
        ).code;
      }
      if (id === '\0virtual:pinned-doc-sidebar') {
        const source = await readFile(path.join(sourceRoot, 'src/components/side-nav.js'), 'utf8');
        const adapted = (await publicImports(source))
          .replace("'gatsby'", "'virtual:pinned-doc-gatsby'")
          .replace("'utils/locale'", "'virtual:pinned-doc-locale'")
          .replace("'../images/docIcons'", "'virtual:pinned-doc-icons'");
        return (await transformWithEsbuild(adapted, 'pinned-side-nav.jsx', { loader: 'jsx' })).code;
      }
      if (id === '\0virtual:pinned-doc-site.css') {
        const css = await readFile(path.join(root, 'apps/docs/public/upstream/site.css'), 'utf8');
        return css.replaceAll('/upstream/Inter-', 'http://127.0.0.1:4321/repl/fonts/Inter-');
      }
      if (!id.startsWith(`\0${prefix}`)) return;
      const [, locale, number] = id.match(/\/([\w-]+)\/(\d+)\.jsx$/) ?? [];
      if (!['zh-cn', 'en-us'].includes(locale ?? '')) throw new Error('Invalid reference locale');
      const filename = locale === 'en-us' ? 'index-en-US.md' : 'index.md';
      const source = await readFile(
        path.join(root, 'vendor/semi-design/content/basic/button', filename),
        'utf8',
      );
      const examples = [...source.matchAll(/```[^\n]*live=true[^\n]*\n([\s\S]*?)```/g)];
      let code = examples[Number(number) - 1]?.[1];
      if (!code) throw new Error(`Missing pinned Button example ${locale}/${number}`);
      const entry = code.match(/^function\s+(\w+)\s*\(/m)?.[1];
      if (!entry) throw new Error(`Unsupported pinned example entry ${locale}/${number}`);
      code = await publicImports(code);
      return (
        await transformWithEsbuild(`${code}\nexport default ${entry};`, 'pinned-button.jsx', {
          loader: 'jsx',
          jsx: 'transform',
        })
      ).code;
    },
  };
}
