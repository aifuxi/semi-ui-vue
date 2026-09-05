<script setup lang="ts">
import { useToast } from '@aifuxi/semi-ui-vue/toast';

const [toast, ToastHolder] = useToast();
const submit = () => toast.open({ content: 'Processing', duration: 0 });
import '@aifuxi/semi-theme-default/toast.css';
</script>

<template>
  <ToastHolder />
  <button type="button" @click="submit">Submit</button>
</template>
