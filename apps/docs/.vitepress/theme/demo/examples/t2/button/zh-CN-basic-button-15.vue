<script setup lang="ts">
import { Button, ButtonGroup } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
const sizes = ['large', 'default', 'small'] as const;
</script>

<template>
  <div style="display: flex">
    <div v-for="size in sizes" :key="size" style="margin-right: 10px">
      <ButtonGroup :size="size"
        ><Button>拷贝</Button><Button>查询</Button><Button>剪切</Button></ButtonGroup
      >
    </div>
  </div>
</template>
