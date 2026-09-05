<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { SelectOption } from '@aifuxi/semi-ui-vue/select';
import { Toast } from '@aifuxi/semi-ui-vue/toast';
import '@aifuxi/semi-theme-default/select.css';
import '@aifuxi/semi-theme-default/toast.css';
</script>
<template>
  <div>
    <Select multiple :style="{ width: '320px' }" :default-value="['douyin', 'coze']">
      <SelectOption value="douyin">Douyin</SelectOption>
      <SelectOption value="coze">Coze</SelectOption>
      <SelectOption value="capcut">Capcut</SelectOption>
      <SelectOption value="xigua">BuzzVideo</SelectOption>
    </Select>
    <br />
    <br />
    <Select
      multiple
      :max-tag-count="2"
      :show-rest-tags-popover="true"
      :rest-tags-popover-props="{ position: 'top' }"
      :style="{ width: '320px' }"
      :default-value="['douyin', 'coze', 'capcut']"
    >
      <SelectOption value="douyin">Semi</SelectOption>
      <SelectOption value="coze">Coze</SelectOption>
      <SelectOption value="capcut">Capcut</SelectOption>
      <SelectOption value="xigua">BuzzVideo</SelectOption>
    </Select>

    <br />
    <br />
    <Select
      multiple
      :style="{ width: '320px' }"
      :default-value="['douyin']"
      :max="2"
      @exceed="() => Toast.warning('Only two options are allowed')"
    >
      <SelectOption value="douyin">Semi</SelectOption>
      <SelectOption value="coze">Coze</SelectOption>
      <SelectOption value="capcut">Capcut</SelectOption>
      <SelectOption value="xigua">BuzzVideo</SelectOption>
    </Select>
    <br />
    <br />
    <Select
      multiple
      :max-tag-count="2"
      :show-rest-tags-popover="true"
      :rest-tags-popover-props="{ position: 'top' }"
      :style="{ width: '220px' }"
      :default-value="['xigua', 'coze', 'capcut', 'douyin']"
      ellipsis-trigger
      expand-rest-tags-on-click
    >
      <SelectOption value="douyin">Semi</SelectOption>
      <SelectOption value="coze">Coze</SelectOption>
      <SelectOption value="capcut">Capcut</SelectOption>
      <SelectOption value="xigua">BuzzVideo</SelectOption>
    </Select>
  </div>
</template>
