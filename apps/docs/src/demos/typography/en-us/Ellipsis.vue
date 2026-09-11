<script setup lang="ts">
import { Title, Text, Paragraph } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
import { provide } from 'vue';
import { EN_US_TYPOGRAPHY_LOCALE, typographyLocaleKey } from '@aifuxi/semi-ui-vue/typography';
provide(typographyLocaleKey, EN_US_TYPOGRAPHY_LOCALE);
const longText =
  "Life's but a walking shadow, a poor player, that struts and frets his hour upon the stage, and then is heard no more; it is a tale told by an idiot, full of sound and fury, signifying nothing.";
</script>

<template>
  <div>
    <Title :heading="5" :ellipsis="{ showTooltip: true }" style="width: 250px"
      >This is a supercalifragilisticexpialidocious title</Title
    ><br />
    <Text :ellipsis="{ showTooltip: true }" style="width: 150px">
      Custom tooltip text if you need
      <template #tooltip>This is a supercalifragilisticexpialidocious tooltip</template> </Text
    ><br />
    <Text link :ellipsis="{ showTooltip: true, pos: 'middle' }" style="width: 150px"
      >This is a supercalifragilisticexpialidocious link</Text
    ><br />
    <Paragraph :ellipsis="{ suffix: '-Macbeth' }" style="width: 300px"
      >With suffix: {{ longText }}</Paragraph
    ><br />
    <Paragraph :ellipsis="{ rows: 3 }" style="width: 300px"
      >Multi-line ellipsis: {{ longText }}</Paragraph
    ><br />
    <Paragraph
      :ellipsis="{ rows: 3, showTooltip: { type: 'popover', opts: { style: { width: '300px' } } } }"
      style="width: 300px"
      >With Popover: {{ longText }}</Paragraph
    ><br />
    <Paragraph
      :ellipsis="{ rows: 3, expandable: true, collapsible: true, collapseText: 'Show Less' }"
      style="width: 300px"
      @expand="(value, event) => console.log(value, event)"
      >Expandable and collapsible: {{ longText }}</Paragraph
    ><br />
    <Title
      :heading="6"
      :ellipsis="{
        showTooltip: { opts: { style: { backgroundColor: 'var(--semi-color-primary)' } } },
      }"
      style="width: 250px"
    >
      Custom tooltip with a blue background color
      <template #tooltip="{ content }">{{ content }}</template>
    </Title>
  </div>
</template>
