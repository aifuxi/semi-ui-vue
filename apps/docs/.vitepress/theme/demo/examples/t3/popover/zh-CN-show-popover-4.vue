<script setup lang="ts">
import { Popover } from '@aifuxi/semi-ui-vue/popover';
import '@aifuxi/semi-theme-default/popover.css';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
import { Empty } from '@aifuxi/semi-ui-vue/empty';
import '@aifuxi/semi-theme-default/empty.css';
import { IllustrationSuccess, IllustrationSuccessDark } from '@aifuxi/semi-illustrations-vue';
const tops = [
  ['topLeft', 'TL'],
  ['top', 'Top'],
  ['topRight', 'TR'],
] as const;
const lefts = [
  ['leftTop', 'LT'],
  ['left', 'Left'],
  ['leftBottom', 'LB'],
] as const;
const rights = [
  ['rightTop', 'RT'],
  ['right', 'Right'],
  ['rightBottom', 'RB'],
] as const;
const bottoms = [
  ['bottomLeft', 'BL'],
  ['bottom', 'Bottom'],
  ['bottomRight', 'BR'],
] as const;
</script>
<template>
  <div>
    <div :style="{ marginLeft: '80px', whiteSpace: 'nowrap' }">
      <template v-for="(pos, index) in tops" :key="index"
        ><Popover :position="pos[0]">
          <Tag :style="{ margin: '8px', padding: '20px' }">{{ pos[1] }}</Tag>
          <template #content
            ><Empty
              :title="'先进的设计 / 研发协作方式'"
              description="使用 Semi D2C 快速还原 Figma 设计稿，一键转代码"
              :style="{
                width: '400px',
                margin: '0 auto',
                display: 'flex',
                padding: '20px',
              }"
            >
              <template #image
                ><IllustrationSuccess :style="{ width: '150px', height: '150px' }" /></template
              ><template #darkModeImage
                ><IllustrationSuccessDark
                  :style="{
                    width: '150px',
                    height: '150px',
                  }" /></template></Empty></template></Popover
      ></template>
    </div>
    <div :style="{ width: '80px', float: 'left' }">
      <template v-for="(pos, index) in lefts" :key="index"
        ><Popover :position="pos[0]">
          <Tag :style="{ margin: '8px', padding: '20px', width: '60px' }">{{ pos[1] }}</Tag>
          <template #content
            ><Empty
              :title="'先进的设计 / 研发协作方式'"
              description="使用 Semi D2C 快速还原 Figma 设计稿，一键转代码"
              :style="{
                width: '400px',
                margin: '0 auto',
                display: 'flex',
                padding: '20px',
              }"
            >
              <template #image
                ><IllustrationSuccess :style="{ width: '150px', height: '150px' }" /></template
              ><template #darkModeImage
                ><IllustrationSuccessDark
                  :style="{
                    width: '150px',
                    height: '150px',
                  }" /></template></Empty></template></Popover
      ></template>
    </div>
    <div :style="{ width: '40px', marginLeft: '300px' }">
      <template v-for="(pos, index) in rights" :key="index"
        ><Popover :position="pos[0]">
          <Tag :style="{ margin: '8px', padding: '20px', width: '60px' }">{{ pos[1] }}</Tag>
          <template #content
            ><Empty
              :title="'先进的设计 / 研发协作方式'"
              description="使用 Semi D2C 快速还原 Figma 设计稿，一键转代码"
              :style="{
                width: '400px',
                margin: '0 auto',
                display: 'flex',
                padding: '20px',
              }"
            >
              <template #image
                ><IllustrationSuccess :style="{ width: '150px', height: '150px' }" /></template
              ><template #darkModeImage
                ><IllustrationSuccessDark
                  :style="{
                    width: '150px',
                    height: '150px',
                  }" /></template></Empty></template></Popover
      ></template>
    </div>
    <div :style="{ marginLeft: '80px', clear: 'both', whiteSpace: 'nowrap' }">
      <template v-for="(pos, index) in bottoms" :key="index"
        ><Popover :position="pos[0]">
          <Tag :style="{ margin: '8px', padding: '20px', width: '60px' }">{{ pos[1] }}</Tag>
          <template #content
            ><Empty
              :title="'先进的设计 / 研发协作方式'"
              description="使用 Semi D2C 快速还原 Figma 设计稿，一键转代码"
              :style="{
                width: '400px',
                margin: '0 auto',
                display: 'flex',
                padding: '20px',
              }"
            >
              <template #image
                ><IllustrationSuccess :style="{ width: '150px', height: '150px' }" /></template
              ><template #darkModeImage
                ><IllustrationSuccessDark
                  :style="{
                    width: '150px',
                    height: '150px',
                  }" /></template></Empty></template></Popover
      ></template>
    </div>
  </div>
</template>
