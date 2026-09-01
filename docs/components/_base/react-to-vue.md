# `_base` React → Vue 迁移

## 类继承 → Composition API 控制器

React 组件可以继承 `BaseComponent` 并依赖类生命周期。Vue 不使用 Options API 或类组件
继承，改为在 `<script setup>` 中组合控制器：

```ts
const controller = useBaseComponent({ props, state });
controller.foundation = new CustomFoundation(controller.adapter);
```

| React v2.102.0          | Vue                               | 说明                           |
| ----------------------- | --------------------------------- | ------------------------------ |
| `extends BaseComponent` | `useBaseComponent(...)`           | 生命周期由 composable 绑定     |
| `componentDidMount`     | `mount` / Vue `onMounted`         | 调用 Foundation `init`         |
| `componentWillUnmount`  | `unmount` / Vue `onBeforeUnmount` | 调用 `destroy` 并清 cache      |
| `this.props`            | readonly Vue props                | props 向下，只读               |
| `this.state`            | shallow/reactive state            | adapter 的 `setState` 原位合并 |
| `className`             | `class`                           | Vue 原生 attribute             |
| `children`              | 默认 slot                         | Vue 原生内容分发               |
| `reactUtils`            | `component-utils`                 | 使用 Vue component/VNode 判定  |

`BaseFoundation` 名称、adapter 方法职责、受控判定、cache 和 `data-*` 转发保持不变。
