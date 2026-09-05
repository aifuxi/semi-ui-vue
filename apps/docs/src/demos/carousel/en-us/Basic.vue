<script setup lang="ts">
import { Carousel } from '@aifuxi/semi-ui-vue/carousel';
import { Title, Paragraph } from '@aifuxi/semi-ui-vue/typography';
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/carousel.css';
import '@aifuxi/semi-theme-default/typography.css';
import '@aifuxi/semi-theme-default/space.css';
const textList = [
  [
    'Semi Design System Management',
    'From Semi Design, To Any Design',
    'Quickly define your design system and apply it to design drafts and code',
  ],
  [
    'Semi Material',
    'Customized components for business scenarios, support online preview and debugging',
    'Content co-authored by Semi Design users',
  ],
  [
    'Semi Template',
    'Efficient Design2Code converts design into real code in seconds',
    'One-click conversion of massive page template front-end code',
  ],
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
    >
  </div>
</template>
