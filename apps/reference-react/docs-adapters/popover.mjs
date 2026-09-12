export const upstream = 'show/popover';
export const exampleCount = { 'zh-cn': 9, 'en-us': 9 };

export function adapt(code, { number }) {
  // Match the reference bundler's fixed illustrations alias, as in Empty.
  code = code.replaceAll('@douyinfe/semi-illustrations', '@semi-v2.102.0/illustrations');
  // TriggerChildren contains a helper class before Demo, so the generic entry
  // inference selects the helper. The pinned evaluator explicitly renders Demo.
  code = code.replace(/^render\(Demo\);?\s*$/m, '');
  code = code.replace(/^\(\) =>/m, 'const DocumentationExample = () =>');
  return `${code}\nexport default ${number === 4 || number === 9 ? 'DocumentationExample' : 'Demo'};`;
}
