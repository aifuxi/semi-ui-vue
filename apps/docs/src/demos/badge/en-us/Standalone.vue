<script setup lang="ts">
import { Badge } from '@aifuxi/semi-ui-vue/badge';
import '@aifuxi/semi-theme-default/badge.css';
</script>

<template>
  <div>
    <Badge :count="5" /><br /><br />
    <Badge count="NEW" theme="light" /><br /><br />
    <Badge :count="99" :overflow-count="10" type="danger" /><br /><br />
    <span><Badge dot type="primary" /> processing</span><br />
    <span><Badge dot type="tertiary" /> info</span><br />
    <span><Badge dot type="success" /> success</span><br />
    <span><Badge dot type="warning" /> warning</span><br />
    <span><Badge dot type="danger" /> error</span>
  </div>
</template>
