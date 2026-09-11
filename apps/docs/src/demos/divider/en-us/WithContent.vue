<script setup lang="ts">
import { Divider } from '@aifuxi/semi-ui-vue/divider';
import '@aifuxi/semi-theme-default/divider.css';
import { IconInfoCircle } from '@aifuxi/semi-icons-vue';
</script>

<template>
  <div>
    <Divider margin="12px" align="left">Left Text</Divider>

    <Divider margin="12px" align="center">Center Text</Divider>

    <Divider margin="12px" align="right">Right Text</Divider>

    <Divider margin="12px">
      <IconInfoCircle />
    </Divider>
  </div>
</template>
