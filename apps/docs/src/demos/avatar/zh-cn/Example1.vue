<script setup lang="ts">
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
</script>

<template>
  <div>
    <Avatar size="extra-extra-small" :style="{ margin: '4px' }" alt="User">U</Avatar>
    <Avatar size="extra-small" :style="{ margin: '4px' }" alt="User">U</Avatar>
    <Avatar size="small" :style="{ margin: '4px' }" alt="User">U</Avatar>
    <Avatar size="default" :style="{ margin: '4px' }" alt="User">U</Avatar>
    <Avatar :style="{ margin: '4px' }" alt="User">U</Avatar>
    <Avatar size="large" :style="{ margin: '4px' }" alt="User">U</Avatar>
    <Avatar size="extra-large" :style="{ margin: '4px' }" alt="User">U</Avatar>
  </div>
</template>
