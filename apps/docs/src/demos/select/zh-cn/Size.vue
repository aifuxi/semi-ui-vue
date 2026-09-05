<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { SelectOption } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
</script>
<template>
  <div>
    <Select placeholder="请选择业务线" :style="{ width: '180px' }" size="small">
      <SelectOption value="ulikecam">轻颜相机</SelectOption>
    </Select>
    <br />
    <br />
    <Select placeholder="请选择业务线" :style="{ width: '180px' }">
      <SelectOption value="ulikecam">轻颜相机</SelectOption>
    </Select>
    <br />
    <br />
    <Select placeholder="请选择业务线" :style="{ width: '180px' }" size="large">
      <SelectOption value="ulikecam">轻颜相机</SelectOption>
    </Select>
  </div>
</template>
