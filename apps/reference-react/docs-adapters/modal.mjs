export const upstream = 'show/modal';
export const exampleCount = { 'zh-cn': 12, 'en-us': 12 };

export function adapt(code, { entry, locale, number }) {
  // Fixed live scope provides useState to anonymous examples; standalone modules
  // must import it. Brand glyph substitution follows the documented exclusion.
  code = code.replace("import React from 'react';", "import React, { useState } from 'react';");
  code = code.replaceAll('IconSemiLogo', 'IconInfoCircle').replaceAll('IconVigoLogo', 'IconMoon');
  if (/^ModalComponent =/m.test(code)) {
    code = code.replace(/^ModalComponent =/m, 'const ModalComponent =');
    entry = 'ModalComponent';
  }
  if (!entry) code = code.replace(/^\(\)\s*=>/m, 'const DocumentationExample = () =>');
  const name = entry ?? 'DocumentationExample';
  if (locale === 'en-us' && number !== 10 && number !== 11)
    return `${code}\nimport { ConfigProvider as DocumentationProvider } from '@douyinfe/semi-ui';\nimport documentationLocale from '@douyinfe/semi-ui/locale/source/en_US';\nexport default () => <DocumentationProvider locale={documentationLocale}><${name} /></DocumentationProvider>;`;
  return `${code}\nexport default ${name};`;
}
