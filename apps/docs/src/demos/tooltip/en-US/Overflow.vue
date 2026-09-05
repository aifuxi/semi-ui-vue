<script setup lang="ts">
import { Text, Title, Paragraph } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';

import { provide } from 'vue';
import { EN_US_TYPOGRAPHY_LOCALE, typographyLocaleKey } from '@aifuxi/semi-ui-vue/typography';
provide(typographyLocaleKey, EN_US_TYPOGRAPHY_LOCALE);
</script>
<template>
  <div>
    <Title :heading="5" :ellipsis="{ showTooltip: true }" :style="{ width: '250px' }">
      This is a very very very very long level-five heading
    </Title>
    <br />
    <Text link :ellipsis="{ showTooltip: true, pos: 'middle' }" :style="{ width: '150px' }">
      This is a very very very very long link
    </Text>
    <br />
    <br />
    <Paragraph
      :ellipsis="{
        rows: 3,
        showTooltip: { type: 'popover', opts: { style: { width: '300px' } } },
      }"
      :style="{ width: '300px' }"
    >
      Multiline truncation with Popover: Semi Design is a design system developed and maintained by
      IES-FE and IES-UED. The system includes a design language and reusable front-end components
      that help designers and developers create high-quality Web applications with a consistent user
      experience.
    </Paragraph>
  </div>
</template>
