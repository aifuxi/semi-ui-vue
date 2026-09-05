<script setup lang="ts">
import { Tooltip } from '@aifuxi/semi-ui-vue/tooltip';
import '@aifuxi/semi-theme-default/tooltip.css';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
</script>
<template>
  <div>
    <Tooltip
      :style="{
        maxWidth: '320px',
      }"
      class="another-classname"
      :content="'hi semi semi semi semi semi semi semi'"
    >
      <Tag :style="{ marginRight: '8px' }"> Custom Style And ClassName</Tag>
    </Tooltip>
  </div>
</template>
