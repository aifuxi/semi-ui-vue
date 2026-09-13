import { readFileSync } from 'node:fs';
import { URL } from 'node:url';
import { adapt as adaptTable } from './table-1.mjs';

export const upstream = 'show/table';
export const exampleCount = { 'zh-cn': 14, 'en-us': 14 };

export function adapt(code, context) {
  const { locale } = context;
  const number = context.number === 14 ? 30 : context.number + 15;
  // The English baseline omits Chinese blocks 23/24. Keep the logical Chinese
  // numbering. English 23/24 translate only text from the Chinese-only snippets.
  {
    const sourceUrl =
      locale === 'en-us' && ![23, 24].includes(number)
        ? new URL('../../../vendor/semi-design/content/show/table/index-en-US.md', import.meta.url)
        : new URL('../../../vendor/semi-design/content/show/table/index.md', import.meta.url);
    const source = readFileSync(sourceUrl, 'utf8');
    const snippets = [...source.matchAll(/```[^\n]*live=true[^\n]*\n([\s\S]*?)```/g)];
    code = snippets[locale === 'en-us' && number >= 25 ? number - 3 : number - 1]?.[1];
    if (!code) throw new Error(`Missing pinned table block ${locale}/${number}`);
  }
  if (locale === 'en-us' && [23, 24].includes(number))
    for (const [source, translated] of [
      ['Semi Design 设计稿.fig', 'Semi Design design draft.fig'],
      ['Semi Design 分享演示文稿', 'Semi Design shared presentation'],
      ['设计文档', 'Design document'],
      ['姜鹏志', 'Jiang Pengzhi'],
      ['郝宣', 'Hao Xuan'],
      ['标题', 'Title'],
      ['大小', 'Size'],
      ['所有者', 'Owner'],
      ['更新日期', 'Update'],
    ])
      code = code.replaceAll(source, translated);
  code = code.replaceAll('@douyinfe/semi-ui/', '@douyinfe/semi-ui');
  // The pinned site provided lodash-es in its live scope; the reference workspace
  // already installs the same Lodash APIs in its CommonJS distribution.
  code = code.replace(
    "import { get, union, pullAll } from 'lodash-es';",
    "import get from 'lodash/get';\nimport union from 'lodash/union';\nimport pullAll from 'lodash/pullAll';",
  );
  if (number === 27 && locale === 'en-us')
    code += "\nimport { IconMore } from '@douyinfe/semi-icons';";
  if (number === 28)
    code += "\nimport { addClass, removeClass } from '@douyinfe/semi-foundation/utils/classnames';";
  let css = '';
  if (number === 24)
    css =
      '.component-table-demo-cell-hover-custom .semi-table-tbody .semi-table-row:hover .semi-table-row-cell{background-color:transparent;background-image:none}.component-table-demo-cell-hover-custom .semi-table-tbody .semi-table-row:hover .semi-table-row-cell.semi-table-cell-fixed-left::before{background-color:transparent}.component-table-demo-cell-hover-custom .semi-table-tbody .semi-table-row:hover .semi-table-row-cell:hover{background-color:rgba(var(--semi-light-green-1),1)}';
  if (number === 28)
    css =
      '#components-table-demo-resizable-column .my-resizing{border-right:2px solid red}#components-table-demo-resizable-column .react-resizable-handle:hover{background-color:red}#components-table-demo-resizable-column .my-resizing:hover .react-resizable-handle{background-color:inherit}';
  if (css)
    code += `\nconst documentationStyle = document.createElement('style'); documentationStyle.textContent = ${JSON.stringify(css)}; document.head.appendChild(documentationStyle);`;
  const entry =
    code.match(/^class\s+(\w+)\s+extends/m)?.[1] ??
    code.match(/^render\((\w+)\);?$/m)?.[1] ??
    code.match(/^function\s+(\w+)\s*\(/m)?.[1];
  return adaptTable(code, { ...context, entry });
}
