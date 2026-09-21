<script setup lang="ts">
import { shallowRef } from 'vue';
import { Pagination } from '@aifuxi/semi-ui-vue/pagination';
import '@aifuxi/semi-theme-default/pagination.css';
import { Modal } from '@aifuxi/semi-ui-vue/modal';
import '@aifuxi/semi-theme-default/modal.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Select } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
import { Cascader } from '@aifuxi/semi-ui-vue/cascader';
import '@aifuxi/semi-theme-default/cascader.css';
import { DatePicker } from '@aifuxi/semi-ui-vue/date-picker';
import '@aifuxi/semi-theme-default/date-picker.css';
import { TimePicker } from '@aifuxi/semi-ui-vue/time-picker';
import '@aifuxi/semi-theme-default/time-picker.css';
import { TreeSelect } from '@aifuxi/semi-ui-vue/tree-select';
import '@aifuxi/semi-theme-default/tree-select.css';
const modalVisible = shallowRef(false);
function closeModal() {
  modalVisible.value = false;
}
const style = { margin: '10px' };
const treeData = [
  {
    label: 'Asia',
    value: 'asia',
    key: '1',
    children: [
      {
        label: 'China',
        value: 'china',
        key: '1-0',
        children: [
          { label: 'Beijing', value: 'beijing', key: '1-0-0' },
          { label: 'Shanghai', value: 'shanghai', key: '1-0-1' },
        ],
      },
      {
        label: 'Japan',
        value: 'japan',
        key: '1-1',
        children: [{ label: 'Osaka', value: 'osaka', key: '1-1-0' }],
      },
    ],
  },
];
</script>
<template>
  <h5>Pagination</h5>
  <Pagination :total="100" show-total show-size-changer :style="style" show-quick-jumper />
  <h5>Modal</h5>
  <div :style="style">
    <Button @click="modalVisible = true">Show Modal</Button
    ><Modal title="Modal" :visible="modalVisible" @ok="closeModal" @cancel="closeModal"
      ><p>This is the content of a basic modal.</p>
      <p>More content...</p></Modal
    >
  </div>
  <h5>Select &amp; Cascader</h5>
  <div :style="style">
    <Select filter :style="{ width: '180px' }"
      ><Select.Option value="abc">abc</Select.Option
      ><Select.Option value="vigo" disabled>vigo</Select.Option
      ><Select.Option value="hotsoon">hotsoon</Select.Option></Select
    ><Cascader
      :style="{ width: '300px', margin: '10px' }"
      :tree-data="treeData"
      filter-tree-node
      prefix="Cascader"
    />
  </div>
  <h5>DatePicker</h5>
  <DatePicker :style="{ ...style, width: '250px' }" /><DatePicker
    :style="{ ...style, width: '300px' }"
    type="dateTime"
  /><DatePicker :style="{ ...style, width: '300px' }" type="dateRange" /><DatePicker
    :style="{ ...style, width: '450px' }"
    type="dateTimeRange"
  />
  <h5>TimePicker</h5>
  <TimePicker :style="style" /><TimePicker use12-hours :style="style" /><br /><br />
  <h5>TreeSelect</h5>
  <TreeSelect
    :style="{ ...style, width: '300px' }"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    :tree-data="treeData"
    filter-tree-node
  />
</template>
