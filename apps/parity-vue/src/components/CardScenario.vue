<script setup lang="ts">
import { shallowRef } from 'vue';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Card, CardGroup, CardMeta } from '@aifuxi/semi-ui-vue/card';
import { Text } from '@aifuxi/semi-ui-vue/typography';

const status = shallowRef('等待操作');
</script>

<template>
  <div class="card-scenario" data-testid="card-vue">
    <section class="card-scenario__primary">
      <Card
        title="Semi Design"
        :style="{ maxWidth: '360px' }"
        data-parity-target="card-basic"
        aria-label="基础卡片"
      >
        <template #headerExtraContent><Text link>更多</Text></template>
        Semi Design 帮助设计师与开发者打造高质量、体验一致的 Web 应用。
      </Card>

      <Card footer-line shadows="always" data-parity-target="card-complete" aria-label="完整卡片">
        <template #title>
          <CardMeta title="Semi Doc" description="全面、易用、优质">
            <template #avatar><Avatar color="blue">SD</Avatar></template>
          </CardMeta>
        </template>
        <template #cover><div class="card-scenario__cover">Vue parity</div></template>
        卡片可组合标题、封面、正文、操作组和页脚。
        <template #actions>
          <Button theme="borderless" @click="status = '查看详情'">查看详情</Button>
          <Button theme="solid" @click="status = '开始使用'">开始使用</Button>
        </template>
        <template #footer><Text type="tertiary">固定 v2.102.0 基线</Text></template>
      </Card>
    </section>

    <section class="card-scenario__states">
      <Card
        title="无外框"
        :bordered="false"
        :header-line="false"
        data-parity-target="card-borderless"
      >
        显式关闭 bordered 与 headerLine。
      </Card>
      <Card title="悬浮阴影" shadows="hover" data-parity-target="card-hover">
        Hover 后显示阴影。
      </Card>
      <Card loading data-parity-target="card-loading" aria-label="加载中的卡片">
        加载完成后的正文
      </Card>
    </section>

    <CardGroup type="grid" class="card-scenario__group" data-parity-target="card-group">
      <Card title="设计">统一语言</Card>
      <Card title="开发">可复用组件</Card>
      <Card title="交付">稳定体验</Card>
    </CardGroup>

    <output class="card-scenario__status" aria-live="polite">{{ status }}</output>
  </div>
</template>
