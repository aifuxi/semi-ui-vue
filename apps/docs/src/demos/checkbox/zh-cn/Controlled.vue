<script setup lang="ts">
import { shallowRef, computed } from 'vue';
import { Checkbox } from '@aifuxi/semi-ui-vue/checkbox';
import '@aifuxi/semi-theme-default/checkbox.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
const checked = shallowRef(true);
const disabled = shallowRef(false);
const label = computed(
  () => `${checked.value ? 'Checked' : 'Unchecked'} ${disabled.value ? 'Disabled' : 'Enabled'}`,
);
</script>

<template>
  <div>
    <p style="margin-bottom: 20px">
      <Checkbox v-model="checked" :disabled="disabled" aria-label="Checkbox demo">{{
        label
      }}</Checkbox>
    </p>
    <p>
      <Button type="primary" size="small" @click="checked = !checked">{{
        checked ? 'Uncheck' : 'Check'
      }}</Button
      ><Button
        style="margin-left: 10px"
        type="primary"
        size="small"
        @click="disabled = !disabled"
        >{{ disabled ? 'Enable' : 'Disable' }}</Button
      >
    </p>
  </div>
</template>
