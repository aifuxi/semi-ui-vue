<script setup lang="ts">
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/space.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
</script>

<template>
  <Space wrap>
    <Button v-for="item in 10" :key="item" theme="solid" type="secondary">按钮</Button>
  </Space>
</template>
