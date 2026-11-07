<script setup lang="ts">
import { Form } from '@aifuxi/semi-ui-vue/form';
import { ref } from 'vue';
import { readInputReviewProps } from '../../../../packages/test-infra/src/input-theme-review';

/** 与 React 一致，经字段集成层查看真实输入排版。 */
const reviewProps = readInputReviewProps(['size', 'disabled', 'readOnly']);

// 动态错误初始值与 React 相同，保留快捷编辑直接传空字符串的用法。
const error = ref('');
// 每项均直接进入公开 ErrorMessage，不通过字段包装层归一化。
const cases = [
  { id: 'undefined', label: 'undefined', error: undefined },
  { id: 'false', label: 'false', error: false },
  { id: 'empty', label: '空字符串', error: '' },
  { id: 'empty-help', label: '空错误与帮助文案', error: '', helpText: '辅助说明' },
  { id: 'text', label: '非空错误', error: '请填写名称。' },
  { id: 'true', label: '布尔 true', error: true },
  { id: 'array', label: '错误数组', error: ['错误一', '错误二'] },
  { id: 'empty-array', label: '空错误数组', error: [] },
  { id: 'help', label: '无错误与帮助文案', error: undefined, helpText: '辅助说明' },
];

/** 显示错误，支持在清除后再次触发同一条提示。 */
function showError(): void {
  error.value = '请填写名称。';
}
/** 传入空字符串清除错误，不添加调用方 v-if 或值转换。 */
function clearError(): void {
  error.value = '';
}
</script>

<template>
  <div class="form-scenario" data-testid="form-vue">
    <Form class-name="form-scenario__form">
      <Form.Input
        v-bind="reviewProps"
        data-parity-target="form-name"
        field="name"
        label="名称"
        placeholder="请输入名称"
        :rules="[{ required: true, message: '请输入名称' }]"
      />
      <Form.Input
        data-parity-target="form-description"
        field="description"
        help-text="用于识别当前方案"
        init-value="Semi Vue"
        label="说明"
      />
      <button class="form-scenario__submit" type="submit">提交</button>
    </Form>
  </div>
  <!-- 与 React 对齐：容器宽 440px、内边距 16px；标签宽 176px，最小行高 32px、间距 16px。 -->
  <section data-testid="form-error-message-cases" :style="{ width: '440px', padding: '16px' }">
    <h3>独立错误提示</h3>
    <!-- 与 React 相同的固定行高保留空状态在截图中的可比性。 -->
    <div
      v-for="item in cases"
      :key="item.id"
      :style="{ display: 'flex', minHeight: '32px', gap: '16px' }"
    >
      <span :style="{ width: '176px' }">{{ item.label }}</span>
      <div :data-error-case="item.id">
        <Form.ErrorMessage
          :error="item.error"
          :help-text="item.helpText"
          validate-status="error"
          show-validate-icon
        />
      </div>
    </div>
    <div data-error-case="dynamic" :style="{ minHeight: '32px' }">
      <Form.ErrorMessage :error="error" validate-status="error" show-validate-icon />
    </div>
    <button type="button" @click="showError">显示错误</button>
    <button type="button" @click="clearError">清除错误</button>
  </section>
</template>
