import { h } from 'vue';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import type { TableColumnProps } from '@aifuxi/semi-ui-vue/table';
import '@aifuxi/semi-theme-default/table.css';
import '@aifuxi/semi-theme-default/avatar.css';

export type Row = Record<string, unknown>;
export const figmaIcon = '/demos/table/figma-icon.png';
const DAY = 24 * 60 * 60 * 1000;

export function makeData(total: number): Row[] {
  return Array.from({ length: total }, (_, index) => {
    const isSemiDesign = index % 2 === 0;
    const size = (index * 1000) % 199;
    return {
      key: String(index),
      name: `${isSemiDesign ? 'Semi Design' : 'Semi D2C'} design draft${index}.fig`,
      owner: isSemiDesign ? 'Jiang Pengzhi' : 'Hao Xuan',
      size,
      updateTime: new Date().valueOf() + size * DAY,
      avatarBg: isSemiDesign ? 'grey' : 'red',
    };
  });
}

export const nameFilters = [
  { text: 'Semi Design design draft', value: 'Semi Design design draft' },
  { text: 'Semi D2C design draft', value: 'Semi D2C design draft' },
];
export const filterName: NonNullable<TableColumnProps['onFilter']> = (value, record) =>
  String(record?.name).includes(String(value));
export const sortSize = (a: Row, b: Row) => (Number(a.size) - Number(b.size) > 0 ? 1 : -1);
export const sortUpdate = (a: Row, b: Row) =>
  Number(a.updateTime) - Number(b.updateTime) > 0 ? 1 : -1;

export function renderName(text: unknown, tag: 'div' | 'span' = 'div') {
  return h(tag, [
    h(Avatar, {
      size: 'small',
      shape: 'square',
      src: figmaIcon,
      style: { marginRight: '12px' },
    }),
    String(text),
  ]);
}

export function renderOwner(text: unknown, record: Row) {
  return h('div', [
    h(
      Avatar,
      {
        size: 'small',
        color: record.avatarBg as 'grey' | 'red',
        style: { marginRight: '4px' },
      },
      () => (typeof text === 'string' ? text.slice(0, 1) : ''),
    ),
    String(text),
  ]);
}

export function renderDate(value: unknown) {
  const date = new Date(Number(value));
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export const logChange = (...args: unknown[]) => console.log(...args);
