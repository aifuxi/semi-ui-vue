<script setup lang="ts">
import { shallowRef } from 'vue';
import { SideSheet } from './index';
import { Button } from '../button';
import { TextArea } from '../input';
const visible = shallowRef(false);
const text = shallowRef('');
</script>
<template>
  <Button @click="visible = true">Open</Button>
  <TextArea v-model="text" />
  <SideSheet :visible="visible" :mask="false" :disable-scroll="false" @cancel="visible = false">
    <p>Entered:</p>
    <p>{{ text }}</p>
  </SideSheet>
</template>
