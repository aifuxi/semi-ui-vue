<script setup lang="ts">
import { Dropdown } from '@aifuxi/semi-ui-vue/dropdown';
import '@aifuxi/semi-theme-default/dropdown.css';
</script>

<template>
  <Dropdown>
    <button>更多操作</button>
    <template #content>
      <Dropdown.Menu>
        <Dropdown.Title>常用操作</Dropdown.Title>
        <Dropdown.Item>编辑</Dropdown.Item>
        <Dropdown.Item disabled>删除</Dropdown.Item>
      </Dropdown.Menu>
    </template>
  </Dropdown>
</template>
