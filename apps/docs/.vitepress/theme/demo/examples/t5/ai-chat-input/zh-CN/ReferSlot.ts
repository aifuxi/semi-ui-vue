import { AIChatInput, SkillSlot } from '@aifuxi/semi-ui-vue/ai-chat-input';
// Extend the existing Tiptap Node instance so the editor and REPL share one runtime.
export const ReferSlot = SkillSlot.extend({
  name: 'referSlot',
  addAttributes() {
    return {
      value: {
        default: '',
        parseHTML: (el: HTMLElement) => el.getAttribute('data-value'),
        renderHTML: (a: Record<string, unknown>) => ({ 'data-value': a.value }),
      },
      info: {
        default: '{}',
        parseHTML: (el: HTMLElement) => el.getAttribute('data-info'),
        renderHTML: (a: Record<string, unknown>) => ({ 'data-info': a.info }),
      },
      type: {
        default: 'text',
        parseHTML: (el: HTMLElement) => el.getAttribute('data-type'),
        renderHTML: (a: Record<string, unknown>) => ({ 'data-type': a.type }),
      },
      uniqueKey: {
        default: '',
        parseHTML: (el: HTMLElement) => el.getAttribute('data-unique-key'),
        renderHTML: (a: Record<string, unknown>) => ({ 'data-unique-key': a.uniqueKey }),
      },
      isCustomSlot: AIChatInput.getCustomSlotAttribute(),
    };
  },
  parseHTML: () => [{ tag: 'refer-slot' }],
  renderHTML: ({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) => [
    'refer-slot',
    HTMLAttributes,
  ],
  addNodeView:
    () =>
    ({ node }: { node: { attrs: Record<string, unknown> } }) => {
      const dom = document.createElement('span');
      dom.className = 'ai-chat-input-refer-slot-wrapper';
      dom.textContent = String(node.attrs.value ?? '');
      dom.contentEditable = 'false';
      return { dom };
    },
});
