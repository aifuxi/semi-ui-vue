<script setup lang="ts">
import { Popover } from '@aifuxi/semi-ui-vue/popover';
import '@aifuxi/semi-theme-default/popover.css';
import { Radio, RadioGroup } from '@aifuxi/semi-ui-vue/radio';
import '@aifuxi/semi-theme-default/radio.css';
import { Empty } from '@aifuxi/semi-ui-vue/empty';
import '@aifuxi/semi-theme-default/empty.css';
import { IllustrationSuccess, IllustrationSuccessDark } from '@aifuxi/semi-illustrations-vue';
import { shallowRef } from 'vue';
const visible = shallowRef(false);
import type { RadioChangeEvent } from '@aifuxi/semi-ui-vue/radio';
</script>
<template>
  <Popover :visible="visible" trigger="custom"
    ><RadioGroup
      type="button"
      :value="visible"
      @change="(event: RadioChangeEvent) => (visible = event.target.value === true)"
      ><Radio :value="true">受控显示</Radio><Radio :value="false">受控隐藏</Radio></RadioGroup
    ><template #content
      ><Empty
        title="先进的设计 / 研发协作方式"
        description="使用 Semi D2C 快速还原 Figma 设计稿，一键转代码"
        style="width: 400px; margin: 0 auto; display: flex; padding: 20px"
        ><template #image><IllustrationSuccess style="width: 150px; height: 150px" /></template
        ><template #darkModeImage
          ><IllustrationSuccessDark
            style="width: 150px; height: 150px" /></template></Empty></template
  ></Popover>
</template>
