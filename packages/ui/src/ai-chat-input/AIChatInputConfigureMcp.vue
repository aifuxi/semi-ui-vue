<script setup lang="ts">
import { computed, inject, useAttrs } from 'vue';

import Button from '../button/Button.vue';
import { Dropdown, DropdownItem, DropdownMenu } from '../dropdown';
import { configContextKey } from '../config-provider';
import type { VNodeChild } from 'vue';

export interface McpOption {
  value: string;
  label: string;
  icon?: VNodeChild;
  [key: string]: unknown;
}

defineOptions({ name: 'AIChatInputConfigureMcp', inheritAttrs: false });
const props = withDefaults(
  defineProps<{
    options?: McpOption[];
    num?: number;
    showConfigure?: boolean;
    className?: string;
  }>(),
  { options: () => [], num: 0, showConfigure: true, className: '' },
);
const emit = defineEmits<{ configureButtonClick: [] }>();
const attrs = useAttrs();
const config = inject(configContextKey, undefined);
const locale = computed(() => {
  const fallback =
    config?.value.locale.code === 'en-US'
      ? { selected: 'Selected ${count} items', configure: 'Configure' }
      : { selected: '已选 ${count} 个', configure: '配置' };
  return {
    ...fallback,
    ...(config?.value.locale.AIChatInput as Partial<typeof fallback> | undefined),
  };
});
</script>

<template>
  <Dropdown v-bind="attrs" :class="['semi-aiChatInput-footer-configure-mcp', props.className]">
    <Button
      theme="outline"
      type="tertiary"
      class="semi-aiChatInput-footer-configure-mcp-trigger"
      @click.stop
    >
      MCP · {{ props.options.length || props.num }}
    </Button>
    <template #content>
      <div class="semi-aiChatInput-footer-configure-mcp-header">
        <span class="semi-aiChatInput-footer-configure-mcp-header-title">
          {{ locale.selected.replace('${count}', String(props.options.length || props.num)) }}
        </span>
        <Button
          v-if="props.showConfigure"
          theme="outline"
          class="semi-aiChatInput-footer-configure-mcp-header-config"
          @click.stop="emit('configureButtonClick')"
        >
          {{ locale.configure }}
        </Button>
      </div>
      <slot>
        <DropdownMenu>
          <DropdownItem v-for="item in props.options" :key="item.value" :icon="item.icon">
            {{ item.label }}
          </DropdownItem>
        </DropdownMenu>
      </slot>
    </template>
  </Dropdown>
</template>
