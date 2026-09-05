<script setup lang="ts">
import { shallowRef } from 'vue';
import { useDocsPreferences } from '../../composables/useDocsPreferences';
const props = defineProps<{ id: string }>();
const { locale } = useDocsPreferences();
const copied = shallowRef(false);
async function copy() {
  const url = new URL(window.location.href);
  url.hash = props.id;
  try {
    await navigator.clipboard.writeText(url.href);
    copied.value = true;
  } catch {
    copied.value = false;
  }
}
</script>

<template>
  <a
    :href="`#${encodeURIComponent(id)}`"
    class="heading-anchor"
    :aria-label="
      copied
        ? locale === 'zh-CN'
          ? '链接已复制'
          : 'Link copied'
        : locale === 'zh-CN'
          ? `复制 ${id} 的链接`
          : `Copy link to ${id}`
    "
    @click="copy"
    >#</a
  >
</template>
