<script setup lang="ts">
import { Card, CardMeta } from '@aifuxi/semi-ui-vue/card';
import '@aifuxi/semi-theme-default/card.css';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
import { Popover } from '@aifuxi/semi-ui-vue/popover';
import '@aifuxi/semi-theme-default/popover.css';
import { IconInfoCircle } from '@aifuxi/semi-icons-vue';
</script>
<template>
  <Card :style="{ maxWidth: '360px' }">
    Semi Design 是由抖音前端团队与 UED 团队共同设计开发并维护的设计系统。
  </Card>
  <br />
  <Card
    :style="{ maxWidth: '360px' }"
    :body-style="{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }"
  >
    <CardMeta title="Semi Doc">
      <template #avatar
        ><Avatar alt="Card meta img" size="default" src="/demos/photo.svg" /></template
    ></CardMeta>
    <Popover position="top" show-arrow>
      <IconInfoCircle :style="{ color: 'var(--semi-color-primary)' }" />
      <template #content
        ><article :style="{ padding: '6px' }">这是一个 Card</article></template
      ></Popover
    >
  </Card>
</template>
