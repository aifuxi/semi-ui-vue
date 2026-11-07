<script setup lang="ts">
import { Input, InputGroup, TextArea } from '@aifuxi/semi-ui-vue/input';
import { shallowRef } from 'vue';
import { readInputReviewProps } from '../../../../packages/test-infra/src/input-theme-review';

/** 与 React 同一 query 进入真实公开 props；默认示例保持不变。 */
const reviewProps = readInputReviewProps(['size', 'disabled', 'readOnly', 'validateStatus']);
/** TextArea 使用 readonly，且缺省 query 不传入显式 undefined。 */
const textareaReviewProps = {
  ...(reviewProps.disabled === undefined ? {} : { disabled: reviewProps.disabled }),
  ...(reviewProps.readOnly === undefined ? {} : { readonly: reviewProps.readOnly }),
  ...(reviewProps.validateStatus === undefined
    ? {}
    : { validateStatus: reviewProps.validateStatus }),
};

const lastValue = shallowRef('none');

function inputChanged(value: string): void {
  lastValue.value = `input:${value}`;
}

function textareaChanged(value: string): void {
  lastValue.value = `textarea:${value}`;
}
</script>

<template>
  <div class="input-scenario" data-testid="input-vue">
    <section class="input-scenario__section" aria-label="基础输入框">
      <h3>基础输入框</h3>
      <div class="input-scenario__grid">
        <Input
          v-bind="reviewProps"
          default-value="hi"
          class-name="input-target-basic"
          aria-label="基本输入框"
          data-parity-target="input-basic"
          @change="inputChanged"
        />
        <Input
          size="large"
          class-name="input-target-large"
          placeholder="large"
          aria-label="大输入框"
          data-parity-target="input-large"
        />
        <Input
          prefix="https://"
          class-name="input-target-affix"
          suffix=".com"
          default-value="semi.design"
          aria-label="带前后缀"
          data-parity-target="input-affix"
        />
        <Input
          addon-before="http://"
          class-name="input-target-addon"
          addon-after=".com"
          default-value="semi"
          aria-label="带前后标签"
          data-parity-target="input-addon"
        />
        <Input
          mode="password"
          class-name="input-target-password"
          default-value="123456"
          aria-label="密码输入框"
          data-parity-target="input-password"
        />
        <Input
          show-clear
          class-name="input-target-clear"
          default-value="click to clear"
          aria-label="可清除输入框"
          data-parity-target="input-clear"
          @clear="lastValue = 'clear'"
        />
        <Input
          disabled
          class-name="input-target-disabled"
          default-value="disabled input"
          aria-label="禁用输入框"
          data-parity-target="input-disabled"
        />
        <Input
          validate-status="error"
          class-name="input-target-error"
          default-value="error input"
          aria-label="错误输入框"
          data-parity-target="input-error"
        />
      </div>
    </section>

    <section class="input-scenario__section" aria-label="输入框组合与多行文本">
      <h3>输入框组合与多行文本</h3>
      <InputGroup
        :label="{ text: '网址', name: 'website', required: true }"
        class-name="input-target-group"
        data-parity-target="input-group"
      >
        <Input default-value="https://" aria-label="协议" />
        <Input default-value="semi.design" aria-label="域名" />
      </InputGroup>
      <div class="input-scenario__textareas">
        <TextArea
          v-bind="textareaReviewProps"
          :default-value="'Semi Design\nVue parity'"
          class-name="input-target-textarea-counter"
          show-counter
          :max-count="80"
          aria-label="带计数文本域"
          data-parity-target="textarea-counter"
          @change="textareaChanged"
        />
        <TextArea
          :default-value="'第一行\n第二行\n第三行'"
          class-name="input-target-textarea-line-number"
          show-line-number
          :rows="4"
          aria-label="带行号文本域"
          data-parity-target="textarea-line-number"
        />
      </div>
    </section>
    <output class="input-scenario__status" aria-live="polite">
      {{ `最近变化：${lastValue}` }}
    </output>
  </div>
</template>
