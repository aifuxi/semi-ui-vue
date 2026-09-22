<script setup lang="ts">
/* eslint-disable vue/first-attribute-linebreak -- pre 内保持无额外空白文本。 */
/* eslint-disable vue/no-v-html -- Prism 会先转义受信任的仓库源码。 */
// @ts-expect-error Prism 1.30.0 未提供类型声明。
import Prism from 'prismjs';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-json.js';
import 'prismjs/components/prism-markdown.js';
import 'prismjs/components/prism-scss.js';
import 'prismjs/components/prism-typescript.js';
import { computed, onMounted, ref } from 'vue';
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
const shouldHighlight = ref(false);
const highlightLanguage = computed(
  () =>
    ({ js: 'javascript', md: 'markdown', ts: 'typescript', vue: 'markup' })[language.value ?? ''] ??
    language.value ??
    'text',
);
const highlightedSource = computed(() => {
  const grammar = Prism.languages[highlightLanguage.value] ?? Prism.languages.plain;
  return Prism.highlight(source.value, grammar, highlightLanguage.value);
});

onMounted(() => {
  shouldHighlight.value = !manifest.value;
});

function handleToggle(event: Event): void {
  shouldHighlight.value = (event.currentTarget as HTMLDetailsElement).open;
}
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
    <details v-if="source" class="demo-block-source" :open="!manifest" @toggle="handleToggle">
      <summary>查看代码 · {{ language }}</summary>
      <div class="semi-codeHighlight semi-codeHighlight-defaultTheme semi-light-scrollbar">
        <pre :class="`language-${highlightLanguage}`"><code v-if="shouldHighlight"
          :class="`language-${highlightLanguage}`"
          v-html="highlightedSource"
        /><code v-else :class="`language-${highlightLanguage}`">{{ source }}</code></pre>
      </div>
    </details>
  </figure>
</template>
