<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { SelectOption } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
import { IconVigoLogo, IconGift } from '@aifuxi/semi-icons-vue';
</script>
<template>
  <div>
    <Select :style="{ width: '320px' }" default-value="douyin" :show-clear="true"
      ><template #prefix><IconVigoLogo></IconVigoLogo></template>
      <SelectOption value="douyin">Douyin</SelectOption>
      <SelectOption value="capcut">Capcut</SelectOption>
      <SelectOption value="coze">Coze</SelectOption>
      <SelectOption value="xigua">BuzzVideo</SelectOption>
    </Select>
    <br />
    <br />
    <Select :style="{ width: '320px' }" default-value="capcut" :show-arrow="false"
      ><template #prefix><IconVigoLogo></IconVigoLogo></template
      ><template #suffix><IconGift></IconGift></template>
      <SelectOption value="douyin">Douyin</SelectOption>
      <SelectOption value="capcut">Capcut</SelectOption>
      <SelectOption value="coze">Coze</SelectOption>
      <SelectOption value="xigua">BuzzVideo</SelectOption>
    </Select>
  </div>
</template>
