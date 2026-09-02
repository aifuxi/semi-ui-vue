<script setup lang="ts">
import { shallowRef } from 'vue';
import { Select, SelectOption, SelectOptionGroup } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/select.css';

const product = shallowRef('douyin');
const regions = shallowRef<Array<string | number>>(['china', 'singapore']);
</script>

<template>
  <div>
    <p>
      Product<br />
      <Select v-model="product" aria-label="Product" show-clear style="width: 220px">
        <SelectOption value="douyin">Douyin</SelectOption>
        <SelectOption value="capcut">CapCut</SelectOption>
        <SelectOption value="xigua" disabled>Xigua Video</SelectOption>
      </Select>
    </p>
    <p>
      Regions<br />
      <Select
        v-model="regions"
        aria-label="Regions"
        multiple
        filter
        :max="4"
        :max-tag-count="2"
        search-placeholder="Filter regions"
        style="width: min(360px, 100%)"
      >
        <SelectOptionGroup label="Asia">
          <SelectOption value="china">China</SelectOption>
          <SelectOption value="singapore">Singapore</SelectOption>
          <SelectOption value="japan">Japan</SelectOption>
        </SelectOptionGroup>
        <SelectOptionGroup label="Europe">
          <SelectOption value="germany">Germany</SelectOption>
          <SelectOption value="france">France</SelectOption>
        </SelectOptionGroup>
      </Select>
    </p>
  </div>
</template>
