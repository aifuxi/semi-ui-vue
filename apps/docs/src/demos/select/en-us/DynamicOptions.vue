<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { SelectOption } from '@aifuxi/semi-ui-vue/select';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/select.css';
import '@aifuxi/semi-theme-default/button.css';
import { shallowRef } from 'vue';
const options = shallowRef([1, 2, 3, 4]);
let revision = 0;
function add() {
  const length = [2, 6, 3, 10][revision++ % 4] ?? 4;
  options.value = Array.from({ length }, (_, i) => i + 1);
}
</script>
<template>
  <div>
    <Select :style="{ width: '180px' }" :value="4">
      <template v-for="option in options" :key="option"
        ><SelectOption :value="option">
          {{ option }}
        </SelectOption></template
      >
    </Select>
    <br />
    <br />
    <Button @click="add">ChangeOptions Dynamic</Button>
  </div>
</template>
