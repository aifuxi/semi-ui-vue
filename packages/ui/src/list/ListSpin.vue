<script setup lang="ts">
import { useId } from 'vue';

defineOptions({ name: 'ListSpin' });
defineProps<{ spinning: boolean }>();
const gradientId = `linearGradient-semi-list-spin-${useId()}`;
</script>

<template>
  <div class="semi-spin semi-spin-large semi-spin-block" :class="{ 'semi-spin-hidden': !spinning }">
    <div v-if="spinning" class="semi-spin-wrapper">
      <svg
        width="48"
        height="48"
        viewBox="0 0 36 36"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        data-icon="spin"
      >
        <defs>
          <linearGradient :id="gradientId" x1="0%" y1="100%" x2="100%" y2="100%">
            <stop stop-color="currentColor" stop-opacity="0" offset="0%" />
            <stop stop-color="currentColor" stop-opacity="0.50" offset="39.9430698%" />
            <stop stop-color="currentColor" offset="100%" />
          </linearGradient>
        </defs>
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <rect fill-opacity="0.01" fill="none" x="0" y="0" width="36" height="36" />
          <path
            d="M34,18 C34,9.163444 26.836556,2 18,2 C11.6597233,2 6.18078805,5.68784135 3.59122325,11.0354951"
            :stroke="`url(#${gradientId})`"
            stroke-width="4"
            stroke-linecap="round"
          />
        </g>
      </svg>
    </div>
    <div class="semi-spin-children" x-semi-prop="children"><slot /></div>
  </div>
</template>
