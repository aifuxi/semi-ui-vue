<script setup lang="ts">
import { Numeral } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
import { provide } from 'vue';
import { EN_US_TYPOGRAPHY_LOCALE, typographyLocaleKey } from '@aifuxi/semi-ui-vue/typography';
provide(typographyLocaleKey, EN_US_TYPOGRAPHY_LOCALE);
function parserTCH(value: string): string {
  return value
    .split(' ')
    .map((item) => (Number(item) ? `${item.replace(/(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1,')}+` : item))
    .join(' ');
}
const data = [
  { type: 'Stars', min: '7100' },
  { type: 'Fork', min: '560' },
  { type: 'Downloads', min: '5000000' },
  { type: 'Contributors', min: '100' },
];
</script>

<template>
  <div>
    <Numeral :parser="parserTCH" component="div">
      Semi Design values our users; any kind of contribution is welcome
      <p v-for="item in data" :key="item.type">
        {{ item.type }}：<b style="color: rgba(var(--semi-violet-5), 1)">{{ item.min }}</b>
      </p>
    </Numeral>
    <br />
    <Numeral
      :link="{ href: 'https://semi.design', target: '_blank', rel: 'noopener noreferrer' }"
      :parser="parserTCH"
    >
      Trusted by {{ 1e5 }} users, go to website &gt;&gt;
    </Numeral>
  </div>
</template>
