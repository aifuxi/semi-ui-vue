<script setup lang="ts">
import { shallowRef, useId } from 'vue';
import { UserGuide, type UserGuideStepItem } from '@aifuxi/semi-ui-vue/user-guide';
import '@aifuxi/semi-theme-default/user-guide.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
const visible = shallowRef(false);

const targetId = useId();
const steps: UserGuideStepItem[] = [
  {
    target: () => document.getElementById(targetId),
    title: 'Beginner’s Guide',
    description: 'Hello AIFUXI!',
    position: 'top',
  },
  {
    target: () => document.getElementById(targetId),
    title: 'New Position',
    description: 'This is Right Position',
    position: 'right',
  },
  {
    target: () => document.getElementById(targetId),
    title: 'Hide Arrow',
    description: 'We hide the arrow',
    position: 'bottom',
    showArrow: false,
  },
];
function close() {
  visible.value = false;
}
</script>
<template>
  <ConfigProvider :locale="locale">
    <div>
      <Button :id="targetId" @click="visible = true">Start Guide</Button>

      <UserGuide
        mode="popup"
        :mask="true"
        :visible="visible"
        :steps="steps"
        @finish="close"
        @skip="close"
      />
    </div>
  </ConfigProvider>
</template>
