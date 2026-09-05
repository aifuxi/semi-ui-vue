<script setup lang="ts">
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { Tooltip } from '@aifuxi/semi-ui-vue/tooltip';
import '@aifuxi/semi-theme-default/tooltip.css';
import { Button, ButtonGroup } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Input } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/input.css';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
import { shallowRef } from 'vue';
const container = shallowRef<HTMLElement | null>(null);
function getPopupContainer() {
  return container.value!;
}
const visible = shallowRef(false);
</script>
<template>
  <ConfigProvider :locale="enUS"
    ><div ref="container" style="width: 100%; height: 100%; overflow: hidden; position: relative">
      <div style="width: 150%; height: 150%; padding-left: 50px; padding-top: 50px">
        <Tooltip content="hi bytedance" :get-popup-container="getPopupContainer"
          ><Button style="margin-bottom: 20px">Hover to show</Button></Tooltip
        ><br /><Tooltip
          content="hi bytedance"
          trigger="click"
          :get-popup-container="getPopupContainer"
          ><Button style="margin-bottom: 20px">Click to show</Button></Tooltip
        ><br /><Tooltip
          content="hi bytedance"
          trigger="focus"
          :get-popup-container="getPopupContainer"
          ><Input style="width: 150px; margin-bottom: 20px" placeholder="Focus to show" /></Tooltip
        ><br /><Tooltip
          content="hi bytedance"
          trigger="custom"
          :visible="visible"
          :get-popup-container="getPopupContainer"
          ><span style="display: inline-block"
            ><ButtonGroup
              ><Button @click="visible = true">Controlled show</Button
              ><Button @click="visible = false">Controlled hide</Button></ButtonGroup
            ></span
          ></Tooltip
        >
      </div>
    </div></ConfigProvider
  >
</template>
