export const upstream = 'show/carousel';
export const exampleCount = { 'zh-cn': 8, 'en-us': 8 };

export function adapt(code, { number }) {
  // Keep the documented asset/branding adaptation identical on both sides.
  const assets = ['one', 'two', 'photo'];
  code = code.replace(
    /https:\/\/lf3-static\.bytednsdoc\.com\/obj\/eden-cn\/hjeh7pldnulm\/SemiDocs\/bg-([123])\.png/g,
    (_, index) => `http://127.0.0.1:4321/demos/${assets[Number(index) - 1]}.svg`,
  );
  code = code.replace(
    /<img\s+src='[^']+semi_logo\.svg'[^>]*\/>/g,
    '<span style={{ width: 87, height: 31, display: "inline-block" }} aria-hidden="true" />',
  );
  // Standalone React examples have no other demos sharing the native radio name. Scope
  // the Vue page's groups by example while preserving every group relationship within it.
  code = code.replaceAll('<RadioGroup ', `<RadioGroup name="carousel-demo-${number}" `);
  // The original docs inject hooks into their scope; standalone modules import them explicitly.
  if (!/import React, \{ useState \}/.test(code))
    code = code.replace("import React from 'react';", "import React, { useState } from 'react';");
  code = code.replace(/^\(\)\s*=>/m, 'const DocumentationExample = () =>');
  return `${code}\nexport default DocumentationExample;`;
}
