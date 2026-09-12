export const upstream = 'show/tag';
// English omits the standalone icon example. The matrix maps its later indices back to these
// actual pinned blocks and uses the Chinese icon block for the identical English icon demo.
export const exampleCount = { 'zh-cn': 12, 'en-us': 11 };

export function adapt(code, { locale, number, entry }) {
  code = code
    .replaceAll('@douyin/semi-icons', '@douyinfe/semi-icons')
    .replaceAll('IconGithubLogo', 'IconCode')
    .replaceAll('IconSemiLogo', 'IconCodeStroked')
    .replace(
      /https:\/\/[^'"\s]+\/(?:dy\.png|avatarDemo\.jpeg)/g,
      'http://127.0.0.1:4321/demos/photo.svg',
    );
  // JSX splits the color's surrounding spaces into children; Vue compiles the same interpolation
  // to one string. Preserve the exact text while using the same Tag string-content branch.
  code = code.replace('> {item} </Tag>', '>{` ${item} `}</Tag>');
  if (locale === 'en-us' && number === 10)
    code = code.replace("tagKey: '3', color: 'violet'", "tagKey: '2', color: 'violet'");
  if (!entry) {
    code = code.replace(/^\(\)\s*=>/m, 'const DocumentationExample = () =>');
    entry = 'DocumentationExample';
  }
  return `${code}\nexport default ${entry};`;
}
