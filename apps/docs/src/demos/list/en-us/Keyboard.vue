<script setup lang="ts">
import { List, ListItem } from '@aifuxi/semi-ui-vue/list';
import '@aifuxi/semi-theme-default/list.css';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
import { shallowRef } from 'vue';
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
</script>

<template>
  <ConfigProvider :locale="enUS"
    ><div
      class="book-list"
      style="width: 280px; display: flex; flex-wrap: wrap; margin-right: 16px"
      tabindex="0"
      role="group"
      aria-label="Book list; use up and down arrow keys to navigate"
      @keydown="onKeydown"
    >
      <List
        :data-source="data"
        :split="false"
        size="small"
        style="flex-basis: 100%; flex-shrink: 0; border: 1px solid var(--semi-color-border)"
        ><template #item="{ item, index }"
          ><ListItem :class="index === active ? 'active-item' : ''">{{ item }}</ListItem></template
        ></List
      >
    </div></ConfigProvider
  >
</template>

<style scoped>
.book-list :deep(.list-item:hover),
.book-list :deep(.active-item) {
  background-color: var(--semi-color-fill-0);
}
.book-list :deep(.list-item:active) {
  background-color: var(--semi-color-fill-1);
}
</style>
