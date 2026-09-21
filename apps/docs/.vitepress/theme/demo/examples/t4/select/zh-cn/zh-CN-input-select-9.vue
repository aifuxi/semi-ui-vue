<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { SelectOption } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
import { IconVigoLogo, IconGift } from '@aifuxi/semi-icons-vue';
</script>
<template>
  <div>
    <Select :style="{ width: '320px' }" default-value="ulikecam" :show-clear="true"
      ><template #prefix><IconVigoLogo></IconVigoLogo></template>
      <SelectOption value="douyin">抖音</SelectOption>
      <SelectOption value="ulikecam">轻颜相机</SelectOption>
      <SelectOption value="jianying">剪映</SelectOption>
      <SelectOption value="xigua">西瓜视频</SelectOption>
    </Select>
    <br />
    <br />
    <Select :style="{ width: '320px' }" default-value="ulikecam" :show-arrow="false"
      ><template #prefix><IconVigoLogo></IconVigoLogo></template
      ><template #suffix><IconGift></IconGift></template>
      <SelectOption value="douyin">抖音</SelectOption>
      <SelectOption value="ulikecam">轻颜相机</SelectOption>
      <SelectOption value="jianying">剪映</SelectOption>
      <SelectOption value="xigua">西瓜视频</SelectOption>
    </Select>
  </div>
</template>
