<script setup lang="ts">
import { Popover } from '@aifuxi/semi-ui-vue/popover';
import '@aifuxi/semi-theme-default/popover.css';
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/space.css';
import { Empty } from '@aifuxi/semi-ui-vue/empty';
import '@aifuxi/semi-theme-default/empty.css';
import { IllustrationSuccess, IllustrationSuccessDark } from '@aifuxi/semi-illustrations-vue';
import ForwardedTrigger from './ForwardedTrigger.vue';
import InheritedTrigger from './InheritedTrigger.vue';
</script>
<template>
  <Space
    ><Popover
      ><ForwardedTrigger label="Functional Component" /><template #content
        ><Empty
          title="先进的设计 / 研发协作方式"
          description="使用 Semi D2C 快速还原 Figma 设计稿，一键转代码"
          style="width: 400px; margin: 0 auto; display: flex; padding: 20px"
          ><template #image><IllustrationSuccess style="width: 150px; height: 150px" /></template
          ><template #darkModeImage
            ><IllustrationSuccessDark
              style="width: 150px; height: 150px" /></template></Empty></template></Popover
    ><Popover
      ><InheritedTrigger label="ClassComponent" /><template #content
        ><Empty
          title="先进的设计 / 研发协作方式"
          description="使用 Semi D2C 快速还原 Figma 设计稿，一键转代码"
          style="width: 400px; margin: 0 auto; display: flex; padding: 20px"
          ><template #image><IllustrationSuccess style="width: 150px; height: 150px" /></template
          ><template #darkModeImage
            ><IllustrationSuccessDark
              style="width: 150px; height: 150px" /></template></Empty></template></Popover
    ><Popover
      ><span
        style="
          border: 2px solid var(--semi-color-border);
          padding-left: 4px;
          padding-right: 4px;
          border-radius: 4px;
        "
        >DOM</span
      ><template #content
        ><Empty
          title="先进的设计 / 研发协作方式"
          description="使用 Semi D2C 快速还原 Figma 设计稿，一键转代码"
          style="width: 400px; margin: 0 auto; display: flex; padding: 20px"
          ><template #image><IllustrationSuccess style="width: 150px; height: 150px" /></template
          ><template #darkModeImage
            ><IllustrationSuccessDark
              style="width: 150px; height: 150px" /></template></Empty></template></Popover
  ></Space>
</template>
