<script setup lang="ts">
import { Title, Paragraph } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
import { provide } from 'vue';
import { EN_US_TYPOGRAPHY_LOCALE, typographyLocaleKey } from '@aifuxi/semi-ui-vue/typography';
provide(typographyLocaleKey, EN_US_TYPOGRAPHY_LOCALE);
</script>

<template>
  <div>
    <Title :heading="5">Default Spacing</Title>
    <Paragraph>
      Life's but a walking shadow, a poor player, that struts and frets his hour upon the stage, and
      then is heard no more; it is a tale told by an idiot, full of sound and fury, signifying
      nothing.
    </Paragraph>
    <br />
    <Title :heading="5">Extended Spacing</Title>
    <Paragraph spacing="extended">
      Life's but a walking shadow, a poor player, that struts and frets his hour upon the stage, and
      then is heard no more; it is a tale told by an idiot, full of sound and fury, signifying
      nothing.
    </Paragraph>
  </div>
</template>
