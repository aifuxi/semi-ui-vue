<script setup lang="ts">
import { Anchor, AnchorLink } from '@aifuxi/semi-ui-vue/anchor';
import '@aifuxi/semi-theme-default/anchor.css';
</script>

<template>
  <Anchor aria-label="文章目录">
    <AnchorLink href="#overview" title="概览" />
    <AnchorLink href="#usage" title="用法">
      <AnchorLink href="#api" title="API" />
    </AnchorLink>
  </Anchor>
</template>
