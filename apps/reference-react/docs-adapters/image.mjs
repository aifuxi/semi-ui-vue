export const upstream = 'show/image';
export const exampleCount = { 'zh-cn': 10, 'en-us': 10 };

export function adapt(code, { number }) {
  const assets = {
    'abstract.jpg': 'image-abstract.svg',
    'sky.jpg': 'image-sky.svg',
    'greenleaf.jpg': 'image-greenleaf.svg',
    'colorful.jpg': 'image-colorful.svg',
    'abstract-small.jpeg': 'image-abstract-small.svg',
    'abstract-big.png': number === 3 ? 'image-abstract-big.svg?reload=' : 'image-abstract-big.svg',
  };
  code = code.replace(
    /https:\/\/lf3-static\.bytednsdoc\.com\/obj\/eden-cn\/ptlz_zlp\/ljhwZthlaukjlkulzlp\/root-web-sites\/([\w.-]+)(\?)?/g,
    (_, file) => {
      if (!assets[file]) throw new Error(`Unknown pinned Image asset: ${file}`);
      return `http://127.0.0.1:4321/demos/${assets[file]}`;
    },
  );
  code = code.replaceAll('https://load-error.jpeg', 'data:image/png;base64,broken');
  // Pinned Fallback's invalid alignItem has no CSS effect; leave it unchanged.
  if (number === 6)
    code = code.replace('{ useMemo, useCallback }', '{ useMemo, useCallback, useState }');
  if (number === 8) {
    // The existing mapping fixes the documented typo in the zoom state names.
    code = code
      .replaceAll('disableZoomIn', 'disabledZoomIn')
      .replaceAll('disableZoomOut', 'disabledZoomOut');
  }
  code = code.replace(/^\(\)\s*=>/m, 'const DocumentationExample = () =>');
  return `${code}\nexport default DocumentationExample;`;
}
