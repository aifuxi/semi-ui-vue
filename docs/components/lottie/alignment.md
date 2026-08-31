# Lottie v2.102.0 对齐矩阵

## 基线与路线

- 唯一基线：`vendor/semi-design` tag `v2.102.0`，commit
  `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- 固定 `content/order.js` 在 HotKeys 后列出 Lottie。Chat、MarkdownRender 与
  JsonViewer 仍受较重运行时或 Worker 链路阻塞；Lottie 只依赖独立的
  `lottie-web@5.13.0`，可单独验证容器、实例与生命周期，因此作为下一切片。
- 源码证据：
  - Adapter/API/DOM：`packages/semi-ui/lottie/index.tsx`。
  - Foundation/常量：`packages/semi-foundation/lottie/{foundation,constants}.ts`。
  - 中英文文档：`content/plus/lottie/`。
  - 固定 Foundation package：`lottie-web@^5.13.0`；本项目锁定 `5.13.0`。

## Vue 组件边界

| 文件                            | 单一职责                                                    | 公开边界                                   |
| ------------------------------- | ----------------------------------------------------------- | ------------------------------------------ |
| `Lottie.vue`                    | 归一化 props，管理内部/外部容器以及固定 Foundation 生命周期 | props、原生 attrs、实例回调                |
| `lottie/index.ts`               | 导出组件、公开类型与静态 `getLottie`                        | 根入口与 `lottie` 子路径                   |
| `foundation-integration/lottie` | 隔离固定 Foundation 与 `lottie-web` 运行时                  | 私有运行时边界；公开声明不泄漏 vendor 路径 |

组件只有一个容器职责和一个动画生命周期，不再拆分子组件或 composable。动画实例与
`lottie-web` 包对象保持原始身份，不进入 Vue 深层代理。

## 公开 API 与默认值

| React v2.102.0                   | 默认值                                                           | Vue 映射                                   | 结论                                             |
| -------------------------------- | ---------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------ |
| `params`                         | 必填；加载时补 `renderer: 'svg'`、`loop: true`、`autoplay: true` | 必填同名 prop                              | 调用方字段覆盖默认值；支持内部或外部 `container` |
| `width?: string`                 | `undefined`                                                      | 同名 prop                                  | 只作用于内部容器                                 |
| `height?: string`                | `undefined`                                                      | 同名 prop                                  | 只作用于内部容器                                 |
| `className?: string` / `style`   | `undefined`                                                      | `className`、`class`、`style` 与原生 attrs | 只作用于内部容器                                 |
| `getAnimationInstance(instance)` | `undefined`                                                      | 同名回调                                   | 初次加载和每次 params 重建后通知                 |
| `getLottie(lottie)`              | `undefined`                                                      | 同名回调                                   | mounted 初始化时通知一次                         |
| `Lottie.getLottie()`             | 静态同步方法                                                     | 同名静态同步方法                           | 返回同一 `lottie-web` 包对象                     |

ConfigProvider 的 `overrideDefaultProps.Lottie` 位于显式 prop 与缺省值之间。`params`
不做普通 truthiness 合并；显式字段（包括 `loop: false`、`autoplay: false`）必须覆盖固定
默认值。

## 状态、事件顺序与更新

1. SSR 仅渲染内部空 `div.semi-lottie`；不导入或执行浏览器播放器。
2. 客户端 mounted 后，内部模式使用组件容器，外部模式使用 `params.container`，并按
   `{ container, renderer: 'svg', loop: true, autoplay: true, ...params }` 调用
   `loadAnimation`。
3. Foundation 创建实例后依次通知 `getAnimationInstance(instance)` 与
   `getLottie(lottie)`；固定 React Adapter 的 `componentDidMount` 随后再次通知同一个
   animation instance，Vue 保留这一双回调时序。
4. `params` 深层值变化时先销毁旧实例，再以新参数创建实例并通知新实例。仅
   `width`、`height`、class、style 或回调变化不重建动画。
5. unmount 只销毁当前实例一次；外部容器由调用方拥有，组件不移除该 DOM。
6. `params.container` 存在时与 React 一致不渲染内部根节点，class/style/data/ARIA attrs
   因无组件根而不转移到外部容器。

## DOM、样式、主题与视觉

- 内部模式：单个空 `div.semi-lottie`，合并 `className`、Vue `class`、`style`、width、
  height、data/ARIA/role attrs。width/height 在 wrapper style 之后由显式 `style` 覆盖。
- 外部模式：组件输出注释节点，SVG/canvas/html 内容由 `lottie-web` 写入外部容器。
- 固定基线没有 Lottie SCSS 或专属 Token。逐组件 CSS 入口为空产物；light/dark、RTL、
  zh-CN/en-US 不改变播放器 DOM，场景仍覆盖这些环境，证明布局与动画帧稳定。
- 浏览器场景使用仓库内确定性 animationData、`autoplay: false`，并固定到同一帧后比较
  React/Vue SVG computed style、几何和截图；不依赖 CDN、网络时序或循环动画。

## 键盘、焦点、ARIA、动效、国际化与 SSR

- 上游不提供键盘、焦点或 ARIA 逻辑。组件不新增 role/tabindex；调用方可在内部容器
  模式透传原生语义。播放器生成节点的可访问性由 `lottie-web` 参数决定。
- 无 Portal/Teleport；外部容器只是调用方显式提供的渲染目标。
- 无内置 Locale 文案。57 个 Locale 的完整性继续由共享门禁覆盖。
- `lottie-web` 仅能在客户端求值。公开根入口和 `./lottie` 子路径必须通过纯 Node SSR
  import；服务端渲染不得访问 window/document/navigator，hydration 后才创建实例。

## 依赖、发布与合规边界

- `lottie-web@5.13.0` 是 MIT 运行时依赖，登记在根开发环境、参考 React 应用、私有
  Foundation 和公开 UI manifest，并锁入 workspace lockfile。
- UI 发布产物继续内联运行时实现，但 manifest、SPDX SBOM、第三方声明和许可证副本
  必须明确记录该依赖。真实 tarball consumer 要验证根/子路径、声明、SSR import、
  浏览器加载和 `lottie-web` 许可证。
- 公开类型使用 UI-owned facade；不暴露 `vendor/**` 或私有 workspace 路径。

## Deviation

- 无未解释的视觉、行为、生命周期或公开 API 差异。
- Vue 原生 `class`、`style` 与非 prop attrs 只在内部容器模式下合并；外部容器模式仍
  与固定 React Adapter 一致不转移这些属性。该映射只补充 Vue 原生写法，不改变
  Semi 的 `className`、DOM 或容器所有权契约。
- `lottie-web` 会在加载时为 animationData 添加完成标记；浏览器夹具因此保持可变，
  但数据内容固定、关闭 autoplay/loop 并停在第 0 帧，截图仍是确定性的。

## 验收门禁

- 单元：固定 load 参数与 false 覆盖、内部/外部容器、class/style/attrs、初始回调时序、
  深层 params 等价不重建/变化时销毁再重建、回调更新、unmount 销毁、静态 getLottie。
- SSR/hydration：根与子路径 SSR-safe import、服务端内部/外部 DOM、hydration 后创建、
  卸载清理且无 warning。
- Chromium：固定 React/Vue 同 animationData；desktop/mobile light/dark/light RTL；
  computed style、几何、确定帧截图、实例控制与 params 重建行为。
- 发布：根/子路径运行时与声明、空样式入口、真实 tarball consumer、许可证/SBOM、
  source-boundary 与 tree-shaking/SSR-safe import。

## 完成证据

- 单元与 SSR：Lottie 公开行为、ConfigProvider 默认值、内部/外部容器、参数深比较、
  双实例回调、卸载销毁、SSR render/hydration 均通过；组件及受影响注册链共 188 个
  Vitest 用例通过。
- Chromium：Lottie 专项 7/7 通过，首次生成基线后又以非更新模式复验 7/7；覆盖
  desktop/mobile、light/dark、en-US RTL、参数重建、真实 `lottie-web` SVG、computed
  style、`0.5 CSS px` 几何和解码像素阈值。工作台 smoke 2/2 通过，代表性截图已人工
  检查，无裁切、主题残留或局部集中差异。
- 构建：固定 React 参考应用与 Vue 文档应用均使用真实播放器完成生产构建；UI dist
  根入口及 `./lottie` 子路径通过纯 Node SSR import，默认主题空组件入口包含全局
  light/dark Token。
- 发布：源码边界、类型声明、根/子路径 ESM、逐组件 CSS、真实 tarball consumer、
  `lottie-web@5.13.0` MIT 许可证副本、第三方声明与 SPDX SBOM 全部通过。
- 影响面未修改共享比较算法、Playwright 配置、全局主题或既有组件运行时，因此按项目
  门禁运行 Lottie 完整场景与工作台 smoke，没有运行全仓 `pnpm test:browser`。
