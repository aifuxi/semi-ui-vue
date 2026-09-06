<script setup lang="ts">
import { Button, ButtonGroup } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
const types = ['primary', 'secondary', 'tertiary', 'warning', 'danger'] as const;
</script>

<template>
  <div style="display: flex">
    <div v-for="type in types" :key="type" style="margin-right: 10px">
      <ButtonGroup :type="type" aria-label="Operate button group"
        ><Button>Copy</Button><Button>Search</Button><Button>Cut</Button></ButtonGroup
      >
    </div>
  </div>
</template>
