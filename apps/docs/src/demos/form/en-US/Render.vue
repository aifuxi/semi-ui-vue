<script setup lang="ts">
import { Form } from '@aifuxi/semi-ui-vue/form';
import RenderFields from '../shared/RenderFields.vue';
import { h } from 'vue';
import type { FormSlotProps } from '@aifuxi/semi-ui-vue/form';
const renderFields = (scope: FormSlotProps) => h(RenderFields, scope);
import '@aifuxi/semi-theme-default/form.css';
</script>
<template>
  <Form layout="horizontal" :render="renderFields" />
</template>
