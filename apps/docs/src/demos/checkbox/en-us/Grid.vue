<script setup lang="ts">
import { Checkbox, CheckboxGroup } from '@aifuxi/semi-ui-vue/checkbox';
import '@aifuxi/semi-theme-default/checkbox.css';
import { Row, Col } from '@aifuxi/semi-ui-vue/grid';
import '@aifuxi/semi-theme-default/grid.css';
</script>

<template>
  <CheckboxGroup style="width: 100%" aria-label="CheckboxGroup demo"
    ><Row
      ><Col v-for="value in ['A', 'B', 'C', 'D', 'E']" :key="value" :span="8"
        ><Checkbox :value="value">{{ value }}</Checkbox></Col
      ></Row
    ></CheckboxGroup
  >
</template>
