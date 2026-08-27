# Switch v2.102.0 对齐矩阵

## 固定源码证据

- React Adapter：`vendor/semi-design/packages/semi-ui/switch/index.tsx`
- Foundation：`vendor/semi-design/packages/semi-foundation/switch/foundation.ts`
- 常量与样式：`vendor/semi-design/packages/semi-foundation/switch/constants.ts`、`switch.scss`、`variables.scss`、`rtl.scss`
- loading 依赖：`vendor/semi-design/packages/semi-ui/spin/index.tsx`、`spin/icon.tsx` 与 `semi-foundation/spin/spin.scss`
- 中英文文档：`vendor/semi-design/content/input/switch/index.md`、`index-en-US.md`
- 上游测试：`vendor/semi-design/packages/semi-ui/switch/__test__/switch.test.js`

## 组件边界

- `Switch.vue`：公开 props/emits/slots、固定 wrapper/input DOM、受控与非受控协调、ARIA 和事件转发。
- `SwitchSpin.vue`：只复现 Switch loading 所依赖的固定 Spin DOM、渐变 SVG 与尺寸 class；不提前发布完整 Spin 组件。
- `SwitchNodeRenderer.ts`：让 `checkedText`/`uncheckedText` prop 可接收 Vue `VNodeChild`；Vue 模板优先使用同名 slot。
- `packages/foundation-integration/src/switch.js`：公开组件访问固定 Switch Foundation 的唯一入口；构建后内联，不泄漏私有包或 vendor 路径。

## API、状态与事件

| 维度       | Semi React v2.102.0                                                         | Vue 公开契约                                                               | 结论                            |
| ---------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------- |
| 非受控     | `defaultChecked` 初始化，change 后 Foundation 更新内部 checked              | `defaultChecked`；change 后更新内部 checked                                | 等价                            |
| 受控       | `checked` 决定显示，`onChange(checked, event)` 请求父级更新                 | `checked` + `@change`；并支持 `v-model`/`modelValue`                       | Vue 原生扩展，`checked` 优先    |
| 更新事件   | `onChange(checked, ChangeEvent)`                                            | `change(checked, Event)`，随后 `update:checked`、`update:modelValue`       | 保留回调信息并增加 Vue 双向绑定 |
| 禁用       | `disabled=false`，Foundation 在 mount/prop 更新时同步 native disabled       | 同默认值与同步顺序                                                         | 等价                            |
| 加载       | `loading=false`；input disabled，wrapper 有 loading class，knob 替换为 Spin | 同 DOM/class/禁用行为                                                      | 等价                            |
| 尺寸       | `large/default/small`，默认 `default`                                       | 同枚举与默认值                                                             | 等价                            |
| 文本       | `checkedText`/`uncheckedText` 为 ReactNode；small 不渲染                    | 同名 VNodeChild prop；另提供同名 slot；small 不渲染                        | 框架原生映射                    |
| 样式与监听 | `className`、`style`、`onMouseEnter`、`onMouseLeave` 绑定 wrapper           | `class`、`style`、`@mouseenter`、`@mouseleave` 作为 Vue attrs 绑定 wrapper | 框架原生映射                    |
| input 标识 | `id` 绑定原生 input                                                         | 同名 prop 绑定原生 input                                                   | 等价                            |
| ARIA       | label/labelledby/describedby/invalid/errormessage 绑定 input                | 模板使用同名 kebab-case attribute，类型侧为对应 camelCase prop             | Vue 模板原生映射                |

事件顺序：非受控 change 由 Foundation 先写入可见 checked，再通知 `change`，之后发出两个 Vue update 事件；受控 change 不自行提交状态，父级通过 `checked` 或 `v-model` 更新后才改变 class/input。若父级拒绝更新，浏览器临时切换的原生 checkbox 会在 Vue tick 后恢复受控值。

## DOM、样式、键盘与可访问性

| 状态          | 固定 DOM/class 契约                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| 根节点        | `div.semi-switch`；data attr、class/style、鼠标监听位于 wrapper                                        |
| 关闭/开启     | 开启追加 `.semi-switch-checked`；普通状态包含 `.semi-switch-knob[aria-hidden=true]`                    |
| disabled      | `.semi-switch-disabled`；原生 input disabled；`aria-disabled` 反映 `disabled` prop                     |
| loading       | `.semi-switch-loading`；Spin 为 `.semi-switch-loading-spin.semi-spin.semi-spin-{size}`；input disabled |
| size          | large/small 分别追加 `.semi-switch-large`/`.semi-switch-small`                                         |
| focus-visible | input 匹配 `:focus-visible` 时 wrapper 追加 `.semi-switch-focus`，blur 清除                            |
| 文本          | `.semi-switch-checked-text`/`.semi-switch-unchecked-text`，保留 `x-semi-prop`                          |
| 原生控件      | `input.semi-switch-native-control[type=checkbox][role=switch]` 覆盖整个开关                            |
| RTL           | `.semi-rtl`/`.semi-portal-rtl` 下 knob、loading Spin 与文本位置使用固定反向 transform                  |

Tab/Shift+Tab 聚焦原生 input，Space 由浏览器原生 checkbox 行为触发 change。没有额外模拟 click/keydown，避免双触发。loading 和 disabled 直接禁用原生 input。

## 主题、动效、SSR 与验证

- `packages/theme-default/switch.css` 的编译顺序是 theme index → global → Switch SCSS → Spin SCSS，覆盖 light/dark、hover/active/focus、三尺寸、loading 和 RTL。
- Switch 背景与 knob transition 均为固定 `200ms`；Spin SVG 旋转为固定 `600ms linear infinite`。
- SSR import 不访问 DOM；受控/defaultChecked、文本、loading SVG 与 ARIA 可稳定渲染。Foundation 的 mount/destroy 仅在客户端生命周期执行。
- 单元测试覆盖 DOM、ARIA、受控/非受控、`v-model`、事件、disabled/loading、尺寸/文本、focus-visible、鼠标监听和 SSR。
- Chromium 对照覆盖固定源码请求、11 个目标的 computed style/几何/局部像素、鼠标/Space/focus、Spin 动画、桌面/移动 light/dark 与 RTL 截图。
- tarball 验证覆盖根/`switch` 子路径 ESM、声明、SSR import 与 `switch.css` 安装解析。

## React → Vue 迁移

| React                                            | Vue                                             |
| ------------------------------------------------ | ----------------------------------------------- |
| `<Switch checked={value} onChange={setValue} />` | `<Switch v-model="value" />`                    |
| `<Switch checked={value} onChange={handler} />`  | `<Switch :checked="value" @change="handler" />` |
| `onChange(checked, event)`                       | `@change="(checked, event) => ..."`             |
| `checkedText={<Icon />}`                         | `<template #checkedText><Icon /></template>`    |
| `uncheckedText={<Icon />}`                       | `<template #uncheckedText><Icon /></template>`  |
| `className` / `style`                            | `class` / `style`                               |
| `onMouseEnter` / `onMouseLeave`                  | `@mouseenter` / `@mouseleave`                   |

没有 accepted visual/behavior deviation。Vue 新增 `v-model`、update emits 与 slots 是框架原生 API 映射，不改变固定默认 DOM、状态或事件载荷。
