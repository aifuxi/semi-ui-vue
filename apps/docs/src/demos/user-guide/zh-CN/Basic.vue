<script setup lang="ts">
import { shallowRef, useId } from 'vue';
import { UserGuide, type UserGuideStepItem } from '@aifuxi/semi-ui-vue/user-guide';
import '@aifuxi/semi-theme-default/user-guide.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/space.css';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
import { Switch } from '@aifuxi/semi-ui-vue/switch';
import '@aifuxi/semi-theme-default/switch.css';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
const visible = shallowRef(false);

const targetId = useId();
const steps: UserGuideStepItem[] = [
  {
    target: () => document.getElementById(`${targetId}-0`),
    title: '新手引导',
    description: 'Hello AIFUXI!',
    position: 'bottom',
  },
  {
    target: () => document.getElementById(`${targetId}-1`),
    title: 'Switch',
    description: 'This is a Semi Switch',
    position: 'bottom',
  },
  {
    target: () => document.getElementById(`${targetId}-2`),
    title: 'Button',
    description: 'This is a Semi Button',
    position: 'bottom',
  },
];
function close() {
  visible.value = false;
}
</script>
<template>
  <ConfigProvider :locale="locale">
    <div>
      <Button @click="visible = true">开始引导</Button>
      <br /><br /><Space
        ><Switch :id="`${targetId}-0`" :default-checked="true" /><Tag :id="`${targetId}-1`">
          Default Tag </Tag
        ><Button :id="`${targetId}-2`">确定</Button></Space
      >
      <UserGuide
        mode="popup"
        :mask="true"
        :visible="visible"
        :steps="steps"
        @change="(value: number) => console.log('current', value)"
        @next="() => console.log('next')"
        @prev="() => console.log('prev')"
        @finish="close"
        @skip="close"
      />
    </div>
  </ConfigProvider>
</template>
