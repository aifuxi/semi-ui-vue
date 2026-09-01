# `_base` v2.102.0 对齐矩阵

## 基线与范围

- 唯一基线：`vendor/semi-design` tag `v2.102.0`，commit
  `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- 上游根入口公开 `BaseFoundation` 与 `BaseComponent`；公开深层入口还包含
  `_base/base`、`_base/baseComponent`、`_base/reactUtils`。
- 这是基础设施模块，不是可视组件。固定基线没有独立文档、单元测试或可截图 DOM；
  `_story` 只演示其他组件的可访问性，不构成 `BaseComponent` 的视觉契约。

## Vue 边界与职责

| 文件                          | 单一职责                                                            | 公开边界                                    |
| ----------------------------- | ------------------------------------------------------------------- | ------------------------------------------- |
| `_base/base.ts`               | Vue 版基础 props、动效与校验状态类型                                | `./_base/base`                              |
| `_base/base-foundation.ts`    | 隔离私有集成包并提供稳定的公开 Foundation 类型 facade               | `./_base/base-foundation`                   |
| `_base/base-component.ts`     | 为 Foundation Adapter 提供 props/state/context/cache 与生命周期控制 | 根入口、`./_base`、`./_base/base-component` |
| `_base/component-utils.ts`    | 识别 Vue 组件、VNode、HTML 元素与空 children                        | `./_base/component-utils`                   |
| `foundation-integration/base` | 选择性编译固定 `BaseFoundation`                                     | 私有边界，公开包构建时内联                  |

`BaseComponent` 保持纯控制器，不伪装成可渲染 SFC。`useBaseComponent` 只负责把
`mount/unmount` 接到 Vue 生命周期；业务组件仍以 Composition API 和显式 adapter 为主。

## API、状态与事件

| React v2.102.0                               | Vue 映射                                           | 结论                                 |
| -------------------------------------------- | -------------------------------------------------- | ------------------------------------ |
| `BaseProps.className` / `style` / `children` | `class` / `style` / 默认 slot                      | React 专属字段不进入基础 prop 类型   |
| `BaseComponent<P,S>`                         | `BaseComponent<P,S,C>` 控制器                      | 不使用 Vue Options API 继承          |
| `componentDidMount/WillUnmount`              | `mount/unmount`；`useBaseComponent` 自动接生命周期 | `init/destroy` 顺序保持一致          |
| `adapter.get* / set*`                        | 同职责、类型化的 Vue adapter                       | props 只读；state/cache 由控制器维护 |
| `isControlled(key)`                          | 同名，使用 own-property 判断                       | 显式 `undefined` 仍视为受控          |
| `setStateAsync`                              | 合并 state 后等待 Vue `nextTick`                   | 对调用方提供渲染提交后的 Promise     |
| `reactUtils`                                 | `component-utils`                                  | React 判定改为 Vue 组件/VNode 判定   |

`stopPropagation` 同时停止原生传播和可选包装事件的 immediate propagation；
`getDataAttr` 只转发 `data-*`。卸载先调用 Foundation `destroy`，再清空 cache。

## DOM、样式、可访问性与平台

- 模块自身不创建 DOM、class、ARIA、Portal、动效或焦点；无 light/dark、RTL、Locale
  和移动布局差异，因此没有独立 Chromium 截图或 computed-style 场景。
- 上游 `base.scss` 已由默认主题根入口按固定编译顺序包含；`_base` 不新增重复样式入口。
- HTML 元素判定在没有 `HTMLElement` 的 SSR 环境返回 `false`，公开入口不访问 DOM。

## SSR、发布与框架映射

- 根入口及五个 `_base` 子路径必须 SSR-safe，声明不得泄漏 `vendor/**`、React 或私有包。
- 真实 tarball 验证运行时导入、类型消费、`BaseFoundation` 内联、子路径目标、许可证与 SBOM。
- 框架映射（不作为 behavior deviation）：React 类组件继承模型改为 Vue Composition API
  可用的控制器和 composable；
  `children` 改为 slot，`className` 改为 `class`。这是框架原生映射，不影响 Foundation
  Adapter 的状态、缓存、受控判定或生命周期能力。

## 验收门禁

- 单元：init/destroy、state/cache、受控判定、data attr、事件传播、VNode/组件/HTMLElement 判定。
- SSR：无 `document/window/HTMLElement` 时根与全部子路径可导入并执行安全分支。
- 发布：根/子路径 ESM 与声明、tree-shaking、真实 tarball consumer、许可证/SBOM。

## 完成证据

- `_base` / `_utils` 定向共 4 个测试文件、16 项行为与 SSR 测试通过；全仓
  `pnpm check` 的 163 个测试文件、1116 项测试全部通过。
- 根入口和 `_base` 的五个公开子路径均通过构建后 Node SSR import；生成声明与运行时
  扫描确认没有 `@workspace`、`vendor/semi-design` 或 React 泄漏。
- 真实 tarball consumer 已验证运行时、类型、exports、Foundation 内联、许可证和 SBOM；
  React/Vue 工作台 Chromium smoke 2/2 通过。
- 本模块没有独立 DOM、样式或交互状态，截图/computed-style/几何比较不适用；没有更新
  视觉基线，也未运行全仓组件浏览器回归。
- 除已记录的 Vue 类继承映射外没有未解释或 accepted behavior deviation，切片标记为
  `ready`。
