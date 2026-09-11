export const upstream = 'basic/space';
export const exampleCount = { 'zh-cn': 5, 'en-us': 5 };

export function adapt(code) {
  code = code.replace(/^\(\) =>/m, 'const DocumentationExample = () =>');
  return `${code}\nexport default DocumentationExample;`;
}
