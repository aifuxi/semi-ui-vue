<script setup lang="ts">
import { Empty } from '@aifuxi/semi-ui-vue/empty';
import '@aifuxi/semi-theme-default/empty.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import IllustrationNoContent from '@aifuxi/semi-illustrations-vue/illustrations/IllustrationNoContent';
import IllustrationNoContentDark from '@aifuxi/semi-illustrations-vue/illustrations/IllustrationNoContentDark';
</script>

<template>
  <Empty title="Empty status header" description="Start creating your first dashboard!">
    <template #image><IllustrationNoContent style="width: 150px; height: 150px" /></template>
    <template #darkModeImage
      ><IllustrationNoContentDark style="width: 150px; height: 150px"
    /></template>
    <div>
      <Button style="padding: 6px 24px; margin-right: 12px" type="primary">Secondary button</Button>
      <Button style="padding: 6px 24px" theme="solid" type="primary">Level 1 button</Button>
    </div>
  </Empty>
</template>
