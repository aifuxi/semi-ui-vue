<script setup lang="ts">
import ToastNotice from './ToastNotice.vue';
import type { ToastStore } from './toast-store';

defineOptions({ name: 'ToastContextList' });
const props = defineProps<{ store: ToastStore }>();

// Keep the class receiver: `ToastStore.remove` reads `this.foundation`.
function remove(id: string): void {
  props.store.remove(id);
}
</script>

<template>
  <!-- The pinned hook holder renders one bare Toast per entry in place (HookToast) and
       nothing while empty; only the imperative host owns wrapper/innerWrapper. -->
  <ToastNotice
    v-for="entry in props.store.state.list"
    :key="entry.id"
    :entry="entry"
    :stack="Boolean(entry.stack)"
    :stack-expanded="false"
    @remove="remove"
  />
</template>
