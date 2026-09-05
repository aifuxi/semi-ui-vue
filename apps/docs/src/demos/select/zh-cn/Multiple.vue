<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { SelectOption } from '@aifuxi/semi-ui-vue/select';
import { Toast } from '@aifuxi/semi-ui-vue/toast';
import '@aifuxi/semi-theme-default/select.css';
import '@aifuxi/semi-theme-default/toast.css';
</script>
<template>
  <div>
    <Select multiple :style="{ width: '320px' }" :default-value="['douyin', 'ulikecam']">
      <SelectOption value="douyin">抖音</SelectOption>
      <SelectOption value="ulikecam">轻颜相机</SelectOption>
      <SelectOption value="jianying">剪映</SelectOption>
      <SelectOption value="xigua">西瓜视频</SelectOption>
    </Select>
    <br />
    <br />
    <Select
      multiple
      :max-tag-count="2"
      :show-rest-tags-popover="true"
      :rest-tags-popover-props="{ position: 'top' }"
      :style="{ width: '320px' }"
      :default-value="['douyin', 'ulikecam', 'jianying']"
    >
      <SelectOption value="douyin">抖音</SelectOption>
      <SelectOption value="ulikecam">轻颜相机</SelectOption>
      <SelectOption value="jianying">剪映</SelectOption>
      <SelectOption value="xigua">西瓜视频</SelectOption>
    </Select>

    <br />
    <br />
    <Select
      multiple
      :style="{ width: '320px' }"
      :default-value="['douyin']"
      :max="2"
      @exceed="() => Toast.warning('最多只允许选择两项')"
    >
      <SelectOption value="douyin">抖音</SelectOption>
      <SelectOption value="ulikecam">轻颜相机</SelectOption>
      <SelectOption value="jianying">剪映</SelectOption>
      <SelectOption value="xigua">西瓜视频</SelectOption>
    </Select>
    <br />
    <br />
    <Select
      multiple
      :max-tag-count="2"
      :show-rest-tags-popover="true"
      :rest-tags-popover-props="{ position: 'top' }"
      :style="{ width: '220px' }"
      :default-value="['xigua', 'ulikecam', 'jianying', 'douyin']"
      ellipsis-trigger
      expand-rest-tags-on-click
    >
      <SelectOption value="douyin">抖音</SelectOption>
      <SelectOption value="ulikecam">轻颜相机</SelectOption>
      <SelectOption value="jianying">剪映</SelectOption>
      <SelectOption value="xigua">西瓜视频</SelectOption>
    </Select>
  </div>
</template>
