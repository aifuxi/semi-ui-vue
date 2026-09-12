export const upstream = 'show/list';
export const exampleCount = { 'zh-cn': 14, 'en-us': 14 };

// The pinned English Drag Sort snippet reuses the Chinese paragraph of the Chinese page; the
// published English example keeps the English paragraph the other English snippets use.
const englishParagraph =
  "Life's but a walking shadow, a poor player, that struts and frets his hour upon the stage, and then is heard no more; it is a tale told by an idiot, full of sound and fury, signifying nothing.";

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

// The pinned Scroll Load / Virtualized / Drag Sort snippets import third-party React libraries the
// reference harness does not ship (react-infinite-scroller, react-virtualized) or does not need
// (@dnd-kit/modifiers). Those three examples are outside this batch's matrix, so the adapter swaps
// the imports for inert local equivalents — the reference build stays green without adding
// dependencies or touching the shared harness.
const excludedExampleShims = {
  7: [
    [
      /^import InfiniteScroll from 'react-infinite-scroller';$/m,
      'const InfiniteScroll = ({ children }) => <>{children}</>;',
    ],
  ],
  8: [
    [
      /^import \{ InfiniteLoader, AutoSizer \} from 'react-virtualized';$/m,
      'const InfiniteLoader = ({ children }) => children({ onRowsRendered: () => undefined, registerChild: () => undefined });\nconst AutoSizer = ({ children }) => children({ width: 700, height: 500 });',
    ],
    [
      /^import VList from 'react-virtualized\/dist\/commonjs\/List';$/m,
      'const VList = () => null;',
    ],
  ],
  9: [
    [
      /^import \{ restrictToVerticalAxis \} from '@dnd-kit\/modifiers';$/m,
      'const restrictToVerticalAxis = {};',
    ],
    // The harness shim exports the dnd-kit surface used by the Transfer batch but not these two
    // names, so the excluded Drag Sort example declares local equivalents.
    [
      /^import \{ DndContext, PointerSensor, MouseSensor, useSensors, useSensor \} from '@dnd-kit\/core';$/m,
      "import { DndContext, MouseSensor, useSensors, useSensor } from '@dnd-kit/core';\nconst PointerSensor = class {};",
    ],
    [
      /^import \{ SortableContext, arrayMove, useSortable, verticalListSortingStrategy \} from '@dnd-kit\/sortable';$/m,
      "import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';\nconst arrayMove = (items, from, to) => {\n  const next = [...items];\n  const [moved] = next.splice(from, 1);\n  next.splice(to, 0, moved);\n  return next;\n};",
    ],
  ],
};

export function adapt(code, { entry, locale, number }) {
  for (const [pattern, replacement] of excludedExampleShims[number] ?? [])
    code = code.replace(pattern, replacement);
  // The pinned English Responsive snippet mistypes the Col breakpoints as `Xs`/`Xl`, which React
  // renders as inert DOM attributes; the documented English demo uses the real `xs`/`xl` props.
  if (locale === 'en-us' && number === 5)
    code = code.replace(/\bXs(?=[=:])/g, 'xs').replace(/\bXl(?=[=:])/g, 'xl');
  if (locale === 'en-us' && number === 9)
    code = code.replace(/Semi Design\s+设计系统包含[\s\S]*?Web 应用。/, englishParagraph);
  // Some pinned snippets use a hook that their React import does not list; add the missing names.
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
  // The pinned snippets either declare a named function component or an anonymous arrow IIFE, and
  // the function form ends with a `render(Name);` call for the live evaluator.
  if (!entry) {
    code = code.replace(/^\(\)\s*=>/m, 'const DocumentationExample = () =>');
    entry = 'DocumentationExample';
  }
  code = code.replace(/^\s*render\([^)]*\);\s*$/m, '');
  return `${code}\nexport default ${entry};`;
}
