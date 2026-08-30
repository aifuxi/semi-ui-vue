# Semi Illustrations v2.102.0 对齐矩阵

## 权威来源与范围

- 固定基线：Semi Design `v2.102.0`，提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- 公开导出：`vendor/semi-design/packages/semi-illustrations/src/index.ts`。
- React 组件源码：`vendor/semi-design/packages/semi-illustrations/src/illustrations/*.tsx`。
- 原始 SVG：`vendor/semi-design/packages/semi-illustrations/src/svgs/*.svg`。
- 上游生成逻辑：`vendor/semi-design/packages/semi-illustrations/scripts/build-illustration.js`。
- 固定公开范围为 16 个组件：Construction、Failure、Idle、NoAccess、NoContent、NoResult、NotFound、Success 的 light/dark 成对版本。

## Vue 组件边界

| 文件                                                    | 单一职责                                           | 公开契约                         |
| ------------------------------------------------------- | -------------------------------------------------- | -------------------------------- |
| `scripts/generate-illustrations.mjs`                    | 从固定 TSX AST 机械生成 Vue `h()` SVG 树并检查漂移 | 仓库工具                         |
| `packages/illustrations/src/components/Illustration.ts` | 将 SVG renderer 包装为无状态 Vue 组件并透传 attrs  | `convertIllustration` 与公开类型 |
| `packages/illustrations/src/illustrations/*.ts`         | 每个文件只渲染一个固定插画 SVG                     | 根导出与逐插画子路径             |
| `packages/illustrations/src/index.ts`                   | 汇总 16 个插画和工厂类型                           | 包根入口                         |

插画是大型、机械生成的 SVG 树，模板不会改善可读性且容易改变 path/attribute；因此使用范围受限的 render function。组件没有内部状态、watcher、provide/inject、slot 或 composable。

## 根 SVG 与 attrs

| 契约         | 固定 React                               | Vue 适配门禁                                               |
| ------------ | ---------------------------------------- | ---------------------------------------------------------- |
| 默认尺寸     | `width=200`、`height=200`                | 相同数字属性与 200×200 几何                                |
| 画布         | `viewBox="0 0 200 200"`、`fill="none"`   | 完整保留                                                   |
| 命名空间     | `xmlns="http://www.w3.org/2000/svg"`     | 完整保留                                                   |
| 可访问性     | `focusable=false`、`aria-hidden=true`    | DOM 分别为 `false`、`true`                                 |
| attrs 顺序   | 默认属性后展开 `props`                   | 调用方 width/height/class/style/ARIA/data/事件可覆盖或附加 |
| 多色与 Token | 保留固定 fill/stroke 与 `--semi-color-*` | 不转换为 `currentColor`，不统一去色                        |
| defs 引用    | 保留 mask/clipPath id 与 `url(#id)`      | 不改名、不去除、不内联简化                                 |

Vue 使用原生 fallthrough attrs；不复刻 React 专属 `React.SVGProps` 类型名。组件实例 ref 不承诺转发为 DOM ref，调用方需要 DOM 时使用外层模板 ref。

## 公开导出

- 根入口导出全部 16 个上游原名，以及 `convertIllustration` 和相关类型。
- `@aifuxi/semi-illustrations-vue/Illustration` 导出共享工厂。
- `@aifuxi/semi-illustrations-vue/illustrations/IllustrationNoContent` 等逐插画子路径支持 tree-shaking。
- 包只含 ESM 与 TypeScript 声明；peer dependency 仅为 `vue >= 3.5.0`。

## 状态、主题、RTL、国际化与 SSR

- 组件无状态、无事件封装、无生命周期和 DOM 查询；所有原生事件通过 attrs 落在根 SVG。
- light/dark 是两个独立公开组件，不读取 `body[theme-mode]`；由 Empty 等消费者选择。
- 部分颜色引用 Semi Token，因此 light/dark 页面都执行真实浏览器对照。
- 插画不含方向或 locale 分支，RTL 和 57 Locale 不改变 SVG；不额外制造镜像或文案。
- 根入口和全部子路径必须 SSR-safe import；16 个组件均执行服务端渲染，代表组件执行 hydration 无警告验证。

## 测试与发布门禁

- 生成检查：源文件数量、文件名与公开导出严格等于固定 16 个，禁止缺失和陈旧生成物。
- 单元/SSR：根导出数量、默认 SVG、light/dark 固定颜色、mask/clipPath、attrs 覆盖、事件透传、16 个可渲染与 hydration。
- Chromium：React 直接编译固定上游插画，Vue 使用生成包；逐插画 computed style、几何和独立截图字节比较，另覆盖桌面/移动、light/dark 全画廊截图。
- 发布：根/工厂/逐插画 ESM 与声明、tree-shaking、SSR import、真实 tarball 离线安装、许可证、声明和 SBOM。

## Deviation 与状态

当前没有 accepted deviation。静态 mask/clipPath id 与上游一致，多个相同插画实例可能复用 id，这是固定 v2.102.0 的既有行为，不在 Vue 侧擅自改写。

当前状态：`ready`。16 个公开插画已完成生成漂移、单元/SSR/hydration、React/Vue Chromium、独立 PNG 字节比较、应用构建和真实 tarball 消费门禁；Empty 后续必须从该包选择真实插画，不得再使用自制替代图。
