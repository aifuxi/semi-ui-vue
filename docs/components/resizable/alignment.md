# Resizable v2.102.0 对齐矩阵

## 固定源码证据

- 公开入口：`vendor/semi-design/packages/semi-ui/resizable/index.tsx`
- 单体 Adapter：`vendor/semi-design/packages/semi-ui/resizable/single/resizable.tsx`、`single/resizableHandler.tsx`
- 组合 Adapter：`vendor/semi-design/packages/semi-ui/resizable/group/resizeGroup.tsx`、`resizeItem.tsx`、`resizeHandler.tsx`
- Foundation：`vendor/semi-design/packages/semi-foundation/resizable/single/index.ts`、`group/index.ts`、`types.ts`、`utils.ts`
- 样式：`vendor/semi-design/packages/semi-foundation/resizable/resizable.scss`、`variables.scss`
- 中英文文档：`vendor/semi-design/content/basic/resizable/index.md`、`index-en-US.md`
- 上游没有独立的 Resizable 单元或 E2E 测试；固定 stories 与同环境 React 运行结果共同作为行为证据。

## Vue 实现边界

| 文件                                      | 职责                                                                      | 隔离说明                                        |
| ----------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------- |
| `Resizable.vue`                           | 单体根节点、八方向手柄、受控/非受控尺寸与遮罩                             | 公开 Vue props、emits、slots 与 attrs 边界      |
| `use-single-resize.ts`                    | Vue Adapter：连接固定单体 Foundation 与 reactive state、emits、DOM/window | Foundation 只从私有集成包进入并在公开构建中内联 |
| `ResizeGroup.vue` / `use-resize-group.ts` | Vue Adapter：组合注册、固定 Group Foundation、方向切换与客户端清理        | provider 实例隔离，嵌套 Group 只消费最近上下文  |
| `ResizeItem.vue` / `ResizeHandler.vue`    | 面板约束、回调与公共分隔条                                                | 脱离 Group 时明确报错                           |
| `SingleResizeHandle.vue`                  | 单体内部手柄的 mouse/touch 输入                                           | 非公开组件                                      |
| `ResizableNodeRenderer.ts`                | 将脚本传入的 `handleNode` VNode 输出到对应手柄                            | 模板用户优先使用具名 slot                       |

`packages/foundation-integration/src/resizable.js` 是唯一的固定 Foundation 运行时入口；其独立声明 facade 隔离上游旧 TypeScript 编译设置。Vue 组件不直接跨目录依赖 `vendor/**`，Vite 将 Foundation 内联到公开 ESM，而发布声明不泄漏私有包或 vendor 路径。

## 公开 API 与默认值

### Resizable

| React v2.102.0                                                  | Vue                                     | 默认值/结论                                                              |
| --------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------ |
| `size`                                                          | `size` + `v-model:size`                 | 受控尺寸；拖拽发出 `update:size`                                         |
| `defaultSize`                                                   | `defaultSize`                           | 非受控初始尺寸；缺省轴为 `auto`                                          |
| `minWidth/minHeight/maxWidth/maxHeight`                         | 同名 typed props                        | 支持 number、px、%、vw、vh                                               |
| `grid`                                                          | `grid`                                  | 默认 `[1, 1]`；兼容固定 Foundation 实际支持的单数字输入                  |
| `snap/snapGap`                                                  | 同名 typed props                        | `snapGap` 默认 `0`                                                       |
| `boundElement/boundsByDirection`                                | 同名 typed props                        | 未指定边界；`boundsByDirection=false`                                    |
| `lockAspectRatio` 与两个 extra prop                             | 同名 typed props                        | `false`、`0`、`0`                                                        |
| `enable`                                                        | 同名 typed prop                         | 除显式 `false` 的方向外，八方向默认启用；整体 `false` 时不渲染手柄包装层 |
| `handleStyle/handleClass/handleWrapperStyle/handleWrapperClass` | 同名 typed props                        | DOM/class/style 等价                                                     |
| `handleNode`                                                    | 同名脚本 prop，另有八个 `handle-*` slot | slot 是 Vue 模板原生映射                                                 |
| `scale/ratio`                                                   | 同名 typed props                        | 均默认 `1`；`ratio` 支持标量与二元组                                     |
| `onResizeStart` 返回 `false`                                    | `beforeResizeStart` prop                | Vue emit 无返回值通道，因此取消守卫改为显式 prop                         |
| `onResizeStart/onChange/onResizeEnd`                            | `resizeStart/change/resizeEnd` emits    | 参数顺序与方向值保持一致                                                 |
| `children`                                                      | 默认 slot                               | Vue 原生映射                                                             |

### ResizeGroup / ResizeItem / ResizeHandler

| React v2.102.0           | Vue                                  | 默认值/结论                                                           |
| ------------------------ | ------------------------------------ | --------------------------------------------------------------------- |
| `ResizeGroup.direction`  | 同名 prop                            | `horizontal`，支持运行时切换到 `vertical`                             |
| Group `children`         | 默认 slot                            | Item/Handler 按 DOM 顺序注册                                          |
| `ResizeItem.defaultSize` | 同名 prop                            | `%`/`px` 为固定份额；数字或纯数字字符串为剩余空间权重；缺省权重为 `1` |
| `ResizeItem.min/max`     | 同名 string props                    | 支持 px、% 与纯数字像素                                               |
| Item 三个回调            | `resizeStart/change/resizeEnd` emits | 分隔条两侧分别使用 right/left 或 bottom/top                           |
| Handler `children`       | 默认 slot                            | 缺省输出 `IconHandle`；纵向 Group 旋转 90°                            |
| class/style              | Vue 原生 class/style attrs           | 固定 `.semi-resizable-*` class 保留                                   |

`ResizeHandler` 在公开入口中指组合分隔条；单体内部的 `ResizableHandler` 没有公开导出。

## 状态、事件与尺寸计算

- 单体 `mousedown/touchstart` 先执行取消守卫，再记录指针、DOM 尺寸、flexBasis、边界和 cursor，最后进入 resize 状态并注册 window 事件。
- mouse 使用 `mousemove/mouseup/mouseleave`；touch 使用非 passive 的 `touchmove` 与 `touchend/touchcancel`。结束和卸载均清理监听器。
- 单体按方向与 `scale/ratio` 计算新尺寸，依次处理绝对 snap、宽高比与 min/max/bounds、grid，并保留初始 `%/vw/vh` 单位。
- 受控 `size` 在拖拽中提供计算起点；每次有效变化发出 `change` 与 `update:size`，结束后恢复到外部传入值。
- Group 扣除每个 Handler 各半空间后分配 Item；拖动只改变分隔条相邻的两个 Item，总百分比保持不变。
- Group 的 min/max 同时约束相邻面板；窗口变化以 200ms debounce 重新校正 px 约束，并从后续未越界面板补偿空间。
- direction 动态切换时，现有 width/height 表达式迁移到新轴并删除旧轴内联尺寸。

## DOM、样式、主题与运行环境

- 单体根为 `div.semi-resizable-resizable`，默认八个手柄使用 `.semi-resizable-resizableHandler-{direction}`；边手柄为 10px，角手柄为 20px。
- Group 根为 `div.semi-resizable-group`，Item 为 `.semi-resizable-item`，Handler 为 `.semi-resizable-handler-{horizontal|vertical}`。
- 拖拽时单体或 Group 根内增加透明、fixed 的 `.semi-resizable-background`，避免 iframe/内容抢占指针。
- 默认主题直接编译固定 global、Resizable SCSS 与默认图标样式，light/dark 通过 `--semi-color-fill-0` 等 token 对齐。
- 固定源码没有 Resizable 专属 RTL 分支；方向由指针几何而非文案方向决定。测试仍覆盖 LTR 桌面/移动 light/dark，RTL 不增加无证据的镜像行为。
- 组件不含国际化文本、Portal 或动效，不需要 Locale、Portal 容器或动画时刻矩阵。
- 固定 React 手柄没有 role、tabindex、ARIA 或键盘处理；Vue 保持 mouse/touch 输入契约，不虚构键盘语义。
- import 与 SSR render 不访问 window/document；测量、Observer 替代逻辑和全局事件均在客户端生命周期内执行。

## 验收证据

| 门槛          | 覆盖                                                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 类型          | 根/`resizable` 子路径导出，四组件 props/emits/slots 与尺寸、方向、手柄类型                                                      |
| 单元          | 默认 DOM、八方向启停、attrs/slots、事件顺序、取消守卫、受控尺寸、min/max/grid/ratio、Group 分配/约束/方向/回调、上下文错误、SSR |
| Chromium 行为 | 固定源码请求、DOM 数量、无键盘语义、单体与 Group 真实拖拽、回调文本、六目标 computed style 与 bounding rect                     |
| Chromium 视觉 | 1440×900 与 390×844、DPR 1、light/dark；React/Vue 组件裁剪截图逐字节相等                                                        |
| 发布          | 根/`resizable` ESM 与 types、根/`resizable.css`、SSR import、真实 tarball 安装与消费端类型检查                                  |

## Deviation

当前没有 accepted visual/behavior deviation。以下两项是 Vue 原生 API 映射，不改变固定行为：

1. React callback 的 `false` 返回值无法通过 Vue emit 读取，因此使用 `beforeResizeStart` prop；开始、变化、结束仍通过 typed emits 输出。
2. React `handleNode` 与 `children` 同时保留脚本 prop 兼容和 Vue slots；具名手柄 slot 优先于 `handleNode`。
