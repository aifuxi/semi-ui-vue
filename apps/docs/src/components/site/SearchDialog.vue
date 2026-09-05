<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, shallowRef, useTemplateRef, watch } from 'vue';
import { navigateTo } from '#imports';
import { useDocsPreferences } from '../../composables/useDocsPreferences';

const open = defineModel<boolean>('open', { default: false });
const { locale } = useDocsPreferences();
const query = shallowRef('');
const active = shallowRef(0);
const entries = shallowRef<Array<{ title: string; path: string; text: string; locale: string }>>(
  [],
);
const loading = shallowRef(false);
const loadError = shallowRef(false);
const dialog = useTemplateRef<HTMLDialogElement>('dialog');
const input = useTemplateRef<HTMLInputElement>('input');
const results = computed(() => {
  const words = query.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return entries.value
    .filter(
      (entry) =>
        entry.locale === locale.value &&
        words.every((word) => `${entry.title} ${entry.text}`.toLocaleLowerCase().includes(word)),
    )
    .sort(
      (a, b) =>
        Number(b.title.toLowerCase().includes(words[0]!)) -
        Number(a.title.toLowerCase().includes(words[0]!)),
    )
    .slice(0, 30);
});
watch(query, () => {
  active.value = 0;
});
let lastFocused: HTMLElement | null = null;
watch(open, async (value) => {
  if (value) {
    lastFocused = document.activeElement as HTMLElement | null;
    dialog.value?.showModal();
    await nextTick();
    input.value?.focus();
    if (!entries.value.length) {
      loading.value = true;
      loadError.value = false;
      try {
        const response = await fetch('/search-index.json');
        if (!response.ok) throw new Error('Search index unavailable');
        entries.value = await response.json();
      } catch {
        loadError.value = true;
      } finally {
        loading.value = false;
      }
    }
  } else {
    dialog.value?.close();
    lastFocused?.focus();
  }
});
function shortcut(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    open.value = !open.value;
  }
}
function keydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    const count = results.value.length;
    if (count) active.value = (active.value + (event.key === 'ArrowDown' ? 1 : -1) + count) % count;
    void nextTick(() =>
      document
        .getElementById(`search-result-${active.value}`)
        ?.scrollIntoView({ block: 'nearest' }),
    );
  }
  if (event.key === 'Enter' && results.value[active.value]) {
    event.preventDefault();
    const path = results.value[active.value]!.path;
    open.value = false;
    void navigateTo(path);
  }
}
onMounted(() => window.addEventListener('keydown', shortcut));
onUnmounted(() => window.removeEventListener('keydown', shortcut));
</script>

<template>
  <dialog
    ref="dialog"
    class="search-dialog"
    :aria-label="locale === 'zh-CN' ? '搜索文档' : 'Search documentation'"
    @cancel="open = false"
    @close="open = false"
    @click="$event.target === dialog && (open = false)"
  >
    <div class="search-box">
      <div class="search-input-row">
        <input
          ref="input"
          v-model="query"
          role="combobox"
          aria-autocomplete="list"
          aria-controls="search-results"
          :aria-expanded="results.length > 0"
          :aria-activedescendant="results.length ? `search-result-${active}` : undefined"
          :aria-label="locale === 'zh-CN' ? '搜索关键词' : 'Search query'"
          :placeholder="
            locale === 'zh-CN' ? '搜索组件、API 和使用指南…' : 'Search components, APIs and guides…'
          "
          @keydown="keydown"
        />
        <button
          type="button"
          :aria-label="locale === 'zh-CN' ? '关闭搜索' : 'Close search'"
          @click="open = false"
        >
          Esc
        </button>
      </div>
      <p v-if="loading" role="status">
        {{ locale === 'zh-CN' ? '正在加载搜索索引…' : 'Loading search index…' }}
      </p>
      <p v-else-if="loadError" role="alert">
        {{
          locale === 'zh-CN'
            ? '搜索索引加载失败，请关闭后重试。'
            : 'Could not load search. Close and try again.'
        }}
      </p>
      <ul id="search-results" role="listbox">
        <li
          v-for="(result, index) in results"
          :id="`search-result-${index}`"
          :key="result.path"
          role="option"
          :aria-selected="active === index"
        >
          <NuxtLink :to="result.path" @click="open = false"
            ><strong>{{ result.title }}</strong
            ><span>{{ result.text.slice(0, 150) }}</span></NuxtLink
          >
        </li>
      </ul>
      <p v-if="query && !loading && !loadError && !results.length" role="status">
        {{ locale === 'zh-CN' ? '没有找到匹配内容' : 'No results found' }}
      </p>
      <div class="search-help">
        {{
          locale === 'zh-CN'
            ? '↑↓ 选择 · Enter 打开 · Esc 关闭'
            : '↑↓ Select · Enter Open · Esc Close'
        }}
      </div>
    </div>
  </dialog>
</template>
