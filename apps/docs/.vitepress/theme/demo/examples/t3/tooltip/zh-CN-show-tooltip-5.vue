<script setup lang="ts">
import { Tooltip } from '@aifuxi/semi-ui-vue/tooltip';
import '@aifuxi/semi-theme-default/tooltip.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Radio, RadioGroup } from '@aifuxi/semi-ui-vue/radio';
import '@aifuxi/semi-theme-default/radio.css';
import { Input } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/input.css';
import { shallowRef } from 'vue';
const container = shallowRef<HTMLElement | null>(null);
function getPopupContainer() {
  return container.value!;
}
const visible = shallowRef(false);
import type { RadioChangeEvent } from '@aifuxi/semi-ui-vue/radio';
</script>
<template>
  <div ref="container" style="width: 100%; height: 100%; overflow: hidden; position: relative">
    <div style="width: 150%; height: 150%; padding-left: 50px; padding-top: 50px">
      <Tooltip content="hi bytedance" :get-popup-container="getPopupContainer"
        ><Button theme="solid" type="tertiary" style="margin-bottom: 20px"
          >悬停显示</Button
        ></Tooltip
      ><br /><Tooltip
        content="hi bytedance"
        trigger="click"
        :get-popup-container="getPopupContainer"
        ><Button style="margin-bottom: 20px">点击显示</Button></Tooltip
      ><br /><Tooltip
        content="hi bytedance"
        trigger="focus"
        :get-popup-container="getPopupContainer"
        ><Input style="width: 100px; margin-bottom: 20px" placeholder="聚焦显示" /></Tooltip
      ><br /><Tooltip
        content="hi bytedance"
        trigger="contextMenu"
        :get-popup-container="getPopupContainer"
        ><Button theme="solid" type="secondary" style="margin-bottom: 20px"
          >右键点击展示</Button
        ></Tooltip
      ><br /><Tooltip
        content="hi bytedance"
        trigger="custom"
        :visible="visible"
        :get-popup-container="getPopupContainer"
        ><span style="display: inline-block"
          ><RadioGroup
            type="button"
            :value="visible"
            @change="(event: RadioChangeEvent) => (visible = event.target.value === true)"
            ><Radio :value="true">受控显示</Radio><Radio :value="false">受控隐藏</Radio></RadioGroup
          ></span
        ></Tooltip
      >
    </div>
  </div>
</template>
