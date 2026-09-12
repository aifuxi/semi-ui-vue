export const upstream = 'show/overflowlist';
export const exampleCount = { 'zh-cn': 4, 'en-us': 4 };

const reactHooks = [
  'useCallback',
  'useContext',
  'useEffect',
  'useImperativeHandle',
  'useLayoutEffect',
  'useMemo',
  'useReducer',
  'useRef',
  'useState',
];

export function adapt(code) {
  // Every pinned OverflowList snippet destructures `useState` from React while only importing the
  // default export, so the missing hook names are added to that import.
  const used = reactHooks.filter((hook) => code.includes(`${hook}(`));
  if (used.length) {
    const match = code.match(/^import React(?:,\s*\{([^}]*)\})? from 'react';$/m);
    if (match) {
      const declared = (match[1] ?? '')
        .split(',')
        .map((name) => name.trim())
        .filter(Boolean);
      const names = [...new Set([...declared, ...used])];
      code = code.replace(match[0], `import React, { ${names.join(', ')} } from 'react';`);
    }
  }
  // `>+{items.length}<` renders as two React children, which sends the Tag down its `center` branch
  // and skips the derived `Tag: +N` aria-label, while the Vue port can only merge the same copy into
  // one text node (`ellipsis` plus that label). Rendering one `{`+${n}`}` child keeps both sides on
  // the same text node without changing the visible copy.
  code = code.replace(
    />\+{([A-Za-z_$][\w.$]*)}</g,
    (_match, expression) => '>{`+${' + expression + '}`}<',
  );
  // The pinned snippets are parenthesized arrow IIFEs; standalone ESM needs one default export.
  code = code.replace(/^\(\)\s*=>/m, 'const DocumentationExample = () =>');
  return `${code}\nexport default DocumentationExample;`;
}
