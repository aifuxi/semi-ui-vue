export const upstream = 'feedback/progress';
export const exampleCount = { 'zh-cn': 12, 'en-us': 12 };

export function adapt(code, { locale, number }) {
  // The pinned English snippets use useState without importing it.
  if (locale === 'en-us' && [7, 8].includes(number))
    code = code.replace("import React from 'react';", "import React, { useState } from 'react';");
  if (locale === 'en-us' && number === 7)
    code = code.replace(
      'percent={percent} showInfo',
      'percent={percent} showInfo aria-label="disk usage"',
    );
  // Keep the existing localized accessible names and name the icon-only controls.
  const labels =
    locale === 'zh-cn'
      ? ['磁盘使用量', '下载进度', '文件下载速度', '减少进度', '增加进度']
      : [
          'Disk usage',
          'Download progress',
          'File download speed',
          'Decrease progress',
          'Increase progress',
        ];
  for (const [index, label] of ['disk usage', 'download progress', 'file download speed'].entries())
    code = code.replaceAll(`aria-label="${label}"`, `aria-label="${labels[index]}"`);
  code = code.replaceAll(
    'icon={<IconChevronLeft />}',
    `icon={<IconChevronLeft />} aria-label="${labels[3]}"`,
  );
  code = code.replaceAll(
    'icon={<IconChevronRight />}',
    `icon={<IconChevronRight />} aria-label="${labels[4]}"`,
  );
  code = code.replace(/^\(\) =>/m, 'const DocumentationExample = () =>');
  return `${code}\nexport default DocumentationExample;`;
}
