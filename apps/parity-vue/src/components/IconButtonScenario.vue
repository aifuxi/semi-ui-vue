<script setup lang="ts">
import { shallowRef } from 'vue';
import { IconButton } from '@aifuxi/semi-ui-vue';

const lastAction = shallowRef('尚未触发');

function normalizeFill(fill: string | readonly string[] | undefined): string | undefined {
  return typeof fill === 'string' ? fill : fill?.join(',');
}
</script>

<template>
  <div class="icon-button-scenario" data-testid="icon-button-vue">
    <div class="icon-button-scenario__row">
      <IconButton
        aria-label="收藏"
        data-parity-target="icon-button-default"
        @click="lastAction = '收藏'"
      >
        <template #icon="{ fill }">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
            data-icon="star"
            :fill="normalizeFill(fill)"
          >
            <path
              d="M8 2.2l1.75 3.55 3.92.57-2.84 2.77.67 3.91L8 11.15 4.5 13l.67-3.91L2.33 6.32l3.92-.57L8 2.2z"
              fill="currentColor"
              stroke="none"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </template>
      </IconButton>

      <IconButton
        icon-position="right"
        no-horizontal-padding="left"
        data-parity-target="icon-button-text"
      >
        <template #icon="{ fill }">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
            data-icon="arrow"
            :fill="normalizeFill(fill)"
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </template>
        展开选项
      </IconButton>

      <IconButton
        size="small"
        theme="solid"
        type="secondary"
        aria-label="删除"
        data-parity-target="icon-button-small"
      >
        <template #icon="{ fill }">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
            data-icon="delete"
            :fill="normalizeFill(fill)"
          >
            <path
              d="M4 5h8M6 5V3h4v2m-5 0 .6 8h4.8l.6-8"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </template>
      </IconButton>

      <IconButton
        disabled
        aria-label="不可删除"
        data-parity-target="icon-button-disabled"
        @click="lastAction = '不可删除'"
      >
        <template #icon="{ fill }">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
            data-icon="delete"
            :fill="normalizeFill(fill)"
          >
            <path
              d="M4 5h8M6 5V3h4v2m-5 0 .6 8h4.8l.6-8"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </template>
      </IconButton>
    </div>

    <div class="icon-button-scenario__row">
      <IconButton loading aria-label="正在保存" data-parity-target="icon-button-loading" />
      <IconButton
        loading
        theme="solid"
        type="tertiary"
        aria-label="AI 加载"
        data-parity-target="icon-button-ai-loading"
      />
      <IconButton
        colorful
        theme="light"
        type="primary"
        aria-label="多彩收藏"
        data-parity-target="icon-button-colorful"
      >
        <template #icon="{ fill }">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
            data-icon="star"
            :fill="normalizeFill(fill)"
          >
            <path
              d="M8 2.2l1.75 3.55 3.92.57-2.84 2.77.67 3.91L8 11.15 4.5 13l.67-3.91L2.33 6.32l3.92-.57L8 2.2z"
              fill="currentColor"
              stroke="none"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </template>
      </IconButton>
    </div>

    <output class="scenario-action-output" aria-live="polite"> 最近操作：{{ lastAction }} </output>
  </div>
</template>
