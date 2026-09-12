<script setup lang="ts">
import { Carousel } from '@aifuxi/semi-ui-vue/carousel';
import { Title, Paragraph } from '@aifuxi/semi-ui-vue/typography';
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/carousel.css';
import '@aifuxi/semi-theme-default/typography.css';
import '@aifuxi/semi-theme-default/space.css';
const textList = [
  [
    'Semi 设计管理系统',
    '从 Semi Design，到 Any Design',
    '快速定制你的设计系统，并应用在设计稿和代码中',
  ],
  ['Semi 物料市场', '面向业务场景的定制化组件，支持线上预览和调试', '内容由 Semi Design 用户共建'],
  ['Semi Template', '高效的 Design2Code 设计稿转代码', '海量 Figma 设计模板一键转为真实前端代码'],
];
const images = ['/demos/one.svg', '/demos/two.svg', '/demos/photo.svg'];
</script>
<template>
  <div>
    <Carousel style="width: 100%; height: 400px" theme="dark"
      ><div
        v-for="(text, index) in textList"
        :key="index"
        :style="{ backgroundSize: 'cover', backgroundImage: `url('${images[index]}')` }"
      >
        <Space
          vertical
          align="start"
          spacing="medium"
          :style="{ position: 'absolute', top: '100px', left: '100px', color: '#1C1F23' }"
          ><span
            style="width: 87px; height: 31px; display: inline-block"
            aria-hidden="true"
          /><Title :heading="2" style="color: #1c1f23">{{ text[0] }}</Title
          ><Space vertical align="start"
            ><Paragraph style="color: #1c1f23">{{ text[1] }}</Paragraph
            ><Paragraph style="color: #1c1f23">{{ text[2] }}</Paragraph></Space
          ></Space
        >
      </div></Carousel
    >
  </div>
</template>
