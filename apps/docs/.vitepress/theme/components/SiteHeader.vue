<script setup lang="ts">
import { computed } from 'vue';
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
import { withBase } from 'vitepress';
import { useThemeMode } from '../composables/use-theme-mode';

defineEmits<{ menu: []; search: [] }>();

const { isDark, toggle } = useThemeMode();

const themeLabel = computed(() => `切换到${isDark.value ? '亮色' : '暗色'}模式`);
</script>

<template>
  <header class="site-header">
    <a class="site-brand" :href="withBase('/')" aria-label="Semi UI Vue">
      <IconSemiLogo style="font-size: 32px" /><span>Semi UI Vue</span>
    </a>
    <nav class="header-links" aria-label="主导航">
      <a :href="withBase('/zh-CN/start/introduction')">指南</a>
      <a :href="withBase('/zh-CN/components')">组件</a>
    </nav>
    <div class="header-actions">
      <Tooltip position="bottom" :content="themeLabel" :z-index="9999">
        <Button class="theme-action" theme="borderless" :aria-label="themeLabel" @click="toggle">
          <template #icon>
            <IconSun v-if="isDark" size="extra-large" class="header-icon" />
            <IconMoon v-else size="extra-large" class="header-icon" />
          </template>
        </Button>
      </Tooltip>
      <Tooltip position="bottom" content="查看 GitHub" :z-index="9999">
        <a
          class="github-action header-control semi-button semi-button-primary semi-button-borderless semi-button-with-icon semi-button-with-icon-only"
          href="https://github.com/aifuxi/semi-ui-vue"
          aria-label="查看 GitHub"
          ><span class="semi-button-content"
            ><IconGithubLogo size="extra-large" class="header-icon" /></span
        ></a>
      </Tooltip>
      <!-- 首版只提供中文，语言入口保留为禁用位，后续按 /zh-CN、/en-US 维度开启。 -->
      <Tooltip position="bottom" content="首版仅提供中文文档" :z-index="9999">
        <Button
          class="locale-action header-control"
          theme="borderless"
          disabled
          aria-label="切换语言（首版仅提供中文文档）"
        >
          <template #icon>
            <IconLanguage style="font-size: 22px" class="header-icon" />
          </template>
          中文
        </Button>
      </Tooltip>
      <button
        class="search-trigger semi-input-wrapper semi-input-wrapper-default"
        type="button"
        aria-haspopup="dialog"
        aria-label="搜索"
        @click="$emit('search')"
      >
        <IconSearch /><span class="search-trigger-label">搜索</span>
        <kbd>⌘ K</kbd>
      </button>
      <Button class="menu-action" theme="borderless" aria-label="打开导航" @click="$emit('menu')">
        <template #icon><IconMenu size="extra-large" class="header-icon" /></template>
      </Button>
    </div>
  </header>
</template>
