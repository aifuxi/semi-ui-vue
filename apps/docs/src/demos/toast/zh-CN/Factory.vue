<script setup lang="ts">
import { onBeforeUnmount, useTemplateRef } from 'vue';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Toast, ToastFactory } from '@aifuxi/semi-ui-vue/toast';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/toast.css';

const container = useTemplateRef<HTMLDivElement>('container');
const ToastInCustomContainer = ToastFactory.create({
  getPopupContainer: () => container.value,
});

onBeforeUnmount(() => ToastInCustomContainer.destroyAll());
</script>

<template>
  <div>
    <Button @click="() => Toast.info('Toast')">Default Toast</Button>
    <br />
    <br />
    <Button @click="() => ToastInCustomContainer.info('Toast in some container')">
      Toast in custom container
    </Button>
    <div ref="container" data-toast-container>custom container</div>
  </div>
</template>
