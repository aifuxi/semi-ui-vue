export const upstream = 'show/cropper';
export const exampleCount = { 'zh-cn': 5, 'en-us': 5 };

export function adapt(code, { number, entry }) {
  // The original live editor supplies render; standalone ESM mounts the default export instead.
  code = code.replace(/^render\(<Demo\s*\/>\);?\s*$/m, '');
  // The pinned live preview snippet uses Slider without importing it.
  if (number === 5)
    code = code.replace(
      'Cropper, Button, RadioGroup, Radio',
      'Cropper, Button, Slider, RadioGroup, Radio',
    );
  code = code.replace(
    /https:\/\/[^'"\s]+\/(?:image\.png|abstract\.jpg)/g,
    number === 5
      ? 'http://127.0.0.1:4321/demos/cropper-abstract.svg'
      : 'http://127.0.0.1:4321/demos/cropper-image.svg',
  );
  return `${code}\nexport default ${entry ?? 'Demo'};`;
}
