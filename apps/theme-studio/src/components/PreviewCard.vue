<script setup lang="ts">
import { ref } from 'vue';
import {
  Button,
  Input,
  Modal,
  Select,
  Switch,
  Tag,
  Tooltip,
  Typography,
} from '@aifuxi/semi-ui-vue';
import { IconPlus, IconArrowRight, IconInfoCircle } from '@aifuxi/semi-icons-vue';
import type { ThemeSettings } from '../studio';
import QuickControls from './QuickControls.vue';

/** 同一组真实组件用于全局、局部与固定基线比较；不仿制组件 DOM。 */
defineProps<{
  name: string;
  title: string;
  theme?: ThemeSettings;
  compact?: boolean;
  buttonStyle?: Record<string, string>;
}>();
/** 弹窗编辑通过原预览边界的所有者更新，避免修改传入 props。 */
const emit = defineEmits<{ change: [value: Partial<ThemeSettings>] }>();
/** 表单业务值与主题相互独立。 */
const project = ref('设计系统');
/** 表单下拉值只演示组件真实交互。 */
const team = ref('design');
/** 示例开关使用当前公开组件。 */
const notifications = ref(true);
/** 默认 body Portal 的声明式弹窗。 */
const modalVisible = ref(false);
/** 自定义触发让 Tooltip 在操作外侧编辑区时保持打开，容器仍使用默认值。 */
const tooltipVisible = ref(false);
/** 固定的业务选项，避免把主题状态混入预览表单。 */
const teams = [
  { label: '设计主题', value: 'design' },
  { label: '组件主题', value: 'engineering' },
];
/** 显示弹窗并保留当前主题。 */
function openModal(): void {
  modalVisible.value = true;
}
/** 关闭弹窗，由组件生命周期撤回默认容器桥接属性。 */
function closeModal(): void {
  modalVisible.value = false;
}
/** 切换提示显示，便于保持打开并实时编辑主题。 */
function toggleTooltip(): void {
  tooltipVisible.value = !tooltipVisible.value;
}
</script>

<template>
  <article class="sample-card" :class="{ 'sample-compact': compact }" :data-testid="`${name}-card`">
    <div class="sample-topline">
      <span class="sample-eyebrow">表单预览</span><Tag color="green">进行中</Tag>
    </div>
    <Typography.Title :heading="4" :data-testid="`${name}-title`">{{ title }}</Typography.Title>
    <Typography.Text :data-testid="`${name}-text`"
      >正文排版预览 · Theme Studio 0123456789</Typography.Text
    >
    <Typography.Text v-if="!compact" code :data-testid="`${name}-code`"
      >font-size: 14px;</Typography.Text
    >
    <Typography.Text v-if="!compact" type="tertiary" class="sample-description"
      >调整变量后，这里的组件会实时更新。</Typography.Text
    >
    <div class="sample-form">
      <label
        ><Typography.Text strong>主题名称</Typography.Text
        ><Input v-model="project" :aria-label="`${name}主题名称`"
      /></label>
      <label
        ><Typography.Text :id="`${name}-team-label`" strong>主题分类</Typography.Text
        ><Select
          v-model="team"
          :aria-labelledby="`${name}-team-label`"
          :option-list="teams"
          :motion="false"
      /></label>
    </div>
    <div class="sample-notification">
      <Typography.Text>启用主题预览</Typography.Text
      ><Switch v-model="notifications" :aria-label="`${name}启用主题预览`" />
    </div>
    <div class="sample-actions" :style="buttonStyle">
      <Button theme="solid" :data-testid="`${name}-primary`"
        ><template #icon><IconPlus /></template>应用主题</Button
      >
      <Button
        ><template #icon><IconArrowRight /></template>查看主题</Button
      >
      <Button disabled>已归档</Button>
    </div>
    <div v-if="theme" class="sample-popups">
      <Tooltip
        trigger="custom"
        :visible="tooltipVisible"
        :motion="false"
        :close-on-esc="true"
        @visible-change="tooltipVisible = $event"
      >
        <Button type="tertiary" :aria-label="`${name}主题提示`" @click="toggleTooltip"
          ><template #icon><IconInfoCircle /></template>主题提示</Button
        >
        <template #content
          ><div class="tooltip-content">
            <Typography.Text link :data-testid="`${name}-tooltip-link`"
              >打开时也能实时更新</Typography.Text
            ><Typography.Text :data-testid="`${name}-tooltip-text`"
              >颜色与排版来自触发位置。</Typography.Text
            ><Button size="small" @click="toggleTooltip">关闭提示</Button>
          </div></template
        >
      </Tooltip>
      <Button type="tertiary" :aria-label="`${name}打开弹窗`" @click="openModal">打开弹窗</Button>
    </div>
    <!-- 使用 Modal 的公开 width 支持手机视口，保留桌面 520px 内容宽度。 -->
    <Modal
      v-if="theme"
      :visible="modalVisible"
      title="继续应用主题"
      :motion="false"
      width="min(520px, calc(100vw - 32px))"
      @cancel="closeModal"
      @ok="closeModal"
    >
      <div class="modal-preview" :data-testid="`${name}-modal`">
        <Typography.Text>在弹窗里调整主题，源预览和默认弹层会同步更新。</Typography.Text>
        <QuickControls :theme="theme" @change="emit('change', $event)" />
        <Button theme="solid" :data-testid="`${name}-modal-primary`">保存主题</Button>
        <Typography.Text link :data-testid="`${name}-modal-link`">查看主题详情</Typography.Text>
      </div>
    </Modal>
  </article>
</template>
