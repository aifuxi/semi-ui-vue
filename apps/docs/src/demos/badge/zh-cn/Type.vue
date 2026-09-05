<script setup lang="ts">
import { Badge } from '@aifuxi/semi-ui-vue/badge';
import '@aifuxi/semi-theme-default/badge.css';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
const avatarStyle = { width: '42px', height: '42px', borderRadius: '4px' };
</script>

<template>
  <div style="display: flex; flex-wrap: wrap">
    <div style="padding: 8px 8px 3px">
      <Badge :count="5" type="primary"
        ><Avatar color="violet" shape="square" :style="avatarStyle">MR</Avatar></Badge
      >
    </div>
    <div style="padding: 8px 8px 3px">
      <Badge :count="5" type="secondary"
        ><Avatar color="violet" shape="square" :style="avatarStyle">YL</Avatar></Badge
      >
    </div>
    <div style="padding: 8px 8px 3px">
      <Badge :count="5" type="tertiary"
        ><Avatar color="red" shape="square" :style="avatarStyle">ZW</Avatar></Badge
      >
    </div>
    <div style="padding: 8px 8px 3px">
      <Badge :count="5" type="warning"
        ><Avatar color="red" shape="square" :style="avatarStyle">JL</Avatar></Badge
      >
    </div>
    <div style="padding: 8px 8px 3px">
      <Badge :count="5" type="danger"
        ><Avatar color="pink" shape="square" :style="avatarStyle">RT</Avatar></Badge
      >
    </div>
    <div style="padding: 8px 8px 3px">
      <Badge dot type="primary"
        ><Avatar color="pink" shape="square" :style="avatarStyle">YF</Avatar></Badge
      >
    </div>
  </div>
</template>
