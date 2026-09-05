<script setup lang="ts">
import { shallowRef } from 'vue';
import { Tabs, TabPane } from '@aifuxi/semi-ui-vue/tabs';
import { Dropdown, DropdownMenu, DropdownItem } from '@aifuxi/semi-ui-vue/dropdown';
import '@aifuxi/semi-theme-default/tabs.css';
import '@aifuxi/semi-theme-default/dropdown.css';
const activeKey = shallowRef('Tab-0');
const arrowStyle = {
  width: '32px',
  height: '32px',
  margin: '0 12px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '100%',
  background: 'rgba(var(--semi-grey-1), 1)',
  color: 'var(--semi-color-text)',
  cursor: 'pointer',
};
</script>

<template>
  <Tabs
    v-model:active-key="activeKey"
    :style="{ width: '50%', margin: '20px' }"
    type="card"
    collapsible
    ><template #arrow="{ items, position, click }"
      ><Dropdown
        ><template #content
          ><DropdownMenu
            ><DropdownItem
              v-for="item in items"
              :key="item.itemKey"
              @click="activeKey = item.itemKey"
              >{{ item.itemKey }}</DropdownItem
            ></DropdownMenu
          ></template
        >
        <div :style="arrowStyle" @click="click">
          {{ position === 'start' ? '←' : '→' }}
        </div></Dropdown
      ></template
    ><TabPane v-for="i in 10" :key="i - 1" :tab="`Tab-${i - 1}`" :item-key="`Tab-${i - 1}`"
      >Content of card tab {{ i - 1 }}</TabPane
    ></Tabs
  >
</template>
