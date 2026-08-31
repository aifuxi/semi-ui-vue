<script setup lang="ts">
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/vue-3';
import { computed, shallowRef } from 'vue';

import { Upload, type UploadChangePayload, type UploadFileItem } from '../upload';
import { LocaleConsumer } from '../locale';
import type { SidebarImageUploadOptions, SidebarLocale } from './types';

const props = defineProps<NodeViewProps>();
const status = shallowRef<string>();
const options = computed(() => props.extension.options as SidebarImageUploadOptions);
const uploadProps = computed(() =>
  Object.fromEntries(Object.entries(options.value).filter(([key]) => key !== 'getUploadImageSrc')),
);

function handleChange(payload: UploadChangePayload): void {
  status.value = payload.fileList[0]?.status;
}

function handleSuccess(response: unknown, file: File, fileList: UploadFileItem[]): void {
  let src = (fileList[0] as (UploadFileItem & { src?: string }) | undefined)?.src;
  if (options.value.getUploadImageSrc) src = options.value.getUploadImageSrc(src);
  else if (typeof response === 'string') src = response;
  else if (typeof response === 'object' && response && 'src' in response) {
    src = String((response as { src: unknown }).src);
  }
  if (!src) return;
  const position = typeof props.getPos === 'function' ? props.getPos() : undefined;
  if (position === undefined) return;
  props.editor
    .chain()
    .focus()
    .deleteRange({ from: position, to: position + props.node.nodeSize })
    .insertContentAt(position, {
      type: options.value.type ?? 'image',
      attrs: { src, alt: file.name, title: file.name },
    })
    .run();
}

function dragMainText(locale: SidebarLocale | undefined): string {
  if (status.value === 'validateFail') return locale?.validateFailInfo ?? 'Validation failed';
  if (status.value === 'uploadFail') return locale?.uploadFailInfo ?? 'Upload failed';
  return locale?.uploadImgInfo ?? 'Upload image';
}
</script>

<template>
  <NodeViewWrapper class="tiptap-image-slot" tabindex="0">
    <LocaleConsumer v-slot="{ localeData }" component-name="Sidebar">
      <Upload
        v-bind="uploadProps"
        :action="uploadProps.action ?? ''"
        draggable
        :class="status"
        :drag-main-text="dragMainText(localeData as SidebarLocale | undefined)"
        @change="handleChange"
        @success="handleSuccess"
      />
    </LocaleConsumer>
  </NodeViewWrapper>
</template>
