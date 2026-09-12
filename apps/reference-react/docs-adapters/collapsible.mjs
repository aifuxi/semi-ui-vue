export const upstream = 'show/collapsible';
export const exampleCount = { 'zh-cn': 4, 'en-us': 4 };

export function adapt(code) {
  // The pinned Nested snippet uses useState without importing it.
  if (code.includes('useState('))
    code = code.replace("import React from 'react';", "import React, { useState } from 'react';");
  // The pinned snippets are parenthesized arrow IIFEs; standalone ESM needs one default export.
  code = code.replace(/^\(\)\s*=>/m, 'const DocumentationExample = () =>');
  return `${code}\nexport default DocumentationExample;`;
}
