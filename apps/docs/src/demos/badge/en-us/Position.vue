<script setup lang="ts">
import { Badge } from '@aifuxi/semi-ui-vue/badge';
import '@aifuxi/semi-theme-default/badge.css';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
const avatarStyle = { width: '42px', height: '42px', borderRadius: '4px' };
</script>

<template>
  <div>
    <Badge count="VIP" position="rightTop" type="danger"
      ><Avatar color="amber" shape="square" :style="avatarStyle">ZH</Avatar></Badge
    >
    <br /><br />
    <Badge count="VIP" position="rightBottom" type="danger"
      ><Avatar color="amber" shape="square" :style="avatarStyle">HS</Avatar></Badge
    >
    <br /><br />
    <Badge count="VIP" position="leftTop" type="danger"
      ><Avatar color="orange" shape="square" :style="avatarStyle">DY</Avatar></Badge
    >
    <br /><br />
    <Badge count="VIP" position="leftBottom" type="danger"
      ><Avatar color="orange" shape="square" :style="avatarStyle">TT</Avatar></Badge
    >
  </div>
</template>
