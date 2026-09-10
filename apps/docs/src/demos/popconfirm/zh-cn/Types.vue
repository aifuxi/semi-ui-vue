<script setup lang="ts">
import { Popconfirm } from '@aifuxi/semi-ui-vue/popconfirm';
import '@aifuxi/semi-theme-default/popconfirm.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Radio, RadioGroup } from '@aifuxi/semi-ui-vue/radio';
import '@aifuxi/semi-theme-default/radio.css';
import { IconAlertTriangle } from '@aifuxi/semi-icons-vue';
import { shallowRef } from 'vue';
const container = shallowRef<HTMLElement | null>(null);
function getPopupContainer() {
  return container.value!;
}
import type { RadioChangeEvent } from '@aifuxi/semi-ui-vue/radio';
const types = ['default', 'warning', 'danger', 'tertiary'] as const;
type ConfirmType = (typeof types)[number];
const type = shallowRef<ConfirmType>('default');
const visible = shallowRef(true);
function changeType(event: RadioChangeEvent) {
  const value = event.target.value;
  if (types.includes(value as ConfirmType)) type.value = value as ConfirmType;
}
</script>
<template>
  <div ref="container" style="position: relative; min-height: 340px; overflow: hidden">
    <RadioGroup
      type="button"
      :value="type"
      style="margin-top: 14px; margin-bottom: 14px"
      @change="changeType"
      ><Radio v-for="key in types" :key="key" :value="key"
        ><span
          :style="{
            color: `var(--semi-color-${key === 'default' ? 'primary' : key})`,
          }"
          >{{ key }}</span
        ></Radio
      ></RadioGroup
    >
    <div>
      <Popconfirm
        v-if="container"
        v-model:visible="visible"
        :get-popup-container="getPopupContainer"
        trigger="custom"
        title="确定是否要保存此修改？"
        content="此修改将不可逆"
        :ok-type="type === 'danger' ? 'danger' : 'primary'"
        ><template #icon
          ><IconAlertTriangle
            size="extra-large"
            :style="type === 'default' ? {} : { color: `var(--semi-color-${type})` }" /></template
        ><Button @click="visible = !visible">点击此处</Button></Popconfirm
      >
    </div>
  </div>
</template>
