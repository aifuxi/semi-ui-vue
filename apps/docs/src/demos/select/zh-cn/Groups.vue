<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { SelectOption } from '@aifuxi/semi-ui-vue/select';
import { SelectOptionGroup } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
</script>
<template>
  <div>
    <Select placeholder="" :style="{ width: '180px' }" filter>
      <SelectOptionGroup label="Asia">
        <SelectOption value="a-1">China</SelectOption>
        <SelectOption value="a-2">Korea</SelectOption>
      </SelectOptionGroup>
      <SelectOptionGroup label="Europe">
        <SelectOption value="b-1">Germany</SelectOption>
        <SelectOption value="b-2">France</SelectOption>
      </SelectOptionGroup>
      <SelectOptionGroup label="South America">
        <SelectOption value="c-1">Peru</SelectOption>
      </SelectOptionGroup>
    </Select>
  </div>
</template>
