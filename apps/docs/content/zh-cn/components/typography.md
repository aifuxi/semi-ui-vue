---
title: '版式'
description: '文字，图片，段落，数值的基本格式。'
locale: 'zh-CN'
slug: 'typography'
category: 'basic'
order: 24
englishTitle: 'Typography'
icon: 'doc-typography'
upstream: 'basic/typography'
---

以下章节与示例逐项对应只读 Semi Design v2.102.0 文档。API 表中的版本号指上游版本；运行与源码均来自当前 Vue SFC。

## 使用场景

- 对文章、博客、日志等的文本内容进行展示时。
- 对文本进行复制和省略等基础操作时。

## 代码演示

### 如何引入

```ts
import { Typography, Title, Text, Paragraph, Numeral } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
```

### 标题组件

通过设置 heading 可以展示不同级别的标题。

::demo-block{demo="typography/zh-cn/Title" title="标题组件"}
::

### 文本组件

内置不同样式的文本。可以通过 `icon` 属性传入图标，这种方式传入的图标默认与文本有间距，同时在链接文本的情况不会出现下划线符合设计规范。

::demo-block{demo="typography/zh-cn/Text" title="文本组件"}
::

链接文本支持传入 `object`，将对应的属性挂在 `<a>` 标签上。  
**v>=1.0** 后默认不再有下划线，可以配合 underline 属性在 hover，active 态增加下划线的样式。

::demo-block{demo="typography/zh-cn/Link" title="文本组件"}
::

### 段落组件

段落组件拥有两种行距，可以通过设置 `spacing='extended'` 使用更宽松的行距。

::demo-block{demo="typography/zh-cn/Paragraph" title="段落组件"}
::

### 数值组件

Numeral 组件在Text组件的基础上，添加了属性: `rule`, `precision`, `truncate`, `parser`, 以提供需要单独处理文本中数值的能力。

Numeral 组件会递归遍历默认插槽节点 检测其中所有的数字文本进行转换展示，请注意控制渲染结构层级；

对于 rule 为 percentages 的 Numeral 组件，数据处理规则有变化。在 **v2.22.0-v2.29.0** 中，对于绝对值大于等于 1 的 num，结果为 num%； 对于绝对值小于等于 1 的 num，结果为 (num\*100)%。在 **v2.30.0** 版本及之后统一为 (num\*100)%。

`precision` 可以设置小数点后保留位数, 用于设置精度  
`truncate` 小数点后保留位截段取整方式，可选 `ceil`, `floor`, `round`，作用与 Math.ceil、Math.floor、Math.round 对齐  
`rule` 用于设置解析规则

- 设为 `percentages` 会将数字自动转换为百分比形式展示
- 设为 `bytes-decimal` 会将数字自动换算为字节对应的单位展示， 1 KB 定义为等于 1000 字节，（B, KB, MB, GB, TB, PB, EB, ZB, YB）
- 设为 `bytes-binary` 会将数字自动换算为字节对应的单位展示，1 KiB 定义为等于 1024字节，（B, KiB, MiB, GiB, TiB, PiB, EiB, ZiB, YiB）
- 设为 `text`时，仅自动对数字进行取整，根据 `precision` 和 `truncate` 属性
- 设为 `numbers`时，会将非数字字符进行过滤，仅展示数字
- 设为 `exponential` 时,会将数字自动转换为科学计数法形式展示

::demo-block{demo="typography/zh-cn/Numeral" title="数值组件"}
::

可以通过 `parser` 自定义解析规则

::demo-block{demo="typography/zh-cn/Parser" title="数值组件"}
::

### 文本大小

段落组件和文本组件支持三种尺寸，`small`（12px）、`normal`（14px）和 `inherit`，默认为`normal`。

当段落组件或者文本组件嵌套使用时候，设置内层组件的 `size` 属性为 `inherit`，内层组件的 size 将继承外层组件的尺寸设置。

::demo-block{demo="typography/zh-cn/Size" title="文本大小"}
::

### 可复制文本

可通过配置 copyable 属性支持文本的复制。  
当 copyable 配置为 true时，默认复制内容为 默认插槽 本身，注意，此时 默认插槽 只支持 string类型传入  
当 copyable 配置为 object 时，可通过 `copyable.content` 指定复制至粘贴板的内容，与 默认插槽 不再强关联， 此时 默认插槽 将不再限定类型，但 `copyable.content` 仍需要为 string  
可以通过 `copyIcon` / `copied` 插槽自定义复制按钮，也支持返回 VNodeChild 的 `copyable.render` 函数。示例的自定义按钮使用 render 回调，使复制成功后仍能再次复制。

::demo-block{demo="typography/zh-cn/Copyable" title="可复制文本"}
::

### 省略文本

支持文本的省略，可以通过 `ellipsis` 配置相关参数，具体参考 [Ellipsis Config](#ellipsis-config)。

1. ellipsis 仅支持纯文本的截断，不支持组件或复杂 VNode，请确保 默认插槽 传入内容类型为 string
2. ellipsis 要实现缩略，需要有明确的 width 或 maxWidth 宽度限制做对比判断。若自身未设置宽度（例如纯依靠 flex 属性撑开），或 width 为 100% 等不定数值，那么父级需要有明确的 width 或 maxWidth
3. ellipsis 需要获取 DOM 的宽高度等信息用以做基本判断，若自身或父级存在 display:none 样式会导致取值不正确，此时缩略会失效
4. 省略文本的计算，分为 CSS 截断和 JS 截断，强依赖 DOM 元素的相关状态获取。在结构复杂的页面，大量使用 Typography 可能会导致过多的 reflow 重排，建议选择合适的省略方式避免造成性能负担。更多信息见 [FAQ](#faq)

::demo-block{demo="typography/zh-cn/Ellipsis" title="省略文本"}
::

当发生超长文本在弹出的 tooltip 没有换行时，可通过手动设置一下 [word-break](https://developer.mozilla.org/zh-CN/docs/Web/CSS/word-break) 或者 [word-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-wrap) 等换行相关属性进行调整, 更多细节可查看 Tooltip 的 FAQ 部分

::demo-block{demo="typography/zh-cn/TooltipWrapping" title="省略文本"}
::

```scss
// 按需配置 word-break

.components-typography-demo {
  word-break: break-word;
  // 或
  word-break: break-all;
}
```

## API参考

### Typography.Text

| 属性      | 说明                                                                                                                                      | 类型                                                  | 默认值    | 版本   |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | --------- | ------ |
| component | 自定义渲染元素                                                                                                                            | html element                                          | span      |        |
| code      | 是否被 `code` 元素包裹                                                                                                                    | boolean                                               | -         |        |
| copyable  | 是否可拷贝                                                                                                                                | boolean \| object:[Copyable Config](#copyable-config) | false     |        |
| delete    | 添加删除线样式                                                                                                                            | boolean                                               | false     |        |
| disabled  | 禁用文本                                                                                                                                  | boolean                                               | false     |        |
| ellipsis  | 设置自动溢出省略                                                                                                                          | boolean\|object:Ellipsis Config                       | false     |        |
| icon      | 前缀图标                                                                                                                                  | VNodeChild                                            | -         |        |
| link      | 是否为链接，传object时，属性将透传给a标签                                                                                                 | boolean\|object                                       | false     |        |
| mark      | 添加标记样式                                                                                                                              | boolean                                               | false     |        |
| size      | 文本大小，可选`normal`，`small`，`inherit`                                                                                                | string                                                | `normal`  |        |
| strong    | 是否加粗                                                                                                                                  | boolean                                               | false     |        |
| type      | 文本类型，可选 `primary`, `secondary`, `warning`, `danger`, `tertiary`(**v>=1.2.0**), `quaternary`(**v>=1.2.0**), `success`(**v>=1.7.0**) | string                                                | `primary` |        |
| underline | 添加下划线样式                                                                                                                            | boolean                                               | false     |        |
| weight    | 设置字重                                                                                                                                  | number                                                |           | 2.34.0 |

### Typography.Title

| 属性      | 说明                                                                                                                                      | 类型                                                  | 默认值    | 版本   |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | --------- | ------ |
| component | 自定义渲染元素，默认由 heading 决定                                                                                                       | html element                                          | h1~h6     |        |
| copyable  | 是否可拷贝                                                                                                                                | boolean \| object:[Copyable Config](#copyable-config) | false     |        |
| delete    | 添加删除线样式                                                                                                                            | boolean                                               | false     |        |
| disabled  | 禁用文本                                                                                                                                  | boolean                                               | false     |        |
| ellipsis  | 设置自动溢出省略                                                                                                                          | boolean\|object:Ellipsis Config                       | false     |        |
| heading   | 标题级别，可选1， 2， 3，4，5，6，对应相应的标题                                                                                          | number                                                | 1         |        |
| link      | 是否为链接，传object时，属性将透传给a标签                                                                                                 | boolean\|object                                       | false     |        |
| mark      | 添加标记样式                                                                                                                              | boolean                                               | false     |        |
| type      | 文本类型，可选 `primary`, `secondary`, `warning`, `danger`, `tertiary`(**v>=1.2.0**), `quaternary`(**v>=1.2.0**), `success`(**v>=1.7.0**) | string                                                | `primary` |        |
| underline | 添加下划线样式                                                                                                                            | boolean                                               | false     |        |
| weight    | 设置字重, 可选 `light`, `regular`, `medium`, `semibold`, `bold`, `default`                                                                | string, number                                        |           | 2.34.0 |
| strong    | 是否加粗                                                                                                                                  | boolean                                               | false     |        |

### Typography.Paragraph

| 属性      | 说明                                                                                                                                      | 类型                                                  | 默认值    | 版本 |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | --------- | ---- |
| component | 自定义渲染元素                                                                                                                            | html element                                          | p         |      |
| copyable  | 是否可拷贝                                                                                                                                | boolean \| object:[Copyable Config](#copyable-config) | false     |      |
| delete    | 添加删除线样式                                                                                                                            | boolean                                               | false     |      |
| disabled  | 禁用文本                                                                                                                                  | boolean                                               | false     |      |
| ellipsis  | 设置自动溢出省略                                                                                                                          | boolean\|object:Ellipsis Config                       | false     |      |
| link      | 是否为链接，传object时，属性将透传给a标签                                                                                                 | boolean\|object                                       | false     |      |
| mark      | 添加标记样式                                                                                                                              | boolean                                               | false     |      |
| size      | 文本大小，可选`normal`，`small`                                                                                                           | string                                                | `normal`  |      |
| spacing   | 行距大小，可选`normal`，`extended`                                                                                                        | string                                                | `normal`  |      |
| strong    | 是否加粗                                                                                                                                  | boolean                                               | false     |      |
| type      | 文本类型，可选 `primary`, `secondary`, `warning`, `danger`, `tertiary`(**v>=1.2.0**), `quaternary`(**v>=1.2.0**), `success`(**v>=1.7.0**) | string                                                | `primary` |      |
| underline | 添加下划线样式                                                                                                                            | boolean                                               | false     |      |

### Typography.Numeral

| 属性      | 说明                                                                                                     | 类型                                                  | 默认值    | 版本   |
| --------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | --------- | ------ |
| rule      | 解析规则，可选 `text`, `numbers`, `bytes-decimal`, `bytes-binary`, `percentages`, `exponential`          | string                                                | `text`    | 2.22.0 |
| precision | 可以设置小数点后保留位数, 用于设置精度                                                                   | number                                                | 0         | 2.22.0 |
| truncate  | 小数点后保留位截段取整方式，可选 `ceil`, `floor`, `round`，作用与 Math.ceil、Math.floor、Math.round 对齐 | string                                                | `round`   | 2.22.0 |
| parser    | 自定义数值解析函数                                                                                       | (str: string) => string                               | -         | 2.22.0 |
| component | 自定义渲染元素                                                                                           | html element                                          | span      | 2.22.0 |
| code      | 是否被 `code` 元素包裹                                                                                   | boolean                                               | -         | 2.22.0 |
| copyable  | 是否可拷贝                                                                                               | boolean \| object:[Copyable Config](#copyable-config) | false     | 2.22.0 |
| delete    | 添加删除线样式                                                                                           | boolean                                               | false     | 2.22.0 |
| disabled  | 禁用文本                                                                                                 | boolean                                               | false     | 2.22.0 |
| icon      | 前缀图标                                                                                                 | VNodeChild                                            | -         | 2.22.0 |
| link      | 是否为链接，传object时，属性将透传给a标签                                                                | boolean\|object                                       | false     | 2.22.0 |
| mark      | 添加标记样式                                                                                             | boolean                                               | false     | 2.22.0 |
| size      | 文本大小，可选`normal`，`small`                                                                          | string                                                | `normal`  | 2.22.0 |
| strong    | 是否加粗                                                                                                 | boolean                                               | false     | 2.22.0 |
| type      | 文本类型，可选 `primary`, `secondary`, `warning`, `danger`, `tertiary`, `quaternary`, `success`          | string                                                | `primary` | 2.22.0 |
| underline | 添加下划线样式                                                                                           | boolean                                               | false     | 2.22.0 |

### Ellipsis Config

| 属性         | 说明                                                | 类型                                        | 默认值 |
| ------------ | --------------------------------------------------- | ------------------------------------------- | ------ |
| collapseText | 折叠的展示文本                                      | string                                      | `收起` |
| collapsible  | 是否支持折叠                                        | boolean                                     | false  |
| expandText   | 展开的展示文本                                      | string                                      | `展开` |
| expandable   | 是否支持展开                                        | boolean                                     | false  |
| pos          | 省略截断的位置，支持末尾和中间截断：`end`, `middle` | string                                      | `end`  |
| rows         | 省略溢出行数                                        | number                                      | 1      |
| showTooltip  | 展示浮层；自定义内容使用 tooltip 插槽               | boolean \| { type?: string, opts?: object } | false  |
| suffix       | 始终展示的后缀                                      | string                                      | -      |
| onExpand     | 展开/收起的回调                                     | function(expanded: bool, Event: e)          | -      |

### Copyable Config

| 属性       | 说明                                                | 类型                                           | 默认值 | 版本   |
| ---------- | --------------------------------------------------- | ---------------------------------------------- | ------ | ------ |
| content    | 复制出的文本                                        | string                                         | -      |        |
| copyTip    | 复制图标的 tooltip 展示内容                         | VNodeChild                                     | -      |        |
| icon       | 自定义渲染复制节点                                  | VNodeChild                                     | -      | 2.31.0 |
| onCopy     | 复制回调                                            | Function(e:Event, content:string, res:boolean) | -      |        |
| render     | 自定义复制渲染函数；也可使用 copyIcon / copied 插槽 | `(copied, copy, config) => VNodeChild`         | -      | 2.65.0 |
| successTip | 复制成功的展示内容                                  | VNodeChild                                     | -      |        |

## 文案规范

- Link
  - 文字链接需要清晰且可预测，用户应该能够预测他们点击链接时会发生什么
  - 切勿通过错误标记链接来误导用户
  - 避免使用“Click here”或“Here”作为独立链接

| ✅ 推荐用法                       | ❌ 不推荐用法                 |
| --------------------------------- | ----------------------------- |
| No spaces yet? ** Create space ** | No spaces yet? **Click here** |

- 避免将整个句子作为可点击的文字链接，而是将描述具体去向的文字作为链接内容

| ✅ 推荐用法                              | ❌ 不推荐用法                           |
| ---------------------------------------- | --------------------------------------- |
| Views **user documentation** for details | **View user documentation for details** |

- 使用短术语或词作为链接文本会更有利于国际化，以避免由于不同的语言的语法和语序不同，而出现链接文字被拆分的问题

| ✅ 推荐用法                 | ❌ 不推荐用法               |
| --------------------------- | --------------------------- |
| Manage **notifications **to | **Manage notifications** to |

- 以文字链接结尾时，不需要跟随标点符号，除了问号“？”

| ✅ 推荐用法                       | ❌ 不推荐用法                 |
| --------------------------------- | ----------------------------- |
| No spaces yet? ** Create space ** | No spaces yet? **Click here** |
| ** Forgot password ？**           | **Forgot password**           |

- 链接文字不要包含冠词“the, a, an”

| ✅ 推荐用法                               | ❌ 不推荐用法                               |
| ----------------------------------------- | ------------------------------------------- |
| View ** user documentation ** for details | View the** user documentation** for details |

## 设计变量

::token-table{component="typography"}
::

## FAQ

- **Typography 省略具体机制及注意事项?**

  Semi 截断有两种策略， CSS 截断和 JS 截断。当设置中间截断（pos='middle')、可展开（expandable)、有后缀（suffix 非空）、可复制（copyable），启用 JS 截断策略；非以上场景，启用 CSS 截断策略。

  通常来说，CSS 截断性能优于 JS 截断。在 默认插槽、 容器尺寸不变的情况下，CSS 截断只涉及 1~2 次计算，js 截断可能涉及多次计算。

  同时使用大量带有截断功能的 Typography 需注意性能消耗，如在 Table 中，可通过设置合理的页容量进行分页减少性能损耗。

## 无障碍

使用原生 `class`、`style`、`id`、`role`、`aria-*` 与 `data-*` 属性。布局不应改变阅读顺序；有交互的子组件应提供明确名称，且能用键盘操作。

## React → Vue 迁移

| React                                     | Vue                                                                   |
| ----------------------------------------- | --------------------------------------------------------------------- |
| `Typography.Title/Text/Paragraph/Numeral` | 可保留组合成员，或直接导入 `Title` / `Text` / `Paragraph` / `Numeral` |
| `children`                                | `default` 插槽；复制和省略默认内容须为纯文本                          |
| `icon` ReactNode                          | `icon` 插槽或 VNodeChild prop（Text/Numeral）                         |
| `copyable.render`                         | 优先 `copyIcon` / `copied` 插槽，也支持返回 VNodeChild 的函数         |
| `showTooltip.renderTooltip`               | `tooltip` scoped slot，参数 `{ content }`                             |
| `onCopy` / `onExpand`                     | 配置回调，并支持 `@copy` / `@expand`                                  |
| React ref                                 | Vue template ref                                                      |

`copyIcon` 插槽提供 `{ copied, copy }`；自定义交互节点应调用 `copy(event)`，且避免事件冒泡造成重复复制。`copy` 事件参数为 `(event, content, result)`；`expand` 参数为 `(expanded, event)`。`copyable.duration` 控制复制状态持续秒数，默认 3。`component` 接受标签名或 Vue 组件。

`showTooltip` 接受 boolean 或 `{ type, opts }`。当前 Vue 默认浮层展示原文，自定义内容通过 `tooltip` 插槽传入；示例用此公开契约实现上游 `opts.content` 的展示意图。`renderTooltip` 不是 Vue 配置字段。Numeral 的 Vue 公开类型不含 `ellipsis`，固定 React Numeral 的公开类型同样不含此 prop；上游 API 表误列的行已移除。Paragraph 与 Numeral 的 `size` 同时支持 `inherit`。

标题级别应符合文档层级；链接提供清晰的去向。自定义复制按钮保留键盘操作与可访问名称。默认复制文案可通过 `typographyLocaleKey` 提供，英文示例注入 `EN_US_TYPOGRAPHY_LOCALE`。
