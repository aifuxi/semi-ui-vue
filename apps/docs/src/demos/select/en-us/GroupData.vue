<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { SelectOption } from '@aifuxi/semi-ui-vue/select';
import { SelectOptionGroup } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
const data = [
  {
    label: 'Asia',
    children: [
      { value: 'a-1', label: 'China' },
      { value: 'a-2', label: 'Korea' },
    ],
  },
  {
    label: 'Europe',
    children: [
      { value: 'b-1', label: 'Germany' },
      { value: 'b-2', label: 'France' },
    ],
  },
  { label: 'South America', children: [{ value: 'c-1', label: 'Peru' }] },
];
</script>
<template>
  <div>
    <Select placeholder="" :style="{ width: '180px' }" filter>
      <template v-for="(group, index) in data" :key="`${index}-${group.label}`"
        ><SelectOptionGroup :label="group.label">
          <template v-for="(option, index2) in group.children" :key="`${index2}-${group.label}`"
            ><SelectOption :value="option.value">
              {{ option.label }}
            </SelectOption></template
          >
        </SelectOptionGroup></template
      >
    </Select>
  </div>
</template>
