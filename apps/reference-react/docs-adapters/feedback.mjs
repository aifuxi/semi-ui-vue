import { fileURLToPath, URL } from 'node:url';
import sass from 'sass-legacy';

export const upstream = 'feedback/feedback';
export const exampleCount = { 'zh-cn': 7, 'en-us': 7 };

const themeEntry = fileURLToPath(
  new URL(
    '../../../vendor/semi-design/packages/semi-theme-default/scss/index.scss',
    import.meta.url,
  ),
);
const feedbackEntry = fileURLToPath(
  new URL(
    '../../../vendor/semi-design/packages/semi-foundation/feedback/feedback.scss',
    import.meta.url,
  ),
);
// The fixed public entry loads SideSheet before Feedback. Restore that order locally:
// the reference aggregate otherwise lets SideSheet's equal-specificity bottom:0 win.
const styles = sass
  .renderSync({
    data: `@import "${themeEntry}";
@import "${feedbackEntry}";`,
    outputStyle: 'expanded',
  })
  .css.toString();

export function adapt(code, { number, locale }) {
  code = code.replace('@douyinfe/semi-illustrations', '@semi-v2.102.0/illustrations');
  // Match the already documented repairs to the pinned example's invalid initialization/closure.
  if (number === 5) {
    code = code.replace('useState(value)', "useState('')");
    if (locale === 'en-us')
      code = code.replace('[onTextAreaChange]);', '[onTextAreaChange, value]);');
  }
  code = code.replace(/^\(\) =>/m, 'const DocumentationExample = () =>');
  if (locale === 'en-us')
    return `import { LocaleProvider } from '@douyinfe/semi-ui';
import enUS from '@douyinfe/semi-ui/locale/source/en_US';
${code}
export default () => <><style>{${JSON.stringify(styles)}}</style><LocaleProvider locale={enUS}><DocumentationExample /></LocaleProvider></>;`;
  return `${code}\nexport default () => <><style>{${JSON.stringify(styles)}}</style><DocumentationExample /></>;`;
}
