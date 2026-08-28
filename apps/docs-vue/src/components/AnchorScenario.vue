<script setup lang="ts">
import { shallowRef } from 'vue';
import { Anchor, AnchorLink, ConfigProvider } from '@workspace/ui';
import type { ParityDirection } from '@workspace/test-infra';

const props = defineProps<{ direction: ParityDirection }>();
const status = shallowRef('等待操作');

const getContainer = (): HTMLElement | Window =>
  document.querySelector<HTMLElement>('.anchor-scenario__content') ?? window;
</script>

<template>
  <ConfigProvider :direction="props.direction">
    <div class="anchor-scenario" data-testid="anchor-vue">
      <div class="anchor-scenario__canvas">
        <div class="anchor-scenario__content" tabindex="0" aria-label="锚点滚动内容">
          <section id="anchor-overview">
            <h3>概览</h3>
            <p>Anchor 用于长页面中的章节导航。</p>
          </section>
          <section id="anchor-usage">
            <h3>用法</h3>
            <p>点击链接会滚动到对应的内容区块。</p>
          </section>
          <section id="anchor-api">
            <h3>API</h3>
            <p>滚动容器、偏移量和滑轨均保持固定契约。</p>
          </section>
          <section id="anchor-disabled">
            <h3>禁用</h3>
            <p>禁用链接保留语义，但不会触发跳转。</p>
          </section>
        </div>

        <div class="anchor-scenario__navigation">
          <Anchor
            aria-label="章节导航"
            data-parity-target="anchor-default"
            :get-container="getContainer"
            :max-height="240"
            :max-width="220"
            @change="(current, previous) => (status = `变化：${previous || '无'} → ${current}`)"
            @click="(_event, current) => (status = `点击：${current}`)"
          >
            <AnchorLink class-name="anchor-target-overview" href="#anchor-overview" title="概览" />
            <AnchorLink class-name="anchor-target-usage" href="#anchor-usage" title="用法">
              <AnchorLink class-name="anchor-target-api" href="#anchor-api" title="API 参考" />
            </AnchorLink>
            <AnchorLink
              class-name="anchor-target-disabled"
              disabled
              href="#anchor-disabled"
              title="禁用链接"
            />
          </Anchor>

          <Anchor
            aria-label="小尺寸导航"
            class-name="anchor-target-small"
            rail-theme="tertiary"
            size="small"
          >
            <AnchorLink href="#anchor-overview" title="小尺寸" />
            <AnchorLink href="#anchor-api" title="三级滑轨" />
          </Anchor>
        </div>
      </div>
      <output class="anchor-scenario__status" aria-live="polite">{{ status }}</output>
    </div>
  </ConfigProvider>
</template>
