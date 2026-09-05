<script setup lang="ts">
import { Anchor, AnchorLink } from '@aifuxi/semi-ui-vue/anchor';
import '@aifuxi/semi-theme-default/anchor.css';
</script>

<template>
  <Anchor aria-label="Article contents">
    <AnchorLink href="#overview" title="Overview" />
    <AnchorLink href="#usage" title="Usage">
      <AnchorLink href="#api" title="API" />
    </AnchorLink>
  </Anchor>
</template>
