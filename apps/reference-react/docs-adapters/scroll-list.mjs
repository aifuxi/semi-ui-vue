export const upstream = 'show/scrolllist';
export const exampleCount = { 'zh-cn': 1, 'en-us': 1 };

export function adapt(code, { locale }) {
  // The pinned snippet creates random disabled minutes on every render. Keep its mixed disabled
  // data contract deterministic, matching the Vue demo without touching global Math.random.
  const random = 'Math.random() > 0.5 ? true : false';
  if (!code.includes(random)) throw new Error('Pinned ScrollList minute fixture changed');
  code = code.replace(random, 'index % 2 === 0');
  // The pinned accessibility section explicitly supports column labels; use the same labels as
  // the translated Vue examples so the listbox names are compared, never filtered from evidence.
  const labels = locale === 'zh-cn' ? ['时段', '小时', '分钟'] : ['AM/PM', 'Hour', 'Minute'];
  let column = 0;
  code = code.replace(/<ScrollItem\s/g, () => `<ScrollItem aria-label="${labels[column++]}" `);
  if (column !== 3) throw new Error('Pinned ScrollList columns changed');
  code = code.replace(/^\(\)\s*=>/m, 'const DocumentationExample = () =>');
  return `${code}\nexport default DocumentationExample;`;
}
