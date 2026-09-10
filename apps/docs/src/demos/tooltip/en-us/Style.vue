<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/config-provider.css';
import { Tooltip } from '@aifuxi/semi-ui-vue/tooltip';
import '@aifuxi/semi-theme-default/tooltip.css';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
</script>
<template>
  <ConfigProvider :locale="enUS"
    ><Tooltip
      :style="{
        maxWidth: '320px',
      }"
      class="another-classname"
      :content="'hi semi semi semi semi semi semi semi'"
    >
      <Tag :style="{ marginRight: '8px' }"> Custom Style And ClassName</Tag>
    </Tooltip></ConfigProvider
  >
</template>
