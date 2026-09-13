<script setup lang="ts">
import { Resizable, ResizeGroup, ResizeHandler, ResizeItem } from '@aifuxi/semi-ui-vue/resizable';
import { shallowRef } from 'vue';

const singleStatus = shallowRef('Drag edge to resize');
const groupStatus = shallowRef('Drag divider to resize');
const panelStyle = {
  border: '1px solid var(--harness-border)',
  backgroundColor: 'var(--harness-panel)',
};
</script>

<template>
  <div class="resizable-scenario" data-testid="resizable-vue">
    <section class="resizable-scenario__section" aria-label="单体伸缩框">
      <h3>单体伸缩框</h3>
      <div class="resizable-scenario__single-host">
        <Resizable
          class="resizable-scenario__single"
          data-parity-target="resizable-single"
          :default-size="{ width: '60%', height: 132 }"
          :min-width="120"
          max-width="90%"
          :style="panelStyle"
          @change="singleStatus = 'Resizing'"
          @resize-end="singleStatus = 'Drag edge to resize'"
        >
          <span>{{ singleStatus }}</span>
        </Resizable>
      </div>
    </section>

    <section class="resizable-scenario__section" aria-label="水平组合伸缩框">
      <h3>水平组合</h3>
      <div class="resizable-scenario__group-host">
        <ResizeGroup
          class="resizable-scenario__group"
          data-parity-target="resize-group-horizontal"
          direction="horizontal"
        >
          <ResizeItem
            class="resizable-target-item-horizontal-first"
            default-size="35%"
            min="20%"
            :style="panelStyle"
            @change="groupStatus = 'Resizing'"
            @resize-end="groupStatus = 'Drag divider to resize'"
          >
            <span>{{ groupStatus }}</span>
          </ResizeItem>
          <ResizeHandler class="resizable-target-handler-horizontal" />
          <ResizeItem default-size="65%" min="30%" :style="panelStyle">
            <span>Detail panel</span>
          </ResizeItem>
        </ResizeGroup>
      </div>
    </section>

    <section class="resizable-scenario__section" aria-label="垂直组合伸缩框">
      <h3>垂直组合</h3>
      <div class="resizable-scenario__vertical-host">
        <ResizeGroup
          class="resizable-scenario__group"
          data-parity-target="resize-group-vertical"
          direction="vertical"
        >
          <ResizeItem default-size="40%" :style="panelStyle">
            <span>Top panel</span>
          </ResizeItem>
          <ResizeHandler class="resizable-target-handler-vertical" />
          <ResizeItem default-size="60%" :style="panelStyle">
            <span>Bottom panel</span>
          </ResizeItem>
        </ResizeGroup>
      </div>
    </section>
  </div>
</template>
