<script setup lang="ts">
import { shallowRef, computed } from 'vue';
import { Checkbox, CheckboxGroup } from '@aifuxi/semi-ui-vue/checkbox';
import '@aifuxi/semi-theme-default/checkbox.css';
import type { CheckboxChangeEvent } from '@aifuxi/semi-ui-vue/checkbox';
const plainOptions = ['Photography', 'Movies', 'Running'];
const checkedList = shallowRef<unknown[]>(['Photography', 'Running']);
const checkAll = computed(() => checkedList.value.length === plainOptions.length);
const indeterminate = computed(() => checkedList.value.length > 0 && !checkAll.value);
function onCheckAllChange(event: CheckboxChangeEvent) {
  checkedList.value = event.target.checked ? [...plainOptions] : [];
}
</script>

<template>
  <div>
    <div style="padding-bottom: 8px; border-bottom: 1px solid var(--semi-color-border)">
      <Checkbox
        :checked="checkAll"
        :indeterminate="indeterminate"
        aria-label="Check all"
        @change="onCheckAllChange"
        >Check all</Checkbox
      >
    </div>
    <CheckboxGroup
      v-model="checkedList"
      style="margin-top: 6px"
      :options="plainOptions"
      aria-label="CheckboxGroup demo"
    />
  </div>
</template>
