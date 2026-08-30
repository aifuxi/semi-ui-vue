<script setup lang="ts">
import { Banner, type BannerType } from '@aifuxi/semi-ui-vue';
import { shallowRef } from 'vue';

const notices: Array<{ type: BannerType; description: string }> = [
  { type: 'info', description: '新版本已经可用。' },
  { type: 'warning', description: '当前配置将在四天后过期。' },
  { type: 'danger', description: '当前接口已经停用，请尽快升级。' },
  { type: 'success', description: '所有发布检查均已通过。' },
];
const lastAction = shallowRef('暂无操作');
</script>

<template>
  <div class="banner-scenario" data-testid="banner-vue">
    <section class="banner-scenario__types" aria-label="通知类型">
      <Banner
        v-for="notice in notices"
        :key="notice.type"
        :data-parity-target="`banner-${notice.type}`"
        :type="notice.type"
        :description="notice.description"
        @close="lastAction = `关闭 ${notice.type}`"
      />
    </section>
    <Banner
      data-parity-target="banner-container"
      :full-mode="false"
      bordered
      type="warning"
      :icon="null"
      :close-icon="null"
      title="配置尚未完成"
      description="请补充应用标识后再发布。"
    >
      <div class="banner-scenario__actions">
        <button type="button">稍后处理</button>
        <button type="button">立即配置</button>
      </div>
    </Banner>
    <p class="banner-scenario__status" role="status">最近操作：{{ lastAction }}</p>
  </div>
</template>
