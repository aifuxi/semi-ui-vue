<script setup lang="ts">
import { Empty } from '@workspace/ui';

const stringImage =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72"%3E%3Crect x="8" y="8" width="56" height="56" rx="14" fill="%23e8f3ff"/%3E%3Cpath d="M23 36h26M36 23v26" stroke="%230066ff" stroke-width="4" stroke-linecap="round"/%3E%3C/svg%3E';
</script>

<template>
  <div class="empty-scenario" data-testid="empty-vue">
    <svg class="empty-scenario__symbols" aria-hidden="true">
      <defs>
        <symbol id="empty-parity-symbol" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r="30" fill="var(--semi-color-fill-0)" />
          <path
            d="M24 36H48"
            stroke="var(--semi-color-text-2)"
            stroke-width="4"
            stroke-linecap="round"
          />
        </symbol>
      </defs>
    </svg>

    <section class="empty-scenario__primary">
      <span class="empty-scenario__label">完整空状态</span>
      <Empty
        title="暂无数据"
        description="创建第一条记录后，内容会显示在这里。"
        data-parity-target="empty-vertical"
      >
        <template #image>
          <svg
            class="empty-scenario__illustration"
            width="120"
            height="120"
            viewBox="0 0 120 120"
            aria-hidden="true"
            focusable="false"
            data-variant="light"
          >
            <rect x="10" y="14" width="100" height="92" rx="18" fill="#f2f3f5" />
            <rect x="27" y="31" width="66" height="55" rx="10" fill="#ffffff" />
            <circle cx="47" cy="51" r="8" fill="#c8d0dc" />
            <path
              d="M35 76L52 61L63 70L76 56L86 76"
              fill="none"
              stroke="#8f9bad"
              stroke-width="6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path d="M42 96H78" stroke="#c8d0dc" stroke-width="6" stroke-linecap="round" />
          </svg>
        </template>
        <template #darkModeImage>
          <svg
            class="empty-scenario__illustration"
            width="120"
            height="120"
            viewBox="0 0 120 120"
            aria-hidden="true"
            focusable="false"
            data-variant="dark"
          >
            <rect x="10" y="14" width="100" height="92" rx="18" fill="#242934" />
            <rect x="27" y="31" width="66" height="55" rx="10" fill="#373e4d" />
            <circle cx="47" cy="51" r="8" fill="#5e6d89" />
            <path
              d="M35 76L52 61L63 70L76 56L86 76"
              fill="none"
              stroke="#9aa9c3"
              stroke-width="6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path d="M42 96H78" stroke="#6b7890" stroke-width="6" stroke-linecap="round" />
          </svg>
        </template>
        <button class="empty-scenario__action" type="button">创建记录</button>
      </Empty>
    </section>

    <section class="empty-scenario__row">
      <div class="empty-scenario__cell">
        <span class="empty-scenario__label">无图片</span>
        <Empty
          title="未找到匹配结果"
          description="请尝试调整筛选条件。"
          data-parity-target="empty-no-image"
        />
      </div>
      <div class="empty-scenario__cell empty-scenario__cell--wide">
        <span class="empty-scenario__label">水平布局</span>
        <Empty
          layout="horizontal"
          title="操作已完成"
          description="你可以继续配置权限和通知规则。"
          data-parity-target="empty-horizontal"
        >
          <template #image>
            <svg
              class="empty-scenario__illustration"
              width="88"
              height="88"
              viewBox="0 0 120 120"
              aria-hidden="true"
              focusable="false"
              data-variant="light"
            >
              <rect x="10" y="14" width="100" height="92" rx="18" fill="#f2f3f5" />
              <rect x="27" y="31" width="66" height="55" rx="10" fill="#ffffff" />
              <circle cx="47" cy="51" r="8" fill="#c8d0dc" />
              <path
                d="M35 76L52 61L63 70L76 56L86 76"
                fill="none"
                stroke="#8f9bad"
                stroke-width="6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path d="M42 96H78" stroke="#c8d0dc" stroke-width="6" stroke-linecap="round" />
            </svg>
          </template>
          <template #darkModeImage>
            <svg
              class="empty-scenario__illustration"
              width="88"
              height="88"
              viewBox="0 0 120 120"
              aria-hidden="true"
              focusable="false"
              data-variant="dark"
            >
              <rect x="10" y="14" width="100" height="92" rx="18" fill="#242934" />
              <rect x="27" y="31" width="66" height="55" rx="10" fill="#373e4d" />
              <circle cx="47" cy="51" r="8" fill="#5e6d89" />
              <path
                d="M35 76L52 61L63 70L76 56L86 76"
                fill="none"
                stroke="#9aa9c3"
                stroke-width="6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path d="M42 96H78" stroke="#6b7890" stroke-width="6" stroke-linecap="round" />
            </svg>
          </template>
          <a class="empty-scenario__link" href="#details">查看详情</a>
        </Empty>
      </div>
    </section>

    <section class="empty-scenario__row empty-scenario__row--compact">
      <div class="empty-scenario__cell">
        <span class="empty-scenario__label">SVG 描述对象</span>
        <Empty
          :image="{ id: 'empty-parity-symbol', viewBox: '0 0 72 72' }"
          :image-style="{ width: '72px', height: '72px' }"
          description="暂无内容"
          data-parity-target="empty-symbol"
        />
      </div>
      <div class="empty-scenario__cell">
        <span class="empty-scenario__label">字符串图片</span>
        <Empty
          :image="stringImage"
          :image-style="{ width: '72px', height: '72px' }"
          description="添加一个项目"
          data-parity-target="empty-string-image"
        />
      </div>
    </section>
  </div>
</template>
