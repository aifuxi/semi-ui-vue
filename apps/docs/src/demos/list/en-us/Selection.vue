<script setup lang="ts">
import { List, ListItem } from '@aifuxi/semi-ui-vue/list';
import '@aifuxi/semi-theme-default/list.css';
import { Checkbox, CheckboxGroup } from '@aifuxi/semi-ui-vue/checkbox';
import '@aifuxi/semi-theme-default/checkbox.css';
import { Radio, RadioGroup } from '@aifuxi/semi-ui-vue/radio';
import '@aifuxi/semi-theme-default/radio.css';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
import { shallowRef } from 'vue';
import type { RadioValue } from '@aifuxi/semi-ui-vue/radio';
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
const items = data.slice(0, 8);
const checked = shallowRef<unknown[]>([...(data[0] ?? '')]);
const selected = shallowRef<RadioValue | undefined>(data[0]);
</script>

<template>
  <ConfigProvider :locale="enUS"
    ><div style="display: flex">
      <div
        class="book-list"
        style="width: 280px; display: flex; flex-wrap: wrap; margin-right: 16px"
      >
        <CheckboxGroup v-model="checked"
          ><List
            class="component-list-demo-booklist"
            :data-source="items"
            :split="false"
            size="small"
            style="flex-basis: 100%; flex-shrink: 0; border: 1px solid var(--semi-color-border)"
            ><template #item="{ item }"
              ><ListItem class="list-item"
                ><Checkbox :value="item">{{ item }}</Checkbox></ListItem
              ></template
            ></List
          ></CheckboxGroup
        >
      </div>
      <div
        class="book-list"
        style="width: 280px; display: flex; flex-wrap: wrap; margin-right: 16px"
      >
        <RadioGroup v-model="selected"
          ><List
            class="component-list-demo-booklist"
            :data-source="items"
            :split="false"
            size="small"
            style="flex-basis: 100%; flex-shrink: 0; border: 1px solid var(--semi-color-border)"
            ><template #item="{ item }"
              ><ListItem class="list-item"
                ><Radio :value="item">{{ item }}</Radio></ListItem
              ></template
            ></List
          ></RadioGroup
        >
      </div>
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
