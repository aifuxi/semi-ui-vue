export const upstream = 'basic/icon';
export const exampleCount = { 'zh-cn': 8, 'en-us': 8 };

export function adapt(code) {
  // Icon demos use a top-level anonymous arrow, including a nested CustomIcon.
  code = code.replace(/^\(\) =>/m, 'const DocumentationExample = () =>');
  return `${code}\nexport default DocumentationExample;`;
}
