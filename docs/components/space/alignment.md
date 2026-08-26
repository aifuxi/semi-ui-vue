# Space v2.102.0 对齐矩阵

## 固定证据

- React Adapter：`vendor/semi-design/packages/semi-ui/space/index.tsx`
- children 展平：`vendor/semi-design/packages/semi-ui/space/utils.ts`
- Foundation 常量：`vendor/semi-design/packages/semi-foundation/space/constants.ts`
- Foundation 样式：`vendor/semi-design/packages/semi-foundation/space/space.scss`
- 默认变量：`vendor/semi-design/packages/semi-foundation/space/variables.scss`
- RTL：`vendor/semi-design/packages/semi-foundation/space/rtl.scss`
- 中英文文档：`vendor/semi-design/content/basic/space/`
- 上游单测：`vendor/semi-design/packages/semi-ui/space/__test__/space.test.js`

以上文件均来自只读 submodule 的 `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。

## 组件边界

`Space.vue` 只负责根容器的方向、交叉轴对齐、换行、间距 class/inline style，以及原生 attrs 和默认 slot。组件没有状态、事件、Observer、Portal 或 Foundation 运行时实例，也没有可复用的副作用逻辑，因此不拆分子组件或 composable。

## 公开 API 与默认值

| 固定 React API      | v2.102.0 行为                                                          | Vue API                                    | 结论         |
| ------------------- | ---------------------------------------------------------------------- | ------------------------------------------ | ------------ |
| `align`             | `start / center / end / baseline`，默认 `center`                       | 同名 typed prop、相同枚举和默认值          | 等价         |
| `spacing`           | `tight / medium / loose / number / array`，默认 `tight`                | 同名 typed prop；array 顺序为水平、垂直    | 等价         |
| `vertical`          | boolean，默认 false；控制 `row / column`                               | 同名 typed prop、相同默认值                | 等价         |
| `wrap`              | boolean，默认 false；仅水平有效，`vertical=true` 时强制关闭            | 同名 typed prop、相同优先级                | 等价         |
| `children`          | 展平数组与 Fragment，忽略 null/undefined/boolean                       | 默认 slot；Vue Fragment 输出为同级 DOM     | Vue 原生映射 |
| `className / style` | 根 div class/style；数字 spacing 在复制 style 后写入，因此覆盖同轴 gap | 原生 `class / style` attrs，保持相同覆盖序 | Vue 原生映射 |
| `data-*`            | `getDataAttr` 透传到根 div                                             | `$attrs` 透传；同时支持 Vue 原生 attrs     | Vue 原生增强 |

组件没有受控/非受控双态，也不修改调用方 props。

## DOM、class 与计算样式

- 根节点固定为 `div.semi-space[x-semi-prop=children]`，slot 子节点直接位于根节点下。
- 水平/垂直分别输出 `semi-space-horizontal`、`semi-space-vertical`，对应 `flex-direction: row/column`。
- `align` 输出 `semi-space-align-{value}`，映射到 `align-items`。
- 只有 `wrap && !vertical` 输出 `semi-space-wrap`。
- 预设 spacing 分别输出水平和垂直 class：tight 8px、medium 16px、loose 24px。
- number 同时写入 `column-gap` 与 `row-gap`；array 第 0 项控制水平，第 1 项控制垂直。字符串项生成 class，数字项生成 px inline style，缺失项不补默认值。
- 调用方 class 合并到根节点；调用方 style 先合并，spacing 派生 gap 后覆盖同名值，与固定 Adapter 一致。

## 行为、可访问性与运行环境

- Space 仅提供视觉布局，不默认增加 role、ARIA、tabindex 或键盘行为；语义由子节点与调用方原生 attrs 决定。
- 没有事件顺序、焦点管理、Portal、动效、国际化数据或异步资源。
- light/dark 不改变 Space 自身 gap，但场景仍按最低视觉矩阵验证组件与主题组合。
- `.semi-rtl` / `.semi-portal-rtl` 为根容器写入 `direction: rtl`；方向敏感场景独立验证。
- import、SSR render 与 hydration 均不访问浏览器全局。

## 验收矩阵

| 证据                  | 场景                                                                                                       |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| 单元行为              | 默认值、attrs/class、三种预设、number/array、style 优先级、四种 align、方向、wrap、Fragment、SSR/hydration |
| Chromium 行为/无障碍  | 本地固定源码请求、十个节点、DOM/class、无默认交互语义、无运行时错误                                        |
| computed style / 几何 | 十个节点逐项精确比较：display、direction、flex、align、wrap、row/column gap、width；每轴误差不超过 0.5px   |
| 视觉                  | desktop 1440×900 与 mobile 390×844，light/dark；额外 desktop light RTL；组件裁剪                           |
| 发布                  | 根/`space` 子路径 ESM 与 types、根/`space.css`、SSR import、真实 tarball 安装                              |

截图阈值保持 `threshold=0.1`、`maxDiffPixelRatio=0.001`，同时要求同一 Chromium 中 React/Vue 组件截图字节完全一致。

## Deviation

当前没有 accepted visual/behavior deviation。React `children`、`className`、`style` 迁移为 Vue 默认 slot 与原生 attrs；Vue 额外允许 `id / role / aria-*` 等 attrs 透传，这是 Vue 原生 API 映射，不改变固定场景的视觉或布局行为。
