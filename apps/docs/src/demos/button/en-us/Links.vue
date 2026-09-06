<script setup lang="ts">
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/button.css';
import { IconLink } from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/typography.css';
</script>

<template>
  <div>
    <Text :link="{ href: '/en-us/start/introduction/' }">Link</Text><br /><br /><Text
      :link="{ href: '/en-us/start/introduction/' }"
      >Open Website</Text
    ><br /><br /><Text link underline
      ><template #icon><IconLink /></template>Link</Text
    >
  </div>
</template>
