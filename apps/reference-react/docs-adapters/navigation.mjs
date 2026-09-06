export const upstream = 'navigation/navigation';
export const exampleCount = { 'zh-cn': 10, 'en-us': 12 };

export function adapt(code, { locale, entry }) {
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
    (_, names) =>
      'import {' + [...new Set(names.split(',').map((name) => name.trim()))].join(', ') + '} from',
  );
  if (!entry) code = code.replace(/^\(\) =>/m, 'const DocumentationExample = () =>');
  code = `import { LocaleProvider } from '@douyinfe/semi-ui';\nimport documentationLocale from '@douyinfe/semi-ui/locale/source/${locale === 'en-us' ? 'en_US' : 'zh_CN'}';\n${code}`;
  const entryName = entry ?? 'DocumentationExample';
  return `${code}\nconst PinnedExample = ${entryName}; export default () => <LocaleProvider locale={documentationLocale}><PinnedExample /></LocaleProvider>;`;
}
