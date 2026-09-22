<script setup lang="ts">
import { Badge } from '@aifuxi/semi-ui-vue/badge';
import '@aifuxi/semi-theme-default/badge.css';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
import IconLock from '@aifuxi/semi-icons-vue/icons/IconLock';
const avatarStyle = { width: '42px', height: '42px', borderRadius: '4px' };
</script>

<template>
  <div>
    <Badge :count="5"><Avatar color="blue" shape="square" :style="avatarStyle">BM</Avatar></Badge
    ><br /><br />
    <Badge dot><Avatar color="blue" shape="square" :style="avatarStyle">YL</Avatar></Badge
    ><br /><br />
    <Badge
      ><Avatar color="light-blue" shape="square" :style="avatarStyle">XZ</Avatar
      ><template #count><IconLock style="color: var(--semi-color-primary)" /></template></Badge
    ><br /><br />
    <Badge count="NEW"
      ><Avatar color="light-blue" shape="square" :style="avatarStyle">WF</Avatar></Badge
    >
  </div>
</template>
