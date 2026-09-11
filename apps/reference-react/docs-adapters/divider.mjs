export const upstream = 'basic/divider';
export const exampleCount = { 'zh-cn': 2, 'en-us': 2 };

export function adapt(code) {
  // Apply the same documented brand substitution as the Vue example.
  code = code.replaceAll('IconSemiLogo', 'IconInfoCircle');
  code = code.replace(/^\(\) =>/m, 'const DocumentationExample = () =>');
  return `${code}\nexport default DocumentationExample;`;
}
