<script setup lang="ts">
import { useTemplateRef, type VNodeChild } from 'vue';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Dropdown, DropdownMenu, DropdownItem } from '@aifuxi/semi-ui-vue/dropdown';
import { IconMoreStroked, IconForward } from '@aifuxi/semi-icons-vue';
import NodeContent from './NodeContent';
import '@aifuxi/semi-theme-default/dropdown.css';
defineProps<{ className?: string; defaultActions?: VNodeChild }>();
const root = useTemplateRef('root');
function getContainer() {
  return (root.value?.closest('.semi-chat-chatBox-wrap') as HTMLElement) ?? document.body;
}
</script>
<template>
  <span ref="root" :class="className"
    ><NodeContent :content="defaultActions" /><Dropdown
      trigger="click"
      position="top"
      :get-popup-container="getContainer"
      ><Button
        class="semi-chat-chatBox-action-btn"
        theme="borderless"
        type="tertiary"
        aria-label="More actions"
        ><template #icon><IconMoreStroked /></template></Button
      ><template #content
        ><DropdownMenu
          ><DropdownItem
            ><template #icon><IconForward /></template>Share</DropdownItem
          ></DropdownMenu
        ></template
      ></Dropdown
    ></span
  >
</template>
