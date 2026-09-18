# Icon React → Vue 迁移

| React v2.102.0                                    | Vue                                                 | 说明                                                          |
| ------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------- |
| `import { IconHome } from '@douyinfe/semi-icons'` | `import { IconHome } from '@aifuxi/semi-icons-vue'` | 523 个稳定图标同名；Lab 图标来自 `@aifuxi/semi-icons-lab-vue` |
| `import Icon from '@douyinfe/semi-icons'`         | `import Icon from '@aifuxi/semi-icons-vue'`         | 基类 default 导出；主 UI 包根与 `icon` 子路径转发稳定基类     |
| `<Icon svg={<Svg />} />`                          | `:svg="node"` 或默认 slot                           | slot 优先；节点不克隆、不修改                                 |
| `convertIcon(renderSvg, type)`                    | 同名函数，`renderSvg({ fill })` 返回 `VNode`        | 生成组件继承 `Icon` props                                     |
| `size` / `spin` / `rotate` / `fill` / `type`      | 同名 prop                                           | class、内联 transform 与 `currentColor` 契约不变              |
| `prefixCls`                                       | 同名 prop，缺省 `semi`                              | 自定义前缀时 class 为 `{prefixCls}-icon*`                     |
| `style` / `className`                             | Vue 原生 `style` / `class`，并保留兼容 `className`  | 根 `span` 合并，不产生额外包装                                |
| `ref` 指向根节点                                  | 组件 ref 暴露 `element`（根 `span`）                | React `ref` 的 DOM 语义映射为 Vue expose                      |
| `aria-label` / `role`                             | 同名原生 attrs                                      | 缺省 `role="img"`，`aria-label` 取 `type`，调用方 attrs 覆盖  |

Vue 追加的原生能力（不改变固定基线行为）：

- 默认 slot 可直接渲染自定义 SVG 节点，模板写法无需 `h()`。
- `element` expose 提供根 `span`，便于测量或聚焦包裹元素，不改变 DOM 结构。

样式、主题与可访问性契约不随迁移改变；逐项证据见[对齐矩阵](./alignment.md)。
