<script setup lang="ts">
import { shallowRef } from 'vue';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import {
  Badge,
  type BadgePosition,
  type BadgeTheme,
  type BadgeType,
} from '@aifuxi/semi-ui-vue/badge';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';

defineProps<{ direction: 'ltr' | 'rtl' }>();
const status = shallowRef('等待操作');
const positions: readonly BadgePosition[] = ['leftTop', 'leftBottom', 'rightTop', 'rightBottom'];
/** 专项 query 使用真实组件补齐全部类型与 theme 的交叉外观。 */
const reviewVariants = new URLSearchParams(window.location.search).get('reviewVariants') === 'all';
/** 固定 Semi 的六种语义色，包含默认场景未出现的 tertiary。 */
const reviewTypes: BadgeType[] = [
  'primary',
  'secondary',
  'tertiary',
  'danger',
  'warning',
  'success',
];
/** Badge 的三种公开 theme 均参与同一语义色对照。 */
const reviewThemes: BadgeTheme[] = ['solid', 'light', 'inverted'];
</script>

<template>
  <ConfigProvider :direction="direction">
    <div class="badge-scenario" data-testid="badge-vue">
      <section
        v-for="theme in reviewVariants ? reviewThemes : []"
        :key="theme"
        class="badge-scenario__section"
      >
        <span class="badge-scenario__label">{{ theme }}</span>
        <div class="badge-scenario__row badge-scenario__row--surface">
          <Badge v-for="type in reviewTypes" :key="type" :theme="theme" :type="type" :count="6"
            ><Avatar size="small">{{ type.slice(0, 1) }}</Avatar></Badge
          >
        </div>
      </section>
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
