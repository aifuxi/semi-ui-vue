<script setup lang="ts">
import { List, ListItem } from '@aifuxi/semi-ui-vue/list';
import '@aifuxi/semi-theme-default/list.css';
const sizes = ['default', 'small', 'large'] as const;
const data = [
  '从明天起，做一个幸福的人',
  '喂马，劈柴，周游世界',
  '从明天起，关心粮食和蔬菜',
  '我有一所房子，面朝大海，春暖花开',
];
</script>

<template>
  <div>
    <div v-for="size in sizes" :key="size" style="margin-right: 16px">
      <h3 style="margin: 16px 0">{{ size.charAt(0).toUpperCase() + size.slice(1) }} Size</h3>
      <List :size="size" bordered :data-source="data"
        ><template #header><div>Header</div></template><template #footer><div>Footer</div></template
        ><template #item="{ item }"
          ><ListItem>{{ item }}</ListItem></template
        ></List
      ><br />
    </div>
  </div>
</template>
