<script setup lang="ts">
import { computed, defineAsyncComponent, onErrorCaptured, shallowRef } from 'vue';
import { useAsyncData } from '#imports';
import { useDocsPreferences } from '../../composables/useDocsPreferences';
import { demoRegistry } from '../../data/demos';

const props = defineProps<{
  demo: string;
  title?: string;
  overflow?: 'hidden' | 'visible';
}>();
const { locale, theme } = useDocsPreferences();
// Only the standalone theme example emits this optional host notification.
const demoEvents =
  props.demo.startsWith('dark-mode/') && props.demo.endsWith('/Global')
    ? {
        themeChange: (value: 'light' | 'dark') => {
          theme.value = value;
        },
      }
    : {};
const sources = import.meta.glob('../../demos/**/*.{vue,ts,js,css,json}', {
  query: '?raw',
  import: 'default',
});
// The preview is ClientOnly; keep its runtime and editor out of the SSR bundle too.
const components = import.meta.client ? import.meta.glob('../../demos/**/*.vue') : {};
const path = `../../demos/${props.demo}.vue`;
const definition = demoRegistry.get(props.demo);
if (!definition) throw new Error(`Demo not registered: ${props.demo}`);
const { data: files } = await useAsyncData(`demo-files:${props.demo}`, async () =>
  Object.fromEntries(
    await Promise.all(
      Object.entries(definition.files).map(async ([name, file]) => [
        name,
        (await sources[`../../demos/${file}`]!()) as string,
      ]),
    ),
  ),
);
const { data: source } = await useAsyncData(`demo-source:${props.demo}`, async () => {
  if (!sources[path]) throw new Error(`Demo source missing: ${props.demo}`);
  return (await sources[path]()) as string;
});
const preview = components[path]
  ? defineAsyncComponent(components[path] as Parameters<typeof defineAsyncComponent>[0])
  : null;
const sourceOpen = shallowRef(false);
const editorOpen = shallowRef(false);
const copied = shallowRef(false);
const error = shallowRef('');
const key = shallowRef(0);
const editor = import.meta.client
  ? defineAsyncComponent(() => import('../demo/DemoEditor.client.vue'))
  : null;
const title = computed(() => props.title ?? props.demo);
onErrorCaptured((cause) => {
  error.value = cause instanceof Error ? cause.message : String(cause);
  return false;
});
async function copy() {
  try {
    await navigator.clipboard.writeText(source.value ?? '');
    copied.value = true;
  } catch {
    copied.value = false;
  }
}
function reset() {
  key.value++;
  error.value = '';
}
</script>

<template>
  <section
    class="demo-block"
    :style="props.overflow ? { overflow: props.overflow } : undefined"
    :data-demo-title="title"
    :data-demo-id="demo"
    :aria-label="title"
  >
    <div v-if="!editorOpen" class="demo-preview" data-demo-preview>
      <p v-if="error" class="demo-error" role="alert">{{ error }}</p>
      <ClientOnly v-else
        ><component :is="preview" v-if="preview" :key="key" v-on="demoEvents" /><template #fallback
          ><div class="demo-loading">
            {{ locale === 'zh-CN' ? '加载交互示例…' : 'Loading interactive example…' }}
          </div></template
        ></ClientOnly
      >
    </div>
    <div class="demo-toolbar">
      <span class="demo-status" aria-live="polite">{{
        copied ? (locale === 'zh-CN' ? '已复制' : 'Copied') : ''
      }}</span>
      <button type="button" @click="reset">{{ locale === 'zh-CN' ? '重置' : 'Reset' }}</button>
      <button type="button" @click="copy">
        {{ locale === 'zh-CN' ? '复制代码' : 'Copy code' }}
      </button>
      <button type="button" :aria-expanded="sourceOpen" @click="sourceOpen = !sourceOpen">
        {{ locale === 'zh-CN' ? '查看源码' : 'View source' }}
      </button>
      <button type="button" :aria-expanded="editorOpen" @click="editorOpen = !editorOpen">
        {{
          editorOpen
            ? locale === 'zh-CN'
              ? '退出编辑'
              : 'Close editor'
            : locale === 'zh-CN'
              ? '在线编辑'
              : 'Edit online'
        }}
      </button>
    </div>
    <pre v-show="sourceOpen" class="demo-source" data-demo-source><code>{{ source }}</code></pre>
    <ClientOnly
      ><component
        :is="editor"
        v-if="editorOpen && source && files"
        :key="key"
        :files="files"
        :entry="definition.entry"
        :demo="demo"
    /></ClientOnly>
  </section>
</template>
