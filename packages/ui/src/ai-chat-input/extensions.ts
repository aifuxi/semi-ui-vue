import { Extension, Node, mergeAttributes, type Extensions } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';

import InputSlotNodeView from './InputSlotNodeView.vue';
import SelectSlotNodeView from './SelectSlotNodeView.vue';
import SkillSlotNodeView from './SkillSlotNodeView.vue';

const customSlotAttribute = {
  default: true,
  parseHTML: () => true,
  renderHTML: () => ({ 'data-custom-slot': 'true' }),
};

export const InputSlot = Node.create({
  name: 'inputSlot',
  group: 'inline',
  inline: true,
  content: 'inline*',
  atom: false,
  selectable: true,
  addAttributes() {
    return {
      placeholder: {
        default: '',
        parseHTML: (element) => element.getAttribute('placeholder') ?? '',
        renderHTML: (attrs) => ({ placeholder: attrs.placeholder }),
      },
      isCustomSlot: customSlotAttribute,
    };
  },
  parseHTML: () => [{ tag: 'input-slot' }],
  renderHTML: ({ HTMLAttributes }) => ['input-slot', mergeAttributes(HTMLAttributes), 0],
  addNodeView: () => VueNodeViewRenderer(InputSlotNodeView),
});

export const SelectSlot = Node.create({
  name: 'selectSlot',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: false,
  addAttributes() {
    return {
      value: {
        default: '\u200B',
        parseHTML: (element) => element.getAttribute('value'),
        renderHTML: (attrs) => ({ value: attrs.value }),
      },
      options: {
        default: '',
        parseHTML: (element) => element.getAttribute('options') ?? '',
        renderHTML: (attrs) => (attrs.options ? { options: attrs.options } : {}),
      },
      isCustomSlot: customSlotAttribute,
    };
  },
  parseHTML: () => [{ tag: 'select-slot' }],
  renderHTML: ({ HTMLAttributes }) => ['select-slot', mergeAttributes(HTMLAttributes)],
  addNodeView: () => VueNodeViewRenderer(SelectSlotNodeView),
});

export const SkillSlot = Node.create({
  name: 'skillSlot',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: false,
  addAttributes() {
    return {
      value: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-value'),
        renderHTML: (attrs) => ({ 'data-value': attrs.value }),
      },
      label: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-label'),
        renderHTML: (attrs) => ({ 'data-label': attrs.label }),
      },
      hasTemplate: {
        default: false,
        parseHTML: (element) => element.getAttribute('data-template') === 'true',
        renderHTML: (attrs) => ({ 'data-template': String(Boolean(attrs.hasTemplate)) }),
      },
      isCustomSlot: customSlotAttribute,
    };
  },
  parseHTML: () => [{ tag: 'skill-slot' }],
  renderHTML: ({ HTMLAttributes }) => ['skill-slot', mergeAttributes(HTMLAttributes)],
  addNodeView: () => VueNodeViewRenderer(SkillSlotNodeView),
});

export const SemiAIChatInputStatus = Extension.create({
  name: 'SemiAIChatInput',
  addStorage: () => ({ allowHotKeySend: true }),
  addCommands() {
    const editor = this.editor;
    return {
      setAllowHotKeySendForSemiAIChatInput: (allow: boolean) => () => {
        const storage = editor.storage as unknown as Record<string, { allowHotKeySend: boolean }>;
        storage.SemiAIChatInput!.allowHotKeySend = allow;
        return true;
      },
    };
  },
});

export const aiChatInputExtensions: Extensions = [
  InputSlot,
  SelectSlot,
  SkillSlot,
  SemiAIChatInputStatus,
];

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    semiAIChatInput: {
      setAllowHotKeySendForSemiAIChatInput: (allow: boolean) => ReturnType;
    };
  }
}
