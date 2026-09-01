/* eslint-disable vue/one-component-per-file -- upstream exports one default renderer registry */
import { IconUploadError } from '@aifuxi/semi-icons-vue';
import {
  Fragment,
  defineComponent,
  h,
  isVNode,
  type Component,
  type Slots,
  type VNode,
  type VNodeChild,
} from 'vue';

import CodeHighlight from '../code-highlight/CodeHighlight.vue';
import Image from '../image/Image.vue';
import Table from '../table/Table.vue';
import Paragraph from '../typography/Paragraph.vue';
import Text from '../typography/Text.vue';
import Title from '../typography/Title.vue';
import type { MarkdownRenderComponents } from './types';

const PREFIX = 'semi-markdownRender';

function createTitle(heading: 1 | 2 | 3 | 4 | 5 | 6): Component {
  return defineComponent({
    name: `MarkdownRenderH${heading}`,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () =>
        h(
          Title,
          {
            ...attrs,
            heading,
            class: [`${PREFIX}-component-header`, attrs.class],
          },
          slots,
        );
    },
  });
}

const MarkdownRenderParagraph = defineComponent({
  name: 'MarkdownRenderParagraph',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => h(Paragraph, { ...attrs, class: [`${PREFIX}-component-p`, attrs.class] }, slots);
  },
});

const MarkdownRenderLink = defineComponent({
  name: 'MarkdownRenderLink',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => h(Text, { ...attrs, link: { ...attrs } }, slots);
  },
});

const MarkdownRenderImage = defineComponent({
  name: 'MarkdownRenderImage',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h('div', { class: `${PREFIX}-component-image` }, [
        h(Image, { ...attrs, fallback: h(IconUploadError), width: '100%' }),
        h('div', { class: `${PREFIX}-component-image-alt` }, String(attrs.alt ?? '')),
      ]);
  },
});

function textContent(value: VNodeChild | VNodeChild[] | undefined): string {
  if (value === null || value === undefined || typeof value === 'boolean') return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map((item) => textContent(item)).join('');
  if (!isVNode(value)) return '';
  return textContent(value.children as VNodeChild | VNodeChild[] | undefined);
}

const MarkdownRenderCode = defineComponent({
  name: 'MarkdownRenderCode',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => {
      const className = typeof attrs.class === 'string' ? attrs.class : '';
      const language = className.split('-').at(-1) ?? '';
      const code = textContent(slots.default?.());
      return language
        ? h(CodeHighlight, { code, language, lineNumber: true })
        : h('span', { class: `${PREFIX}-simple-code` }, code);
    };
  },
});

function flattenElements(children: VNodeChild | VNodeChild[] | undefined): VNode[] {
  const result: VNode[] = [];
  const visit = (value: VNodeChild | VNodeChild[] | undefined): void => {
    for (const child of Array.isArray(value) ? value : [value]) {
      if (!isVNode(child)) continue;
      if (child.type === Fragment) {
        visit(child.children as VNodeChild | VNodeChild[] | undefined);
      } else {
        result.push(child);
      }
    }
  };
  visit(children);
  return result;
}

function elementChildren(node: VNode | undefined): VNode[] {
  return flattenElements(node?.children as VNodeChild | VNodeChild[] | undefined);
}

function slotChildren(slots: Slots): VNodeChild[] {
  return (slots.default?.() ?? []) as VNodeChild[];
}

const MarkdownRenderTable = defineComponent({
  name: 'MarkdownRenderTable',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => {
      const children = flattenElements(slotChildren(slots));
      const thead = children.find((node) => node.type === 'thead') ?? children[0];
      const tbody = children.find((node) => node.type === 'tbody') ?? children[1];
      const headerRow = elementChildren(thead).find((node) => node.type === 'tr');
      const columns = elementChildren(headerRow).map((cell, index) => ({
        dataIndex: String(index),
        title: cell.children as VNodeChild,
      }));
      const dataSource = elementChildren(tbody)
        .filter((node) => node.type === 'tr')
        .map((row, rowIndex) => {
          const record: Record<string, unknown> = { key: String(rowIndex) };
          elementChildren(row).forEach((cell, cellIndex) => {
            record[String(cellIndex)] = cell.children as VNodeChild;
          });
          return record;
        });
      return h(Table, { ...attrs, columns, dataSource });
    };
  },
});

export const markdownRenderDefaultComponents = Object.freeze({
  h1: createTitle(1),
  h2: createTitle(2),
  h3: createTitle(3),
  h4: createTitle(4),
  h5: createTitle(5),
  h6: createTitle(6),
  a: MarkdownRenderLink,
  img: MarkdownRenderImage,
  table: MarkdownRenderTable,
  p: MarkdownRenderParagraph,
  code: MarkdownRenderCode,
}) satisfies MarkdownRenderComponents;
