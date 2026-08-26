# Divider v2.102.0 对齐矩阵

## 固定证据

- React Adapter：`vendor/semi-design/packages/semi-ui/divider/index.tsx`
- Foundation 常量：`vendor/semi-design/packages/semi-foundation/divider/constants.ts`
- Foundation 样式：`vendor/semi-design/packages/semi-foundation/divider/divider.scss`
- 默认变量：`vendor/semi-design/packages/semi-foundation/divider/variables.scss`
- 中文文档：`vendor/semi-design/content/basic/divider/index.md`
- 英文文档：`vendor/semi-design/content/basic/divider/index-en-US.md`
- 上游单测：`vendor/semi-design/packages/semi-ui/divider/__test__/divider.test.js`

以上文件均来自只读 submodule 的 `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。

## 组件边界

`Divider.vue` 只负责根分割线的方向、虚线、边距、内容对齐、class 和 attrs。`DividerContentRenderer.ts` 只处理 React `children` 到 Vue 默认 slot 的 DOM 映射：单个纯文本节点生成上游同名内部 span，非文本 VNode 直接输出。Divider 没有状态、事件、Observer、Portal 或 Foundation 运行时实例，不需要 composable。

## 公开 API 与默认值

| 固定 React API          | v2.102.0 行为                                              | Vue API                                  | 结论         |
| ----------------------- | ---------------------------------------------------------- | ---------------------------------------- | ------------ |
| `align`                 | `left / right / center`，默认 `center`；只影响水平内容模式 | 同名 typed prop、相同枚举和默认值        | 等价         |
| `dashed`                | boolean，默认 false；切换水平下边框或垂直左边框为虚线      | 同名 typed prop、相同默认值              | 等价         |
| `layout`                | `horizontal / vertical`，默认 `horizontal`                 | 同名 typed prop、相同枚举和默认值        | 等价         |
| `margin`                | number/string；水平映射上下，垂直映射左右                  | 同名 prop；Vue 数字 style 同样转换为 px  | 等价         |
| `children`              | 水平时渲染；纯字符串包内部 span；垂直时忽略                | 默认 slot；保留相同 DOM 分支             | Vue 原生映射 |
| `className / style`     | 根 div class/style，显式 style 后覆盖 margin 派生值        | 原生 `class / style` attrs，保持覆盖顺序 | Vue 原生映射 |
| `id / role / aria-*` 等 | `...rest` 透传根 div                                       | `$attrs` 透传根 div                      | Vue 原生映射 |

组件没有受控/非受控双态，也不修改调用方 props。

## DOM、class 与计算样式

- 根节点固定为 `div.semi-divider`。
- 水平与垂直分别输出 `semi-divider-horizontal`、`semi-divider-vertical`。
- 虚线输出 `semi-divider-dashed`。
- 水平且有内容时输出 `semi-divider-with-text` 与 `semi-divider-with-text-{align}`。
- 单个纯文本 slot 输出 `span.semi-divider_inner-text[x-semi-prop=children]`；自定义 VNode 直接位于根 div 下。
- 水平线使用 1px `border-bottom`、宽 100%；垂直线使用 1px `border-left`、高 20px、`vertical-align: middle`。
- 左/右内容对齐的短线固定为 40px；中间内容两侧各占 50%。纯文本左右 padding 为 8px，font-weight 为 600。
- `margin` 先生成轴向 inline style，调用方传入的原生 `style` 后合并并可覆盖同名值。

## 行为、可访问性与运行环境

- Divider 没有点击、键盘、焦点或受控事件；根 div 保持非可聚焦。
- 固定 Adapter 不默认写入 ARIA。需要语义分隔时，调用方可通过 attrs 传入 `role="separator"`；垂直模式同时传 `aria-orientation="vertical"`。React/Vue 场景都验证了这些 attrs。
- 没有 Portal、动效、异步资源、全局监听或国际化数据。
- light/dark 由相同 `--semi-color-border` 与 `--semi-color-text-0` Token 驱动。
- `align=left/right` 保持固定源码的物理方向语义；`.semi-rtl` 和原生 `dir` 不交换枚举含义，RTL 场景单独对照。
- 组件 import 与 SSR render 都不访问 DOM；适用于服务端渲染和 hydration。

## 验收矩阵

| 证据                  | 场景                                                                                          |
| --------------------- | --------------------------------------------------------------------------------------------- |
| 单元行为              | 默认值、attrs/class/style、margin 覆盖、虚线、三种 align、文本/自定义 slot、垂直忽略内容、SSR |
| Chromium 行为/无障碍  | 本地固定源码请求、八个节点、role/ARIA 透传、水平/垂直边框、无运行时错误                       |
| computed style / 几何 | 八个节点逐项精确比较；伪元素短线宽度；bounding rect 每轴差不超过 0.5 CSS px                   |
| 视觉                  | desktop 1440×900 与 mobile 390×844，light/dark；额外 desktop light RTL；组件裁剪              |
| 发布                  | 根/`divider` 子路径 ESM 与 types、根/`divider.css`、SSR import、真实 tarball 安装             |

截图阈值保持 `threshold=0.1`、`maxDiffPixelRatio=0.001`，同时要求同一 Chromium 中 React/Vue 组件截图字节完全一致。

## Deviation

当前没有 accepted visual/behavior deviation。React `children`、`className`、`style` 仅按 Vue 原生 slot 与 attrs 迁移，不作为差异。
