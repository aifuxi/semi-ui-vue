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
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
const visible = shallowRef(false);
const steps = [
  { title: '欢迎使用 AIFUXI 主题工具!', description: '', position: 'bottom' },
  {
    title: '高可用的色盘',
    description: '选取主色后，我们的颜色算法会为你生成一套高可用的色盘',
    position: 'bottom',
  },
  { title: '自由定制', description: '开始定制属于你的设计系统吧！', position: 'bottom' },
] as const;
const covers = ['/demos/one.svg', '/demos/two.svg', '/demos/photo.svg'];
</script>
<template>
  <ConfigProvider :locale="locale">
    <Button @click="visible = true">开始引导</Button>
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
          你可以从已发布的主题出发，或者选择<Text strong>立即创造</Text>来创造一个新的主题
        </div>
        <template v-else>{{ step.description }}</template>
      </template>
    </UserGuide>
  </ConfigProvider>
</template>
