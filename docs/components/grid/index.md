# Grid 栅格

基于 24 列的页面布局系统。实现基线为 Semi Design v2.102.0，并保留 `.semi-row`、`.semi-col-*` 与 `--semi-*` 兼容契约。

## 引入

```ts
import { Col, Row } from '@aifuxi/semi-ui-vue';
// 或 import { Col, Row } from '@aifuxi/semi-ui-vue/grid';
import '@aifuxi/semi-theme-default/grid.css';
```

## 基础使用

Col 必须放在 Row 内。

```vue
<Row>
  <Col :span="8">col-8</Col>
  <Col :span="8">col-8</Col>
  <Col :span="8">col-8</Col>
</Row>
```

## Gutter

数值表示水平间隔；tuple 第一项为水平间隔，第二项为垂直间隔。两项都可传入断点对象。

```vue
<Row :gutter="[{ xs: 8, md: 24, xl: 32 }, 16]">
  <Col v-for="item in 4" :key="item" :span="12">col-12</Col>
</Row>
```

## Flex 布局

```vue
<Row type="flex" justify="space-between" align="middle">
  <Col :span="6" :order="3">第三项</Col>
  <Col :span="6" :order="1">第一项</Col>
  <Col :span="6" :order="2">第二项</Col>
</Row>
```

## 响应式

每个断点可以直接传 span 数值，也可以传入 `span/order/offset/push/pull` 对象。

```vue
<Row>
  <Col :xs="{ span: 10, offset: 1 }" :md="{ span: 8, offset: 2 }" :lg="{ span: 6, push: 1 }">
    responsive
  </Col>
  <Col :xs="12" :md="10" :lg="8">adaptive</Col>
</Row>
```

## Row API

| 属性        | 类型                                                      | 默认值 | 说明              |
| ----------- | --------------------------------------------------------- | ------ | ----------------- |
| `type`      | `flex`                                                    | -      | Flex 布局模式     |
| `align`     | `top \| middle \| bottom`                                 | -      | Flex 交叉轴对齐   |
| `justify`   | `start \| end \| center \| space-around \| space-between` | -      | Flex 主轴对齐     |
| `gutter`    | `GridGutter \| [GridGutter, GridGutter]`                  | `0`    | 水平/垂直栅格间隔 |
| `prefixCls` | `string`                                                  | `semi` | class 前缀        |

## Col API

| 属性                 | 类型                | 默认值 | 说明               |
| -------------------- | ------------------- | ------ | ------------------ |
| `span`               | `number`            | -      | 占用列数；0 时隐藏 |
| `order`              | `number`            | -      | Flex 排序          |
| `offset`             | `number`            | -      | 左侧间隔列数       |
| `push`               | `number`            | -      | 向右移动列数       |
| `pull`               | `number`            | -      | 向左移动列数       |
| `xs/sm/md/lg/xl/xxl` | `number \| ColSize` | -      | 六断点响应式配置   |
| `prefixCls`          | `string`            | `semi` | class 前缀         |

## Slot 与原生属性

Row 和 Col 都使用默认 slot，并接受原生 `class`、`style`、role、ARIA、data、id 与事件 attrs。Col 必须位于 Row 内。

## React → Vue

| React                     | Vue                        |
| ------------------------- | -------------------------- |
| `className`               | `class`                    |
| `children`                | 默认 slot                  |
| `<Row gutter={[16, 24]}>` | `<Row :gutter="[16, 24]">` |
| `<Col xs={{ span: 8 }}>`  | `<Col :xs="{ span: 8 }">`  |

完整源码证据、RTL、SSR 与验收范围见 [对齐矩阵](./alignment.md)。
