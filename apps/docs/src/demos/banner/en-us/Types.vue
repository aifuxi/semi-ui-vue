<script setup lang="ts">
import { Banner } from '@aifuxi/semi-ui-vue/banner';
import '@aifuxi/semi-theme-default/banner.css';
</script>

<template>
  <Banner type="info" description="A pre-released version is available." />
  <br />
  <Banner
    type="warning"
    description="This version of the document is going to expire after 4 days."
  />
  <br />
  <Banner type="danger" description="This document was deprecated since Jan 1, 2019." />
  <br />
  <Banner type="success" description="You are viewing the latest version of this document." />
</template>
