export const upstream = 'show/timeline';
export const exampleCount = { 'zh-cn': 8, 'en-us': 8 };

export function adapt(code) {
  // The pinned snippets are anonymous arrows; expose the original body as standalone ESM.
  code = code.replace(/^\(\)\s*=>/m, 'const DocumentationExample = () =>');
  return `${code}\nexport default DocumentationExample;`;
}
