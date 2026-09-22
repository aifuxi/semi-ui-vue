<script setup lang="ts">
import { Badge } from '@aifuxi/semi-ui-vue/badge';
import '@aifuxi/semi-theme-default/badge.css';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
const avatarStyle = { width: '42px', height: '42px', borderRadius: '4px' };
</script>

<template>
  <div style="display: flex; flex-wrap: wrap">
    <div style="padding: 8px">
      <Badge :count="5" theme="solid"
        ><Avatar color="indigo" shape="square" :style="avatarStyle">XZ</Avatar></Badge
      >
    </div>
    <div style="padding: 8px">
      <Badge :count="5" theme="light"
        ><Avatar color="indigo" shape="square" :style="avatarStyle">YB</Avatar></Badge
      >
    </div>
    <div style="padding: 8px">
      <Badge :count="5" theme="inverted"
        ><Avatar color="light-green" shape="square" :style="avatarStyle">LX</Avatar></Badge
      >
    </div>
    <div style="padding: 8px">
      <Badge dot theme="solid"
        ><Avatar color="light-green" shape="square" :style="avatarStyle">YZ</Avatar></Badge
      >
    </div>
    <div style="padding: 8px">
      <Badge dot theme="light"
        ><Avatar color="lime" shape="square" :style="avatarStyle">HW</Avatar></Badge
      >
    </div>
    <div style="padding: 8px; border-radius: 4px; background-color: var(--semi-color-fill-0)">
      <Badge dot theme="inverted"
        ><Avatar color="lime" shape="square" :style="avatarStyle">XM</Avatar></Badge
      >
    </div>
  </div>
</template>
