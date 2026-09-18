# Button React → Vue 迁移

| React v2.102.0                                       | Vue                                                                   | 说明                                                                      |
| ---------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `import { Button } from '@douyinfe/semi-ui'`         | `import { Button } from '@aifuxi/semi-ui-vue'`                        | 根导出与 `button` 子路径同名；named 导出，无默认导出                      |
| `<Button onClick={fn} />`                            | `@click="fn"`                                                         | `click`/`mousedown`/`mouseenter`/`mouseleave` 携带原生事件                |
| `icon={<Icon />}`                                    | `#icon` slot，或组件图标 prop                                         | slot 优先；函数/节点 prop 仍可用                                          |
| `iconPosition` / `iconSize` / `iconStyle`            | 同名 prop；`#icon` scoped slot 额外提供 `fill`/`iconSize`/`iconStyle` | 固定 Adapter 对 `iconSize`/`iconStyle` 无可观察输出                       |
| `loading`                                            | 同名 prop                                                             | 渲染固定 Spin、阻止交互，语义不变                                         |
| `disabled`                                           | 同名 prop                                                             | 输出原生 `disabled` 与 `aria-disabled="true"`                             |
| `block` / `circle` / `colorful`                      | 同名 prop                                                             | class 与 Token 契约不变                                                   |
| `noHorizontalPadding`                                | `boolean \| 'left' \| 'right' \| 数组`                                | 与固定 Adapter 的取值集合一致                                             |
| `contentClassName`                                   | `contentClass`                                                        | 作用于 `.semi-button-content` 容器；Vue 去掉 `Name` 后缀以贴合 props 命名 |
| `htmlType`                                           | 同名 prop                                                             | 缺省 `button`                                                             |
| `className` / `style`                                | Vue 原生 `class` / `style`，`contentClass` 管内容容器                 | 根节点属性透传，不产生额外包装                                            |
| `<ButtonGroup>` / `<SplitButtonGroup>`               | 同名命名导出                                                          | `size/theme/type/colorful/disabled` 合并到直接子 Button                   |
| `ref` 指向 React 实例（`ref.current` 即 button DOM） | 组件根为原生 `button`，通过组件 ref 的 `$el` 访问同一节点             | 组件不额外 expose 方法；根 DOM 与 class/style 不变                        |

Vue 追加的原生能力（不改变固定基线行为）：

- `Button`/`ButtonGroup`/`SplitButtonGroup` 均通过命名导出提供，模板与 render function 写法一致。
- 图标 slot 暴露 `fill`/`iconSize`/`iconStyle`，便于在 Vue 中直接驱动 Semi Icon 的填充与尺寸，不伪造上游不存在的 DOM。

样式、主题、RTL 与可访问性契约不随迁移改变；逐项证据见[对齐矩阵](./alignment.md)。
