<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { SelectOption } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
import { IconClock } from '@aifuxi/semi-icons-vue';
const selectStyle = { width: '180px', margin: '20px' };
const innerSlotStyle = {
  backgroundColor: '#FFF',
  height: '40px',
  color: '#0077FA',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
};
const outSlotStyle = {
  backgroundColor: 'whitesmoke',
  height: '29px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
};
</script>
<template>
  <div>
    <div>
      <p>outerBottomSlot:</p>
      <Select
        :style="selectStyle"
        :dropdown-style="{ width: '180px' }"
        :max-height="213"
        default-open
        :auto-adjust-overflow="false"
        position="bottom"
        ><template #outerBottom
          ><div :style="outSlotStyle">
            <IconClock></IconClock>
            <span :style="{ color: 'rgba(28, 31, 35, 0.55)' }">More recently viewed pages</span>
          </div></template
        >
        <SelectOption value="douyin">Douyin</SelectOption>
        <SelectOption value="capcut">Capcut</SelectOption>
        <SelectOption value="coze">Coze</SelectOption>
        <SelectOption value="xigua">BuzzVideo</SelectOption>
      </Select>
      <p>innerBottomSlot:</p>
      <Select :style="selectStyle" :dropdown-style="{ width: '180px' }"
        ><template #innerBottom><div :style="innerSlotStyle">No suitable product?</div></template>
        <SelectOption value="douyin">Douyin</SelectOption>
        <SelectOption value="capcut">Capcut</SelectOption>
        <SelectOption value="coze">Coze</SelectOption>
        <SelectOption value="xigua">BuzzVideo</SelectOption>
      </Select>
    </div>
  </div>
</template>
