export const upstream = 'show/calendar';
export const exampleCount = { 'zh-cn': 9, 'en-us': 9 };

export function adapt(code) {
  // Vue template interpolation always stringifies `date.getDate()`, so the documented Vue example
  // renders Avatar's `typeof children === 'string'` label branch. The pinned React snippet passes a
  // number instead, which skips that branch and renders a bare text node in the avatar root; pass
  // the same string form so both hosts render the documented example identically.
  code = code.replaceAll('{date.getDate()}', '{String(date.getDate())}');
  // The pinned snippets are parenthesized arrow IIFEs; standalone ESM needs one default export.
  code = code.replace(/^\(\)\s*=>/m, 'const DocumentationExample = () =>');
  return `${code}\nexport default DocumentationExample;`;
}
