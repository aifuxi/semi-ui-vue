<script setup lang="ts">
import { shallowRef, useId } from 'vue';
import { UserGuide } from '@aifuxi/semi-ui-vue/user-guide';
import '@aifuxi/semi-theme-default/user-guide.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
const visible = shallowRef(false);
const targetId = useId();
const steps = [
  {
    target: () => document.getElementById(targetId),
    title: 'No Mask',
    description: 'Hello AIFUXI!',
  },
];
</script>
<template>
  <ConfigProvider :locale="locale">
    <Button :id="targetId" @click="visible = true">Start Guide</Button>
    <UserGuide
      mode="popup"
      :mask="false"
      :visible="visible"
      :steps="steps"
      @finish="visible = false"
      @skip="visible = false"
    />
  </ConfigProvider>
</template>
