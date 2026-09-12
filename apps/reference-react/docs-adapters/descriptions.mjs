export const upstream = 'show/descriptions';
// The pinned Chinese page ships eight live snippets; the English page only seven (it has no
// vertical layout snippet, see descriptions-vertical.mjs).
export const exampleCount = { 'zh-cn': 8, 'en-us': 7 };

export function adapt(code) {
  // The pinned snippets are parenthesized arrow IIFEs; standalone ESM needs one default export.
  code = code.replace(/^\(\)\s*=>/m, 'const DocumentationExample = () =>');
  return `${code}\nexport default DocumentationExample;`;
}
