<script setup lang="ts">
import { h, provide } from 'vue';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { useToast } from '@aifuxi/semi-ui-vue/toast';
import ContextContent from './ContextContent.vue';
import { reachableContextKey } from './context-key';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/toast.css';

provide(reachableContextKey, 'Light');
const [toast, ToastHolder] = useToast();

function show() {
  toast.success({ duration: 0, content: h(ContextContent) });
}
</script>

<template>
  <div><Button @click="show">Hook Toast</Button></div>
  <ToastHolder />
</template>
