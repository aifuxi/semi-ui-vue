<script setup lang="ts">
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyleKit } from '@tiptap/extension-text-style';
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/vue-3';
import { computed, watch } from 'vue';

import SidebarFileToolbar from './SidebarFileToolbar.vue';
import SidebarRichTextRenderer from './SidebarRichTextRenderer';
import { SidebarImageUploadNode, SidebarSelectionMark } from './sidebar-extensions';
import type { SidebarFileItemEmits, SidebarFileItemProps } from './types';

defineOptions({ name: 'SidebarFileItem' });
const props = withDefaults(defineProps<Omit<SidebarFileItemProps, 'key'>>(), { editable: true });
const emit = defineEmits<SidebarFileItemEmits>();
const extensions = computed(() => [
  TextStyleKit,
  StarterKit.configure({
    link: { openOnClick: false, enableClickSelection: true },
  }),
  Image,
  SidebarSelectionMark,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  SidebarImageUploadNode.configure(props.imgUploadProps),
  ...(props.extensions ?? []),
]);

const editor = useEditor({
  content: props.content ?? '',
  editable: props.editable,
  extensions: extensions.value,
  onUpdate: ({ editor: instance }) => {
    const html = instance.getHTML();
    emit('content-change', html);
  },
});

watch(
  () => props.editable,
  (editable) => editor.value?.setEditable(editable),
);
watch(
  () => props.content,
  (content) => {
    if (!editor.value || content === undefined || editor.value.getHTML() === content) return;
    editor.value.commands.setContent(content, { emitUpdate: false });
  },
);
</script>

<template>
  <div :class="['semi-sidebar-file', props.class, props.className]" :style="props.style">
    <SidebarFileToolbar v-if="props.editable && editor" :editor="editor" />
    <EditorContent v-if="editor" :editor="editor" class="semi-sidebar-file-editor" />
    <SidebarRichTextRenderer v-else :html="props.content ?? ''" />
  </div>
</template>
