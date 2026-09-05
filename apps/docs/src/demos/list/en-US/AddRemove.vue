<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { List } from '@aifuxi/semi-ui-vue/list';
import '@aifuxi/semi-theme-default/list.css';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
import { IconMinusCircle, IconPlusCircle } from '@aifuxi/semi-icons-vue';
import { shallowRef } from 'vue';
const catalog = [
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
const items = shallowRef(catalog.slice(0, 8));
function remove(item: string) {
  items.value = items.value.filter((book) => book !== item);
}
function add() {
  const next = catalog.find((book) => !items.value.includes(book));
  if (next) items.value = [...items.value, next];
}
</script>

<template>
  <ConfigProvider :locale="enUS"
    ><div
      class="book-list"
      style="width: 280px; display: flex; flex-wrap: wrap; margin-right: 16px"
    >
      <List
        :data-source="items"
        :split="false"
        size="small"
        style="flex-basis: 100%; flex-shrink: 0; border: 1px solid var(--semi-color-border)"
        ><template #item="{ item }"
          ><div style="margin: 4px" class="list-item">
            <Button
              theme="borderless"
              type="danger"
              style="margin-right: 4px"
              :aria-label="'Remove ' + item"
              @click="remove(item)"
              ><template #icon><IconMinusCircle /></template></Button
            >{{ item }}
          </div></template
        ><template #footer
          ><Button theme="borderless" :disabled="items.length === catalog.length" @click="add"
            ><template #icon><IconPlusCircle /></template>Add a book</Button
          ></template
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
