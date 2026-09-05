<script setup lang="ts">
import { useToast } from '@aifuxi/semi-ui-vue/toast';

const [toast, ToastHolder] = useToast();

function submit() {
  toast.open({ content: '处理中', duration: 0 });
}
import '@aifuxi/semi-theme-default/toast.css';
</script>

<template>
  <ToastHolder />
  <button type="button" @click="submit">提交</button>
</template>
