<script setup lang="ts">
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
import { Card, CardGroup } from '@aifuxi/semi-ui-vue/card';
import '@aifuxi/semi-theme-default/card.css';
</script>

<template>
  <CardGroup type="grid"
    ><Card
      v-for="index in 7"
      :key="index"
      shadows="hover"
      title="Card title"
      :header-line="false"
      style="width: 260px"
      ><template #headerExtraContent><Text link>More</Text></template
      ><Text>Card content</Text></Card
    ></CardGroup
  >
</template>
