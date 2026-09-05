<script setup lang="ts">
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
import { Card, CardGroup } from '@aifuxi/semi-ui-vue/card';
import '@aifuxi/semi-theme-default/card.css';
import { Slider } from '@aifuxi/semi-ui-vue/slider';
import '@aifuxi/semi-theme-default/slider.css';
import { shallowRef } from 'vue';
const spacing = shallowRef(12);
function changeSpacing(value: number | number[]) {
  if (typeof value === 'number') spacing.value = value;
}
</script>

<template>
  <div>
    <Text>Slide to adjust Card spacing</Text
    ><Slider
      :default-value="12"
      :max="40"
      :min="10"
      style="width: 360px"
      @change="changeSpacing"
    /><br /><CardGroup :spacing="spacing"
      ><Card
        v-for="index in 8"
        :key="index"
        shadows="hover"
        title="Card title"
        :header-line="false"
        style="width: 260px"
        ><template #headerExtraContent><Text link>More</Text></template
        ><Text>Card content</Text></Card
      ></CardGroup
    >
  </div>
</template>
