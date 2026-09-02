<script setup lang="ts">
import { shallowRef } from 'vue';
import { IconChevronRight, IconHome } from '@aifuxi/semi-icons-vue';
import { Breadcrumb, BreadcrumbItem, ConfigProvider } from '@aifuxi/semi-ui-vue';
import type { BreadcrumbItemInfo } from '@aifuxi/semi-ui-vue';
import type { ParityDirection } from '@workspace/test-infra';

const props = defineProps<{ direction: ParityDirection }>();
const status = shallowRef('等待操作');

function itemName(item: BreadcrumbItemInfo): string {
  return typeof item.name === 'string' ? item.name : String(item.path ?? '自定义项');
}
</script>

<template>
  <ConfigProvider :direction="props.direction">
    <div class="breadcrumb-scenario" data-testid="breadcrumb-vue">
      <div class="breadcrumb-scenario__canvas">
        <div class="breadcrumb-scenario__section">
          <span class="breadcrumb-scenario__label">基础与图标</span>
          <Breadcrumb
            aria-label="文档路径"
            data-parity-target="breadcrumb-basic"
            @click="(item) => (status = `父级：${itemName(item)}`)"
          >
            <BreadcrumbItem @click="(item) => (status = `子项：${itemName(item)}`)">
              <template #icon><IconHome /></template>
              首页
            </BreadcrumbItem>
            <BreadcrumbItem href="#components">组件</BreadcrumbItem>
            <BreadcrumbItem>面包屑</BreadcrumbItem>
          </Breadcrumb>
        </div>

        <div class="breadcrumb-scenario__section">
          <span class="breadcrumb-scenario__label">折叠与 Popover</span>
          <Breadcrumb
            data-parity-target="breadcrumb-collapsed"
            more-type="popover"
            @click="(item) => (status = `折叠项：${itemName(item)}`)"
          >
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>设计系统</BreadcrumbItem>
            <BreadcrumbItem>导航组件</BreadcrumbItem>
            <BreadcrumbItem>层级结构</BreadcrumbItem>
            <BreadcrumbItem>面包屑</BreadcrumbItem>
            <BreadcrumbItem>详情</BreadcrumbItem>
          </Breadcrumb>
        </div>

        <div class="breadcrumb-scenario__section">
          <span class="breadcrumb-scenario__label">宽松尺寸与受控激活</span>
          <Breadcrumb :active-index="1" :compact="false" data-parity-target="breadcrumb-loose">
            <template #separator><IconChevronRight size="small" /></template>
            <BreadcrumbItem>工作台</BreadcrumbItem>
            <BreadcrumbItem href="#current">当前页面</BreadcrumbItem>
            <BreadcrumbItem no-link>详情</BreadcrumbItem>
          </Breadcrumb>
        </div>
      </div>
      <output class="breadcrumb-scenario__status" aria-live="polite">{{ status }}</output>
    </div>
  </ConfigProvider>
</template>
