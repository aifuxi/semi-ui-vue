<script setup lang="ts">
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/button.css';
import { IconLink } from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/typography.css';
</script>

<template>
  <div>
    <Text :link="{ href: '/en-us/start/introduction/' }">Link text</Text><br /><br /><Text
      :link="{ href: '/en-us/start/introduction/' }"
      >Open website</Text
    ><br /><br /><Text link underline
      ><template #icon><IconLink /></template>Underlined link</Text
    >
  </div>
</template>
