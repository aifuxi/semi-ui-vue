<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { SelectOption } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
import { shallowRef, computed } from 'vue';
import type { SelectModelValue } from '@aifuxi/semi-ui-vue/select';
const provinces = ['四川', '广东'];
const maps: Record<string, string[]> = { 四川: ['成都', '都江堰'], 广东: ['广州', '深圳', '东莞'] };
const province = shallowRef(provinces[0] ?? '');
const citys = computed(() => maps[province.value] ?? []);
const city = shallowRef<SelectModelValue>(citys.value[0]);
function provinceChange(next: SelectModelValue) {
  if (typeof next !== 'string') return;
  province.value = next;
  city.value = maps[next]?.[0];
}
</script>
<template>
  <div>
    <Select :style="{ width: '150px', margin: '10px' }" :value="province" @change="provinceChange">
      <template v-for="pro in provinces" :key="pro"
        ><SelectOption :value="pro">
          {{ pro }}
        </SelectOption></template
      >
    </Select>
    <Select v-model="city" :style="{ width: '150px', margin: '10px' }">
      <template v-for="c in citys" :key="c"
        ><SelectOption :value="c">
          {{ c }}
        </SelectOption></template
      >
    </Select>
  </div>
</template>
