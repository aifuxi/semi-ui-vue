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
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
const visible = shallowRef(false);

const targetId = useId();
const steps: UserGuideStepItem[] = [
  {
    target: () => document.getElementById(`${targetId}-0`),
    title: 'Beginner’s Guide',
    description: 'Hello AIFUXI!',
  },
  {
    target: () => document.getElementById(`${targetId}-1`),
    title: 'New Padding',
    description: 'This is 10px padding',
  },
  {
    target: () => document.getElementById(`${targetId}-2`),
    title: 'Change Padding',
    description: 'We change the Padding to 15px',
    spotlightPadding: 15,
  },
];
function close() {
  visible.value = false;
}
</script>
<template>
  <ConfigProvider :locale="locale">
    <div>
      <Button @click="visible = true">Start Guide</Button>
      <br /><br /><Space
        ><Switch :id="`${targetId}-0`" :default-checked="true" /><Tag :id="`${targetId}-1`">
          Default Tag </Tag
        ><Button :id="`${targetId}-2`">Confirm</Button></Space
      >
      <UserGuide
        mode="popup"
        :mask="true"
        :visible="visible"
        :steps="steps"
        :spotlight-padding="10"
        @finish="close"
        @skip="close"
      />
    </div>
  </ConfigProvider>
</template>
