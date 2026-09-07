<script setup lang="ts">
import { shallowRef } from 'vue';
import { UserGuide } from '@aifuxi/semi-ui-vue/user-guide';
import '@aifuxi/semi-theme-default/user-guide.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Image } from '@aifuxi/semi-ui-vue/image';
import '@aifuxi/semi-theme-default/image.css';
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
const visible = shallowRef(false);
const steps = [
  { title: 'Welcome to AIFUXI theme tools!', description: '', position: 'bottom' },
  {
    title: 'High-available color palette',
    description:
      'After selecting the main color, our color algorithm will generate a high-available color palette for you',
    position: 'bottom',
  },
  {
    title: 'Customize freely',
    description: 'Start customizing your design system!',
    position: 'bottom',
  },
] as const;
const covers = ['/demos/one.svg', '/demos/two.svg', '/demos/photo.svg'];
</script>
<template>
  <ConfigProvider :locale="locale">
    <Button @click="visible = true">Start Guide</Button>
    <UserGuide
      mode="modal"
      :mask="true"
      :visible="visible"
      :steps="steps"
      @finish="visible = false"
      @skip="visible = false"
      @change="(current: number) => console.log('current', current)"
      @next="() => console.log('next')"
      @prev="() => console.log('prev')"
    >
      <template #cover="{ index }"
        ><Image width="600px" height="100%" :src="covers[index]" :alt="steps[index]?.title"
      /></template>
      <template #description="{ index, step }">
        <div v-if="index === 0">
          You can start from a published theme, or choose
          <Text strong>Create Now</Text> to create a new theme
        </div>
        <template v-else>{{ step.description }}</template>
      </template>
    </UserGuide>
  </ConfigProvider>
</template>
