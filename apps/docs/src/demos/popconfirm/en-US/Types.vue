<script setup lang="ts">
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { Popconfirm } from '@aifuxi/semi-ui-vue/popconfirm';
import '@aifuxi/semi-theme-default/popconfirm.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Radio, RadioGroup } from '@aifuxi/semi-ui-vue/radio';
import '@aifuxi/semi-theme-default/radio.css';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
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
  <ConfigProvider :locale="enUS"
    ><div ref="container" style="position: relative; min-height: 340px; overflow: hidden">
      <RadioGroup :value="type" style="margin-top: 14px; margin-bottom: 14px" @change="changeType"
        ><Radio v-for="key in types" :key="key" :value="key"
          ><strong
            :style="{
              color: `var(--semi-color-${key === 'default' ? 'primary' : key})`,
            }"
            >{{ key }}</strong
          ></Radio
        ></RadioGroup
      >
      <div>
        <Popconfirm
          v-if="container"
          v-model:visible="visible"
          :get-popup-container="getPopupContainer"
          trigger="custom"
          title="Are you sure to save this modification?"
          content="This modification will be irreversible"
          :ok-type="type === 'danger' ? 'danger' : 'primary'"
          ><template #icon
            ><IconAlertTriangle
              size="extra-large"
              :style="type === 'default' ? {} : { color: `var(--semi-color-${type})` }" /></template
          ><Button @click="visible = !visible">Click here</Button></Popconfirm
        >
      </div>
    </div></ConfigProvider
  >
</template>
