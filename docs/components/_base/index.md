# `_base` 基础设施

`_base` 提供固定 Semi v2.102.0 Foundation 架构在 Vue 中的公共基础边界。它不渲染
独立 UI；业务组件继续使用 Composition API，只有需要构造自定义 Foundation adapter
时才直接使用这里的控制器和类型。

## 导入

```ts
import { BaseComponent, BaseFoundation, useBaseComponent } from '@aifuxi/semi-ui-vue';
import type { BaseProps, ValidateStatus } from '@aifuxi/semi-ui-vue/_base';
```

## 在 setup 中绑定生命周期

```ts
const controller = useBaseComponent({
  props,
  state: shallowReactive({ visible: true }),
  context: { locale: 'zh-CN' },
});

controller.foundation = new CustomFoundation(controller.adapter);
```

`useBaseComponent` 在组件挂载后调用 `foundation.init()`，卸载时调用
`foundation.destroy()` 并清空 cache。`isControlled(key)` 使用 own-property 判断，显式
传入 `undefined` 也属于受控。

## 子路径

- `/_base`：完整公开入口。
- `/_base/base`：基础 props、动效与 `ValidateStatus` 类型。
- `/_base/base-foundation`：固定 `BaseFoundation` 公共 facade。
- `/_base/base-component`：控制器与 `useBaseComponent`。
- `/_base/component-utils`：Vue 组件、VNode、HTMLElement 与空 children 判定。

该模块没有专属 DOM 或 CSS；默认主题根入口已经包含固定 base 样式。
