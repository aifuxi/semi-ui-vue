<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
const types = ['primary', 'secondary', 'tertiary', 'warning', 'danger'] as const;
</script>

<template>
  <div>
    <div>
      <ul style="list-style: none; display: flex; margin: 0; padding: 0">
        <li v-for="type in types" :key="type" style="margin: 10px">
          <Button theme="light" :type="type"
            ><template v-for="(part, index) in ['light', ' ', type]" :key="index">{{
              part
            }}</template></Button
          >
        </li>
      </ul>
    </div>
  </div>
</template>
