<script setup lang="ts">
import { Transfer } from '@aifuxi/semi-ui-vue';

const data = [
  { key: 'design', label: 'Design', value: 'design' },
  { key: 'engineering', label: 'Engineering', value: 'engineering' },
  { key: 'product', label: 'Product', value: 'product' },
  { key: 'operations', label: 'Operations', value: 'operations' },
  { key: 'finance', label: 'Finance', value: 'finance', disabled: true },
  { key: 'support', label: 'Support', value: 'support' },
];
</script>

<template>
  <div class="transfer-scenario" data-testid="transfer-vue">
    <Transfer
      data-parity-target="transfer-root"
      :data-source="data"
      :default-value="['design', 'product']"
      :style="{ width: '568px', height: '360px' }"
    />
  </div>
</template>
