import MarkdownIt, { type Token } from 'markdown-it';
import { defineComponent, h, type Component, type PropType, type VNodeChild } from 'vue';

import type { ChatMarkdownRenderProps } from './types';

function safeUrl(value: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return /^(https?:|mailto:|tel:|\/|#)/i.test(trimmed) ? trimmed : undefined;
}

function attrs(token: Token): Record<string, unknown> {
  const output: Record<string, unknown> = {};
  for (const [name, value] of token.attrs ?? []) {
    if (name.startsWith('on')) continue;
    if (name === 'href' || name === 'src') {
      const safe = safeUrl(value);
      if (safe) output[name] = safe;
      continue;
    }
    output[name === 'class' ? 'class' : name] = value;
  }
  return output;
}

function renderTokens(tokens: Token[], components: Record<string, unknown>): VNodeChild[] {
  function visit(start: number, closeType?: string): [VNodeChild[], number] {
    const nodes: VNodeChild[] = [];
    let index = start;
    while (index < tokens.length) {
      const token = tokens[index]!;
      if (closeType && token.type === closeType) return [nodes, index + 1];
      if (token.type === 'inline') {
        nodes.push(...renderTokens(token.children ?? [], components));
        index += 1;
        continue;
      }
      if (token.type === 'text') {
        nodes.push(token.content);
        index += 1;
        continue;
      }
      if (token.type === 'softbreak') {
        nodes.push('\n');
        index += 1;
        continue;
      }
      if (token.type === 'hardbreak') {
        nodes.push(h('br'));
        index += 1;
        continue;
      }
      if (token.type === 'code_inline') {
        nodes.push(h('code', token.content));
        index += 1;
        continue;
      }
      if (token.type === 'fence' || token.type === 'code_block') {
        const language = token.info.trim().split(/\s+/)[0] ?? '';
        nodes.push(
          h('div', { class: 'semi-chat-chatBox-content-code semi-always-dark' }, [
            language
              ? h('div', { class: 'semi-chat-chatBox-content-code-topSlot' }, [
                  h('span', { class: 'semi-chat-chatBox-content-code-topSlot-type' }, language),
                ])
              : undefined,
            h('pre', [
              h('code', { class: language ? `language-${language}` : undefined }, token.content),
            ]),
          ]),
        );
        index += 1;
        continue;
      }
      if (token.type === 'image') {
        const properties = attrs(token);
        properties.alt = token.children?.map((child) => child.content).join('') ?? '';
        nodes.push(h((components.img as Component | undefined) ?? 'img', properties));
        index += 1;
        continue;
      }
      if (token.type === 'html_inline' || token.type === 'html_block') {
        nodes.push(token.content);
        index += 1;
        continue;
      }
      if (token.nesting === 1) {
        const close = token.type.replace(/_open$/, '_close');
        const [children, next] = visit(index + 1, close);
        const tag = (components[token.tag] as Component | undefined) ?? token.tag;
        nodes.push(h(tag, attrs(token), children as never));
        index = next;
        continue;
      }
      index += 1;
    }
    return [nodes, index];
  }
  return visit(0)[0];
}

export default defineComponent({
  name: 'ChatMarkdownContent',
  props: {
    raw: { type: String, default: '' },
    components: {
      type: Object as PropType<Record<string, unknown>>,
      default: () => ({}),
    },
    options: {
      type: Object as PropType<ChatMarkdownRenderProps>,
      default: () => ({}),
    },
  },
  setup(props) {
    return () => {
      const parser = new MarkdownIt({
        html: false,
        breaks: Boolean(props.options.breaks),
        linkify: props.options.linkify !== false,
        typographer: Boolean(props.options.typographer),
      });
      return h(
        'div',
        { class: 'semi-markdownRender' },
        renderTokens(parser.parse(props.raw, {}), props.components),
      );
    };
  },
});
