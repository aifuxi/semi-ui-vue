<script setup lang="ts">
import { List, ListItem } from '@aifuxi/semi-ui-vue/list';
import '@aifuxi/semi-theme-default/list.css';
import { Input } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/input.css';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
import { IconSearch } from '@aifuxi/semi-icons-vue';
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
];
const query = shallowRef('');
const filtered = computed(() => data.filter((item) => item.includes(String(query.value))));
</script>

<template>
  <ConfigProvider :locale="enUS"
    ><div
      class="book-list"
      style="width: 280px; display: flex; flex-wrap: wrap; margin-right: 16px"
    >
      <List
        :data-source="filtered"
        :split="false"
        size="small"
        style="flex-basis: 100%; flex-shrink: 0; border: 1px solid var(--semi-color-border)"
        ><template #header
          ><Input v-model="query" placeholder="Search"
            ><template #prefix><IconSearch /></template></Input></template
        ><template #item="{ item }"
          ><ListItem class="list-item">{{ item }}</ListItem></template
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
