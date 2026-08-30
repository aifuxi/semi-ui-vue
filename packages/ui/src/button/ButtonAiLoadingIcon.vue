<script setup lang="ts">
import { useId } from 'vue';

const gradientId = `semi-ai-loading-${useId().replaceAll(':', '')}`;
</script>

<template>
  <span role="img" aria-label="ai_loading" class="semi-icon semi-icon-default semi-icon-ai_loading">
    <svg
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      focusable="false"
      aria-hidden="true"
    >
      <path
        d="M15.1112 7.99978C15.1112 4.07242 11.9275 0.888672 8.00009 0.888672C5.18219 0.888672 2.74711 2.52771 1.59619 4.90445"
        :stroke="`url(#${gradientId})`"
        stroke-width="1.77778"
        stroke-linecap="round"
      />
      <defs>
        <linearGradient
          :id="gradientId"
          x1="16"
          y1="8"
          x2="2.68594"
          y2="11.022"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="rgba(233,69,255)" />
          <stop offset="0.3" stop-color="rgba(166,71,255)" />
          <stop offset="0.6" stop-color="rgba(107,97,255)" />
          <stop offset="1" stop-color="rgba(46,140,255)" stop-opacity="0" />
        </linearGradient>
      </defs>
    </svg>
  </span>
</template>
