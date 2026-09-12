<script setup lang="ts">
import { List, ListItem } from '@aifuxi/semi-ui-vue/list';
import '@aifuxi/semi-theme-default/list.css';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
const data = [
  'Do not go gentle into that good night,',
  'Old age should burn and rave at close of day;',
  'Rage, rage against the dying of the light.',
];
</script>

<template>
  <ConfigProvider :locale="enUS"
    ><div>
      <div style="margin-right: 16px">
        <h3 style="margin-bottom: 16px">Default Size</h3>
        <List bordered :data-source="data"
          ><template #header><div>Header</div></template
          ><template #footer><div>Footer</div></template
          ><template #item="{ item }"
            ><ListItem>{{ item }}</ListItem></template
          ></List
        >
      </div>
      <br />
      <div style="margin-right: 16px">
        <h3 style="margin: 16px 0">Small Size</h3>
        <List size="small" bordered :data-source="data"
          ><template #header><div>Header</div></template
          ><template #footer><div>Footer</div></template
          ><template #item="{ item }"
            ><ListItem>{{ item }}</ListItem></template
          ></List
        >
      </div>
      <br />
      <div style="margin-right: 16px">
        <h3 style="margin: 16px 0">Large Size</h3>
        <List size="large" bordered :data-source="data"
          ><template #header><div>Header</div></template
          ><template #footer><div>Footer</div></template
          ><template #item="{ item }"
            ><ListItem>{{ item }}</ListItem></template
          ></List
        >
      </div>
    </div></ConfigProvider
  >
</template>
