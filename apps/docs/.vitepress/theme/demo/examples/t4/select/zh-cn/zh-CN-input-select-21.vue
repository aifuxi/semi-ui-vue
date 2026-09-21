<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { TextArea } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/select.css';
import '@aifuxi/semi-theme-default/input.css';
import { shallowRef } from 'vue';
import type { SelectModelValue } from '@aifuxi/semi-ui-vue/select';
const list = [
  { value: 'douyin', label: '抖音', type: 1 },
  { value: 'ulikecam', label: '轻颜相机', type: 2 },
  { value: 'jianying', label: '剪映', type: 3 },
  { value: 'toutiao', label: '今日头条', type: 4 },
];
const cbValue = shallowRef<SelectModelValue>();
const multipleCbValue = shallowRef<SelectModelValue>();
function onChange(value: SelectModelValue) {
  cbValue.value = value;
  console.log(value);
}
function onMultipleChange(value: SelectModelValue) {
  multipleCbValue.value = value;
  console.log(value);
}
</script>
<template>
  <div>
    <div>
      <div>
        <Select
          :style="{ width: '150px' }"
          on-change-with-object
          :option-list="list"
          placeholder="单选"
          :default-value="list[0]"
          @change="onChange"
        ></Select>
        <h4>onChange回调:</h4>
        <TextArea
          :style="{ width: '320px', marginBottom: '48px' }"
          autosize
          :value="JSON.stringify(cbValue)"
          :rows="2"
        ></TextArea>
      </div>
      <div>
        <Select
          :style="{ width: '320px' }"
          on-change-with-object
          multiple
          :option-list="list"
          placeholder="多选"
          @change="onMultipleChange"
        ></Select>
        <h4>onChange回调:</h4>
        <TextArea
          :style="{ width: '320px' }"
          autosize
          :value="JSON.stringify(multipleCbValue)"
        ></TextArea>
      </div>
    </div>
  </div>
</template>
