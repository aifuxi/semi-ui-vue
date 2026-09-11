export const upstream = 'feedback/toast';
export const exampleCount = { 'zh-cn': 9, 'en-us': 10 };

// The pinned Basic example imports `throttle` from lodash-es, which the fixed live scope
// provides. The reference bundle only aliases lodash, so keep the same leading-only
// semantics with a local implementation instead of widening the shared build aliases.
const throttleShim = `function throttle(fn, wait, options = {}) {
    let last = 0;
    let timer = null;
    const throttled = (...args) => {
        const now = Date.now();
        const remaining = wait - (now - last);
        if (remaining <= 0) {
            last = now;
            fn(...args);
        } else if (!timer && options.trailing !== false) {
            timer = setTimeout(() => {
                last = Date.now();
                timer = null;
                fn(...args);
            }, remaining);
        }
    };
    throttled.cancel = () => {
        clearTimeout(timer);
        timer = null;
        last = 0;
    };
    return throttled;
}`;

export function adapt(code, { entry }) {
  // Independent-brand substitution plus the pinned English Other Types example's missing
  // space after the comma; every other string stays identical to the fixed source.
  code = code
    .replaceAll('Hi,Bytedance dance dance', 'Hi, AIFUXI dance dance')
    .replaceAll('Hi, Bytedance dance dance', 'Hi, AIFUXI dance dance');
  code = code.replace(/^import \{ throttle \} from 'lodash-es';\s*$/m, throttleShim);
  // The pinned `semi-ui/index.ts` combines `default as Toast` with the named
  // `ToastFactory`, which the shared reference import map cannot resolve. Route only
  // these two names through the existing public toast alias.
  code = code.replace(/import\s*\{([^}]+)\}\s*from\s*'@douyinfe\/semi-ui';?/g, (_whole, names) => {
    const list = names
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean);
    const rest = list.filter((name) => name !== 'Toast' && name !== 'ToastFactory');
    const lines = [];
    if (rest.length) lines.push(`import { ${rest.join(', ')} } from '@douyinfe/semi-ui';`);
    if (list.includes('Toast') && list.includes('ToastFactory'))
      lines.push("import Toast, { ToastFactory } from '@semi-v2.102.0/toast';");
    else if (list.includes('Toast')) lines.push("import Toast from '@semi-v2.102.0/toast';");
    else if (list.includes('ToastFactory'))
      lines.push("import { ToastFactory } from '@semi-v2.102.0/toast';");
    return lines.join('\n');
  });
  // The fixed live scope supplies React to examples that omit the import (English Stacking).
  if (!/from ['"]react['"];?/.test(code)) code = `import React from 'react';\n${code}`;
  // The fixed live scope exposes `render`; standalone ESM must not execute it.
  code = code.replace(/^render\(\w+\);?\s*$/m, '');
  if (!entry) code = code.replace(/^\(\)\s*=>/m, 'const DocumentationExample = () =>');
  return `${code}\nexport default ${entry ?? 'DocumentationExample'};`;
}
