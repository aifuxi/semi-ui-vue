<script setup lang="ts">
import { List, ListItem } from '@aifuxi/semi-ui-vue/list';
import '@aifuxi/semi-theme-default/list.css';
import { Pagination } from '@aifuxi/semi-ui-vue/pagination';
import '@aifuxi/semi-theme-default/pagination.css';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
import { computed, shallowRef } from 'vue';
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
  'Moon and sixpence',
  'The silent majority',
  'First person singular',
];
const page = shallowRef(1);
const pageData = computed(() => data.slice((page.value - 1) * 4, page.value * 4));
</script>

<template>
  <ConfigProvider :locale="enUS"
    ><div
      class="book-list"
      style="width: 280px; display: flex; flex-wrap: wrap; margin-right: 16px"
    >
      <List
        class="component-list-demo-booklist"
        :data-source="pageData"
        :split="false"
        size="small"
        style="flex-basis: 100%; flex-shrink: 0; border: 1px solid var(--semi-color-border)"
        ><template #item="{ item }"
          ><ListItem class="list-item">{{ item }}</ListItem></template
        ></List
      ><Pagination
        v-model:current-page="page"
        size="small"
        :total="data.length"
        :page-size="4"
        style="width: 100%; flex-basis: 100%; justify-content: center"
      /></div
  ></ConfigProvider>
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
