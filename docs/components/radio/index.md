# Radio 单选框

Radio 用于在互斥选项中选择一项。本实现对齐本地 Semi Design `v2.102.0`，支持单项、组合、按钮、卡片、纯卡片与高级取消模式，并保留 `.semi-radio*` / `.semi-radioGroup*` 样式契约。

## 基本使用

```vue
<script setup lang="ts">
import { Radio, RadioGroup } from '@workspace/ui/radio';
import { shallowRef } from 'vue';

const value = shallowRef('design');
</script>

<template>
  <RadioGroup v-model="value" name="product" aria-label="产品">
    <Radio value="ui">Semi UI</Radio>
    <Radio value="design">Semi Design</Radio>
    <Radio value="d2c">Semi D2C</Radio>
  </RadioGroup>
</template>
```

`value` 与 `modelValue` 都能建立受控 Group 契约，二者同时存在时 `value` 优先。点击先发出 `change(event)`，随后发出 `update:value` 与 `update:modelValue`；受控视觉值等待父级回写。

## Options 与布局

```vue
<template>
  <RadioGroup
    direction="vertical"
    :default-value="2"
    :options="[
      { label: '公开', value: 1 },
      { label: '团队可见', value: 2, extra: '仅成员可访问' },
      { label: '私密', value: 3, disabled: true },
    ]"
  />
</template>
```

`options` 支持字符串和对象。对象可配置 `label`、`value`、`disabled`、`extra`、`className`、`style`、`addonId`、`addonClassName`、`addonStyle` 与 `extraId`。默认 slot 适合需要逐项插槽内容或单独事件的场景。

## 按钮与卡片

```vue
<template>
  <RadioGroup type="button" button-size="large" default-value="now">
    <Radio value="now">即时推送</Radio>
    <Radio value="later">定时推送</Radio>
  </RadioGroup>

  <RadioGroup type="card" direction="vertical" default-value="a">
    <Radio value="a" extra="包含圆形选择标记">卡片 A</Radio>
    <Radio value="b" extra="可展示辅助说明">卡片 B</Radio>
  </RadioGroup>

  <RadioGroup type="pureCard" direction="vertical" default-value="a">
    <Radio value="a" extra="隐藏圆形选择标记">纯卡片 A</Radio>
    <Radio value="b">纯卡片 B</Radio>
  </RadioGroup>
</template>
```

Button 类型支持 `small`、`middle`、`large`。与固定源码一致，button 不显示 `extra`，也不应用 Group 的垂直方向 class。

## 高级取消与单项 v-model

```vue
<script setup lang="ts">
import { Radio } from '@workspace/ui/radio';
import { shallowRef } from 'vue';

const checked = shallowRef(true);
</script>

<template>
  <Radio v-model="checked" mode="advanced">再次点击可取消</Radio>
</template>
```

普通模式内部使用原生 radio；`mode="advanced"` 使用固定源码的 checkbox 语义，因此已选项可以再次点击取消。Group advanced 模式取消时发出 `event.target.value = undefined`。

## API

### Radio

| 属性                            | 类型                                            | 默认值      | 说明                        |
| ------------------------------- | ----------------------------------------------- | ----------- | --------------------------- |
| `checked` / `modelValue`        | `boolean`                                       | -           | 受控值；`checked` 优先      |
| `defaultChecked`                | `boolean`                                       | `false`     | 非受控初始值                |
| `value`                         | `string \| number \| boolean`                   | -           | Group 比较值与事件值        |
| `disabled` / `autoFocus`        | `boolean`                                       | `false`     | 禁用 / 自动聚焦 input       |
| `mode`                          | `'' \| 'advanced'`                              | `''`        | 普通或可取消模式            |
| `type`                          | `'default' \| 'button' \| 'card' \| 'pureCard'` | `'default'` | 独立 Radio 样式             |
| `displayMode`                   | `'' \| 'vertical'`                              | `''`        | 单项内容布局                |
| `extra`                         | `VNodeChild`                                    | -           | 辅助文本，也可用 `#extra`   |
| `addonId` / `extraId`           | `string`                                        | 自动生成    | ARIA 关联 id                |
| `addonClassName` / `addonStyle` | class / style                                   | -           | 内容容器样式                |
| `name` / `preventScroll`        | `string` / `boolean`                            | -           | 原生 name / 实例 focus 选项 |

事件：`change(event)`、`mouseenter(event)`、`mouseleave(event)`、`update:checked(checked)`、`update:modelValue(checked)`。实例方法：`focus()`、`blur()`。

### RadioGroup

| 属性                   | 类型                                            | 默认值         | 说明                   |
| ---------------------- | ----------------------------------------------- | -------------- | ---------------------- |
| `value` / `modelValue` | `string \| number \| boolean`                   | -              | 受控组值；`value` 优先 |
| `defaultValue`         | `string \| number \| boolean`                   | -              | 非受控初始值           |
| `options`              | `Array<string \| RadioOption>`                  | -              | 配置式子项             |
| `direction`            | `'horizontal' \| 'vertical'`                    | `'horizontal'` | 排列方向               |
| `type`                 | `'default' \| 'button' \| 'card' \| 'pureCard'` | `'default'`    | 全组样式               |
| `buttonSize`           | `'small' \| 'middle' \| 'large'`                | `'middle'`     | 按钮尺寸               |
| `mode`                 | `'' \| 'advanced'`                              | `''`           | 是否允许取消           |
| `disabled`             | `boolean`                                       | `false`        | 禁用所有子项           |
| `name`                 | `string`                                        | `'default'`    | 子 input 的 name       |
| `ariaLabel` 等         | ARIA 值                                         | -              | Group 根节点 ARIA      |

事件：`change(event)`、`update:value(value)`、`update:modelValue(value)`。`Radio.Group` 与具名 `RadioGroup` 指向同一组件。

## React → Vue 迁移

| React                                                                  | Vue                            |
| ---------------------------------------------------------------------- | ------------------------------ |
| `<Radio.Group value={value} onChange={e => setValue(e.target.value)}>` | `<RadioGroup v-model="value">` |
| `<Radio onChange={handler}>`                                           | `<Radio @change="handler">`    |
| `children` / `extra={<Node />}`                                        | 默认 slot / `#extra` slot      |
| `onMouseEnter` / `onMouseLeave`                                        | `@mouseenter` / `@mouseleave`  |
| `ref.current.focus()`                                                  | `radioRef?.focus()`            |

完整的状态、事件顺序、DOM、键盘、ARIA、RTL、SSR、视觉和发布证据见 [对齐矩阵](./alignment.md)。
