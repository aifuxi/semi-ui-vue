<script setup lang="ts">
import {
  IconCode,
  IconExcel,
  IconPdf,
  IconSendMsgStroked,
  IconVideo,
  IconWord,
} from '@aifuxi/semi-icons-vue';

import { Image } from '../image';
import type { Reference } from './types';

defineProps<{ references: Reference[] }>();
const imageTypes = new Set(['jpeg', 'jpg', 'png', 'gif']);
const typeMap: Record<string, 'word' | 'pdf' | 'excel' | 'video' | 'code'> = {
  doc: 'word',
  docx: 'word',
  txt: 'word',
  word: 'word',
  pdf: 'pdf',
  excel: 'excel',
  xlsx: 'excel',
  xls: 'excel',
  mp4: 'video',
  avi: 'video',
  mov: 'video',
  wmv: 'video',
  flv: 'video',
  mkv: 'video',
  json: 'code',
  js: 'code',
  ts: 'code',
  jsx: 'code',
  tsx: 'code',
};
function extension(name?: string): string {
  return name?.split('.').pop()?.toLowerCase() ?? '';
}
</script>

<template>
  <div class="semi-ai-chat-dialogue-references">
    <div
      v-for="(reference, index) in references"
      :key="reference.id ?? index"
      class="semi-ai-chat-dialogue-reference"
    >
      <IconSendMsgStroked />
      <span class="semi-ai-chat-dialogue-reference-content">
        <span
          v-if="typeMap[extension(reference.name)]"
          :class="[
            'semi-ai-chat-dialogue-reference-icon',
            `semi-ai-chat-dialogue-reference-icon-${typeMap[extension(reference.name)]}`,
          ]"
        >
          <IconWord v-if="typeMap[extension(reference.name)] === 'word'" size="small" />
          <IconPdf v-else-if="typeMap[extension(reference.name)] === 'pdf'" size="small" />
          <IconExcel v-else-if="typeMap[extension(reference.name)] === 'excel'" size="small" />
          <IconVideo v-else-if="typeMap[extension(reference.name)] === 'video'" size="small" />
          <IconCode v-else size="small" />
        </span>
        <Image
          v-if="reference.url && imageTypes.has(extension(reference.name))"
          class="semi-ai-chat-dialogue-reference-img"
          :src="reference.url"
          :width="16"
          :height="16"
        />
        <span class="semi-ai-chat-dialogue-reference-name">
          {{ reference.name ?? reference.content }}
        </span>
      </span>
    </div>
  </div>
</template>
