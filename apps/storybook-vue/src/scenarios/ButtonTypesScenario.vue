<script setup lang="ts">
import { shallowRef } from 'vue';
import { Button, type ButtonType } from '@aifuxi/semi-ui-vue/button';
import { buttonReview } from '../../../../packages/test-infra/src/root-theme-review';

/** 仅显式审查 query 会覆盖按钮 props，既有默认对照保持原样。 */
const review = buttonReview(window.location.search);

const BUTTON_TYPES: readonly { type: ButtonType; label: string }[] = [
  { type: 'primary', label: '主要按钮' },
  { type: 'secondary', label: '次要按钮' },
  { type: 'tertiary', label: '第三按钮' },
  { type: 'warning', label: '警告按钮' },
  { type: 'danger', label: '危险按钮' },
];

const lastAction = shallowRef('尚未触发');
</script>

<template>
  <div class="button-types-scenario" data-testid="button-types-vue">
    <div class="button-types-scenario__row">
      <Button
        v-for="item in BUTTON_TYPES"
        :key="item.type"
        :type="item.type"
        v-bind="review"
        :data-parity-target="`button-${item.type}`"
        @click="lastAction = item.label"
      >
        {{ item.label }}
      </Button>
    </div>
    <output class="scenario-action-output" aria-live="polite"> 最近操作：{{ lastAction }} </output>
  </div>
</template>
