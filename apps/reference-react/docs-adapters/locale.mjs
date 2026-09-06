export const upstream = 'other/locale';
export const exampleCount = { 'zh-cn': 3, 'en-us': 3 };

export function adapt(code, { entry }) {
  // The live evaluator supplies hooks and render(); ESM supplies those bindings explicitly.
  code = code
    .replace(
      "import React from 'react';",
      "import React, { useState, useMemo, useCallback } from 'react';",
    )
    .replace(/^render\(\w+\);?$/m, '');
  // Match the site's local media and independent branding without masking either region.
  let imageIndex = 0;
  code = code
    .replace(
      /https:\/\/lf3-static\.bytednsdoc\.com[^"'\s]+/g,
      () => `http://127.0.0.1:4321/demos/${imageIndex++ % 2 ? 'two' : 'one'}.svg`,
    )
    .replaceAll('IconSemiLogo', 'IconApps')
    .replaceAll('Semi 数据后台', '组件数据后台')
    .replaceAll('Semi Platform', 'Component Platform');
  if (!entry) throw new Error('Unsupported pinned Locale entry');
  return `${code}\nexport default ${entry};`;
}
