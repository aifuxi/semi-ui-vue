<script setup lang="ts">
import { Empty } from '@aifuxi/semi-ui-vue/empty';
import '@aifuxi/semi-theme-default/empty.css';
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
</script>

<template>
  <Empty title="暂未找到匹配的筛选结果">
    <template #description
      ><span><Text>试试 </Text><Text link>重置筛选条件</Text></span></template
    >
  </Empty>
</template>
