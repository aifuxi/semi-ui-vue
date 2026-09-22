<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
import '@aifuxi/semi-theme-default/modal.css';
import { useModal } from '@aifuxi/semi-ui-vue/modal';
import enGB from '@aifuxi/semi-ui-vue/locale/source/en_GB';
const [modal, ContextHolder] = useModal();
const config = {
  title: 'This is a success message',
  content: 'Context consumer',
};
</script>
<template>
  <ConfigProvider :locale="enGB"
    ><div><Button @click="modal.confirm(config)">Confirm Modal</Button></div>
    <ContextHolder
  /></ConfigProvider>
</template>
