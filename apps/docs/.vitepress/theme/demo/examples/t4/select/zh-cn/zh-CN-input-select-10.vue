<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { SelectOption } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
const innerSlotStyle = {
  backgroundColor: 'var(--color-white)',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  paddingLeft: '32px',
  borderTop: '1px solid var(--semi-color-border)',
  borderRadius: '0 0 6px 6px',
  color: 'var(--semi-color-link)',
};
const outSlotStyle = {
  backgroundColor: 'var(--semi-color-fill-0)',
  height: '36px',
  display: 'flex',
  paddingLeft: '32px',
  color: 'var(--semi-color-link)',
  alignItems: 'center',
  cursor: 'pointer',
  borderTop: '1px solid var(--semi-color-border)',
  borderRadius: '0 0 6px 6px',
};
</script>
<template>
  <div>
    <div>
      <p>outerBottomSlot:</p>
      <Select
        :style="{ width: '300px' }"
        :dropdown-style="{ width: '180px' }"
        :max-height="150"
        placeholder="自定义外侧底部slot，始终显示"
        default-open
        :auto-adjust-overflow="false"
        position="bottom"
        ><template #outerBottom
          ><div :style="outSlotStyle">
            <span :style="{ color: 'var(--semi-color-link)' }">未找到应用?</span>
          </div></template
        >
        <SelectOption value="douyin">抖音</SelectOption>
        <SelectOption value="ulikecam">轻颜相机</SelectOption>
        <SelectOption value="jianying">剪映</SelectOption>
        <SelectOption value="duoshan">多闪</SelectOption>
        <SelectOption value="xigua">西瓜视频</SelectOption>
      </Select>
      <p :style="{ marginTop: '200px' }">innerBottomSlot:</p>
      <Select
        :style="{ width: '300px' }"
        :dropdown-style="{ width: '180px' }"
        :max-height="150"
        placeholder="自定义内侧底部slot，滚动至底部显示"
        ><template #innerBottom><div :style="innerSlotStyle">点击加载更多</div></template>
        <SelectOption value="douyin">抖音</SelectOption>
        <SelectOption value="ulikecam">轻颜相机</SelectOption>
        <SelectOption value="jianying">剪映</SelectOption>
        <SelectOption value="duoshan">多闪</SelectOption>
        <SelectOption value="xigua">西瓜视频</SelectOption>
      </Select>
    </div>
  </div>
</template>
