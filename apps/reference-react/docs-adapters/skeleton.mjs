export const upstream = 'feedback/skeleton';
export const exampleCount = { 'zh-cn': 8, 'en-us': 8 };

export function adapt(code, { locale }) {
  // Both documented Vue examples serve the local demo asset; the pinned snippets
  // point at CDN copies (different hosts per locale), so map them to the same file.
  code = code.replace(
    /https:\/\/(?:lf3-static\.bytednsdoc\.com|sf6-cdn-tos\.douyinstatic\.com)[^"']+/g,
    'http://127.0.0.1:4321/demos/photo.svg',
  );
  code = code.replace(/^\(\) =>/m, 'const DocumentationExample = () =>');
  // The pinned English Table example assigns a numeric dataIndex, which only makes
  // React log a propTypes warning; the Chinese snippet and the documented Vue demo
  // both use the string form.
  code = code.replace('item.dataIndex = key;', 'item.dataIndex = `${key}`;');
  // The published pages render every demo inside the locale provider (locale context
  // only, no direction); mirror that environment instead of relying on locale defaults.
  return `import { LocaleProvider } from '@douyinfe/semi-ui';
import documentationLocale from '@douyinfe/semi-ui/locale/source/${locale === 'en-us' ? 'en_US' : 'zh_CN'}';
${code}
export default () => <LocaleProvider locale={documentationLocale}><DocumentationExample /></LocaleProvider>`;
}
