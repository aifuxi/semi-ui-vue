<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import { Button, Tooltip, type TooltipPosition } from '@aifuxi/semi-ui-vue';

const host = ref<HTMLElement | null>(null);
const clickVisible = shallowRef(false);
const lastChange = shallowRef('none');
const placements: Array<{ position: TooltipPosition; label: string }> = [
  { position: 'top', label: 'Top' },
  { position: 'right', label: 'Right' },
  { position: 'bottom', label: 'Bottom' },
  { position: 'left', label: 'Left' },
];

function getPopupContainer(): HTMLElement {
  return host.value ?? document.body;
}

function handleClickVisibleChange(visible: boolean): void {
  clickVisible.value = visible;
  lastChange.value = `click:${String(visible)}`;
}
</script>

<template>
  <div ref="host" class="tooltip-scenario" data-testid="tooltip-vue">
    <section v-if="host" class="tooltip-scenario__section" aria-label="固定方位">
      <h3>固定方位</h3>
      <div class="tooltip-scenario__placements">
        <Tooltip
          v-for="item in placements"
          :key="item.position"
          :class="`tooltip-target-${item.position}`"
          :content="`${item.label} 提示`"
          :get-popup-container="getPopupContainer"
          :motion="false"
          :position="item.position"
          trigger="custom"
          :visible="true"
          :wrapper-id="`tooltip-${item.position}`"
        >
          <Button :data-parity-target="`tooltip-trigger-${item.position}`">
            {{ item.label }}
          </Button>
        </Tooltip>
      </div>
    </section>

    <section v-if="host" class="tooltip-scenario__section" aria-label="触发行为">
      <h3>触发行为</h3>
      <div class="tooltip-scenario__actions">
        <Tooltip
          content="Hover 提示"
          :get-popup-container="getPopupContainer"
          :motion="false"
          wrapper-id="tooltip-hover"
          @visible-change="(visible) => (lastChange = `hover:${String(visible)}`)"
        >
          <Button data-parity-target="tooltip-trigger-hover">Hover</Button>
        </Tooltip>
        <Tooltip
          :visible="clickVisible"
          content="Click 提示"
          :get-popup-container="getPopupContainer"
          :motion="false"
          trigger="click"
          wrapper-id="tooltip-click"
          @visible-change="handleClickVisibleChange"
        >
          <Button data-parity-target="tooltip-trigger-click">Click</Button>
        </Tooltip>
        <Tooltip
          content="禁用按钮提示"
          :get-popup-container="getPopupContainer"
          :motion="false"
          wrapper-class-name="tooltip-disabled-wrapper"
          wrapper-id="tooltip-disabled"
        >
          <Button disabled data-parity-target="tooltip-trigger-disabled">Disabled</Button>
        </Tooltip>
      </div>
    </section>

    <output v-if="host" class="tooltip-scenario__status" aria-live="polite">
      {{ `最近变化：${lastChange}` }}
    </output>
  </div>
</template>
