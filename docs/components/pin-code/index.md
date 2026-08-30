# PinCode 验证码输入

PinCode 用于分格输入短信验证码、邀请码等短字符序列。本实现对齐本地 Semi Design `v2.102.0`，复用 Vue Input，并保留 `.semi-pincode-*` 与 `.semi-input-*` 样式契约。

## 基本使用

```vue
<script setup lang="ts">
import { PinCode } from '@aifuxi/semi-ui-vue/pin-code';
</script>

<template>
  <PinCode
    size="small"
    default-value="123456"
    @change="(value) => console.log(value)"
    @complete="(value) => console.log('pincode:', value)"
  />
  <PinCode size="default" default-value="123456" @change="(value) => console.log(value)" />
  <PinCode size="large" default-value="123456" @change="(value) => console.log(value)" />
</template>
```

## 受控与 v-model

```vue
<script setup lang="ts">
import { PinCode } from '@aifuxi/semi-ui-vue/pin-code';
import { shallowRef } from 'vue';

const code = shallowRef('69af41');
</script>

<template>
  <PinCode v-model="code" format="mixed" />
</template>
```

`value` 与 `modelValue` 都能建立受控契约，二者同时存在时 `value` 优先。受控输入会先发出 `change`、`update:value`、`update:modelValue`，视觉值等待父级回写。

## 位数、格式和手动聚焦

```vue
<script setup lang="ts">
import { PinCode, type PinCodeExposed } from '@aifuxi/semi-ui-vue/pin-code';
import { useTemplateRef } from 'vue';

const pinCode = useTemplateRef<PinCodeExposed>('pinCode');
</script>

<template>
  <button type="button" @click="pinCode?.focus(2)">聚焦第三格</button>
  <PinCode ref="pinCode" :count="4" :format="/[A-Z]/" default-value="ABCD" />
</template>
```

`format="number"` 只接受数字，`mixed` 接受 ASCII 数字与字母；也可以传 RegExp 或逐字符校验函数。粘贴会从当前格依次写入，遇到第一个非法字符停止。

## API

| 属性                   | 类型                                                   | 默认值      | 说明                   |
| ---------------------- | ------------------------------------------------------ | ----------- | ---------------------- |
| `autoFocus`            | `boolean`                                              | `true`      | 客户端挂载后聚焦第一格 |
| `count`                | `number`                                               | `6`         | 输入格数量             |
| `defaultValue`         | `string`                                               | -           | 非受控初始值           |
| `disabled`             | `boolean`                                              | `false`     | 禁用全部输入格         |
| `format`               | `'number' \| 'mixed' \| RegExp \| ((char) => boolean)` | `'number'`  | 单字符校验             |
| `modelValue` / `value` | `string`                                               | -           | Vue/同名受控值         |
| `size`                 | `'small' \| 'default' \| 'large'`                      | `'default'` | Input 尺寸             |
| `className` / `style`  | Vue class/style                                        | -           | 根节点样式             |

事件：`change(value)`、`complete(value)`、`update:value(value)`、`update:modelValue(value)`。实例方法：`focus(index)`、`blur(index)`。

## React → Vue 迁移

| React                                           | Vue                                       |
| ----------------------------------------------- | ----------------------------------------- |
| `<PinCode value={value} onChange={setValue} />` | `<PinCode v-model="value" />`             |
| `onComplete={handler}`                          | `@complete="handler"`                     |
| `className="custom"`                            | `class="custom"` 或 `class-name="custom"` |
| `ref.current.focus(2)`                          | `pinCodeRef?.focus(2)`                    |

完整的状态、事件顺序、键盘、SSR、视觉和发布证据见 [对齐矩阵](./alignment.md)。
