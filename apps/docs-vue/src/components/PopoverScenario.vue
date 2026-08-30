<script setup lang="ts">
import { useTemplateRef } from 'vue';

import { Button, ConfigProvider, Popover } from '@aifuxi/semi-ui-vue';

import type { ParityDirection } from '@workspace/test-infra';

defineProps<{ direction: ParityDirection }>();

const host = useTemplateRef<HTMLDivElement>('host');
const getPopupContainer = () => host.value ?? document.body;
</script>

<template>
  <ConfigProvider :direction="direction">
    <div ref="host" class="popover-scenario" data-testid="popover-vue">
      <div v-if="host" class="popover-scenario__triggers">
        <div class="popover-scenario__scroll-host" data-testid="popover-scroll-host">
          <div class="popover-scenario__scroll-content">
            <Popover
              class="popover-target-bottom"
              :get-popup-container="getPopupContainer"
              :motion="false"
              position="bottom"
              trigger="custom"
              visible
            >
              <template #content>
                <div class="popover-scenario__card">
                  <strong>Bottom card</strong><span>Complex content</span>
                </div>
              </template>
              <Button data-parity-target="popover-trigger-bottom">Bottom</Button>
            </Popover>
          </div>
        </div>
        <Popover
          :arrow-style="{
            backgroundColor: 'rgb(0, 100, 250)',
            borderColor: 'rgb(0, 100, 250)',
          }"
          class="popover-target-right"
          :get-popup-container="getPopupContainer"
          :motion="false"
          position="right"
          show-arrow
          :style="{ backgroundColor: 'rgb(0, 100, 250)', color: 'rgb(255, 255, 255)' }"
          trigger="custom"
          visible
        >
          <template #content>
            <div class="popover-scenario__card">
              <strong>Right card</strong><span>Arrow and custom color</span>
            </div>
          </template>
          <Button data-parity-target="popover-trigger-right">Right</Button>
        </Popover>
        <Popover
          class="popover-target-click"
          :get-popup-container="getPopupContainer"
          :motion="false"
          trigger="click"
        >
          <template #content>
            <div class="popover-scenario__card">
              <strong>Click card</strong><span>Escape and focus guard</span>
              <button class="popover-scenario__inside-action">Action</button>
            </div>
          </template>
          <Button data-parity-target="popover-trigger-click">Click</Button>
        </Popover>
        <Popover
          class="popover-target-hover"
          :get-popup-container="getPopupContainer"
          :motion="false"
        >
          <template #content>
            <div class="popover-scenario__card">
              <strong>Hover card</strong><span>Tooltip role</span>
            </div>
          </template>
          <Button data-parity-target="popover-trigger-hover">Hover</Button>
        </Popover>
      </div>
    </div>
  </ConfigProvider>
</template>
