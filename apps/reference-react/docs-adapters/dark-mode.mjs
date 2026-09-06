export const upstream = 'advanced/dark-mode';
export const exampleCount = { 'zh-cn': 2, 'en-us': 2 };

export function adapt(code, { locale, entry }) {
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
  code = `import { LocaleProvider } from '@douyinfe/semi-ui';\nimport documentationLocale from '@douyinfe/semi-ui/locale/source/${locale === 'en-us' ? 'en_US' : 'zh_CN'}';\n${code}`;
  const entryName = entry ?? 'DocumentationExample';
  return `${code}\nconst PinnedExample = ${entryName}; export default () => <LocaleProvider locale={documentationLocale}><PinnedExample /></LocaleProvider>;`;
}
