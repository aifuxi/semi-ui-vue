<script setup lang="ts">
/* eslint-disable vue/require-default-prop -- recursive filter menu preserves absent custom renderer semantics. */
import { defineComponent, h, isVNode, type PropType, type VNodeChild } from 'vue';
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

const FilterMenuItem = defineComponent({
  props: { filter: { type: Object as PropType<TableFilter>, required: true } },
  setup(itemProps) {
    return () => {
      const choice = itemProps.filter;
      const checked = props.selected.includes(choice.value);
      const onChange = (event: MouseEvent) => emit('toggle', choice, event);
      const custom = props.renderItem?.({
        checked,
        filteredValue: props.selected,
        filterMultiple: props.multiple,
        level: props.level,
        onChange,
        text: choice.text,
        value: choice.value,
      });
      // A custom Dropdown.Item is the menu item itself, not content of another item.
      if (isVNode(custom)) return custom;
      const content = () => h(TableNodeRenderer, { content: choice.text });
      return h(DropdownItem, { onClick: onChange }, () =>
        props.multiple ? h(Checkbox, { checked }, content) : h(Radio, { checked }, content),
      );
    };
  },
});
</script>

<template>
  <DropdownMenu>
    <template v-for="(option, index) in props.filters" :key="`${props.level}-${index}`">
      <Dropdown v-if="option.children?.length" trigger="hover" position="right">
        <FilterMenuItem :filter="option" />
        <template #content>
          <TableFilterMenu
            :filters="option.children"
            :level="props.level + 1"
            :multiple="props.multiple"
            :render-item="props.renderItem"
            :selected="props.selected"
            @toggle="(nestedFilter, event) => emit('toggle', nestedFilter, event)"
          />
        </template>
      </Dropdown>
      <FilterMenuItem v-else :filter="option" />
    </template>
    <slot v-if="props.level === 0" name="footer" />
  </DropdownMenu>
</template>
