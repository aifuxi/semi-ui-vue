<script setup lang="ts">
import { computed } from 'vue';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Tooltip } from '@aifuxi/semi-ui-vue/tooltip';
import { IconCode, IconCopy, IconEdit } from '@aifuxi/semi-icons-vue';

const props = defineProps<{ title: string; kind?: 'live' | 'import' | 'code'; id?: string }>();

const kindLabel = computed(() => {
  switch (props.kind) {
    case 'import':
      return '引入方式示例';
    case 'live':
      return '可运行示例';
    default:
      return '代码示例';
  }
});
</script>

<template>
  <figure class="demo-block" :data-demo-kind="kind">
    <div class="demo-block-preview">
      <!-- 首版只渲染占位：示例清单契约见 ../demo/types.ts，接入 @vue/repl 后在此消费 id 对应的 manifest。 -->
      <span class="demo-block-placeholder">示例代码待补</span>
    </div>
    <figcaption class="demo-block-footer">
      <span class="demo-block-title">{{ title }}</span>
      <span class="demo-block-kind">{{ kindLabel }}</span>
      <div class="demo-block-actions">
        <Tooltip content="首版未接入示例代码" position="top">
          <Button theme="borderless" size="small" disabled>
            <template #icon><IconCode /></template>
            查看代码
          </Button>
        </Tooltip>
        <Tooltip content="首版未接入在线编辑" position="top">
          <Button theme="borderless" size="small" disabled>
            <template #icon><IconEdit /></template>
            在线编辑
          </Button>
        </Tooltip>
        <Tooltip content="首版未接入示例代码" position="top">
          <Button theme="borderless" size="small" disabled aria-label="复制代码">
            <template #icon><IconCopy /></template>
          </Button>
        </Tooltip>
      </div>
    </figcaption>
  </figure>
</template>
