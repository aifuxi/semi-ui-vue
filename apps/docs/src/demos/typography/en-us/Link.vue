<script setup lang="ts">
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
import { IconLink } from '@aifuxi/semi-icons-vue';
import { provide } from 'vue';
import { EN_US_TYPOGRAPHY_LOCALE, typographyLocaleKey } from '@aifuxi/semi-ui-vue/typography';
provide(typographyLocaleKey, EN_US_TYPOGRAPHY_LOCALE);
</script>

<template>
  <div>
    <Text :link="{ href: 'https://semi.design/' }">Link</Text>
    <br />
    <br />
    <Text :link="{ href: 'https://semi.design/' }">Open Website</Text>
    <br />
    <br />
    <Text link underline
      ><template #icon><IconLink /></template>Link</Text
    >
  </div>
</template>
