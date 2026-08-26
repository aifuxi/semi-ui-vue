# Grid

A 24-column page layout system. The implementation targets Semi Design v2.102.0 and preserves the `.semi-row`, `.semi-col-*`, and `--semi-*` compatibility surface.

## Import

```ts
import { Col, Row } from '@workspace/ui';
// or import { Col, Row } from '@workspace/ui/grid';
import '@workspace/theme-default/grid.css';
```

## Basic usage

Col must be placed inside Row.

```vue
<Row>
  <Col :span="8">col-8</Col>
  <Col :span="8">col-8</Col>
  <Col :span="8">col-8</Col>
</Row>
```

## Gutter

A number sets the horizontal gutter. In a tuple, the first item is horizontal and the second is vertical. Either item may be a breakpoint object.

```vue
<Row :gutter="[{ xs: 8, md: 24, xl: 32 }, 16]">
  <Col v-for="item in 4" :key="item" :span="12">col-12</Col>
</Row>
```

## Flex layout

```vue
<Row type="flex" justify="space-between" align="middle">
  <Col :span="6" :order="3">Third</Col>
  <Col :span="6" :order="1">First</Col>
  <Col :span="6" :order="2">Second</Col>
</Row>
```

## Responsive layout

Each breakpoint accepts either a span number or a `span/order/offset/push/pull` object.

```vue
<Row>
  <Col :xs="{ span: 10, offset: 1 }" :md="{ span: 8, offset: 2 }" :lg="{ span: 6, push: 1 }">
    responsive
  </Col>
  <Col :xs="12" :md="10" :lg="8">adaptive</Col>
</Row>
```

## Row API

| Prop        | Type                                                      | Default | Description                      |
| ----------- | --------------------------------------------------------- | ------- | -------------------------------- |
| `type`      | `flex`                                                    | -       | Flex layout mode                 |
| `align`     | `top \| middle \| bottom`                                 | -       | Flex cross-axis alignment        |
| `justify`   | `start \| end \| center \| space-around \| space-between` | -       | Flex main-axis alignment         |
| `gutter`    | `GridGutter \| [GridGutter, GridGutter]`                  | `0`     | Horizontal/vertical grid spacing |
| `prefixCls` | `string`                                                  | `semi`  | Class prefix                     |

## Col API

| Prop                 | Type                | Default | Description                              |
| -------------------- | ------------------- | ------- | ---------------------------------------- |
| `span`               | `number`            | -       | Occupied columns; 0 hides the Col        |
| `order`              | `number`            | -       | Flex order                               |
| `offset`             | `number`            | -       | Empty columns before the Col             |
| `push`               | `number`            | -       | Columns moved right                      |
| `pull`               | `number`            | -       | Columns moved left                       |
| `xs/sm/md/lg/xl/xxl` | `number \| ColSize` | -       | Six responsive breakpoint configurations |
| `prefixCls`          | `string`            | `semi`  | Class prefix                             |

## Slot and native attributes

Row and Col expose a default slot and accept native `class`, `style`, role, ARIA, data, id, and event attrs. Col must be nested under Row.

## React → Vue

| React                     | Vue                        |
| ------------------------- | -------------------------- |
| `className`               | `class`                    |
| `children`                | Default slot               |
| `<Row gutter={[16, 24]}>` | `<Row :gutter="[16, 24]">` |
| `<Col xs={{ span: 8 }}>`  | `<Col :xs="{ span: 8 }">`  |

See the [alignment matrix](./alignment.md) for source evidence, RTL, SSR, and acceptance coverage.
