<script setup lang="ts">
import { Text, Paragraph } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
import { provide } from 'vue';
import { EN_US_TYPOGRAPHY_LOCALE, typographyLocaleKey } from '@aifuxi/semi-ui-vue/typography';
provide(typographyLocaleKey, EN_US_TYPOGRAPHY_LOCALE);
</script>

<template>
  <div>
    <Text>Normal</Text>
    <Paragraph spacing="extended">
      Life's but a walking shadow, a poor player, that struts and frets his hour upon the stage, and
      then is heard no more; it is a tale told by an idiot, full of sound and fury, signifying
      nothing.
    </Paragraph>
    <br />
    <Text size="small">Small</Text>
    <Paragraph size="small">
      Life's but a walking shadow, a poor player, that struts and frets his hour upon the stage, and
      then is heard no more; it is a tale told by an idiot, full of sound and fury, signifying
      nothing.
    </Paragraph>
    <br />
    <Text size="small"
      >This is a Text, size is small<Text link size="inherit"
        >This is a Text，size is inherit, inherit parent's size</Text
      >
    </Text>
  </div>
</template>
