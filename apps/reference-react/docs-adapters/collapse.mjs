export const upstream = 'show/collapse';
export const exampleCount = { 'zh-cn': 6, 'en-us': 6 };

export function adapt(code) {
  // The pinned English Basic snippet mistypes `ItemKey`; the fixed Adapter only reads `itemKey`,
  // and the documented Vue demo uses the real prop name.
  code = code.replaceAll('ItemKey="1"', 'itemKey="1"');
  // The pinned Extra snippet splits the tag label into `{' '}Recommended{' '}`, so React sees a
  // three-child array and the fixed Tag keeps `aria-label=""`. A Vue template interpolation can
  // only produce one text node per expression, and the documented demo passes `' Recommended '`;
  // use the same single string child so both hosts render the documented example identically.
  code = code.replace(/\{' '\}\s*Recommended\{' '\}/, "{' Recommended '}");
  // The pinned snippets are parenthesized arrow IIFEs; standalone ESM needs one default export.
  code = code.replace(/^\(\)\s*=>/m, 'const DocumentationExample = () =>');
  return `${code}\nexport default DocumentationExample;`;
}
