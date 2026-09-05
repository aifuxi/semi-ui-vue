<script setup lang="ts">
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import { Badge } from '@aifuxi/semi-ui-vue/badge';
import '@aifuxi/semi-theme-default/badge.css';
import '@aifuxi/semi-theme-default/avatar.css';
</script>

<template>
  <Badge :count="5">
    <Avatar shape="square" color="blue">BM</Avatar>
  </Badge>
  <Badge dot>
    <Avatar shape="square" color="blue">YL</Avatar>
  </Badge>
</template>
