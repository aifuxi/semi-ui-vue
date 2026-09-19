<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, shallowRef, useTemplateRef, watch } from 'vue';
import { useRouter, withBase } from 'vitepress';

interface SearchEntry {
  title: string;
  path: string;
  text: string;
}

const open = defineModel<boolean>('open', { default: false });
const router = useRouter();

const query = shallowRef('');
const active = shallowRef(0);
const entries = shallowRef<SearchEntry[]>([]);
const loading = shallowRef(false);
const loadError = shallowRef(false);
const dialog = useTemplateRef<HTMLDialogElement>('dialog');
const input = useTemplateRef<HTMLInputElement>('input');

const results = computed(() => {
  const words = query.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return entries.value
    .filter((entry) =>
      words.every((word) => `${entry.title} ${entry.text}`.toLocaleLowerCase().includes(word)),
    )
    .sort(
      (left, right) =>
        Number(right.title.toLowerCase().includes(words[0] ?? '')) -
        Number(left.title.toLowerCase().includes(words[0] ?? '')),
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
        const response = await fetch(withBase('/search-index.json'));
        if (!response.ok) throw new Error('搜索索引不可用');
        entries.value = (await response.json()) as SearchEntry[];
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

function go(entry: SearchEntry): void {
  open.value = false;
  query.value = '';
  void router.go(withBase(entry.path));
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    active.value = Math.min(active.value + 1, results.value.length - 1);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    active.value = Math.max(active.value - 1, 0);
  } else if (event.key === 'Enter') {
    const entry = results.value[active.value];
    if (entry) go(entry);
  }
}

function onGlobalKeydown(event: KeyboardEvent): void {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    open.value = !open.value;
  }
}

onMounted(() => window.addEventListener('keydown', onGlobalKeydown));
onUnmounted(() => window.removeEventListener('keydown', onGlobalKeydown));
</script>

<template>
  <dialog ref="dialog" class="search-dialog" aria-label="站内搜索" @close="open = false">
    <div class="search-box">
      <div class="search-input-row">
        <input
          ref="input"
          v-model="query"
          type="search"
          placeholder="搜索组件、指南"
          aria-label="搜索组件、指南"
          autocomplete="off"
          @keydown="onKeydown"
        />
        <button type="button" aria-label="关闭搜索" @click="open = false">Esc</button>
      </div>
      <p v-if="loading" class="search-help">索引加载中…</p>
      <p v-else-if="loadError" class="search-help">搜索索引加载失败，请刷新页面重试。</p>
      <p v-else-if="query && !results.length" class="search-help">没有找到匹配内容。</p>
      <ul v-else-if="results.length">
        <li
          v-for="(entry, index) in results"
          :key="entry.path"
          :aria-selected="index === active"
          @mouseenter="active = index"
        >
          <a :href="withBase(entry.path)" @click.prevent="go(entry)">
            <strong>{{ entry.title }}</strong>
            <span>{{ entry.text.slice(0, 90) }}</span>
          </a>
        </li>
      </ul>
      <p v-else class="search-help">输入关键词检索组件与指南，↑ ↓ 选择，Enter 跳转。</p>
    </div>
  </dialog>
</template>
