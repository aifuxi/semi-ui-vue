# Typography 版式

提供标题、正文、段落、链接、复制、截断和数值格式化。基线为 Semi Design v2.102.0，并保留 `.semi-typography*` 与 `--semi-*` 样式兼容契约。

## 引入

```ts
import { Typography, Title, Text, Paragraph, Numeral } from '@workspace/ui';
import '@workspace/theme-default/typography.css';
```

也可以使用聚合成员：

```ts
const { Title, Text, Paragraph, Numeral } = Typography;
```

## 标题、文本与段落

```vue
<Title :heading="2" weight="semibold">设计系统</Title>
<Text type="secondary" strong>辅助说明</Text>
<Paragraph spacing="extended">适合连续阅读的正文。</Paragraph>
```

`Title` 的 heading 支持 1-6；`Text` 和 `Paragraph` 支持 normal/small/inherit 尺寸。`component` 可覆盖默认标签。

## 装饰与链接

```vue
<Text mark>标记</Text>
<Text code>pnpm build</Text>
<Text underline>下划线</Text>
<Text delete>删除内容</Text>
<Text :link="{ href: '/guide' }" underline>查看指南</Text>
<Text link disabled>禁用链接</Text>
```

## 复制

```vue
<Text
  :copyable="{
    content: 'token-name',
    duration: 2,
    onCopy: (_event, content, result) => console.log(content, result),
  }"
  @copy="onCopy"
>
  token-name
</Text>
```

可用 `copyIcon` 和 `copied` slots 自定义复制前后节点；`copyIcon` scoped slot 提供 `copy` 与 `copied`。

## 截断

```vue
<Paragraph
  :ellipsis="{
    rows: 2,
    expandable: true,
    collapsible: true,
    suffix: ' [文档]',
  }"
  @expand="onExpand"
>
  很长的纯文本内容……
</Paragraph>
```

简单末尾截断使用 CSS；middle、expandable、suffix 或 copyable 会使用 JS 测量。与固定版本一致，ellipsis 只保证纯文本。

## 数值格式化

```vue
<Numeral rule="bytes-binary" :precision="2">1536</Numeral>
<!-- 1.50 KiB -->

<Numeral rule="percentages" :precision="1">0.125</Numeral>
<!-- 12.5% -->
```

rule 支持 `text`、`numbers`、`bytes-decimal`、`bytes-binary`、`percentages`、`exponential`；truncate 支持 `ceil`、`floor`、`round`。

## API

四个内容组件共享：`component`、`copyable`、`delete`、`disabled`、`link`、`mark`、`strong`、`type`、`underline`；Title 额外提供 `heading/weight/ellipsis`，Text 提供 `icon/code/size/weight/ellipsis`（weight 为数字），Paragraph 提供 `size/spacing/ellipsis`，Numeral 提供 `icon/code/size/rule/precision/truncate/parser`。

### Slots

| Slot       | 说明                                                   |
| ---------- | ------------------------------------------------------ |
| `default`  | 文本或内容节点                                         |
| `icon`     | Text/Numeral 前缀图标                                  |
| `copyIcon` | 自定义复制节点；参数为 `{ copy, copied }`              |
| `copied`   | 自定义复制成功节点                                     |
| `tooltip`  | ellipsis 溢出后的 scoped tooltip，参数为 `{ content }` |

## React → Vue 迁移

| React                       | Vue                                               |
| --------------------------- | ------------------------------------------------- |
| `Typography.Title` 等成员   | 可保留，或直接使用 `Title/Text/Paragraph/Numeral` |
| `children`                  | 默认 slot                                         |
| `icon` ReactNode            | `icon` prop 或 slot                               |
| `copyable.render`           | 可保留函数；优先 copyIcon/copied slots            |
| `showTooltip.renderTooltip` | tooltip scoped slot                               |
| `onExpand` / `onCopy`       | 配置回调，并额外支持 `@expand` / `@copy`          |
| React ref                   | Vue template ref                                  |
