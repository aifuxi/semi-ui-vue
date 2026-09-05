<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from 'vue';
import { Repl, useStore } from '@vue/repl';
import Monaco from '@vue/repl/monaco-editor';
import { useDocsPreferences } from '../../composables/useDocsPreferences';

const props = defineProps<{
  demo: string;
  entry: string;
  files: Record<string, string>;
}>();
const { theme, locale } = useDocsPreferences();
const repl = useTemplateRef('repl');
const origin = window.location.origin;
const imports = (await fetch('/repl/import-map.json').then((response) => {
  if (!response.ok) throw new Error('Playground resources are unavailable');
  return response.json();
})) as { imports: Record<string, string> };
const absoluteImports = Object.fromEntries(
  Object.entries(imports.imports).map(([key, url]) => [key, new URL(url, origin).href]),
);
const resourceLinks = shallowRef({
  esModuleShims: `${origin}/repl/es-module-shims.js`,
  vueCompilerUrl: () => `${window.location.origin}/repl/compiler-sfc.js`,
  typescriptLib: () => `${location.origin}/repl/typescript.js`,
  pkgLatestVersionUrl: (name: string) => `${location.origin}/repl/types/${name}/version.json`,
  pkgDirUrl: (name: string) => `${location.origin}/repl/types/${name}/files.json`,
  pkgFileTextUrl: (name: string, _version: string | undefined, path: string) =>
    `${location.origin}/repl/types/${name}/${path}`,
});
const store = useStore({
  builtinImportMap: shallowRef({ imports: absoluteImports }),
  resourceLinks,
  locale,
  vueVersion: shallowRef(null),
});
await store.setFiles(props.files, props.entry);
async function run() {
  const code = repl.value?.getEditorInstance()?.getValue();
  await store.setFiles(
    { ...store.getFiles(), ...(code === undefined ? {} : { [store.activeFile.filename]: code }) },
    store.mainFile,
  );
  repl.value?.reload();
}
const previewOptions = computed(() => ({
  headHTML: `<link rel="stylesheet" href="${origin}/repl/theme.css"><style>@font-face{font-family:Inter;src:url(${origin}/repl/fonts/Inter-Regular.ttf)}@font-face{font-family:Inter;src:url(${origin}/repl/fonts/Inter-SemiBold.ttf);font-weight:600}body{margin:24px;font-family:Inter,system-ui,sans-serif;color:var(--semi-color-text-0);background:var(--semi-color-bg-0)}</style><script>document.addEventListener('DOMContentLoaded',()=>document.body.setAttribute('theme-mode',document.documentElement.classList.contains('dark')?'dark':'light'));window.addEventListener('message',event=>{if(event.source===parent&&event.data?.action==='docs-theme'){const theme=event.data.theme==='dark'?'dark':'light';document.documentElement.className=theme;document.body.setAttribute('theme-mode',theme)}})\x3C/script>`,
  bodyHTML: '',
  showRuntimeError: true,
  showRuntimeWarning: true,
}));
</script>

<template>
  <div class="demo-editor" :data-editor-demo="demo">
    <div class="editor-actions">
      <button type="button" @click="run">{{ locale === 'zh-CN' ? '运行' : 'Run' }}</button>
    </div>
    <Repl
      ref="repl"
      :store="store"
      :editor="Monaco"
      :theme="theme"
      preview-theme
      :preview-options="previewOptions"
      :show-import-map="false"
      :show-ts-config="false"
      :show-compile-output="false"
      :show-ssr-output="false"
      :clear-console="false"
      :editor-options="{
        showErrorText: locale === 'zh-CN' ? '显示错误' : 'Show errors',
        autoSaveText: locale === 'zh-CN' ? '自动运行' : 'Auto run',
        monacoOptions: { minimap: { enabled: false }, fontSize: 13 },
      }"
    />
  </div>
</template>
