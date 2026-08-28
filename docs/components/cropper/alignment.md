# Cropper v2.102.0 对齐矩阵

## 基线与范围

- 唯一基线：`vendor/semi-design` tag `v2.102.0`，commit `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- React Adapter：`packages/semi-ui/cropper/index.tsx`。
- Foundation：`packages/semi-foundation/cropper/{foundation,constants,utils}.ts`。
- 主题：`packages/semi-foundation/cropper/{cropper,variables}.scss` 与默认全局 token。
- 文档：`content/show/cropper/index.md`、`index-en-US.md`；场景补充自 `_story/cropper.stories.tsx`。

## 组件边界

- `Cropper.vue`：公开 DOM、props/emits、原生图片属性、裁切框和实例方法。
- `use-cropper-foundation.ts`：Foundation adapter、受控属性同步、ResizeObserver、wheel/document 监听与卸载清理。
- `@workspace/foundation-integration/cropper`：唯一 vendor 运行时边界；公开声明不泄漏 vendor 路径。

## 公开 API

| React v2.102.0                | 默认值             | Vue 映射                                          | 门禁                                                              |
| ----------------------------- | ------------------ | ------------------------------------------------- | ----------------------------------------------------------------- |
| `src?: string`                | -                  | 同名 prop                                         | 两层图片 `src` 一致                                               |
| `imgProps?`                   | -                  | `imgProps?: ImgHTMLAttributes`                    | 固定 React 源码未透传；Vue 为兼容运行时同样不消费，见 discrepancy |
| `shape`                       | `rect`             | `'rect' \| 'round' \| 'roundRect'`                | rect/round/roundRect class 与 resize handle 数量                  |
| `aspectRatio?`                | -                  | 同名受控比例                                      | 初始比例、八方向固定比例 resize                                   |
| `defaultAspectRatio`          | `1`                | 同名 prop                                         | 仅初始比例，随后自由 resize                                       |
| `zoom?`                       | 内部 `1`           | 同名 prop；滚轮同时发出 `update:zoom`             | 受控同步、步长及 min/max 边界                                     |
| `onZoomChange`                | -                  | `zoomChange` emit                                 | Foundation 状态更新后触发                                         |
| `rotate?`                     | 内部 `0`           | 同名 prop                                         | 以裁切框中心旋转并同步两层图片/preview                            |
| `showResizeBox`               | `true`             | 同名 Boolean prop                                 | 缺省、显式 false、显式 true 独立覆盖                              |
| `cropperBoxStyle`             | -                  | 同名 `StyleValue`                                 | 用户 style 覆盖 outline 等字段                                    |
| `cropperBoxCls`               | -                  | 同名兼容 prop；另接收文档名 `cropperBoxClassName` | 两个名称均落到 box class                                          |
| `fill`                        | `rgba(0, 0, 0, 0)` | 同名 prop                                         | canvas 空白区域填充                                               |
| `maxZoom/minZoom/zoomStep`    | `3/0.1/0.1`        | 同名 props                                        | 滚轮上下限与两位小数                                              |
| `preview?: () => HTMLElement` | -                  | 同名 prop                                         | 创建、更新并在卸载/切换时移除预览图片                             |
| `className/style`             | -                  | `class`/`className`/`style` + attrs               | 根节点透传与合并                                                  |
| `ref.getCropperCanvas()`      | -                  | `defineExpose<CropperMethods>`                    | 返回按原图像素和 fill 裁切的 canvas                               |

## 状态与事件顺序

- 初始 `imgData/cropperBox` 为零尺寸，`zoom=1`、`rotate=0`、`loaded=false`。
- 图片 `load` 后按容器尺寸等比 cover，裁切框按 `aspectRatio || defaultAspectRatio` 居中铺满一轴，然后创建 preview。
- wheel 先 `preventDefault`，再按 `zoomStep` 更新图像几何和内部 zoom，最后发出 `zoomChange`/`update:zoom`；越界不发事件。
- mask 拖动图片；cropper box 拖动裁切框；corner 拖动边界。document mousemove/mouseup 在结束和卸载时清理。
- ResizeObserver 只观察宽度；首次通知被 Foundation 忽略，加载后的后续 resize 按宽度比例缩放图像与裁切框。
- prop `rotate`/`zoom` 同步遵循固定 React `getDerivedStateFromProps` 的计算顺序；受控更新在 Vue watcher 中一次提交。

## DOM、class 与样式

- 根：`.semi-cropper`。
- 图片层：`.semi-cropper-img-wrapper > img.semi-cropper-img[crossorigin=anonymous]`。
- 遮罩：`.semi-cropper-mask`。
- 裁切框：`.semi-cropper-box > .semi-cropper-view-box > img.semi-cropper-view-img`。
- round 形态在 box 和 view-box 添加 `.semi-cropper-view-box-round`；roundRect 仅 view-box 添加。
- rect/roundRect 载入后渲染 8 个 `.semi-cropper-box-corner-*`，round 渲染 4 个中点 handle。
- 复用固定 SCSS；关键 computed style 覆盖定位、overflow、mask 背景、outline、handle 尺寸/颜色、cursor 和圆角。

## 键盘、焦点、ARIA、Portal、动效、RTL、国际化、SSR

- 固定源码为纯指针/滚轮裁切器，无焦点节点、键盘交互或 ARIA 属性；Vue 不额外制造不对等契约。
- 无 Portal/Teleport、无组件动效、无 locale 文案。
- 坐标和 handle class 在 RTL 下保持固定源码物理方向语义；增加 RTL 视觉对照，不做逻辑镜像。
- import 与 SSR render 不访问 `window/document/Image/ResizeObserver/canvas`；Observer、Foundation init 和 preview 仅在 mounted 后创建。

## 行为与视觉证据矩阵

- unit：默认/显式 Boolean、DOM/class、load 初始化、ratio、wheel/边界/事件顺序、rotate/zoom watcher、三类拖动、preview 生命周期、canvas、attrs 和卸载清理。
- SSR：根结构可渲染、无浏览器 global 访问、子路径与根入口可导入。
- Chromium：同一 BrowserContext、固定内联 data URI 图片、桌面 `1440x900` 和移动 `390x844`、light/dark、RTL；检查 runtime error、请求来源、computed style、geometry 与组件裁剪截图。
- 发布：根/子路径 JS 与 d.ts、`cropper.css`、SSR import、tree-shaking、许可/SBOM 和隔离 tarball consumer。

## 上游 discrepancy 与 deviation

- 文档使用 `cropperBoxClassName`，源码类型/运行时只读取 `cropperBoxCls`。Vue 同时接收两者，`cropperBoxCls` 优先；这是 Vue 原生迁移兼容扩展，不改变 React 名称的行为。
- `imgProps` 出现在源码类型和文档中，但固定 React render 未展开它。Vue 保留类型但不消费，以运行时对齐为准；文档明确提示该 v2.102.0 限制。
- 固定 React `getDerivedStateFromProps` 的 zoom 分支以 `newRotate` 是否存在为前置条件。Vue 保留该条件，避免在只传 zoom 时制造不可解释的 React/Vue行为差异。
- 其余差异：无。任何截图或几何差异在验收前必须修复或追加记录。

## 验收结果

- 格式、Lint、8 组 TypeScript/Vue 类型检查与全量 Vitest 通过；Vitest 共 `77` 个文件、`570` 项测试。
- 固定 vendor、公开 inventory、图标/插画生成一致性、源码边界、全部公开包与两个参考应用构建通过。
- Cropper Chromium 对照共 `7` 项通过，覆盖本地 v2.102.0 来源、几何、wheel、drag、桌面/移动 light/dark 与 RTL。
- 四组独立 React/Vue 基线 PNG 经直接 `cmp` 均逐字节相同；测试仍保留 `threshold <= 0.1`、`maxDiffPixelRatio <= 0.001` 与关键节点 `0.5 CSS px` 几何上限。
- 默认主题共 `86` 个根入口、`3352102` 字节 CSS 通过，包含 `cropper.css`；根入口及全部公开子路径 SSR import 通过。
- 真实 tarball consumer 的安装、exports、ESM、类型、样式入口、SSR import、许可与 SBOM 检查通过。
