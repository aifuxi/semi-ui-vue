<script setup lang="ts">
import { Table } from '@aifuxi/semi-ui-vue/table';
import '@aifuxi/semi-theme-default/table.css';
import { List } from '@aifuxi/semi-ui-vue/list';
import '@aifuxi/semi-theme-default/list.css';
import { Calendar } from '@aifuxi/semi-ui-vue/calendar';
import '@aifuxi/semi-theme-default/calendar.css';
import { Typography } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
import { Transfer } from '@aifuxi/semi-ui-vue/transfer';
import '@aifuxi/semi-theme-default/transfer.css';
import { Image, ImagePreview } from '@aifuxi/semi-ui-vue/image';
import '@aifuxi/semi-theme-default/image.css';
const columns = [
  { title: 'Name', width: 250, dataIndex: 'name' },
  { title: 'Age', width: 150, dataIndex: 'age' },
  { title: 'Address', dataIndex: 'address' },
];
const dataSource = Array.from({ length: 46 }, (_, i) => ({
  key: String(i),
  name: `Bytedance ${i}`,
  age: 32,
  address: `Beijing, Haidian. Zhichun Road ${i}`,
}));
const transferData = Array.from({ length: 100 }, (_, i) => ({
  label: `Option Name ${i}`,
  value: i,
  disabled: false,
  key: i,
}));
const srcList = ['/demos/one.svg', '/demos/two.svg', '/demos/one.svg', '/demos/two.svg'];
</script>
<template>
  <h5>Table</h5>
  <Table :columns="columns" :data-source="dataSource" :scroll="{ y: 320 }" />
  <h5>Table - Empty</h5>
  <Table :columns="columns" :data-source="[]" :scroll="{ y: 320 }" />
  <h5>List - Empty</h5>
  <List :data-source="[]"
    ><template #header><div>List</div></template></List
  >
  <h5>Calendar</h5>
  <Calendar mode="month" />
  <h5>Typography - Copyable</h5>
  <Typography.Paragraph copyable>Click to copy text.</Typography.Paragraph>
  <h5>Typography - Collapsible</h5>
  <Typography.Paragraph
    :ellipsis="{ rows: 3, expandable: true, collapsible: true }"
    :style="{ width: '300px' }"
    >Expandable and collapsible: Life's but a walking shadow, a poor player, that struts and frets
    his hour upon the stage, and then is heard no more; it is a tale told by an idiot, full of sound
    and fury, signifying nothing.</Typography.Paragraph
  >
  <h5>Transfer</h5>
  <Transfer :style="{ width: '568px', height: '416px' }" :data-source="transferData" />
  <h5>Image</h5>
  <ImagePreview show-tooltip
    ><Image
      v-for="(src, index) in srcList"
      :key="index"
      :src="src"
      :width="200"
      :alt="`lamp${index + 1}`"
      :style="{ marginRight: '5px' }"
  /></ImagePreview>
</template>
