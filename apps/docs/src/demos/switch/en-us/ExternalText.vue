<script setup lang="ts">
import { shallowRef } from 'vue';
import { Switch } from '@aifuxi/semi-ui-vue/switch';
import '@aifuxi/semi-theme-default/switch.css';
import { Title } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
const open = shallowRef(false);
</script>

<template>
  <div style="display: flex; align-items: center">
    <Title :heading="6" style="margin: 8px">{{ open ? 'On' : 'Off' }}</Title
    ><Switch v-model="open" aria-label="a switch for demo" />
  </div>
</template>
