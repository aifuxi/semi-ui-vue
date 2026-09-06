<script setup lang="ts">
import { h } from 'vue';
import { IconUser, IconStar, IconApps } from '@aifuxi/semi-icons-vue';
import { Form } from '@aifuxi/semi-ui-vue/form';
import '@aifuxi/semi-theme-default/form.css';
import { Nav } from '@aifuxi/semi-ui-vue/navigation';
import '@aifuxi/semi-theme-default/navigation.css';
const items = [
  { itemKey: 'user', text: 'Users', icon: h(IconUser) },
  { itemKey: 'union', text: 'Activity', icon: h(IconStar) },
];
const header = {
  logo: h(IconApps, { style: { height: '36px', fontSize: '36px' } }),
  text: 'Component Platform',
};
</script>
<template>
  <h5>Form</h5>
  <Form layout="horizontal"
    ><Form.Input
      field="UserName"
      :label="{ text: 'Role', optional: true }"
      :style="{ width: '200px' }"
  /></Form>
  <h5>Navigation</h5>
  <Nav
    :body-style="{ height: '320px' }"
    :items="items"
    :header="header"
    :footer="{ collapseButton: true }"
  />
</template>
