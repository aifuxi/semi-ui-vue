<script setup lang="ts">
import { IconTick } from '@workspace/icons';
import { computed, shallowRef } from 'vue';

import Tooltip from '../tooltip/Tooltip.vue';
import TabsNodeRenderer from './TabsNodeRenderer';
import type { PlainTab, TabsDropdownOptions } from './types';

const props = withDefaults(
  defineProps<{
    activeKey: string;
    className?: string | undefined;
    items: PlainTab[];
    options?: TabsDropdownOptions | undefined;
  }>(),
  { className: '', options: () => ({}) },
);
const emit = defineEmits<{ select: [itemKey: string, event: MouseEvent] }>();
const visible = shallowRef(false);
const trigger = computed(() => props.options.trigger ?? 'hover');
const position = computed(() => props.options.position ?? 'bottomLeft');

function select(item: PlainTab, event: MouseEvent): void {
  if (item.disabled) return;
  visible.value = false;
  emit('select', item.itemKey, event);
}
</script>

<template>
  <Tooltip
    v-model:visible="visible"
    :class="className"
    click-to-hide
    click-trigger-to-hide
    disable-focus-listener
    :motion="false"
    :position="position"
    prefix-cls="semi-dropdown"
    :show-arrow="false"
    :spacing="4"
    :trigger="trigger"
  >
    <template #content>
      <div class="semi-dropdown" :style="options.style">
        <div class="semi-dropdown-content" x-semi-prop="render">
          <ul aria-orientation="vertical" class="semi-dropdown-menu" role="menu">
            <li
              v-for="item in items"
              :key="item.itemKey"
              :aria-disabled="item.disabled ? 'true' : 'false'"
              :class="[
                'semi-dropdown-item',
                'semi-dropdown-item-withTick',
                item.itemKey === activeKey ? 'semi-dropdown-item-active' : undefined,
                item.disabled ? 'semi-dropdown-item-disabled' : undefined,
              ]"
              role="menuitem"
              tabindex="-1"
              @click="select(item, $event)"
            >
              <IconTick
                :style="item.itemKey === activeKey ? undefined : { color: 'transparent' }"
              />
              <div v-if="item.icon" class="semi-dropdown-item-icon">
                <TabsNodeRenderer :content="item.icon" />
              </div>
              <TabsNodeRenderer :content="item.tab" />
            </li>
          </ul>
        </div>
      </div>
    </template>
    <slot />
  </Tooltip>
</template>
