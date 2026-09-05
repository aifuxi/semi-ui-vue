<script setup lang="ts">
import { Empty } from '@aifuxi/semi-ui-vue/empty';
import '@aifuxi/semi-theme-default/empty.css';
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
</script>

<template>
  <Empty title="No matching filter results found yet">
    <template #description
      ><span><Text>Try</Text><Text link>Reset filter</Text></span></template
    >
  </Empty>
</template>
