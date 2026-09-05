<script setup lang="ts">
import { Dropdown } from '@aifuxi/semi-ui-vue/dropdown';
import '@aifuxi/semi-theme-default/dropdown.css';
</script>

<template>
  <Dropdown>
    <button>More actions</button>
    <template #content>
      <Dropdown.Menu>
        <Dropdown.Title>Common actions</Dropdown.Title>
        <Dropdown.Item>Edit</Dropdown.Item>
        <Dropdown.Item disabled>Delete</Dropdown.Item>
      </Dropdown.Menu>
    </template>
  </Dropdown>
</template>
