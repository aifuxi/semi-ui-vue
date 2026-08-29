<script setup lang="ts">
import { computed, inject, type CSSProperties } from 'vue';

import { configContextKey, type ConfigDirection } from '../config-provider';

import NotificationNotice from './NotificationNotice.vue';
import { NotificationStore } from './notification-store';
import { NOTIFICATION_POSITIONS, type NotificationEntry, type NotificationPosition } from './types';

defineOptions({ name: 'NotificationHost' });
const props = defineProps<{ store: NotificationStore }>();
const config = inject(configContextKey, undefined);

interface PositionedNotice {
  direction: ConfigDirection;
  entry: NotificationEntry;
}

const grouped = computed<Record<NotificationPosition, PositionedNotice[]>>(() => {
  const groups: Record<NotificationPosition, PositionedNotice[]> = {
    top: [],
    topLeft: [],
    topRight: [],
    bottom: [],
    bottomLeft: [],
    bottomRight: [],
  };
  const combined = [...props.store.state.notices, ...props.store.state.removedItems].filter(
    (entry, index, entries) =>
      entries.findIndex((candidate) => candidate.id === entry.id) === index,
  );
  for (const entry of combined) {
    const direction = entry.direction ?? config?.value.direction ?? 'ltr';
    const position = entry.position ?? (direction === 'rtl' ? 'topLeft' : 'topRight');
    groups[position].push({ direction, entry });
  }
  return groups;
});

function listStyle(items: PositionedNotice[]): CSSProperties {
  const first = items[0]?.entry;
  if (!first) return {};
  const style: CSSProperties = {};
  for (const property of ['top', 'left', 'bottom', 'right'] as const) {
    const value = first[property];
    if (value !== undefined) style[property] = typeof value === 'number' ? `${value}px` : value;
  }
  return style;
}

function animationClass(
  entry: NotificationEntry,
  position: NotificationPosition,
): string | undefined {
  if (entry.phase === 'stable') return undefined;
  return `semi-notification-notice-animation-${entry.phase === 'leave' ? 'hide' : 'show'}_${position}`;
}

function handleAnimationEnd(entry: NotificationEntry): void {
  if (entry.phase === 'leave') props.store.finishRemove(entry.id);
  else props.store.finishEnter(entry.id);
}

function handleRemove(id: string): void {
  props.store.remove(id);
}
</script>

<template>
  <template v-for="position in NOTIFICATION_POSITIONS" :key="position">
    <div
      v-if="grouped[position].length"
      class="semi-notification-list"
      :placement="position"
      :style="listStyle(grouped[position])"
    >
      <NotificationNotice
        v-for="item in grouped[position]"
        :key="item.entry.id"
        :animation-class="animationClass(item.entry, position)"
        :direction="item.direction"
        :entry="item.entry"
        @animation-end="handleAnimationEnd(item.entry)"
        @remove="handleRemove"
      />
    </div>
  </template>
</template>
