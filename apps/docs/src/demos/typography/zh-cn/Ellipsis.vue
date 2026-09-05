<script setup lang="ts">
import { Title, Text, Paragraph } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
import { shallowRef } from 'vue';
const longText =
  'Semi Design 是由抖音前端团队与 UED 团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的 Web 应用。';
const expanded = shallowRef(false);
</script>

<template>
  <div>
    <Title :heading="5" :ellipsis="{ showTooltip: true }" style="width: 250px"
      >是一个很长很长很长很长5号标题</Title
    ><br />
    <Text :ellipsis="{ showTooltip: true }" style="width: 150px">
      可以自定义浮层里的展示内容试试看吧
      <template #tooltip
        ><div class="semi-tooltip-wrapper semi-tooltip-wrapper-show" role="tooltip">
          <div class="semi-tooltip-content">这是自定义要展示的内容</div>
        </div></template
      > </Text
    ><br />
    <Text link :ellipsis="{ showTooltip: true, pos: 'middle' }" style="width: 150px"
      >是一个很长很长很长很长的链接</Text
    ><br />
    <Paragraph :ellipsis="{ suffix: '小尾巴' }" style="width: 300px">{{ longText }}</Paragraph
    ><br />
    <Paragraph :ellipsis="{ rows: 3 }" style="width: 300px">{{ longText }}</Paragraph
    ><br />
    <Paragraph
      :ellipsis="{ rows: 3, showTooltip: { type: 'popover', opts: { style: { width: '300px' } } } }"
      style="width: 300px"
      >{{ longText }}</Paragraph
    ><br />
    <Paragraph
      :ellipsis="{ rows: 3, expandable: true, collapsible: true, collapseText: '折叠我吧' }"
      style="width: 300px"
      @expand="expanded = $event"
      >{{ longText }}</Paragraph
    >
    <output aria-live="polite">展开状态：{{ expanded }}</output
    ><br />
    <Text
      :ellipsis="{ showTooltip: true, pos: 'middle' }"
      style="width: 150px; word-break: break-word"
    >
      sssssssssssssssssssssssss
      <template #tooltip
        ><div class="semi-tooltip-wrapper semi-tooltip-wrapper-show" role="tooltip">
          <div class="semi-tooltip-content">全英文设置了 word-break</div>
        </div></template
      > </Text
    ><br /><br />
    <Title :heading="5" :ellipsis="{ showTooltip: true }" style="width: 250px">
      这是一个自定义弹出层组件的省略文本，背景色是蓝色
      <template #tooltip="{ content }"
        ><div
          class="semi-tooltip-wrapper semi-tooltip-wrapper-show"
          style="background-color: var(--semi-color-primary)"
          role="tooltip"
        >
          <div class="semi-tooltip-content">{{ content }}</div>
        </div></template
      >
    </Title>
  </div>
</template>
