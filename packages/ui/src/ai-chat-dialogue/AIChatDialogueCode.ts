import { IconCopyStroked, IconTick } from '@aifuxi/semi-icons-vue';
import { defineComponent, h, onBeforeUnmount, ref, useAttrs, type VNodeChild } from 'vue';

import CodeHighlight from '../code-highlight/CodeHighlight.vue';

function textContent(value: VNodeChild | VNodeChild[] | undefined): string {
  if (value === null || value === undefined || typeof value === 'boolean') return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map((item) => textContent(item)).join('');
  if (typeof value === 'object' && 'children' in value)
    return textContent(value.children as VNodeChild | VNodeChild[] | undefined);
  return '';
}

export default defineComponent({
  name: 'AIChatDialogueCode',
  inheritAttrs: false,
  setup(_, { slots }) {
    const attributes = useAttrs();
    const copied = ref(false);
    let timer: ReturnType<typeof setTimeout> | undefined;
    onBeforeUnmount(() => timer && clearTimeout(timer));
    return () => {
      const className = typeof attributes.class === 'string' ? attributes.class : '';
      const language = className.split('-').at(-1) ?? '';
      const code = textContent(slots.default?.());
      if (!language) return h('span', { class: 'semi-markdownRender-simple-code' }, code);
      const copy = async (): Promise<void> => {
        if (typeof navigator !== 'undefined') await navigator.clipboard?.writeText(code);
        copied.value = true;
        timer = setTimeout(() => (copied.value = false), 2000);
      };
      return h('div', { class: 'semi-ai-chat-dialogue-code' }, [
        h('div', { class: 'semi-ai-chat-dialogue-code-topSlot' }, [
          h('span', { class: 'semi-ai-chat-dialogue-code-topSlot-type' }, language),
          h('span', { class: 'semi-ai-chat-dialogue-code-topSlot-copy' }, [
            h(
              'button',
              {
                type: 'button',
                'aria-label': copied.value ? 'copied' : 'copy code',
                class: 'semi-ai-chat-dialogue-code-topSlot-copy-wrapper',
                onClick: copy,
              },
              [h(copied.value ? IconTick : IconCopyStroked)],
            ),
          ]),
        ]),
        h(CodeHighlight, { code, language, lineNumber: true }),
      ]);
    };
  },
});
