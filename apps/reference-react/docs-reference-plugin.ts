import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformWithEsbuild, type Plugin } from 'vite';

const root = fileURLToPath(new URL('../..', import.meta.url));
const prefix = 'virtual:pinned-button-docs/';
const iconPrefix = 'virtual:pinned-icon-docs/';
const navigationPrefix = 'virtual:pinned-navigation-docs/';
const darkPrefix = 'virtual:pinned-dark-mode-docs/';
const localePrefix = 'virtual:pinned-locale-docs/';
const configPrefix = 'virtual:pinned-config-provider-docs/';
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
  return {
    name: 'pinned-button-documentation',
    resolveId(id) {
      if (id.startsWith(`\0${navigationPrefix}`)) return id;
      if (
        [
          'virtual:pinned-doc-site.css',
          'virtual:pinned-doc-sidebar',
          'virtual:pinned-doc-icons',
          'virtual:pinned-doc-gatsby',
          'virtual:pinned-doc-locale',
          'virtual:pinned-button-examples',
          'virtual:pinned-icon-examples',
          'virtual:pinned-config-provider-examples',
          'virtual:pinned-locale-examples',
          'virtual:pinned-dark-mode-examples',
          'virtual:pinned-navigation-examples',
        ].includes(id)
      )
        return `\0${id}`;
      if (
        id.startsWith(navigationPrefix) ||
        id.startsWith(darkPrefix) ||
        id.startsWith(localePrefix) ||
        id.startsWith(prefix) ||
        id.startsWith(iconPrefix) ||
        id.startsWith(configPrefix)
      )
        return `\0${id}`;
    },
    async load(id) {
      if (id === '\0virtual:pinned-navigation-examples')
        return `export default {${['zh-cn', 'en-us'].map((locale) => `${JSON.stringify(locale)}:[${Array.from({ length: locale === 'en-us' ? 12 : 10 }, (_, index) => `()=>import('${navigationPrefix}${locale}/${index + 1}.jsx')`).join(',')}]`).join(',')}}`;
      if (id === '\0virtual:pinned-button-examples')
        return `export default {${['zh-cn', 'en-us'].map((locale) => `${JSON.stringify(locale)}:[${Array.from({ length: 17 }, (_, index) => `()=>import('${prefix}${locale}/${index + 1}.jsx')`).join(',')}]`).join(',')}}`;
      if (id === '\0virtual:pinned-icon-examples')
        return `export default {${['zh-cn', 'en-us'].map((locale) => `${JSON.stringify(locale)}:[${Array.from({ length: 8 }, (_, index) => `()=>import('${iconPrefix}${locale}/${index + 1}.jsx')`).join(',')}]`).join(',')}}`;
      if (id === '\0virtual:pinned-config-provider-examples')
        return `export default {${['zh-cn', 'en-us'].map((locale) => `${JSON.stringify(locale)}:[${Array.from({ length: 3 }, (_, index) => `()=>import('${configPrefix}${locale}/${index + 1}.jsx')`).join(',')}]`).join(',')}}`;
      if (id === '\0virtual:pinned-dark-mode-examples')
        return `export default {${['zh-cn', 'en-us'].map((locale) => `${JSON.stringify(locale)}:[${Array.from({ length: 2 }, (_, index) => `()=>import('${darkPrefix}${locale}/${index + 1}.jsx')`).join(',')}]`).join(',')}}`;
      if (id === '\0virtual:pinned-locale-examples')
        return `export default {${['zh-cn', 'en-us'].map((locale) => `${JSON.stringify(locale)}:[${Array.from({ length: 3 }, (_, index) => `()=>import('${localePrefix}${locale}/${index + 1}.jsx')`).join(',')}]`).join(',')}}`;
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
      const isNavigation = id.startsWith(`\0${navigationPrefix}`);
      const isDarkMode = id.startsWith(`\0${darkPrefix}`);
      const isLocale = id.startsWith(`\0${localePrefix}`);
      const isConfigProvider = id.startsWith(`\0${configPrefix}`);
      const isIcon = id.startsWith(`\0${iconPrefix}`);
      if (
        !isNavigation &&
        !isDarkMode &&
        !isLocale &&
        !isConfigProvider &&
        !isIcon &&
        !id.startsWith(`\0${prefix}`)
      )
        return;
      const [, locale, number] = id.match(/\/([\w-]+)\/(\d+)\.jsx$/) ?? [];
      if (!['zh-cn', 'en-us'].includes(locale ?? '')) throw new Error('Invalid reference locale');
      const filename = locale === 'en-us' ? 'index-en-US.md' : 'index.md';
      const source = await readFile(
        path.join(
          root,
          `vendor/semi-design/content/${isNavigation ? 'navigation/navigation' : isDarkMode ? 'advanced/dark-mode' : isLocale ? 'other/locale' : isConfigProvider ? 'other/configprovider' : `basic/${isIcon ? 'icon' : 'button'}`}`,
          filename,
        ),
        'utf8',
      );
      const examples = [...source.matchAll(/```[^\n]*live=true[^\n]*\n([\s\S]*?)```/g)];
      let code = examples[Number(number) - 1]?.[1];
      if (!code) throw new Error(`Missing pinned Button example ${locale}/${number}`);
      const entry =
        code.match(/^class\s+(\w+)\s+extends/m)?.[1] ??
        code.match(/^render\((\w+)\);?$/m)?.[1] ??
        code.match(/^function\s+(\w+)\s*\(/m)?.[1];
      if (!entry && !isIcon && !isDarkMode && !isNavigation)
        throw new Error(`Unsupported pinned example entry ${locale}/${number}`);
      // Fixed Markdown assigns an undeclared variable in both Split examples. The original
      // site evaluates demos outside ESM; declare that local when compiling the reference as ESM.
      if (!isConfigProvider && !isIcon && Number(number) === 17)
        code = code.replace('        newBtnVisible =', '        const newBtnVisible =');
      // The pinned RTL demo calls Toast but omits its import. Supply only that binding.
      if (isConfigProvider && Number(number) === 3)
        code = `import { Toast } from '@douyinfe/semi-ui';\n${code}`;
      if (isLocale) {
        // The live evaluator supplies hooks and render(); ESM supplies those bindings explicitly.
        code = code
          .replace(
            "import React from 'react';",
            "import React, { useState, useMemo, useCallback } from 'react';",
          )
          .replace(/^render\(\w+\);?$/m, '');
        // Match the site's local media and independent branding without masking either region.
        let imageIndex = 0;
        code = code
          .replace(
            /https:\/\/lf3-static\.bytednsdoc\.com[^"'\s]+/g,
            () => `http://127.0.0.1:4321/demos/${imageIndex++ % 2 ? 'two' : 'one'}.svg`,
          )
          .replaceAll('IconSemiLogo', 'IconApps')
          .replaceAll('Semi 数据后台', '组件数据后台')
          .replaceAll('Semi Platform', 'Component Platform');
      }
      if (isNavigation) {
        if (code.includes('useState(') && !/import[^;]*\buseState\b/.test(code))
          code = "import { useState } from 'react';\n" + code;
        // Pinned live evaluator tolerates duplicate imports and its English class omits super().
        // Repair only the compile/runtime prerequisites; retain each language's distinct demo.
        code = code
          .replace(/constructor\(\) \{/g, 'constructor() { super();')
          .replaceAll('IconSemiLogo', 'IconApps')
          .replaceAll('IconBytedanceLogo', 'IconApps')
          .replaceAll('Semi 运营后台', '组件运营后台')
          .replace(
            /<img src="https:[^"]+"\s*\/>/g,
            '<IconApps style={{ height: "36px", fontSize: 36 }} />',
          )
          .replace(
            /Copyright © \{new Date\(\).getFullYear\(\)\} ByteDance. All Rights Reserved. /g,
            'Component workspace',
          );
        if (code.includes('<IconApps') && !/import[^;]*\bIconApps\b/.test(code))
          code = "import { IconApps } from '@douyinfe/semi-icons';\n" + code;
        code = code.replace(
          /import \{([^}]+)\} from/g,
          (_, names: string) =>
            'import {' +
            [...new Set(names.split(',').map((name) => name.trim()))].join(', ') +
            '} from',
        );
        if (!entry) code = code.replace(/^\(\) =>/m, 'const DocumentationExample = () =>');
      }
      if (isDarkMode) {
        // Supply the live evaluator hook and replace site-only branding/callback symmetrically.
        code = code
          .replace("import React from 'react';", "import React, { useState } from 'react';")
          .replaceAll('IconSemiLogo', 'IconApps')
          .replaceAll('IconBytedanceLogo', 'IconApps')
          .replaceAll('IconApps, IconHome', 'IconHome')
          .replaceAll('Semi Design</span>', 'Component Design</span>')
          .replaceAll('Semi Theme</span>', 'Component Theme</span>')
          .replaceAll('Semi Blocks</span>', 'Component Blocks</span>')
          .replaceAll('Copyright © 2019 ByteDance. All Rights Reserved. ', 'Component workspace')
          .replace(/window\.setMode\('[^']+'\);/g, '')
          .replace("body.hasAttribute('theme-mode')", "body.getAttribute('theme-mode') === 'dark'");
        if (!entry) code = code.replace(/^\(\) =>/m, 'const DocumentationExample = () =>');
      }
      if (isDarkMode || isNavigation)
        code = `import { LocaleProvider } from '@douyinfe/semi-ui';\nimport documentationLocale from '@douyinfe/semi-ui/locale/source/${locale === 'en-us' ? 'en_US' : 'zh_CN'}';\n${code}`;
      code = await publicImports(code);
      // Icon demos use a top-level anonymous arrow expression, including a nested CustomIcon.
      if (isIcon) code = code.replace(/^\(\) =>/m, 'const DocumentationExample = () =>');
      const entryName =
        isIcon || ((isDarkMode || isNavigation) && !entry) ? 'DocumentationExample' : entry;
      const exportCode =
        isDarkMode || isNavigation
          ? `const PinnedExample = ${entryName}; export default () => <LocaleProvider locale={documentationLocale}><PinnedExample /></LocaleProvider>;`
          : `export default ${entryName};`;
      return (
        await transformWithEsbuild(`${code}\n${exportCode}`, 'pinned-button.jsx', {
          loader: 'jsx',
          jsx: 'transform',
        })
      ).code;
    },
  };
}
