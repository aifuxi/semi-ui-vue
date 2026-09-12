export const upstream = 'show/empty';
export const exampleCount = { 'zh-cn': 5, 'en-us': 5 };

export function adapt(code) {
  // The reference bundler only aliases the pinned illustrations entry, and the documented Vue
  // examples import the same illustrations from the public Vue package.
  code = code.replaceAll('@douyinfe/semi-illustrations', '@semi-v2.102.0/illustrations');
  // The pinned snippets are parenthesized arrow IIFEs; standalone ESM needs one default export.
  code = code.replace(/^\(\)\s*=>/m, 'const DocumentationExample = () =>');
  return `${code}\nexport default DocumentationExample;`;
}
