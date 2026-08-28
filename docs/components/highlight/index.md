# Highlight 高亮文本

Highlight 把源文本中匹配的关键词替换为可定制的行内高亮标签。本实现以固定 Semi Design v2.102.0 Adapter、Foundation、SCSS 与文档为唯一基线。

## 引入

```ts
import { Highlight } from '@workspace/ui';
import '@workspace/theme-default/highlight.css';
```

也可使用子路径：

```ts
import Highlight, { type HighlightProps } from '@workspace/ui/highlight';
```

## 基本用法

```vue
<script setup lang="ts">
import { Highlight } from '@workspace/ui';
import '@workspace/theme-default/highlight.css';
</script>

<template>
  <h2>
    <Highlight
      source-string="从 Semi Design 到 Any Design，快速定义你的设计系统"
      :search-words="['设计系统', 'Semi Design']"
    />
  </h2>
</template>
```

组件不增加根元素：未匹配内容仍是原始文本节点，匹配内容默认由 `mark.semi-highlight-tag` 包裹。因此不要在直接承载 Highlight 的父元素上使用会拆分文本流的 flex/grid 布局；需要布局时先增加普通文本容器。

## 自定义标签与统一样式

```vue
<Highlight
  component="strong"
  source-string="Semi Design helps teams build a design system"
  :search-words="['Semi Design', 'design system']"
  highlight-class-name="search-result"
  :highlight-style="{
    borderRadius: '6px',
    padding: '0 4px',
    backgroundColor: 'var(--semi-color-primary)',
    color: 'var(--semi-color-white)',
  }"
/>
```

默认标签是 `mark`，也可以指定 `span`、`strong` 等原生标签。`highlightClassName` 和 `highlightStyle` 会应用到每个匹配区间。

## 为每个关键词指定样式

```vue
<Highlight
  component="span"
  source-string="Semi connects design and code"
  :search-words="[
    {
      text: 'Semi',
      className: 'brand-keyword',
      style: { backgroundColor: 'rgba(var(--semi-teal-5), 1)', color: 'white' },
    },
    {
      text: 'design',
      className: 'design-keyword',
      style: { backgroundColor: 'var(--semi-color-primary)', color: 'white' },
    },
  ]"
  :highlight-style="{ borderRadius: '4px', padding: '2px 4px' }"
/>
```

对象搜索词的 `className` 会追加在统一 class 后；对象 `style` 在统一样式之后合并，因此同名属性以对象样式为准。相交或首尾相接的匹配会按固定 Foundation 规则合并为一个标签。

## 大小写与正则

```vue
<Highlight source-string="Semi semi" :search-words="['semi']" case-sensitive />

<Highlight source-string="Version 2.102 and 2x102" :search-words="['2.102']" :auto-escape="false" />
```

- `caseSensitive` 缺省为 `false`。
- `autoEscape` 缺省为 `true`，搜索词按普通文本处理；显式设为 `false` 时按 JavaScript 正则表达式处理。
- `autoEscape` 的缺省、显式 `true` 和显式 `false` 是三个已锁定的公开行为，显式 `false` 不会被默认值覆盖。

## API

### Props

| 属性                 | 类型                   | 默认值   | 说明                     |
| -------------------- | ---------------------- | -------- | ------------------------ |
| `sourceString`       | `string`               | `''`     | 源文本                   |
| `searchWords`        | `HighlightSearchWords` | `[]`     | 字符串或对象搜索词数组   |
| `component`          | `string`               | `'mark'` | 匹配区间使用的原生标签   |
| `highlightClassName` | `string`               | -        | 所有高亮标签的追加 class |
| `highlightStyle`     | `CSSProperties`        | -        | 所有高亮标签的统一样式   |
| `caseSensitive`      | `boolean`              | `false`  | 是否区分大小写           |
| `autoEscape`         | `boolean`              | `true`   | 是否转义正则特殊字符     |

`HighlightSearchWord` 包含 `text: string`、可选 `className` 与可选 `style: CSSProperties`。组件没有 slots、emits、`v-model` 或 imperative ref API；固定 Adapter 没有根元素，因此 Vue attrs 没有合法落点，也不会被透传到高亮标签。

## 可访问性、主题、RTL 与 SSR

- 高亮内容仍是连续文本；组件本身不创建焦点或键盘交互。
- `mark` 提供原生高亮语义；改用其它标签时由调用方确认语义是否适合。
- light/dark 颜色由 `--semi-color-highlight` 与 `--semi-color-highlight-bg` 驱动。
- 文本方向继承父级；组件没有独立 RTL 布局。
- 根入口和 `@workspace/ui/highlight` 均可在无 DOM 环境导入和服务端渲染；源文本通过 Vue 文本节点转义，不使用 `v-html`。

完整源码证据、匹配算法、computed style、视觉矩阵和 deviation 结论见 [对齐矩阵](./alignment.md)，React 迁移见 [React → Vue](./react-to-vue.md)。
