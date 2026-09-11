export const upstream = 'basic/layout';
export const exampleCount = { 'zh-cn': 8, 'en-us': 8 };

export function adapt(code, { locale }) {
  // Only independent branding and the live evaluator's anonymous entry need adaptation.
  code = code
    .replace(/^\(\) =>/m, 'const DocumentationExample = () =>')
    .replaceAll('IconSemiLogo', 'IconInfoCircle')
    .replaceAll('IconBytedanceLogo', 'IconInfoCircle')
    .replace(
      /Copyright © \d+ ByteDance\. All Rights Reserved\. /g,
      'Copyright © aifuxi. All Rights Reserved.',
    )
    .replaceAll('Semi Design', 'aifuxi')
    .replaceAll('Semi Theme', 'aifuxi Theme')
    .replaceAll('Semi Blocks', 'aifuxi Blocks')
    .replaceAll('Hi, Bytedance dance dance.', 'Hi, welcome to the workspace.')
    .replace(
      /import \{([^}]+)\} from/g,
      (_, names) =>
        'import {' +
        [...new Set(names.split(',').map((name) => name.trim()))].join(', ') +
        '} from',
    );
  return `import { LocaleProvider } from '@douyinfe/semi-ui';
import documentationLocale from '@douyinfe/semi-ui/locale/source/${locale === 'en-us' ? 'en_US' : 'zh_CN'}';
${code}
export default () => <LocaleProvider locale={documentationLocale}><DocumentationExample /></LocaleProvider>;`;
}
