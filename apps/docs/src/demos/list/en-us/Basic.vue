<script setup lang="ts">
import { List, ListItem } from '@aifuxi/semi-ui-vue/list';
import '@aifuxi/semi-theme-default/list.css';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
const sizes = ['default', 'small', 'large'] as const;
const data = [
  'Do not go gentle into that good night,',
  'Old age should burn and rave at close of day;',
  'Rage, rage against the dying of the light.',
];
</script>

<template>
  <ConfigProvider :locale="enUS"
    ><div>
      <div v-for="size in sizes" :key="size" style="margin-right: 16px">
        <h3 style="margin: 16px 0">{{ size.charAt(0).toUpperCase() + size.slice(1) }} Size</h3>
        <List :size="size" bordered :data-source="data"
          ><template #header><div>Header</div></template
          ><template #footer><div>Footer</div></template
          ><template #item="{ item }"
            ><ListItem>{{ item }}</ListItem></template
          ></List
        ><br />
      </div></div
  ></ConfigProvider>
</template>
