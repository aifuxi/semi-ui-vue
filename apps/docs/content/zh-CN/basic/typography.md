---
title: 'Typography 版式'
description: '文字，图片，段落，数值的基本格式。'
type: 'basic'
order: 24
icon: 'doc-typography'
---

## 使用场景

- 对文章、博客、日志等的文本内容进行展示时。
- 对文本进行复制和省略等基础操作时。

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/typography` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-basic-typography-1" title="如何引入" kind="import" />

### 标题组件

通过设置 heading 可以展示不同级别的标题。

<DemoBlock id="zh-CN-basic-typography-2" title="标题组件" kind="live" />

### 文本组件

内置不同样式的文本。可以通过 `icon` 属性传入图标，这种方式传入的图标默认与文本有间距，同时在链接文本的情况不会出现下划线符合设计规范。

<DemoBlock id="zh-CN-basic-typography-3" title="文本组件" kind="live" />

链接文本支持传入 `object`，将对应的属性挂在 `` 标签上。
**v>=1.0** 后默认不再有下划线，可以配合 underline 属性在 hover，active 态增加下划线的样式。

<DemoBlock id="zh-CN-basic-typography-4" title="文本组件" kind="live" />

### 段落组件

段落组件拥有两种行距，可以通过设置 `spacing='extended'` 使用更宽松的行距。

<DemoBlock id="zh-CN-basic-typography-5" title="段落组件" kind="live" />

### 数值组件

Numeral 组件在Text组件的基础上，添加了属性: `rule`, `precision`, `truncate`, `parser`, 以提供需要单独处理文本中数值的能力。

`precision` 可以设置小数点后保留位数, 用于设置精度
`truncate` 小数点后保留位截段取整方式，可选 `ceil`, `floor`, `round`，作用与 Math.ceil、Math.floor、Math.round 对齐
`rule` 用于设置解析规则

- 设为 `percentages` 会将数字自动转换为百分比形式展示
- 设为 `bytes-decimal` 会将数字自动换算为字节对应的单位展示， 1 KB 定义为等于 1000 字节，（B, KB, MB, GB, TB, PB, EB, ZB, YB）
- 设为 `bytes-binary` 会将数字自动换算为字节对应的单位展示，1 KiB 定义为等于 1024字节，（B, KiB, MiB, GiB, TiB, PiB, EiB, ZiB, YiB）
- 设为 `text`时，仅自动对数字进行取整，根据 `precision` 和 `truncate` 属性
- 设为 `numbers`时，会将非数字字符进行过滤，仅展示数字
- 设为 `exponential` 时,会将数字自动转换为科学计数法形式展示

<DemoBlock id="zh-CN-basic-typography-6" title="数值组件" kind="live" />

可以通过 `parser` 自定义解析规则

<DemoBlock id="zh-CN-basic-typography-7" title="数值组件" kind="live" />

### 文本大小

段落组件和文本组件支持两种尺寸，`small`（12px） 和 `normal`（14px） 和 `inherit`，默认为`normal`。

当段落组件或者文本组件嵌套使用时候，设置内层组件的 `size` 属性为 `inherit`，内层组件的 size 将继承外层组件的尺寸设置。

<DemoBlock id="zh-CN-basic-typography-8" title="文本大小" kind="live" />

### 可复制文本

可通过配置 copyable 属性支持文本的复制。
当 copyable 配置为 true 时，默认复制内容为默认插槽的文本。
当 copyable 配置为对象时，可通过 `copyable.content` 指定复制内容；默认插槽可使用任意 VNode，但 `copyable.content` 仍须为 string。
可以通过 `copyable.render` 属性，自定义复制按钮的渲染逻辑

<DemoBlock id="zh-CN-basic-typography-9" title="可复制文本" kind="live" />

### 省略文本

支持文本的省略，可以通过 `ellipsis` 配置相关参数，具体参考 [Ellipsis Config](#Ellipsis-Config)。

<DemoBlock id="zh-CN-basic-typography-10" title="省略文本" kind="live" />

<DemoBlock id="zh-CN-basic-typography-11" title="省略文本" kind="live" />

<DemoBlock id="zh-CN-basic-typography-12" title="省略文本" kind="code" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/typography/types.ts`、`packages/ui/src/typography/index.ts` 的公开类型为准。

#### Vue 用法

- `Typography` 是默认导出容器，默认渲染 article；Text、Title、Paragraph、Numeral 同时作为静态成员和具名导出，SFC 模板推荐使用具名导出。
- `ellipsis.onExpand`、`copyable.onCopy`、`copyable.render` 与 `Numeral.parser` 是保留的嵌套 callback props，不是组件事件。
- 默认插槽提供正文；icon、copyIcon、copied、tooltip 插槽分别覆盖前缀、复制图标、复制成功内容和省略浮层内容。

#### Vue 事件

**Text / Title / Paragraph / Numeral**

| 事件   | 参数                                                                   | 说明               |
| ------ | ---------------------------------------------------------------------- | ------------------ |
| copy   | [event: MouseEvent \| KeyboardEvent, content: string, result: boolean] | 复制操作完成       |
| expand | [expanded: boolean, event: MouseEvent \| KeyboardEvent]                | 省略内容展开或收起 |

#### Vue 插槽

**Typography**

| 插槽    | 作用域参数 | 说明         |
| ------- | ---------- | ------------ |
| default | {}         | 排版容器内容 |

**Text / Numeral**

| 插槽     | 作用域参数                                                                 | 说明         |
| -------- | -------------------------------------------------------------------------- | ------------ |
| default  | {}                                                                         | 正文内容     |
| icon     | {}                                                                         | 前缀图标     |
| copyIcon | { copied: boolean, copy: (event: MouseEvent \| KeyboardEvent) =&gt; void } | 复制操作图标 |
| copied   | {}                                                                         | 复制成功内容 |
| tooltip  | { content: string }                                                        | 省略内容浮层 |

**Title / Paragraph**

| 插槽     | 作用域参数                                                                 | 说明         |
| -------- | -------------------------------------------------------------------------- | ------------ |
| default  | {}                                                                         | 正文内容     |
| copyIcon | { copied: boolean, copy: (event: MouseEvent \| KeyboardEvent) =&gt; void } | 复制操作图标 |
| copied   | {}                                                                         | 复制成功内容 |
| tooltip  | { content: string }                                                        | 省略内容浮层 |

### Typography.Text

| 属性      | 说明                                                                                                                                               | 类型                                | 默认值    | 版本   |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | --------- | ------ |
| component | 自定义根元素或 Vue 组件                                                                                                                            | TypographyComponent                 | span      |        |
| copyable  | 复制配置；内部 onCopy 是嵌套 callback prop                                                                                                         | boolean \| TypographyCopyableConfig | false     |        |
| delete    | 添加删除线样式                                                                                                                                     | boolean                             | false     |        |
| disabled  | 禁用文本                                                                                                                                           | boolean                             | false     |        |
| ellipsis  | 省略配置；内部 onExpand 是嵌套 callback prop                                                                                                       | boolean \| TypographyEllipsis       | false     |        |
| icon      | 前缀 VNode；icon 插槽优先                                                                                                                          | VNodeChild                          | -         |        |
| link      | 是否为链接，传object时，属性将透传给a标签                                                                                                          | TypographyLink                      | false     |        |
| mark      | 添加标记样式                                                                                                                                       | boolean                             | false     |        |
| size      | 文本大小，可选`normal`，`small`，`inherit`                                                                                                         | TypographySize                      | `normal`  |        |
| strong    | 是否加粗                                                                                                                                           | boolean                             | false     |        |
| type      | 文本类型，可选 `primary`, `secondary`, `warning`, `danger`, `tertiary`(**v&gt;=1.2.0**), `quaternary`(**v&gt;=1.2.0**), `success`(**v&gt;=1.7.0**) | TypographyType                      | `primary` |        |
| underline | 添加下划线样式                                                                                                                                     | boolean                             | false     |        |
| code      | 是否被 `code` 元素包裹                                                                                                                             | boolean                             | -         |        |
| weight    | 设置字重                                                                                                                                           | number                              | —         | 2.34.0 |

### Typography.Title

| 属性      | 说明                                                                                                                                               | 类型                                | 默认值    | 版本   |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | --------- | ------ |
| component | 自定义根元素或 Vue 组件；默认由 heading 决定                                                                                                       | TypographyComponent                 | h1~h6     |        |
| copyable  | 复制配置；内部 onCopy 是嵌套 callback prop                                                                                                         | boolean \| TypographyCopyableConfig | false     |        |
| delete    | 添加删除线样式                                                                                                                                     | boolean                             | false     |        |
| disabled  | 禁用文本                                                                                                                                           | boolean                             | false     |        |
| ellipsis  | 省略配置；内部 onExpand 是嵌套 callback prop                                                                                                       | boolean \| TypographyEllipsis       | false     |        |
| link      | 是否为链接，传object时，属性将透传给a标签                                                                                                          | TypographyLink                      | false     |        |
| mark      | 添加标记样式                                                                                                                                       | boolean                             | false     |        |
| strong    | —                                                                                                                                                  | boolean                             | —         |        |
| type      | 文本类型，可选 `primary`, `secondary`, `warning`, `danger`, `tertiary`(**v&gt;=1.2.0**), `quaternary`(**v&gt;=1.2.0**), `success`(**v&gt;=1.7.0**) | TypographyType                      | `primary` |        |
| underline | 添加下划线样式                                                                                                                                     | boolean                             | false     |        |
| weight    | 设置字重, 可选 `light`, `regular`, `medium`, `semibold`, `bold`, `default`                                                                         | TypographyWeight \| undefined       | —         | 2.34.0 |
| heading   | 标题级别，可选1， 2， 3，4，5，6，对应相应的标题                                                                                                   | TypographyHeading                   | 1         |        |

### Typography.Paragraph

| 属性      | 说明                                                                                                                                               | 类型                                | 默认值    | 版本 |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | --------- | ---- |
| component | 自定义根元素或 Vue 组件                                                                                                                            | TypographyComponent                 | p         |      |
| copyable  | 复制配置；内部 onCopy 是嵌套 callback prop                                                                                                         | boolean \| TypographyCopyableConfig | false     |      |
| delete    | 添加删除线样式                                                                                                                                     | boolean                             | false     |      |
| disabled  | 禁用文本                                                                                                                                           | boolean                             | false     |      |
| ellipsis  | 省略配置；内部 onExpand 是嵌套 callback prop                                                                                                       | boolean \| TypographyEllipsis       | false     |      |
| link      | 是否为链接，传object时，属性将透传给a标签                                                                                                          | TypographyLink                      | false     |      |
| mark      | 添加标记样式                                                                                                                                       | boolean                             | false     |      |
| size      | 文本大小，可选`normal`，`small`                                                                                                                    | TypographySize                      | `normal`  |      |
| spacing   | 行距大小，可选`normal`，`extended`                                                                                                                 | TypographySpacing                   | `normal`  |      |
| strong    | 是否加粗                                                                                                                                           | boolean                             | false     |      |
| type      | 文本类型，可选 `primary`, `secondary`, `warning`, `danger`, `tertiary`(**v&gt;=1.2.0**), `quaternary`(**v&gt;=1.2.0**), `success`(**v&gt;=1.7.0**) | TypographyType                      | `primary` |      |
| underline | 添加下划线样式                                                                                                                                     | boolean                             | false     |      |

### Typography.Numeral

| 属性      | 说明                                                                                                     | 类型                                | 默认值    | 版本   |
| --------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------- | --------- | ------ |
| component | 自定义根元素或 Vue 组件                                                                                  | TypographyComponent                 | span      | 2.22.0 |
| copyable  | 复制配置；内部 onCopy 是嵌套 callback prop                                                               | boolean \| TypographyCopyableConfig | false     | 2.22.0 |
| delete    | 添加删除线样式                                                                                           | boolean                             | false     | 2.22.0 |
| disabled  | 禁用文本                                                                                                 | boolean                             | false     | 2.22.0 |
| icon      | 前缀 VNode；icon 插槽优先                                                                                | VNodeChild                          | -         | 2.22.0 |
| link      | 是否为链接，传object时，属性将透传给a标签                                                                | TypographyLink                      | false     | 2.22.0 |
| mark      | 添加标记样式                                                                                             | boolean                             | false     | 2.22.0 |
| size      | 文本大小，可选`normal`，`small`                                                                          | TypographySize                      | `normal`  | 2.22.0 |
| strong    | 是否加粗                                                                                                 | boolean                             | false     | 2.22.0 |
| type      | 文本类型，可选 `primary`, `secondary`, `warning`, `danger`, `tertiary`, `quaternary`, `success`          | TypographyType                      | `primary` | 2.22.0 |
| underline | 添加下划线样式                                                                                           | boolean                             | false     | 2.22.0 |
| weight    | —                                                                                                        | TypographyWeight \| undefined       | —         |        |
| code      | 是否被 `code` 元素包裹                                                                                   | boolean                             | -         | 2.22.0 |
| rule      | 解析规则，可选 `text`, `numbers`, `bytes-decimal`, `bytes-binary`, `percentages`, `exponential`          | TypographyNumeralRule               | `text`    | 2.22.0 |
| precision | 可以设置小数点后保留位数, 用于设置精度                                                                   | number                              | 0         | 2.22.0 |
| truncate  | 小数点后保留位截段取整方式，可选 `ceil`, `floor`, `round`，作用与 Math.ceil、Math.floor、Math.round 对齐 | TypographyTruncate                  | `round`   | 2.22.0 |
| parser    | 数值文本解析 callback prop                                                                               | (value: string) =&gt; string        | -         | 2.22.0 |

### Ellipsis Config

| 属性         | 说明                                                        | 类型                                                               | 默认值                     |
| ------------ | ----------------------------------------------------------- | ------------------------------------------------------------------ | -------------------------- |
| collapseText | 折叠的展示文本                                              | string                                                             | 启用折叠时使用 Locale 文案 |
| collapsible  | 是否支持折叠                                                | boolean                                                            | false                      |
| expandText   | 展开的展示文本                                              | string                                                             | 启用展开时使用 Locale 文案 |
| expandable   | 是否支持展开                                                | boolean                                                            | false                      |
| pos          | 省略截断的位置，支持末尾和中间截断：`end`, `middle`         | 'end' \| 'middle'                                                  | `end`                      |
| rows         | 省略溢出行数                                                | number                                                             | 1                          |
| showTooltip  | 是否展示 Tooltip/Popover 及其配置；tooltip 插槽可自定义内容 | boolean \| TypographyShowTooltip                                   | false                      |
| suffix       | 始终展示的后缀                                              | string                                                             | `''`                       |
| onExpand     | 展开或收起 callback prop；组件同时触发 expand 事件          | (expanded: boolean, event: MouseEvent \| KeyboardEvent) =&gt; void | -                          |

### Copyable Config

| 属性       | 说明                                            | 类型                                                                                                                           | 默认值 | 版本   |
| ---------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------ | ------ |
| content    | 复制出的文本                                    | string                                                                                                                         | -      |        |
| copyTip    | 复制操作提示 VNode                              | VNodeChild                                                                                                                     | -      |        |
| successTip | 复制成功提示 VNode；copied 插槽优先             | VNodeChild                                                                                                                     | -      |        |
| icon       | 自定义复制 VNode；copyIcon 插槽优先             | VNodeChild \| undefined                                                                                                        | -      | 2.31.0 |
| duration   | 复制成功状态持续秒数                            | number                                                                                                                         | 3      |        |
| onCopy     | 复制完成 callback prop；组件同时触发 copy 事件  | (event: MouseEvent \| KeyboardEvent, content: string, result: boolean) =&gt; void                                              | -      |        |
| render     | 复制操作渲染 callback prop；copyIcon 插槽可替代 | ( copied: boolean, copy: (event: MouseEvent \| KeyboardEvent) =&gt; void, config: TypographyCopyableConfig, ) =&gt; VNodeChild | —      |        |

## 文案规范

- Link
- 文字链接需要清晰且可预测，用户应该能够预测他们点击链接时会发生什么
- 切勿通过错误标记链接来误导用户
- 避免使用“Click here”或“Here”作为独立链接

| ✅ 推荐用法                 | ❌ 不推荐用法             |
| --------------------------- | ------------------------- |
| No spaces yet? Create space | No spaces yet? Click here |

- 避免将整个句子作为可点击的文字链接，而是将描述具体去向的文字作为链接内容

| ✅ 推荐用法                          | ❌ 不推荐用法                       |
| ------------------------------------ | ----------------------------------- |
| Views user documentation for details | View user documentation for details |

- 使用短术语或词作为链接文本会更有利于国际化，以避免由于不同的语言的语法和语序不同，而出现链接文字被拆分的问题

| ✅ 推荐用法             | ❌ 不推荐用法           |
| ----------------------- | ----------------------- |
| Manage notifications to | Manage notifications to |

- 以文字链接结尾时，不需要跟随标点符号，除了问号“？”

| ✅ 推荐用法                 | ❌ 不推荐用法             |
| --------------------------- | ------------------------- |
| No spaces yet? Create space | No spaces yet? Click here |
| Forgot password ？          | Forgot password           |

- 链接文字不要包含冠词“the, a, an”

| ✅ 推荐用法                         | ❌ 不推荐用法                           |
| ----------------------------------- | --------------------------------------- |
| View user documentation for details | View the user documentation for details |

## FAQ

- **Typography 省略具体机制及注意事项?**

Semi 截断有两种策略， CSS 截断和 JS 截断。当设置中间截断（pos='middle')、可展开（expandable)、有后缀（suffix 非空）、可复制（copyable），启用 JS 截断策略；非以上场景，启用 CSS 截断策略。

通常来说，CSS 截断性能优于 JS 截断。在默认插槽内容、容器尺寸不变时，CSS 截断只涉及 1~2 次计算，JS 截断可能涉及多次计算。

同时使用大量带有截断功能的 Typography 需注意性能消耗，如在 Table 中，可通过设置合理的页容量进行分页减少性能损耗。
