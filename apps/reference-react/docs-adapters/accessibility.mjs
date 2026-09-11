export const upstream = 'experience/accessibility';
export const exampleCount = { 'zh-cn': 1, 'en-us': 1 };

export function adapt(code) {
  // Preserve the existing documented local-asset substitution on both sides.
  code = code.replace(
    'https://lf9-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/a11y-img-alt-avatar.png',
    'http://127.0.0.1:4321/demos/photo.svg',
  );
  code = code.replace(/^\(\) =>/m, 'const DocumentationExample = () =>');
  return `${code}\nexport default DocumentationExample;`;
}
