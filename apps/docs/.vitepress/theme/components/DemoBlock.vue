<script setup lang="ts">
import { computed } from 'vue';
import codeSources from '../generated/code-sources.json';
import { loadExampleManifest } from '../demo/types';

interface CodeSource {
  language: string;
  source: string;
}

const props = defineProps<{ title: string; kind?: 'live' | 'import' | 'code'; id?: string }>();
const manifest = computed(() => (props.id ? loadExampleManifest(props.id) : null));
const codeSource = computed(() =>
  props.id ? (codeSources as Record<string, CodeSource>)[props.id] : undefined,
);
const source = computed(() => {
  if (manifest.value) return manifest.value.files[manifest.value.entry] ?? '';
  return codeSource.value?.source ?? '';
});
const language = computed(() => (manifest.value ? 'vue' : codeSource.value?.language));
</script>

<template>
  <figure class="demo-block" :data-demo-id="id" :data-demo-kind="kind">
    <div
      v-if="manifest"
      class="demo-block-preview"
      :style="{ minHeight: `${manifest.preview.minHeight ?? 0}px` }"
    >
      <component :is="manifest.component" />
    </div>
    <details v-if="source" class="demo-block-source" :open="!manifest">
      <summary>查看代码 · {{ language }}</summary>
      <pre><code :class="`language-${language}`">{{ source }}</code></pre>
    </details>
  </figure>
</template>
