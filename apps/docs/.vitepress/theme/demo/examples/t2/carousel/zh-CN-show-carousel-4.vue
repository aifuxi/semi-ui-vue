<script setup lang="ts">
import { shallowRef } from 'vue';
import { Carousel } from '@aifuxi/semi-ui-vue/carousel';
import { Title, Paragraph } from '@aifuxi/semi-ui-vue/typography';
import { Space } from '@aifuxi/semi-ui-vue/space';
import { Radio, RadioGroup } from '@aifuxi/semi-ui-vue/radio';
import '@aifuxi/semi-theme-default/carousel.css';
import '@aifuxi/semi-theme-default/typography.css';
import '@aifuxi/semi-theme-default/space.css';
import '@aifuxi/semi-theme-default/radio.css';
const textList = [
  [
    'Semi 设计管理系统',
    '从 Semi Design，到 Any Design',
    '快速定制你的设计系统，并应用在设计稿和代码中',
  ],
  ['Semi 物料市场', '面向业务场景的定制化组件，支持线上预览和调试', '内容由 Semi Design 用户共建'],
  ['Semi 设计/代码模板', '高效的 Design2Code 设计稿转代码', '海量 Figma前端代码一键转'],
];
const images = ['/demos/one.svg', '/demos/two.svg', '/demos/photo.svg'];
const type = shallowRef<'dot' | 'line' | 'columnar'>('dot');
const position = shallowRef<'left' | 'center' | 'right'>('left');
const size = shallowRef<'small' | 'medium'>('small');
</script>
<template>
  <div>
    <Carousel
      style="width: 100%; height: 400px"
      theme="dark"
      :indicator-type="type"
      :indicator-position="position"
      :indicator-size="size"
      :auto-play="false"
      ><div
        v-for="(text, index) in textList"
        :key="index"
        :style="{ backgroundSize: 'cover', backgroundImage: `url('${images[index]}')` }"
      >
        <Space
          vertical
          align="start"
          spacing="medium"
          :style="{ position: 'absolute', top: '100px', left: '100px' }"
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
    ><br /><Space vertical align="start"
      ><Space
        ><div>类型</div>
        <RadioGroup v-model="type" name="carousel-demo-3" type="button"
          ><Radio value="dot">dot</Radio><Radio value="line">line</Radio
          ><Radio value="columnar">columnar</Radio></RadioGroup
        ></Space
      ><Space
        ><div>位置</div>
        <RadioGroup v-model="position" name="carousel-demo-3" type="button"
          ><Radio value="left">left</Radio><Radio value="center">center</Radio
          ><Radio value="right">right</Radio></RadioGroup
        ></Space
      ><Space
        ><div>尺寸</div>
        <RadioGroup v-model="size" name="carousel-demo-3" type="button"
          ><Radio value="small">small</Radio><Radio value="medium">medium</Radio></RadioGroup
        ></Space
      ></Space
    >
  </div>
</template>
