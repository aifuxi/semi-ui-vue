<script setup lang="ts">
import { TagInput } from '@aifuxi/semi-ui-vue/tag-input';
import '@aifuxi/semi-theme-default/tag-input.css';
import { IconVigoLogo, IconGift } from '@aifuxi/semi-icons-vue';
</script>

<template>
  <div>
    <TagInput
      ><template #prefix><IconVigoLogo></IconVigoLogo></template
    ></TagInput>
    <br /><br />
    <TagInput prefix="Prefix"></TagInput>
    <br /><br />
    <TagInput
      ><template #suffix><IconGift></IconGift></template
    ></TagInput>
    <br /><br />
    <TagInput suffix="Suffix"></TagInput>
  </div>
</template>
