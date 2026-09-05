<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { TagInput } from '@aifuxi/semi-ui-vue/tag-input';
import '@aifuxi/semi-theme-default/select.css';
import '@aifuxi/semi-theme-default/tag-input.css';
import { shallowRef } from 'vue';
import type { SelectModelValue } from '@aifuxi/semi-ui-vue/select';
const value = shallowRef<SelectModelValue>(['douyin', 'ulikecam']);
const input = shallowRef('');
const list = [
  { value: 'douyin', label: 'Douyin' },
  { value: 'ulikecam', label: 'UlikeCam' },
  { value: 'jianying', label: 'Capcut' },
  { value: 'doubao', label: 'Cici' },
];
function sort(labels: string[]) {
  value.value = labels.flatMap((label) => {
    const item = list.find((option) => option.label === label);
    return item ? [item.value] : [];
  });
}
function labels(items: Array<{ label?: unknown }>) {
  return items.map((item) => String(item.label));
}
function clearTrigger(onClear: (event: MouseEvent) => void) {
  onClear(new MouseEvent('click'));
}
</script>
<template>
  <div>
    <h4>Select that can reorder selected options by dragging</h4>
    <Select v-model="value" :option-list="list" multiple filter style="width: 240px"
      ><template #trigger="{ value: selected, onSearch, onClear }"
        ><div @keydown.stop>
          <TagInput
            draggable
            :allow-duplicates="false"
            :value="labels(selected)"
            :input-value="input"
            show-clear
            @input-change="
              (word: string) => {
                onSearch(word);
                input = word;
              }
            "
            @change="sort"
            @clear="clearTrigger(onClear)"
          /></div></template
    ></Select>
  </div>
</template>
