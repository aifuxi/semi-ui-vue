<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/config-provider.css';
import { Popconfirm } from '@aifuxi/semi-ui-vue/popconfirm';
import '@aifuxi/semi-theme-default/popconfirm.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Toast } from '@aifuxi/semi-ui-vue/toast';
import '@aifuxi/semi-theme-default/toast.css';
const onConfirm = () => {
  Toast.success('Confirm save!');
};
const onCancel = () => {
  Toast.warning('Cancel save!');
};
</script>
<template>
  <ConfigProvider :locale="enUS"
    ><Popconfirm
      title="Are you sure you want to save this modification?"
      content="This modification will be irreversible"
      @confirm="onConfirm"
      @cancel="onCancel"
    >
      <Button> Save</Button>
    </Popconfirm></ConfigProvider
  >
</template>
