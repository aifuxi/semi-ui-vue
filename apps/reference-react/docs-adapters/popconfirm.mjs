export const upstream = 'feedback/popconfirm';
export const exampleCount = { 'zh-cn': 4, 'en-us': 4 };

export function adapt(code, { entry, locale }) {
  // The pinned English Type example imports the package root with a trailing slash,
  // which the shared import rewriter does not match.
  code = code.replaceAll("from '@douyinfe/semi-ui/'", "from '@douyinfe/semi-ui'");
  // The pinned site's live evaluator accepts a bare arrow IIFE or a named render
  // function; standalone ESM needs one default export for either shape.
  code = code.replace(/^\(\) =>/m, 'const DocumentationExample = () =>');
  const demo = entry ? `<${entry} />` : '<DocumentationExample />';
  // The published pages run each English demo inside the English locale provider;
  // without it the reference footer would fall back to the Chinese button labels.
  if (locale === 'en-us')
    return `import { LocaleProvider } from '@douyinfe/semi-ui';
import enUS from '@douyinfe/semi-ui/locale/source/en_US';
${code}
export default () => <LocaleProvider locale={enUS}>${demo}</LocaleProvider>;`;
  return `${code}\nexport default ${entry ?? 'DocumentationExample'};`;
}
