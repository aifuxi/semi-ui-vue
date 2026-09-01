<script setup lang="ts">
import { IconArrowUp, IconChainStroked, IconDeleteStroked } from '@aifuxi/semi-icons-vue';
import { useTemplateRef } from 'vue';

import { Button } from '../button';
import { TextArea, type TextAreaExposed } from '../input';
import { Tooltip } from '../tooltip';
import {
  Upload,
  type UploadChangePayload,
  type UploadExposed,
  type UploadFileItem,
} from '../upload';
import ChatAttachment from './ChatAttachment.vue';
import type { ChatLocale, ChatProps } from './types';

const props = defineProps<{
  value: string;
  attachment: UploadFileItem[];
  disabled: boolean;
  clickUpload: boolean;
  pasteUpload: boolean;
  chatProps: ChatProps;
  locale?: ChatLocale | undefined;
}>();
const emit = defineEmits<{
  input: [value: string];
  keydown: [event: KeyboardEvent];
  paste: [event: ClipboardEvent];
  uploadChange: [payload: UploadChangePayload];
  remove: [file: UploadFileItem];
  send: [event: MouseEvent];
  clear: [event: MouseEvent];
}>();
const textarea = useTemplateRef<TextAreaExposed>('textarea');
const upload = useTemplateRef<UploadExposed>('upload');

defineExpose({
  focus: () => textarea.value?.focus(),
  insert: (files: File[]) => upload.value?.insert(files),
});
</script>

<template>
  <div
    :class="['semi-chat-inputBox', props.chatProps.inputBoxCls]"
    :style="props.chatProps.inputBoxStyle"
  >
    <div class="semi-chat-inputBox-inner" @click="textarea?.focus()">
      <Button
        v-if="props.chatProps.showClearContext"
        class="semi-chat-inputBox-clearButton"
        theme="borderless"
        :aria-label="props.locale?.clearContext ?? 'Clear context'"
        @click.stop="emit('clear', $event)"
      >
        <template #icon><IconDeleteStroked /></template>
      </Button>
      <div class="semi-chat-inputBox-container">
        <Tooltip
          v-if="props.clickUpload && props.chatProps.uploadTipProps"
          v-bind="props.chatProps.uploadTipProps"
        >
          <span>
            <Upload
              v-bind="props.chatProps.uploadProps"
              ref="upload"
              class="semi-chat-inputBox-upload"
              :action="props.chatProps.uploadProps?.action ?? ''"
              :file-list="props.attachment"
              @change="emit('uploadChange', $event)"
            >
              <Button
                class="semi-chat-inputBox-uploadButton"
                theme="borderless"
                aria-label="upload attachment"
              >
                <template #icon><IconChainStroked size="extra-large" /></template>
              </Button>
            </Upload>
          </span>
        </Tooltip>
        <Upload
          v-else-if="props.clickUpload"
          v-bind="props.chatProps.uploadProps"
          ref="upload"
          class="semi-chat-inputBox-upload"
          :action="props.chatProps.uploadProps?.action ?? ''"
          :file-list="props.attachment"
          @change="emit('uploadChange', $event)"
        >
          <Button
            class="semi-chat-inputBox-uploadButton"
            theme="borderless"
            aria-label="upload attachment"
          >
            <template #icon><IconChainStroked size="extra-large" /></template>
          </Button>
        </Upload>
        <div class="semi-chat-inputBox-inputArea" @paste="emit('paste', $event)">
          <TextArea
            ref="textarea"
            class="semi-chat-inputBox-textarea"
            :model-value="props.value"
            :placeholder="props.chatProps.placeholder ?? ''"
            :autosize="{ minRows: 1, maxRows: 5 }"
            @update:model-value="emit('input', $event)"
            @keydown="emit('keydown', $event)"
          />
          <div v-if="props.attachment.length" class="semi-chat-attachment">
            <ChatAttachment
              v-for="file in props.attachment"
              :key="file.uid"
              :file="file"
              show-clear
              @clear="emit('remove', $event)"
            />
          </div>
        </div>
        <Button
          class="semi-chat-inputBox-sendButton"
          theme="solid"
          type="primary"
          :disabled="props.disabled"
          aria-label="send message"
          @click.stop="emit('send', $event)"
        >
          <template #icon
            ><IconArrowUp class="semi-chat-inputBox-sendButton-icon" size="large"
          /></template>
        </Button>
      </div>
    </div>
  </div>
</template>
