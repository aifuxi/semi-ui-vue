<script setup lang="ts">
import { Badge } from '@aifuxi/semi-ui-vue/badge';
import '@aifuxi/semi-theme-default/badge.css';
</script>

<template>
  <div>
    <Badge :count="5" /><br /><br />
    <Badge count="NEW" theme="light" /><br /><br />
    <Badge :count="99" :overflow-count="10" type="danger" /><br /><br />
    <span><Badge dot type="primary" /> Processing</span><br />
    <span><Badge dot type="tertiary" /> Info</span><br />
    <span><Badge dot type="success" /> Success</span><br />
    <span><Badge dot type="warning" /> Warning</span><br />
    <span><Badge dot type="danger" /> Error</span>
  </div>
</template>
