export const upstream = 'show/badge';
export const exampleCount = { 'zh-cn': 6, 'en-us': 6 };

export function adapt(code) {
  // The pinned snippets are parenthesized arrow IIFEs; standalone ESM needs one default export.
  code = code.replace(/^\(\)\s*=>/m, 'const DocumentationExample = () =>');
  return `${code}\nexport default DocumentationExample;`;
}
