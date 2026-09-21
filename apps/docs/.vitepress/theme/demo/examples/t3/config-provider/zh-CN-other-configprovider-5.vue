<script setup lang="ts">
import { shallowRef } from 'vue';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import { Button, ButtonGroup } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/config-provider.css';
import '@aifuxi/semi-theme-default/button.css';
import DirectionButtons from './DirectionButtons.vue';
import DirectionInputs from './DirectionInputs.vue';
import DirectionNavigation from './DirectionNavigation.vue';
import DirectionDisplay from './DirectionDisplay.vue';
import DirectionFeedback from './DirectionFeedback.vue';
const direction = shallowRef<'ltr' | 'rtl'>('ltr');
</script>
<template>
  <div>
    <div :style="{ marginBottom: '20px' }">
      <ButtonGroup
        ><Button @click="direction = 'ltr'">LTR</Button
        ><Button @click="direction = 'rtl'">RTL</Button></ButtonGroup
      >
    </div>
    <ConfigProvider :direction="direction">
      <DirectionButtons />
      <DirectionInputs />
      <DirectionNavigation />
      <DirectionDisplay />
      <DirectionFeedback :direction="direction" />
    </ConfigProvider>
  </div>
</template>
