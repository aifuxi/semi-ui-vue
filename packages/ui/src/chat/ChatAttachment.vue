<script setup lang="ts">
import { IconAlertCircle, IconBriefStroked, IconClear } from '@aifuxi/semi-icons-vue';
import { computed } from 'vue';

import { Image } from '../image';
import { Progress } from '../progress';
import type { UploadFileItem } from '../upload';

const props = withDefaults(
  defineProps<{
    file:
      | UploadFileItem
      | {
          name: string;
          size: string | number;
          url?: string;
          status?: string;
          uid?: string;
          fileInstance?: File;
        };
    showClear?: boolean;
  }>(),
  { showClear: false },
);
const emit = defineEmits<{ clear: [file: UploadFileItem] }>();
const suffix = computed(() => props.file.name.split('.').pop() ?? 'file');
const isImage = computed(
  () =>
    props.file.fileInstance?.type?.startsWith('image/') ||
    /^(png|jpe?g|gif|bmp|webp)$/i.test(suffix.value),
);
const percent = computed(() => ('percent' in props.file ? (props.file.percent ?? 0) : 0));
</script>

<template>
  <span class="semi-chat-attachment-item">
    <Image
      v-if="isImage"
      class="semi-chat-attachment-img"
      :src="props.file.url"
      :preview="false"
      :width="50"
      :height="50"
    />
    <a
      v-else
      class="semi-chat-attachment-file"
      :href="props.file.url"
      target="_blank"
      rel="noreferrer"
    >
      <IconBriefStroked class="semi-chat-attachment-file-icon" />
      <span class="semi-chat-attachment-file-info">
        <span class="semi-chat-attachment-file-title">{{ props.file.name }}</span>
        <span class="semi-chat-attachment-file-metadata">
          <span class="semi-chat-attachment-file-type">{{ suffix }}</span>
          · {{ props.file.size }}
        </span>
      </span>
    </a>
    <Progress
      v-if="props.file.status === 'uploading'"
      class="semi-chat-attachment-process"
      type="circle"
      size="small"
      :percent="percent"
    />
    <IconAlertCircle
      v-else-if="props.file.status === 'uploadFail' || props.file.status === 'validateFail'"
      class="semi-chat-attachment-fail"
    />
    <button
      v-if="props.showClear"
      type="button"
      class="semi-chat-attachment-clear"
      aria-label="remove attachment"
      @click="emit('clear', props.file as UploadFileItem)"
    >
      <IconClear />
    </button>
  </span>
</template>
