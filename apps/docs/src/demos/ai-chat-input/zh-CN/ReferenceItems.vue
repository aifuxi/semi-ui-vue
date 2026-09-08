<script setup lang="ts">
import {
  IconFile,
  IconFolder,
  IconBranch,
  IconCode,
  IconGit,
  IconGlobeStroke,
  IconTerminal,
  IconConnectionPoint2,
  IconUpload,
  IconClose,
} from '@aifuxi/semi-icons-vue';
const props = defineProps<{
  items: Array<{ type?: string; name?: string; value?: string; url?: string; detail?: string }>;
}>();
const emit = defineEmits<{ remove: [index: number] }>();
const icons = {
  file: IconFile,
  folder: IconFolder,
  branch: IconBranch,
  code: IconCode,
  git: IconGit,
  web: IconGlobeStroke,
  terminal: IconTerminal,
  change: IconConnectionPoint2,
};
</script>
<template>
  <div class="reference-items">
    <div v-for="(item, index) in props.items" :key="index" class="reference-item">
      <img v-if="item.url" :src="item.url" :alt="item.name" width="18" height="18" /><component
        :is="icons[item.type as keyof typeof icons] ?? IconUpload"
        v-else
      /><span
        >{{ item.name ?? item.value }}<small v-if="item.detail">{{ item.detail }}</small></span
      ><button :aria-label="'删除 ' + (item.name ?? item.value)" @click="emit('remove', index)">
        <IconClose size="small" />
      </button>
    </div>
  </div>
</template>
<style scoped>
.reference-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.reference-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 8px;
  background: var(--semi-color-fill-0);
  font-size: 12px;
}
.reference-item small {
  display: block;
}
.reference-item button {
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  display: flex;
}
</style>
