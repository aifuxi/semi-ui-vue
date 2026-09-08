<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from '#imports';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Tooltip } from '@aifuxi/semi-ui-vue/tooltip';
import {
  IconGithubLogo,
  IconLanguage,
  IconMenu,
  IconMoon,
  IconSearch,
  IconSemiLogo,
  IconSun,
} from '@aifuxi/semi-icons-vue';
import { useDocsPreferences } from '../../composables/useDocsPreferences';

defineEmits<{ menu: []; search: [] }>();
const route = useRoute();
const { locale, theme, toggleTheme } = useDocsPreferences();
const prefix = computed(() => locale.value.toLowerCase());
const otherLanguage = computed(() =>
  route.path.replace(/^\/(zh-cn|en-us)/i, locale.value === 'zh-CN' ? '/en-us' : '/zh-cn'),
);
const themeLabel = computed(() =>
  locale.value === 'zh-CN'
    ? `切换到${theme.value === 'dark' ? '亮色' : '暗色'}模式`
    : `Switch to ${theme.value === 'dark' ? 'light' : 'dark'} mode`,
);
const githubLabel = computed(() => (locale.value === 'zh-CN' ? '查看GitHub' : 'View GitHub'));
const localeLabel = computed(() => (locale.value === 'zh-CN' ? 'Switch to English' : '切换到中文'));
</script>

<template>
  <header class="site-header">
    <NuxtLink class="site-brand" :to="`/${prefix}/start/introduction/`" aria-label="Semi UI Vue">
      <IconSemiLogo style="font-size: 32px" /><span>Semi UI Vue</span>
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
      <Tooltip position="bottom" :content="themeLabel" :z-index="9999">
        <Button
          class="theme-action"
          theme="borderless"
          :aria-label="themeLabel"
          @click="toggleTheme"
        >
          <template #icon>
            <IconSun v-if="theme === 'dark'" size="extra-large" class="header-icon" />
            <IconMoon v-else size="extra-large" class="header-icon" />
          </template>
        </Button>
      </Tooltip>
      <Tooltip position="bottom" :content="githubLabel" :z-index="9999">
        <a
          class="github-action header-control semi-button semi-button-primary semi-button-borderless semi-button-with-icon semi-button-with-icon-only"
          href="https://github.com/aifuxi/semi-ui-vue"
          :aria-label="githubLabel"
          ><span class="semi-button-content"
            ><IconGithubLogo size="extra-large" class="header-icon" /></span
        ></a>
      </Tooltip>
      <Tooltip position="bottom" :content="localeLabel" :auto-adjust-overflow="false">
        <NuxtLink
          class="locale-action header-control semi-button semi-button-primary semi-button-borderless semi-button-with-icon"
          :to="otherLanguage"
          :aria-label="localeLabel"
          ><span class="semi-button-content"
            ><IconLanguage style="font-size: 22px" class="header-icon" /><span
              class="semi-button-content-right"
              ><span
                :class="['locale-text', locale === 'zh-CN' ? 'locale-text-en' : 'locale-text-zh']"
                >{{ locale === 'zh-CN' ? 'EN' : '中文' }}</span
              ></span
            ></span
          ></NuxtLink
        >
      </Tooltip>
      <!-- The pinned site loads an unversioned search widget. Keep our dialog trigger semantic. -->
      <button
        class="search-trigger semi-input-wrapper semi-input-wrapper-default"
        type="button"
        aria-haspopup="dialog"
        :aria-label="locale === 'zh-CN' ? '搜索' : 'Search'"
        @click="$emit('search')"
      >
        <IconSearch /><span class="search-trigger-label">{{
          locale === 'zh-CN' ? '搜索' : 'Search'
        }}</span>
        <kbd>⌘ K</kbd>
      </button>
      <Button
        class="menu-action"
        theme="borderless"
        :aria-label="locale === 'zh-CN' ? '打开导航' : 'Open navigation'"
        @click="$emit('menu')"
        ><template #icon><IconMenu size="extra-large" class="header-icon" /></template
      ></Button>
    </div>
  </header>
</template>
