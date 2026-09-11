export const upstream = 'feedback/banner';
export const exampleCount = { 'zh-cn': 4, 'en-us': 4 };

export function adapt(code, { entry }) {
  // The shared pinned site CSS already includes layout decoration and container borders.
  if (!entry) {
    code = code.replace(/^\(\) =>/m, 'const DocumentationExample = () =>');
    entry = 'DocumentationExample';
  }
  return `${code}\nexport default ${entry};`;
}
