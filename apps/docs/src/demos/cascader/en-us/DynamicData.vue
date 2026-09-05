<script setup lang="ts">
import { Cascader } from '@aifuxi/semi-ui-vue/cascader';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/cascader.css';
import '@aifuxi/semi-theme-default/button.css';
import { shallowRef } from 'vue';
import type { CascaderData } from '@aifuxi/semi-ui-vue/cascader';
const treeData = shallowRef<CascaderData[]>([]);
let revision = 0;
function add() {
  revision++;
  const length = (revision % 3) + 1;
  treeData.value = Array.from({ length }, (_, i) => ({
    key: String(i),
    label: `Item-${i}`,
    value: String(i),
    children: Array.from({ length: (revision + i) % 3 }, (_, ci) => ({
      key: `${i}-${ci}`,
      label: `Item-${i}-${ci}`,
      value: `${i}-${ci}`,
    })),
  }));
}
</script>
<template>
  <div>
    <Cascader
      :style="{ width: '400px' }"
      :tree-data="treeData"
      placeholder="Please select"
    ></Cascader>
    <br />
    <br />
    <Button @click="add"> Update Data </Button>
  </div>
</template>
