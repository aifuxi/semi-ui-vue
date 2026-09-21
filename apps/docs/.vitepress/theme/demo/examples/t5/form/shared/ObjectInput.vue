<script setup lang="ts">
import { Input } from '@aifuxi/semi-ui-vue/input';
import { Select } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/input.css';
import '@aifuxi/semi-theme-default/select.css';
defineOptions({ inheritAttrs: false });
const props = defineProps<{
  value?: { name?: string; role?: string };
  labels: { name: string; role: string; development: string; design: string };
  validateStatus?: 'default' | 'error' | 'warning' | 'success';
}>();
const emit = defineEmits<{ change: [value: { name?: string; role?: string }] }>();
function update(key: 'name' | 'role', value: unknown) {
  emit('change', { ...props.value, [key]: String(value ?? '') });
}
</script>
<template>
  <div class="custom-field">
    <Input
      :prefix="labels.name"
      :aria-label="labels.name"
      :value="value?.name"
      :validate-status="validateStatus === 'success' ? 'default' : (validateStatus ?? 'default')"
      style="width: 180px"
      @change="update('name', $event)"
    />
    <Select
      :prefix="labels.role"
      :aria-label="labels.role"
      :value="value?.role"
      :validate-status="validateStatus === 'success' ? 'default' : (validateStatus ?? 'default')"
      :option-list="[
        { value: 'rd', label: labels.development },
        { value: 'UED', label: labels.design },
      ]"
      style="width: 200px"
      @change="update('role', $event)"
    />
  </div>
</template>
<style scoped>
.custom-field {
  display: flex;
  gap: 12px;
}
</style>
