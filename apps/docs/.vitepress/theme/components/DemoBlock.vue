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
const ready = computed(() => Boolean(source.value));

const kindLabel = computed(() => {
  switch (props.kind) {
    case 'import':
      return '引入方式示例';
    case 'live':
      return '可运行示例';
    default:
      return '代码示例';
  }
});
</script>

<template>
  <figure class="demo-block" :data-demo-kind="kind">
    <div
      v-if="manifest"
      class="demo-block-preview"
      :style="{ minHeight: `${manifest.preview.minHeight ?? 0}px` }"
    >
      <component :is="manifest.component" />
    </div>
    <figcaption class="demo-block-footer">
      <span class="demo-block-title">{{ title }}</span>
      <span class="demo-block-kind">{{ kindLabel }}</span>
      <span class="demo-block-status" :class="{ 'demo-block-status-ready': ready }">
        <span aria-hidden="true" />{{ ready ? '示例已迁移' : '示例迁移中' }}
      </span>
    </figcaption>
    <details v-if="source" class="demo-block-source" :open="!manifest">
      <summary>查看代码 · {{ language }}</summary>
      <pre><code :class="`language-${language}`">{{ source }}</code></pre>
    </details>
  </figure>
</template>
