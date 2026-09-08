<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/sidebar.css';
import { ref } from 'vue';
import {
  Annotation,
  type SidebarActiveKey,
  type SidebarAnnotationItem,
} from '@aifuxi/semi-ui-vue/sidebar';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { references } from './listData';
const visible = ref(true),
  activeKey = ref<SidebarActiveKey>('1'),
  clicked = ref('');
function click(_event: MouseEvent, item: SidebarAnnotationItem) {
  clicked.value = item.title ?? '';
}
</script>
<template>
  <ConfigProvider :locale="locale"
    ><div
      style="
        display: flex;
        height: 500px;
        border: 1px solid var(--semi-color-border);
        border-radius: 8px;
        overflow: hidden;
        box-sizing: border-box;
      "
    >
      <div style="flex: 1; padding: 20px">
        <Button @click="visible = !visible">{{ visible ? 'Close' : 'Show' }} references</Button
        ><output>{{ clicked }}</output>
      </div>
      <Annotation
        :default-size="{ width: 420 }"
        :visible="visible"
        :active-key="activeKey"
        :info="references"
        @cancel="visible = false"
        @change="activeKey = $event"
        @click="click"
      /></div
  ></ConfigProvider>
</template>
