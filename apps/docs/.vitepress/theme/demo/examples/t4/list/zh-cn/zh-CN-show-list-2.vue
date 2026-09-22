<script setup lang="ts">
import { List, ListItem } from '@aifuxi/semi-ui-vue/list';
import '@aifuxi/semi-theme-default/list.css';
const data = [
  '从明天起，做一个幸福的人',
  '喂马，劈柴，周游世界',
  '从明天起，关心粮食和蔬菜',
  '我有一所房子，面朝大海，春暖花开',
];
</script>

<template>
  <div>
    <div style="margin-right: 16px">
      <h3 style="margin-bottom: 16px">Default Size</h3>
      <List bordered :data-source="data"
        ><template #header><div>Header</div></template><template #footer><div>Footer</div></template
        ><template #item="{ item }"
          ><ListItem>{{ item }}</ListItem></template
        ></List
      >
    </div>
    <div style="margin-right: 16px">
      <h3 style="margin: 16px 0">Small Size</h3>
      <List size="small" bordered :data-source="data"
        ><template #header><div>Header</div></template><template #footer><div>Footer</div></template
        ><template #item="{ item }"
          ><ListItem>{{ item }}</ListItem></template
        ></List
      >
    </div>
    <div style="margin-right: 16px">
      <h3 style="margin: 16px 0">Large Size</h3>
      <List size="large" bordered :data-source="data"
        ><template #header><div>Header</div></template><template #footer><div>Footer</div></template
        ><template #item="{ item }"
          ><ListItem>{{ item }}</ListItem></template
        ></List
      >
    </div>
  </div>
</template>
