export const upstream = 'basic/resizable';
export const exampleCount = { 'zh-cn': 14, 'en-us': 14 };

export function adapt(code) {
  // Foundation accepts a scalar, but the fixed React PropTypes only declares the equivalent tuple.
  code = code.replace('grid={100}', 'grid={[100, 100]}');
  // The fixed public entry exports this family by name; reuse the existing pinned alias.
  code = code.replace(/import \{([^}]+)\} from '@douyinfe\/semi-ui';/g, (_, imports) => {
    const names = imports.split(',').map((name) => name.trim());
    const resize = names.filter((name) => /^Resiz/.test(name));
    const other = names.filter((name) => !/^Resiz/.test(name));
    return [
      resize.length ? `import { ${resize.join(', ')} } from '@semi-v2.102.0/resizable';` : '',
      other.length ? `import { ${other.join(', ')} } from '@douyinfe/semi-ui';` : '',
    ].join('\n');
  });
  for (const name of ['Toast', 'Button'])
    if (code.includes(name) && !new RegExp(`import \\{[^}]*\\b${name}\\b`).test(code))
      code = `import { ${name} } from '@douyinfe/semi-ui';\n${code}`;
  if (code.includes('IconTransfer'))
    code = `import { IconHandle } from '@douyinfe/semi-icons';\n${code.replaceAll('IconTransfer', 'IconHandle')}`;
  return `${code}\nexport default Demo;`;
}
