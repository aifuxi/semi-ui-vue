<script setup lang="ts">
import { Empty } from '@aifuxi/semi-ui-vue/empty';
import '@aifuxi/semi-theme-default/empty.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import IllustrationSuccess from '@aifuxi/semi-illustrations-vue/illustrations/IllustrationSuccess';
import IllustrationSuccessDark from '@aifuxi/semi-illustrations-vue/illustrations/IllustrationSuccessDark';
</script>

<template>
  <Empty
    title="Created successfully"
    layout="horizontal"
    description="This is a very long description text. This layout is recommended when the text is too long. This is a very long description text. This layout is recommended when the text is too long. This is a very long description text. This layout is recommended when the text is too long. "
    style="width: 800px; margin: 0 auto"
  >
    <template #image><IllustrationSuccess style="width: 150px; height: 150px" /></template>
    <template #darkModeImage
      ><IllustrationSuccessDark style="width: 150px; height: 150px"
    /></template>
    <Button type="primary" theme="solid" style="padding: 6px 24px">Start operation</Button>
  </Empty>
</template>
