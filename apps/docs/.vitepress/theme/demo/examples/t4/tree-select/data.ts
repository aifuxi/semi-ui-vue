import type { TreeNodeData } from '@aifuxi/semi-ui-vue/tree-select';
export type DemoLocale = 'zh-cn' | 'en-us';
export function createTreeData(
  locale: DemoLocale,
  variant: 'basic' | 'full' | 'search' | 'wrap' | 'strict' | 'selected' = 'basic',
): TreeNodeData[] {
  const chinese = locale === 'zh-cn' && !['full', 'search', 'wrap'].includes(variant);
  const labels: Record<string, string> = {
    Asia: '亚洲',
    China: '中国',
    Beijing: '北京',
    Shanghai: '上海',
    Japan: '日本',
    'North America': '北美洲',
    'South America': '南美洲',
    Antarctica: '南极洲',
  };
  const node = (value: string, key: string, children?: TreeNodeData[]): TreeNodeData => ({
    label: chinese ? (labels[value] ?? value) : value,
    value,
    key,
    ...(children ? { children } : {}),
  });
  const cities = [node('Beijing', '0-0-0'), node('Shanghai', '0-0-1')];
  if (variant === 'full') cities.push(node('Chengdu', '0-0-2'));
  if (variant === 'wrap') cities.push(node('Shenzhen', '0-0-2'), node('Guangzhou', '0-0-3'));
  const china = node('China', '0-0', cities);
  if (variant === 'strict') china.disabled = true;
  const countries = [china];
  if (['full', 'search', 'wrap'].includes(variant))
    countries.push(node('Japan', '0-1', [node('Osaka', '0-1-0')]));
  if (variant === 'strict') countries.push(node('Japan', '0-1'));
  const data = [
    node('Asia', '0', countries),
    node(
      'North America',
      '1',
      ['full', 'search', 'wrap'].includes(variant)
        ? [node('United States', '1-0'), node('Canada', '1-1')]
        : undefined,
    ),
  ];
  if (variant === 'selected') data.push(node('South America', '2'), node('Antarctica', '3'));
  return data;
}
export function replaceChildren(
  data: TreeNodeData[],
  key: string,
  children: TreeNodeData[],
): TreeNodeData[] {
  return data.map((node) =>
    node.key === key
      ? { ...node, children }
      : node.children
        ? { ...node, children: replaceChildren(node.children, key, children) }
        : node,
  );
}
