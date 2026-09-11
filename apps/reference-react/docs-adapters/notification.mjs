export const upstream = 'feedback/notification';
export const exampleCount = { 'zh-cn': 8, 'en-us': 8 };

// The pinned English examples mistype `duration`/`position`; the Vue examples use the
// documented API, so the reference must run the same options to stay comparable.
const documentedOptionTypos = (code) =>
  code
    .replaceAll('with: 3', 'duration: 3')
    .replaceAll("Position: 'topRight'", "position: 'topRight'");

// Independent-brand substitution: the pinned demos use ByteDance copy and Toutiao/Vigo
// logos. Replace them with exactly the strings and icons the Vue examples render.
// Every other string stays byte-identical to the pinned source, including the English
// button/content copy the Chinese examples already use upstream.
function brandSubstitutions(code) {
  return code
    .replaceAll('ies dance dance dance', 'AIFUXI design notification')
    .replaceAll('Hi, Bytedance dance dance', 'AIFUXI design notification')
    .replaceAll('Hi, Bytedance', 'Hi, AIFUXI')
    .replaceAll('Hi bytedance', 'Hi, AIFUXI')
    .replaceAll('semi-ui-notification', 'aifuxi-notification')
    .replaceAll('IconToutiaoLogo', 'IconBell')
    .replaceAll('IconVigoLogo', 'IconStar');
}

// Icon-only buttons need an accessible name. The Vue examples add a bilingual aria-label;
// mirror it so the reference exposes the same name instead of an unnamed button.
const iconLabels = {
  'zh-cn': { red: '红色铃铛图标通知', star: '星标图标通知', pink: '粉色星标图标通知' },
  'en-us': {
    red: 'Red bell notification',
    star: 'Star notification',
    pink: 'Pink star notification',
  },
};

function labelIconButtons(code, locale) {
  const labels = iconLabels[locale];
  return code
    .replace(
      /(\n\s*)icon=\{<IconBell \/>\}\n(\s*)style=\{\{ marginRight: 5 \}\}/,
      `$1aria-label="${labels.red}"$1icon={<IconBell />}\n$2style={{ marginRight: 5 }}`,
    )
    .replace(
      /(\n\s*)icon=\{<IconStar \/>\}\n(\s*)style=\{\{ marginRight: 5 \}\}/,
      `$1aria-label="${labels.star}"$1icon={<IconStar />}\n$2style={{ marginRight: 5 }}`,
    )
    .replace(
      /(\n\s*)icon=\{<IconStar \/>\}\n(\s*)onClick=/,
      `$1aria-label="${labels.pink}"$1icon={<IconStar />}\n$2onClick=`,
    );
}

export function adapt(code, { locale, number }) {
  code = documentedOptionTypos(code);
  code = brandSubstitutions(code);
  // The pinned Manual Close example uses `useState` without importing it.
  if (number === 7)
    code = code.replace("import React from 'react';", "import React, { useState } from 'react';");
  if (number === 3) code = labelIconButtons(code, locale);
  code = code.replace(/^\(\) =>/m, 'const DocumentationExample = () =>');
  return `${code}\nexport default DocumentationExample;`;
}
