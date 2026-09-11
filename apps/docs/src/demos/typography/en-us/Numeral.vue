<script setup lang="ts">
import { Numeral } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
import { provide } from 'vue';
import { EN_US_TYPOGRAPHY_LOCALE, typographyLocaleKey } from '@aifuxi/semi-ui-vue/typography';
provide(typographyLocaleKey, EN_US_TYPOGRAPHY_LOCALE);
</script>

<template>
  <div>
    <Numeral :precision="1">
      <p>Liked：1.6111e1 K</p>
    </Numeral>

    <p>Views:<Numeral rule="numbers" :precision="1">2.4444e2</Numeral>K</p>

    <Numeral rule="percentages" :precision="2" :style="{ marginBottom: '12px' }">
      <p>Favorable rating: 0.915</p>
    </Numeral>

    <Numeral rule="percentages" :style="{ marginBottom: '12px' }">
      My odds of winning this game are 0.6 and my odds of losing are 0.4.
    </Numeral>

    <Numeral rule="bytes-decimal" :precision="2" truncate="floor">
      <p>Used: 1000</p>
      <p>Available: {{ 1024 * 1000 }}</p>
    </Numeral>

    <Numeral rule="bytes-binary" :precision="2" truncate="floor">
      <p>Used: 1024</p>
      <p>Available: {{ 2e12 }}</p>
    </Numeral>
  </div>
</template>
