<script setup lang="ts">
import { Input } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/input.css';
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
import { IconSearch } from '@aifuxi/semi-icons-vue';
</script>

<template>
  <div>
    <Input show-clear
      ><template #prefix><IconSearch></IconSearch></template
    ></Input>
    <br /><br />
    <Input prefix="Prefix" show-clear></Input>
    <br /><br />
    <Input show-clear
      ><template #suffix><IconSearch></IconSearch></template
    ></Input>
    <br /><br />
    <Input show-clear
      ><template #suffix
        ><Text strong type="secondary" :style="{ marginRight: '8px' }">Suffix</Text></template
      ></Input
    >
  </div>
</template>
