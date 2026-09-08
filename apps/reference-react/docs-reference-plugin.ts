import { readFile, readdir, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  transformWithEsbuild,
  type EnvironmentModuleNode,
  type Plugin,
  type ViteDevServer,
} from 'vite';

const root = fileURLToPath(new URL('../..', import.meta.url));
const examplesId = 'virtual:pinned-documentation-examples';
const examplePrefix = 'virtual:pinned-documentation/';
const adaptersRoot = path.join(root, 'apps/reference-react/docs-adapters');
const sourceRoot = path.join(root, 'vendor/semi-design');
async function publicImports(code: string): Promise<string> {
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
export function pinnedButtonDocumentation(): Plugin {
  let server: ViteDevServer | undefined;
  let stopWatching: (() => void) | undefined;
  const adapterConsumers = new Map<string, Set<string>>();
  return {
    name: 'pinned-button-documentation',
    // The site package's React controls must resolve to the same fixed submodule as demos.
    async transform(code, id) {
      if (id.includes('/semi-site-header/dist/index.es.js')) return publicImports(code);
    },
    async configureServer(instance) {
      server = instance;
      const realAdaptersRoot = await realpath(adaptersRoot);
      instance.watcher.add(realAdaptersRoot);
      const registryChanged = (file: string) => {
        if (
          path.dirname(file) !== realAdaptersRoot ||
          !/^[a-z0-9-]+\.mjs$/.test(path.basename(file))
        )
          return;
        const graph = instance.environments.client!.moduleGraph;
        const registry = graph.getModuleById(`\0${examplesId}`);
        if (registry) graph.invalidateModule(registry);
        instance.ws.send({ type: 'full-reload' });
      };
      // Evaluated adapters are not client imports. Connect their complete SSR dependency
      // graph to the generated client modules explicitly when a watched file changes.
      const dependencyChanged = (file: string) => {
        const consumers = adapterConsumers.get(file);
        if (!consumers) return;
        const graph = instance.environments.client!.moduleGraph;
        for (const id of consumers) {
          const module = graph.getModuleById(id);
          if (module) graph.invalidateModule(module);
        }
        instance.ws.send({ type: 'full-reload' });
      };
      instance.watcher.on('add', registryChanged).on('unlink', registryChanged);
      instance.watcher.on('change', dependencyChanged).on('unlink', dependencyChanged);
      stopWatching = () => {
        instance.watcher.off('add', registryChanged).off('unlink', registryChanged);
        instance.watcher.off('change', dependencyChanged).off('unlink', dependencyChanged);
      };
    },
    closeBundle() {
      stopWatching?.();
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
      if (!id.startsWith(`\0${examplePrefix}`)) return;
      const match = id
        .slice(examplePrefix.length + 1)
        .match(/^([a-z0-9-]+)\/(examples|([\w-]+)\/(\d+)\.jsx)$/);
      if (!match) throw new Error(`Invalid documentation reference ${id}`);
      const [, component, request, locale, number] = match;
      const adapterPath = await realpath(path.join(adaptersRoot, `${component}.mjs`));
      // Vite owns dev evaluation so editing a transitive helper invalidates its module
      // instance too. Node import() would keep stale helper instances across reloads.
      const adapter = server
        ? await server.ssrLoadModule(adapterPath)
        : await import(/* @vite-ignore */ pathToFileURL(adapterPath).href);
      this.addWatchFile(adapterPath);
      if (server) {
        const seen = new Set<EnvironmentModuleNode>();
        const watchDependencies = (module: EnvironmentModuleNode | undefined) => {
          if (!module || seen.has(module)) return;
          seen.add(module);
          if (module.file) {
            this.addWatchFile(module.file);
            const consumers = adapterConsumers.get(module.file) ?? new Set<string>();
            consumers.add(id);
            adapterConsumers.set(module.file, consumers);
          }
          for (const dependency of module.importedModules) watchDependencies(dependency);
        };
        watchDependencies(server.environments.ssr!.moduleGraph.getModuleById(adapterPath));
      }
      if (request === 'examples')
        return `export default {${['zh-cn', 'en-us'].map((language) => `${JSON.stringify(language)}:[${Array.from({ length: adapter.exampleCount[language] }, (_, index) => `()=>import('${examplePrefix}${component}/${language}/${index + 1}.jsx')`).join(',')}]`).join(',')}}`;
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
      return (
        await transformWithEsbuild(await publicImports(adapted), `pinned-${component}.jsx`, {
          loader: 'jsx',
          jsx: 'transform',
        })
      ).code;
    },
  };
}
