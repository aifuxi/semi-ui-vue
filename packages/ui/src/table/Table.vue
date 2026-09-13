<script setup lang="ts">
import { camelize, getCurrentInstance, useSlots, useTemplateRef } from 'vue';

import TableCore from './TableCore.vue';
import type { TableEmits, TableExposed, TableProps, TableSlots } from './types';

type RecordType = Record<string, unknown>;

defineOptions({ name: 'Table', inheritAttrs: false });
const props = withDefaults(defineProps<TableProps<RecordType>>(), { expandIcon: undefined });
const emit = defineEmits<TableEmits<RecordType>>();
defineSlots<TableSlots<RecordType>>();

const instance = getCurrentInstance();
const slots = useSlots();
const core = useTemplateRef<TableExposed<RecordType>>('core');
const events = new Set<string>([
  'change',
  'expand',
  'expandedRowsChange',
  'pageChange',
  'select',
  'selectAll',
  'selectChange',
] satisfies Array<keyof TableEmits<RecordType>>);
const reservedProps = new Set(['key', 'ref', 'ref_key', 'ref_for']);

function isDeclaredListener(key: string): boolean {
  if (!/^on[^a-z]/.test(key)) return false;
  const name = key.slice(2).replace(/Once$/, '');
  return events.has(camelize(name.charAt(0).toLowerCase() + name.slice(1)));
}

function forwardedProps(): Record<string, unknown> {
  // Read during every render: normalized Boolean defaults must not turn absent
  // caller props into explicit values in the newly mounted core.
  return Object.fromEntries(
    Object.entries(instance?.vnode.props ?? {}).filter(
      ([key]) => !reservedProps.has(key) && !key.startsWith('onVnode') && !isDeclaredListener(key),
    ),
  );
}

defineExpose<TableExposed<RecordType>>({
  getCurrentPageData: () => core.value?.getCurrentPageData() ?? [],
});
</script>

<template>
  <TableCore
    v-bind="forwardedProps()"
    :key="props.resizable ? 'resizable' : 'normal'"
    ref="core"
    @change="(info) => emit('change', info)"
    @expand="(expanded, record, event) => emit('expand', expanded!, record!, event)"
    @expanded-rows-change="(rows) => emit('expandedRowsChange', rows!)"
    @page-change="(page, size) => emit('pageChange', page, size)"
    @select="(record, selected, rows, event) => emit('select', record, selected, rows, event)"
    @select-all="(selected, rows, changedRows) => emit('selectAll', selected, rows, changedRows)"
    @select-change="(keys, rows) => emit('selectChange', keys, rows)"
  >
    <template v-if="slots.default" #default><slot /></template>
    <template v-if="slots.cell" #cell="slotProps"><slot name="cell" v-bind="slotProps" /></template>
    <template v-if="slots.empty" #empty><slot name="empty" /></template>
    <template v-if="slots.expandedRow" #expandedRow="slotProps">
      <slot name="expandedRow" v-bind="slotProps" />
    </template>
    <template v-if="slots.footer" #footer="slotProps"
      ><slot name="footer" v-bind="slotProps"
    /></template>
    <template v-if="slots.groupSection" #groupSection="slotProps">
      <slot name="groupSection" v-bind="slotProps" />
    </template>
    <template v-if="slots.headerCell" #headerCell="slotProps">
      <slot name="headerCell" v-bind="slotProps" />
    </template>
    <template v-if="slots.pagination" #pagination="slotProps">
      <slot name="pagination" v-bind="slotProps" />
    </template>
    <template v-if="slots.title" #title="slotProps"
      ><slot name="title" v-bind="slotProps"
    /></template>
  </TableCore>
</template>
