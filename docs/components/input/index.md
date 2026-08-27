# Input 输入框

Input、InputGroup 与 TextArea 对齐 Semi Design v2.102.0，保留 `.semi-input*` DOM/class、状态、主题 Token、键盘、ARIA、IME 与 TextArea resize/行号契约。

## 基础使用

固定中文文档的首个可见示例在 Vue 中写为：

```vue
<script setup lang="ts">
import { Input } from '@workspace/ui';
</script>

<template>
  <Input default-value="hi" />
</template>
```

`v-model` 是推荐的受控写法；`value` 与 `modelValue` 同时存在时，`value` 优先。

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Input } from '@workspace/ui';

const value = ref('semi.design');
</script>

<template>
  <Input v-model="value" prefix="https://" suffix=".com" show-clear />
</template>
```

## 密码、附加项与插槽

```vue
<Input mode="password" default-value="123456" />
<Input addon-before="http://" addon-after=".com" default-value="semi" />
<Input show-clear>
  <template #prefix>前缀</template>
  <template #suffix>后缀</template>
  <template #clearIcon>清除</template>
</Input>
```

`addonBefore`、`addonAfter`、`prefix`、`suffix`、`insetLabel`、`clearIcon` 均同时支持同名 prop 与具名 slot，slot 优先。

## InputGroup

```vue
<InputGroup :label="{ text: '网址', name: 'website', required: true }">
  <Input default-value="https://" />
  <Input default-value="semi.design" />
</InputGroup>
```

Group 的 `size`、`disabled` 只作为直接子项的回退值；子项显式 `false` 仍优先。Group 暴露 `focus`、`blur` 事件，并保留 `role="group"`。

## TextArea

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { TextArea } from '@workspace/ui';

const value = ref('第一行\n第二行');
</script>

<template>
  <TextArea
    v-model="value"
    :autosize="{ minRows: 2, maxRows: 6 }"
    show-counter
    show-line-number
    :max-count="200"
    @resize="({ height, width }) => console.log(height, width)"
  />
</template>
```

`autosize` 使用内容高度；显式 `resize` 使用浏览器原生拖拽并发出包含 width/height 的事件。两者同时存在时 autosize 优先并关闭原生 resize。

## API

### Input

| Prop                                    | 类型                                     | 默认值      |
| --------------------------------------- | ---------------------------------------- | ----------- |
| `value` / `modelValue` / `defaultValue` | `string \| number`                       | -           |
| `addonBefore` / `addonAfter`            | `VNodeChild`                             | `''`        |
| `prefix` / `suffix` / `insetLabel`      | `VNodeChild`                             | `''`        |
| `insetLabelId`                          | `string`                                 | -           |
| `mode`                                  | `'password'`                             | -           |
| `type`                                  | `string`                                 | `'text'`    |
| `size`                                  | `'small' \| 'default' \| 'large'`        | `'default'` |
| `showClear` / `hideSuffix`              | `boolean`                                | `false`     |
| `clearIcon`                             | `VNodeChild`                             | IconClear   |
| `disabled` / `readonly` / `borderless`  | `boolean`                                | `false`     |
| `validateStatus`                        | `default \| warning \| error \| success` | `default`   |
| `maxLength` / `minLength`               | `number`                                 | -           |
| `getValueLength`                        | `(value: string) => number`              | -           |
| `composition`                           | `boolean`                                | `false`     |
| `autoFocus` / `preventScroll`           | `boolean`                                | `false`     |
| `inputStyle`                            | `StyleValue`                             | -           |

事件：`change(value, event)`、`input`、`focus`、`blur`、`clear`、`enterPress`、`keydown/keypress/keyup`、`compositionStart/End/Update` 与 `update:value/update:modelValue`。实例暴露 `input`、`focus()`、`blur()`、`select()`。

### TextArea

| Prop                                                         | 类型                                                        | 默认值     |
| ------------------------------------------------------------ | ----------------------------------------------------------- | ---------- |
| `value` / `modelValue` / `defaultValue`                      | `string`                                                    | -          |
| `rows` / `cols`                                              | `number`                                                    | `4` / `20` |
| `autosize`                                                   | `boolean \| { minRows?, maxRows? }`                         | `false`    |
| `resize`                                                     | `none \| both \| horizontal \| vertical \| block \| inline` | -          |
| `showCounter` / `showClear` / `showLineNumber`               | `boolean`                                                   | `false`    |
| `maxCount`                                                   | `number`                                                    | -          |
| `lineNumberStart`                                            | `number`                                                    | `1`        |
| `lineNumberClassName` / `lineNumberStyle`                    | class / style                                               | -          |
| `textareaStyle`                                              | `StyleValue`                                                | -          |
| `disabledEnterStartNewLine`                                  | `boolean`                                                   | `false`    |
| `getValueLength` / `maxLength` / `minLength` / `composition` | 与 Input 相同                                               | -          |

事件除 Input 的密码专属能力外保持同名，并增加 `resize({ height, width? })`；实例暴露 `textarea`、`focus()`、`blur()`、`select()`。

### InputGroup

`size`、`disabled`、`label`、`labelPosition`、`className`、`style`，以及 `focus/blur` 事件。完整 DOM、事件顺序、ARIA、SSR、视觉与 deviation 证据见[对齐矩阵](./alignment.md)。

## React → Vue

| React                            | Vue                                                |
| -------------------------------- | -------------------------------------------------- |
| `value` + `onChange`             | `v-model`；也保留 `value` + `@change`              |
| `onClear` / `onEnterPress`       | `@clear` / `@enterPress`                           |
| `prefix/suffix/addon*` ReactNode | 同名 prop 或具名 slot                              |
| `clearIcon`                      | `#clearIcon` 或同名 prop                           |
| `InputGroup` children clone      | 默认 slot；组级值只回退到未显式声明的直接子项      |
| `Input.TextArea`（概念）         | 具名 `TextArea`，脚本对象也保留 `Input.TextArea`   |
| React forwardRef                 | Vue 组件 ref 的 `input/textarea/focus/blur/select` |
