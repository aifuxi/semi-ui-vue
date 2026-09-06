export const upstream = 'other/configprovider';
export const exampleCount = { 'zh-cn': 3, 'en-us': 3 };

export function adapt(code, { number, entry }) {
  if (!entry) throw new Error(`Unsupported pinned ConfigProvider entry ${number}`);
  // The pinned RTL demo calls Toast but omits its import.
  if (number === 3) code = `import { Toast } from '@douyinfe/semi-ui';\n${code}`;
  return `${code}\nexport default ${entry};`;
}
