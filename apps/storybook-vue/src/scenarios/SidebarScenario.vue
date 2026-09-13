<script setup lang="ts">
import { computed, h, ref } from 'vue';
import { ConfigProvider, type SemiLocale } from '@aifuxi/semi-ui-vue/config-provider';
import {
  Sidebar,
  type SidebarCodeItemProps,
  type SidebarOption,
} from '@aifuxi/semi-ui-vue/sidebar';
import type { ParityDirection, ParityLocale } from '@workspace/test-infra';

const props = defineProps<{ direction: ParityDirection; locale: ParityLocale }>();
const activeKey = ref('code');
const localeMap: Record<ParityLocale, SemiLocale> = {
  'zh-CN': { code: 'zh-CN', Sidebar: { copySuccess: '复制成功' } },
  'en-US': { code: 'en-US', Sidebar: { copySuccess: 'Copied' } },
};
const labels = computed(() =>
  props.locale === 'zh-CN'
    ? { title: '开发资源', code: '代码', files: '文件' }
    : { title: 'Developer resources', code: 'Code', files: 'Files' },
);
const options = computed<SidebarOption[]>(() => [
  { key: 'code', icon: h('span', { 'aria-hidden': true }, '⌘'), name: labels.value.code },
  { key: 'files', icon: h('span', { 'aria-hidden': true }, '□'), name: labels.value.files },
]);
const codes: SidebarCodeItemProps[] = [
  {
    key: 'main',
    name: 'main.ts',
    language: 'typescript',
    content: 'const ready = true;\nexport default ready;',
  },
];
</script>

<template>
  <ConfigProvider :direction="props.direction" :locale="localeMap[props.locale]">
    <div class="sidebar-scenario" data-testid="sidebar-vue">
      <Sidebar
        visible
        :motion="false"
        :resizable="false"
        :show-close="false"
        :title="labels.title"
        :active-key="activeKey"
        :options="options"
        @active-option-change="(_event, key) => (activeKey = key)"
      >
        <template #main-content>
          <Sidebar.CodeContent active-key="main" :codes="codes" />
        </template>
      </Sidebar>
    </div>
  </ConfigProvider>
</template>
