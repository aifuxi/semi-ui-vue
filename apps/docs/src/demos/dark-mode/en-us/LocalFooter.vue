<script setup lang="ts">
import { Layout } from '@aifuxi/semi-ui-vue/layout';
import { IconApps } from '@aifuxi/semi-icons-vue';
</script>
<template>
  <Layout.Footer
    :style="{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '20px',
      color: 'var(--semi-color-text-2)',
      backgroundColor: 'rgba(var(--semi-grey-0), 1)',
    }"
  >
    <span :style="{ display: 'flex', alignItems: 'center' }"
      ><IconApps size="large" :style="{ marginRight: '8px' }" /><span
        >Component workspace</span
      ></span
    >
    <span><span :style="{ marginRight: '24px' }">Customer Service</span><span>Feedback</span></span>
  </Layout.Footer>
</template>
