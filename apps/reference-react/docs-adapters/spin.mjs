export const upstream = 'feedback/spin';
export const exampleCount = { 'zh-cn': 5, 'en-us': 6 };

export function adapt(code) {
  // The pinned snippets are parenthesized arrow IIFEs; standalone ESM needs one default export.
  code = code.replace(/^\(\) =>/m, 'const DocumentationExample = () =>');
  return `${code}\nexport default DocumentationExample;`;
}
