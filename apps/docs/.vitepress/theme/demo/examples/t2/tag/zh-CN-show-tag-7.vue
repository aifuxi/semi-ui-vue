<script setup lang="ts">
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
import IconAIFilledLevel1 from '@aifuxi/semi-icons-vue/icons/IconAIFilledLevel1';
import IconAIFilledLevel3 from '@aifuxi/semi-icons-vue/icons/IconAIFilledLevel3';
</script>

<template>
  <div style="display: flex; flex-direction: column; row-gap: 30px">
    <div
      style="
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 10px;
        width: fit-content;
      "
    >
      <Tag colorful type="solid" shape="circle" gradient>
        <template #prefixIcon><IconAIFilledLevel1 size="small" /></template>AI</Tag
      >
      <Tag colorful type="light" shape="circle" gradient>
        <template #prefixIcon><IconAIFilledLevel3 size="small" /></template>AI</Tag
      >
      <Tag colorful type="ghost" shape="circle" gradient>
        <template #prefixIcon><IconAIFilledLevel3 size="small" /></template>AI</Tag
      >
      <Tag colorful type="solid" shape="circle">
        <template #prefixIcon><IconAIFilledLevel1 size="small" /></template>AI</Tag
      >
      <Tag colorful type="light" shape="circle">
        <template #prefixIcon><IconAIFilledLevel1 size="small" /></template>AI</Tag
      >
      <Tag colorful type="ghost" shape="circle">
        <template #prefixIcon><IconAIFilledLevel1 size="small" /></template>AI</Tag
      >
    </div>
    <div
      style="
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 10px;
        width: fit-content;
      "
    >
      <Tag colorful type="solid" gradient>
        <template #prefixIcon><IconAIFilledLevel1 size="small" /></template>AI</Tag
      >
      <Tag colorful type="light" gradient>
        <template #prefixIcon><IconAIFilledLevel3 size="small" /></template>AI</Tag
      >
      <Tag colorful type="ghost" gradient>
        <template #prefixIcon><IconAIFilledLevel3 size="small" /></template>AI</Tag
      >
      <Tag colorful type="solid">
        <template #prefixIcon><IconAIFilledLevel1 size="small" /></template>AI</Tag
      >
      <Tag colorful type="light">
        <template #prefixIcon><IconAIFilledLevel1 size="small" /></template>AI</Tag
      >
      <Tag colorful type="ghost">
        <template #prefixIcon><IconAIFilledLevel1 size="small" /></template>AI</Tag
      >
    </div>
  </div>
</template>
