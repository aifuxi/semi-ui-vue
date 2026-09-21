<script setup lang="ts">
import { Badge } from '@aifuxi/semi-ui-vue/badge';
import '@aifuxi/semi-theme-default/badge.css';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
const avatarStyle = { width: '42px', height: '42px', borderRadius: '4px' };
</script>

<template>
  <div>
    <Badge :count="99"><Avatar color="teal" shape="square" :style="avatarStyle">ZH</Avatar></Badge>
    <br /><br />
    <Badge :count="100"><Avatar color="teal" shape="square" :style="avatarStyle">HS</Avatar></Badge>
    <br /><br />
    <Badge :count="99" :overflow-count="10"
      ><Avatar color="green" shape="square" :style="avatarStyle">DY</Avatar></Badge
    >
    <br /><br />
    <Badge :count="1000" :overflow-count="999"
      ><Avatar color="green" shape="square" :style="avatarStyle">TT</Avatar></Badge
    >
  </div>
</template>
