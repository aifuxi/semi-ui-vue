<script setup lang="ts">
import { shallowRef } from 'vue';
import { Avatar, Badge, ConfigProvider, type BadgePosition } from '@workspace/ui';

defineProps<{ direction: 'ltr' | 'rtl' }>();
const status = shallowRef('等待操作');
const positions: readonly BadgePosition[] = ['leftTop', 'leftBottom', 'rightTop', 'rightBottom'];
</script>

<template>
  <ConfigProvider :direction="direction">
    <div class="badge-scenario" data-testid="badge-vue">
      <section class="badge-scenario__section">
        <span class="badge-scenario__label">基础 / 溢出</span>
        <div class="badge-scenario__row">
          <Badge :count="5" data-parity-target="badge-root" @click="status = '徽章已点击'">
            <Avatar shape="square" color="blue">BM</Avatar>
          </Badge>
          <Badge dot data-parity-target="badge-dot">
            <Avatar shape="square" color="light-blue">YL</Avatar>
          </Badge>
          <Badge :count="120" :overflow-count="99" data-parity-target="badge-overflow">
            <Avatar shape="square" color="teal">ZH</Avatar>
          </Badge>
          <Badge count="NEW"><Avatar shape="square" color="green">WF</Avatar></Badge>
        </div>
      </section>

      <section class="badge-scenario__section">
        <span class="badge-scenario__label">主题 / 类型</span>
        <div class="badge-scenario__row badge-scenario__row--surface">
          <Badge :count="6" type="primary" theme="solid"><Avatar>P</Avatar></Badge>
          <Badge :count="6" type="danger" theme="light" data-parity-target="badge-light">
            <Avatar color="red">D</Avatar>
          </Badge>
          <Badge :count="6" type="success" theme="inverted">
            <Avatar color="green">S</Avatar>
          </Badge>
          <Badge dot type="warning"><Avatar color="orange">W</Avatar></Badge>
        </div>
      </section>

      <section class="badge-scenario__section badge-scenario__section--positions">
        <span class="badge-scenario__label">四角位置</span>
        <div class="badge-scenario__positions">
          <Badge
            v-for="position in positions"
            :key="position"
            count="VIP"
            :position="position"
            type="danger"
          >
            <Avatar shape="square" color="amber">A</Avatar>
          </Badge>
        </div>
      </section>

      <section class="badge-scenario__section">
        <span class="badge-scenario__label">自定义 / 独立</span>
        <div class="badge-scenario__row">
          <Badge data-parity-target="badge-custom">
            <Avatar shape="square" color="purple">V</Avatar>
            <template #count><span class="badge-scenario__custom">✓</span></template>
          </Badge>
          <Badge :count="8" type="secondary" data-parity-target="badge-standalone" />
          <span class="badge-scenario__standalone-line"><Badge dot type="success" />成功</span>
        </div>
      </section>
      <output class="badge-scenario__status" aria-live="polite">{{ status }}</output>
    </div>
  </ConfigProvider>
</template>
