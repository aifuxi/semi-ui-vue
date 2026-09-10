<script setup lang="ts">
import { List, ListItem } from '@aifuxi/semi-ui-vue/list';

const users = ['Alice', 'Bob'];
import '@aifuxi/semi-theme-default/list.css';
</script>

<template>
  <List :data-source="users" bordered>
    <template #item="{ item, index }">
      <ListItem :header="`${index + 1}.`" :main="item" />
    </template>
  </List>
</template>
