export const upstream = 'show/sidesheet';
export const exampleCount = { 'zh-cn': 6, 'en-us': 6 };

export function adapt(code, { entry, locale }) {
  if (!entry) code = code.replace(/^\(\)\s*=>/m, 'const DocumentationExample = () =>');
  const name = entry ?? 'DocumentationExample';
  if (locale === 'en-us')
    return `${code}\nimport { ConfigProvider as DocumentationProvider } from '@douyinfe/semi-ui';\nimport documentationLocale from '@douyinfe/semi-ui/locale/source/en_US';\nexport default () => <DocumentationProvider locale={documentationLocale}><${name} /></DocumentationProvider>;`;
  return `${code}\nexport default ${name};`;
}
