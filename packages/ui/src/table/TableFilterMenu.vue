<script setup lang="ts">
/* eslint-disable vue/require-default-prop -- recursive filter menu preserves absent custom renderer semantics. */
import type { VNodeChild } from 'vue';
import { Checkbox } from '../checkbox';
import { Dropdown, DropdownItem, DropdownMenu } from '../dropdown';
import { Radio } from '../radio';
import TableNodeRenderer from './TableNodeRenderer';
import type { TableFilter } from './types';

defineOptions({ name: 'TableFilterMenu' });
const props = withDefaults(
  defineProps<{
    filters: TableFilter[];
    level?: number;
    multiple: boolean;
    renderItem?: ((props?: Record<string, unknown>) => VNodeChild) | undefined;
    selected: unknown[];
  }>(),
  { level: 0 },
);
const emit = defineEmits<{
  toggle: [filter: TableFilter, event: MouseEvent];
}>();

function renderFilterItem(filter: TableFilter, eventHandler: (event: MouseEvent) => void) {
  return props.renderItem?.({
    checked: props.selected.includes(filter.value),
    filteredValue: props.selected,
    filterMultiple: props.multiple,
    level: props.level,
    onChange: eventHandler,
    text: filter.text,
    value: filter.value,
  });
}
</script>

<template>
  <DropdownMenu>
    <template v-for="(filter, index) in props.filters" :key="`${props.level}-${index}`">
      <Dropdown v-if="filter.children?.length" trigger="hover" position="right">
        <DropdownItem @click="emit('toggle', filter, $event)">
          <TableNodeRenderer
            v-if="props.renderItem"
            :content="renderFilterItem(filter, (event) => emit('toggle', filter, event))"
          />
          <Checkbox v-else-if="props.multiple" :checked="props.selected.includes(filter.value)">
            <TableNodeRenderer :content="filter.text" />
          </Checkbox>
          <Radio v-else :checked="props.selected.includes(filter.value)">
            <TableNodeRenderer :content="filter.text" />
          </Radio>
        </DropdownItem>
        <template #content>
          <TableFilterMenu
            :filters="filter.children"
            :level="props.level + 1"
            :multiple="props.multiple"
            :render-item="props.renderItem"
            :selected="props.selected"
            @toggle="(nestedFilter, event) => emit('toggle', nestedFilter, event)"
          />
        </template>
      </Dropdown>
      <DropdownItem v-else @click="emit('toggle', filter, $event)">
        <TableNodeRenderer
          v-if="props.renderItem"
          :content="renderFilterItem(filter, (event) => emit('toggle', filter, event))"
        />
        <Checkbox v-else-if="props.multiple" :checked="props.selected.includes(filter.value)">
          <TableNodeRenderer :content="filter.text" />
        </Checkbox>
        <Radio v-else :checked="props.selected.includes(filter.value)">
          <TableNodeRenderer :content="filter.text" />
        </Radio>
      </DropdownItem>
    </template>
  </DropdownMenu>
</template>
