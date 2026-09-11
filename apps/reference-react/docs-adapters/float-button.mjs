export const upstream = 'basic/floatbutton';
export const exampleCount = { 'zh-cn': 7, 'en-us': 7 };

export function adapt(code) {
  code = code.replace(/^\(\) =>/m, 'const PinnedExample = () =>');
  // Isolate the fixed buttons to the same 340px preview viewport as the Vue SFC.
  return `${code}\nexport default function DocumentationExample() {
    return <div style={{ minHeight: 340, transform: 'translateZ(0)' }}><PinnedExample /></div>;
  }`;
}
