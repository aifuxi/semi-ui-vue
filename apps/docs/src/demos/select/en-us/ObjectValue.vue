<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { TextArea } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/select.css';
import '@aifuxi/semi-theme-default/input.css';
import { shallowRef } from 'vue';
import type { SelectModelValue } from '@aifuxi/semi-ui-vue/select';
const list = [
  { value: 'douyin', label: 'Douyin', type: 1 },
  { value: 'capcut', label: 'Capcut', type: 2 },
  { value: 'xigua', label: 'BuzzVideo', type: 3 },
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
          :default-value="list[0]"
          @change="onChange"
        ></Select>
        <h4>onChang callback:</h4>
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
          placeholder="Multiple Select"
          @change="onMultipleChange"
        ></Select>
        <h4>onChange callback:</h4>
        <TextArea
          :style="{ width: '320px' }"
          autosize
          :value="JSON.stringify(multipleCbValue)"
        ></TextArea>
      </div>
    </div>
  </div>
</template>
