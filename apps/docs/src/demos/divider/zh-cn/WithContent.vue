<script setup lang="ts">
import { Divider } from '@aifuxi/semi-ui-vue/divider';
import '@aifuxi/semi-theme-default/divider.css';
import { IconInfoCircle } from '@aifuxi/semi-icons-vue';
</script>

<template>
  <div>
    <Divider margin="12px" align="left"> 这是居左文字 </Divider>

    <Divider margin="12px" align="center"> 这是居中文字 </Divider>

    <Divider margin="12px" align="right"> 这是居右文字 </Divider>

    <Divider margin="12px">
      <IconInfoCircle />
    </Divider>
  </div>
</template>
