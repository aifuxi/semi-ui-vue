export const upstream = 'show/table';
// This acceptance slice deliberately compiles only blocks 1–15. The remaining fixed
// Chinese/English blocks (22/20) belong to later slices and may need their own dependencies.
export const exampleCount = { 'zh-cn': 15, 'en-us': 15 };

export function adapt(code, { entry, locale }) {
  code = code.replaceAll('@douyinfe/semi-illustrations', '@semi-v2.102.0/illustrations');
  code = code.replaceAll(
    'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/',
    'http://127.0.0.1:4321/demos/table/',
  );
  const hooks = ['useState', 'useMemo', 'useEffect', 'useRef'];
  const used = hooks.filter((name) => code.includes(`${name}(`));
  const reactImport = code.match(/^import React(?:,\s*\{([^}]*)\})? from 'react';$/m);
  if (reactImport && used.length) {
    const declared = (reactImport[1] ?? '')
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean);
    code = code.replace(
      reactImport[0],
      `import React, { ${[...new Set([...declared, ...used])].join(', ')} } from 'react';`,
    );
  }
  const name = entry ?? 'App';
  code = code.replace(/^render\(\w+\);?$/m, '');
  if (locale === 'en-us')
    return `${code}\nimport { ConfigProvider as DocumentationProvider } from '@douyinfe/semi-ui';\nimport documentationLocale from '@douyinfe/semi-ui/locale/source/en_US';\nexport default () => <DocumentationProvider locale={documentationLocale} direction={new URLSearchParams(location.search).get('direction') === 'rtl' ? 'rtl' : 'ltr'}><${name} /></DocumentationProvider>;`;
  return `${code}\nimport { ConfigProvider as DocumentationProvider } from '@douyinfe/semi-ui';\nexport default () => new URLSearchParams(location.search).get('direction') === 'rtl' ? <DocumentationProvider direction="rtl"><${name} /></DocumentationProvider> : <${name} />;`;
}
