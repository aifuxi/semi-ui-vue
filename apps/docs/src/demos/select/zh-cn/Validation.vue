<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { SelectOption } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
</script>
<template>
  <div>
    <Select :style="{ width: '180px' }">
      <SelectOption value="ulikecam">轻颜相机</SelectOption>
    </Select>
    <br />
    <br />
    <Select :style="{ width: '180px' }" validate-status="warning">
      <SelectOption value="ulikecam">轻颜相机</SelectOption>
    </Select>
    <br />
    <br />
    <Select :style="{ width: '180px' }" validate-status="error">
      <SelectOption value="ulikecam">轻颜相机</SelectOption>
    </Select>
  </div>
</template>
