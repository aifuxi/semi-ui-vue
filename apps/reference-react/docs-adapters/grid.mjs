export const upstream = 'basic/grid';
export const exampleCount = { 'zh-cn': 7, 'en-us': 7 };

export function adapt(code) {
  code = code.replace(/^\(\) =>/m, 'const DocumentationExample = () =>');
  return `${code}\nexport default DocumentationExample;`;
}
