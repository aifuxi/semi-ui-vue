<script setup lang="ts">
import Document from '@tiptap/extension-document';
import HardBreak from '@tiptap/extension-hard-break';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { Placeholder, UndoRedo } from '@tiptap/extensions';
import { EditorContent, useEditor } from '@tiptap/vue-3';
import { computed } from 'vue';
import type { Content as TiptapContent, Editor, Extensions } from '@tiptap/core';

import { aiChatInputExtensions } from './extensions';
import type { PlaceholderProps } from './types';

const props = defineProps<{
  defaultContent?: TiptapContent;
  placeholder?: PlaceholderProps;
  showPlaceholderWhenSkillOnly?: boolean;
  extensions?: Extensions;
  immediatelyRender?: boolean;
  handleKeyDown?: (view: unknown, event: KeyboardEvent) => boolean;
}>();
const emit = defineEmits<{
  create: [editor: Editor];
  update: [editor: Editor];
  keydown: [event: KeyboardEvent];
  paste: [event: ClipboardEvent, files: File[]];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const placeholderExtension = computed(() =>
  Placeholder.configure({
    placeholder: props.placeholder ?? '',
    showOnlyCurrent: true,
  }),
);

function syncSkillPlaceholder(instance: Editor): void {
  const dom = instance.view.dom;
  const show = Boolean(props.showPlaceholderWhenSkillOnly && isSkillOnly(instance));
  dom.classList.toggle('has-skill-slot', show);
  if (show && typeof props.placeholder === 'string') dom.dataset.placeholder = props.placeholder;
  else delete dom.dataset.placeholder;
}

const editor = useEditor({
  content: props.defaultContent ?? '',
  extensions: [
    Document,
    Paragraph,
    Text,
    UndoRedo,
    HardBreak,
    ...aiChatInputExtensions,
    placeholderExtension.value,
    ...(props.extensions ?? []),
  ],
  editorProps: {
    handleKeyDown: (view, event) => props.handleKeyDown?.(view, event) ?? false,
  },
  onCreate: ({ editor: instance }) => {
    syncSkillPlaceholder(instance);
    emit('create', instance);
  },
  onUpdate: ({ editor: instance }) => {
    syncSkillPlaceholder(instance);
    emit('update', instance);
  },
});

function isSkillOnly(instance: Editor): boolean {
  const json = instance.getJSON();
  const nodes = json.content?.flatMap((node) => node.content ?? []) ?? [];
  return nodes.length === 1 && nodes[0]?.type === 'skillSlot';
}

function handlePaste(event: ClipboardEvent): void {
  const files = Array.from(event.clipboardData?.items ?? [])
    .map((item) => item.getAsFile())
    .filter((file): file is File => Boolean(file));
  emit('paste', event, files);
}

function setContent(content: TiptapContent): void {
  editor.value?.commands.setContent(content);
}

function focus(pos?: Parameters<Editor['commands']['focus']>[0]): void {
  editor.value?.commands.focus(pos ?? 'end');
}

function getEditor(): Editor | undefined {
  return editor.value;
}

defineExpose({ setContent, focus, getEditor });
</script>

<template>
  <EditorContent
    v-if="editor"
    :editor="editor"
    class="semi-aiChatInput-editor-content"
    @keydown="emit('keydown', $event as KeyboardEvent)"
    @paste="handlePaste"
    @focus="emit('focus', $event as FocusEvent)"
    @blur="emit('blur', $event as FocusEvent)"
  />
</template>
