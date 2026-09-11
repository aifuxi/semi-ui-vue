export const upstream = 'basic/typography';
export const exampleCount = { 'zh-cn': 10, 'en-us': 10 };

export function adapt(code, { number, entry, locale }) {
  if (!entry) throw new Error(`Unsupported pinned Typography entry ${number}`);
  // The site's live scope supplies these missing bindings; standalone ESM must import them.
  if (number === 8) code = `import { Toast } from '@douyinfe/semi-ui';\n${code}`;
  if (number === 9)
    code = code.replace(
      "import React from 'react';",
      "import React, { useCallback } from 'react';",
    );
  // Match the pinned documentation's code font, which the Vue site also loads locally.
  const styles =
    number === 2
      ? "@font-face { font-family: Inconsolata; src: url('http://127.0.0.1:4321/upstream/Inconsolata-Regular.woff2') format('woff2'); font-weight: 400; }"
      : number === 10
        ? '.components-typography-demo { word-break: break-word; }'
        : '';
  let demo = `<${entry} />`;
  if (locale === 'en-us') {
    code = `import { LocaleProvider } from '@douyinfe/semi-ui';
import enUS from '@douyinfe/semi-ui/locale/source/en_US';
${code}`;
    demo = `<LocaleProvider locale={enUS}>${demo}</LocaleProvider>`;
  }
  return `${code}\nexport default function DocumentationExample() { return <><style>{${JSON.stringify(styles)}}</style>${demo}</>; }`;
}
