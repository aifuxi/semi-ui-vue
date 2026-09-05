<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from '#imports';
import { useDocsPreferences } from '../../composables/useDocsPreferences';

defineEmits<{ menu: []; search: [] }>();
const route = useRoute();
const { locale, toggleTheme } = useDocsPreferences();
const prefix = computed(() => locale.value.toLowerCase());
const otherLanguage = computed(() =>
  route.path.replace(/^\/(zh-cn|en-us)/i, locale.value === 'zh-CN' ? '/en-us' : '/zh-cn'),
);
</script>

<template>
  <header class="site-header">
    <NuxtLink class="site-brand" :to="`/${prefix}/start/introduction/`" aria-label="Semi UI Vue">
      <span class="brand-mark" aria-hidden="true">V</span><span>Semi UI <strong>Vue</strong></span>
    </NuxtLink>
    <nav class="header-links" :aria-label="locale === 'zh-CN' ? '主导航' : 'Main navigation'">
      <NuxtLink :to="`/${prefix}/start/getting-started/`">{{
        locale === 'zh-CN' ? '指南' : 'Guide'
      }}</NuxtLink>
      <NuxtLink :to="`/${prefix}/components/`">{{
        locale === 'zh-CN' ? '组件' : 'Components'
      }}</NuxtLink>
    </nav>
    <div class="header-actions">
      <button
        class="icon-action theme-action"
        type="button"
        :aria-label="locale === 'zh-CN' ? '切换主题' : 'Toggle theme'"
        @click="toggleTheme"
      >
        <span aria-hidden="true">◐</span>
      </button>
      <a
        class="icon-action github-action"
        href="https://github.com/aifuxi/semi-ui-vue"
        aria-label="GitHub"
        ><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path
            d="M12 1a11 11 0 0 0-3.48 21.44c.55.1.75-.24.75-.53v-2.05c-3.06.66-3.7-1.3-3.7-1.3-.5-1.27-1.22-1.61-1.22-1.61-1-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.68 2.57 1.19 3.2.91.1-.71.38-1.2.7-1.47-2.44-.28-5-1.22-5-5.44 0-1.2.43-2.18 1.13-2.95-.12-.28-.5-1.4.1-2.91 0 0 .92-.3 3.02 1.13a10.5 10.5 0 0 1 5.5 0c2.1-1.42 3.02-1.13 3.02-1.13.6 1.51.22 2.63.1 2.91.7.77 1.13 1.75 1.13 2.95 0 4.23-2.56 5.16-5 5.43.39.34.74 1.01.74 2.04v3.03c0 .3.2.64.76.53A11 11 0 0 0 12 1Z"
          /></svg
      ></a>
      <NuxtLink
        class="locale-action"
        :to="otherLanguage"
        :aria-label="locale === 'zh-CN' ? 'Switch to English' : '切换到简体中文'"
        >{{ locale === 'zh-CN' ? 'EN' : '中文' }}</NuxtLink
      >
      <button class="search-trigger" type="button" @click="$emit('search')">
        <span aria-hidden="true">⌕</span> {{ locale === 'zh-CN' ? '搜索' : 'Search' }}
        <kbd>⌘ K</kbd>
      </button>
      <button
        class="icon-action menu-action"
        type="button"
        :aria-label="locale === 'zh-CN' ? '打开导航' : 'Open navigation'"
        @click="$emit('menu')"
      >
        ☰
      </button>
    </div>
  </header>
</template>
