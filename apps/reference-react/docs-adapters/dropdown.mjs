export const upstream = 'show/dropdown';
export const exampleCount = { 'zh-cn': 6, 'en-us': 6 };

export function adapt(code, { entry, locale, number }) {
  if (locale === 'en-us' && number === 4) {
    // Fixed English JSX misspells this React prop; the resulting DOM stays tabindex=-1.
    const original = '<Dropdown.Menu tabindex={-1}>';
    if (code.split(original).length !== 2)
      throw new Error('Expected one pinned English Dropdown focus menu tabindex typo');
    code = code.replace(original, '<Dropdown.Menu tabIndex={-1}>');
  }
  if (!entry) {
    code = code.replace(/^\(\)\s*=>/m, 'const DocumentationExample = () =>');
    entry = 'DocumentationExample';
  }
  return `${code}\nexport default ${entry};`;
}
