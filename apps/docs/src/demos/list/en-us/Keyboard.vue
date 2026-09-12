<script setup lang="ts">
import { List, ListItem } from '@aifuxi/semi-ui-vue/list';
import '@aifuxi/semi-theme-default/list.css';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
import { onBeforeUnmount, onMounted, shallowRef } from 'vue';
const data = [
  'Siege',
  'The ordinary world',
  'Three Body',
  'Snow in the Snow',
  'Saharan story',
  'Those things in the Ming Dynasty',
  'A little monk of Zen',
  'Dune',
  'The courage to be hated',
  'Crime and Punishment',
];
const active = shallowRef(-1);
function onKeydown(event: KeyboardEvent) {
  if (!['ArrowUp', 'ArrowDown'].includes(event.key)) return;
  event.preventDefault();
  active.value =
    event.key === 'ArrowDown'
      ? (active.value + 1) % data.length
      : active.value <= 0
        ? data.length - 1
        : active.value - 1;
}
// 固定上游在 window 上监听，示例不再额外提供可聚焦容器；文档页只渲染一个该示例，全局监听与上游一致。
onMounted(() => window.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
</script>

<template>
  <ConfigProvider :locale="enUS"
    ><div
      class="book-list"
      style="
        width: 280px;
        display: flex;
        flex-wrap: wrap;
        margin-right: 16px;
        border: 1px solid var(--semi-color-border);
      "
    >
      <List
        class="component-list-demo-booklist"
        :data-source="data"
        :split="false"
        size="small"
        style="flex-basis: 100%; flex-shrink: 0; border-bottom: 1px solid var(--semi-color-border)"
        ><template #item="{ item, index }"
          ><ListItem :class="index === active ? 'component-list-demo-booklist-active-item' : ''">{{
            item
          }}</ListItem></template
        ></List
      >
    </div></ConfigProvider
  >
</template>

<style scoped>
.book-list :deep(.list-item:hover),
.book-list :deep(.component-list-demo-booklist-active-item) {
  background-color: var(--semi-color-fill-0);
}
.book-list :deep(.list-item:active) {
  background-color: var(--semi-color-fill-1);
}
</style>
