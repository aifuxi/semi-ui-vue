export const upstream = 'show/card';
export const exampleCount = { 'zh-cn': 14, 'en-us': 14 };

// Both documented pages serve the local demo assets; the pinned snippets point at CDN copies.
// The pinned Markdown mixes two cover file names (`card-cover-docs-demo.jpeg` for the flexible,
// skeleton and actions examples, `card-cover-docs-demo2.jpeg` for the cover example); both map to
// the single local poster asset the documented Vue demos use.
const assets = [
  [
    'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/card-cover-docs-demo2.jpeg',
    'http://127.0.0.1:4321/demos/poster.svg',
  ],
  [
    'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/card-cover-docs-demo.jpeg',
    'http://127.0.0.1:4321/demos/poster.svg',
  ],
  [
    'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/card-meta-avatar-docs-demo.jpg',
    'http://127.0.0.1:4321/demos/photo.svg',
  ],
];

export function adapt(code, { entry }) {
  for (const [from, to] of assets) code = code.replaceAll(from, to);
  // The pinned snippets declare a named function component, so export that entry itself.
  if (!entry) {
    code = code.replace(/^\(\)\s*=>/m, 'const DocumentationExample = () =>');
    entry = 'DocumentationExample';
  }
  return `${code}\nexport default ${entry};`;
}
