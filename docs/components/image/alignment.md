# Image v2.102.0 对齐矩阵

## 路线与权威来源

- 当前路线：最近完成 Highlight；Image 是固定 `vendor/semi-design/content/order.js` 中紧随其后的公开组件，之后才是 Cropper 与 List。
- 固定基线：Semi Design `v2.102.0`，提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- Adapter、公开类型与 DOM：`vendor/semi-design/packages/semi-ui/image/` 下的 `image.tsx`、`preview.tsx`、`previewInner.tsx`、`previewImage.tsx`、header/footer/context 与 `interface.tsx`。
- Foundation 与算法：`vendor/semi-design/packages/semi-foundation/image/` 下的五个 Foundation、`constants.ts` 与 `utils.ts`。
- 样式、动效与 RTL：同目录 `variables.scss`、`image.scss`、`animation.scss`、`rtl.scss`；默认 Token 来自 `semi-theme-default/scss/`。
- 文档与行为语料：`vendor/semi-design/content/show/image/`、`packages/semi-ui/image/__test__/` 与 `_story/`。
- 已就绪依赖：Slider、Tooltip、Divider、Icon、ConfigProvider/Locale 和 Portal 基础已经完成。固定 Adapter 使用的 Skeleton.Image 与 Spin 只承担 Image 私有加载占位，本切片保留其固定 DOM/class 与必要样式，但不提前公开 Skeleton/Spin API。

## Vue 组件边界

| 文件                     | 单一职责                                                          | 契约                                   |
| ------------------------ | ----------------------------------------------------------------- | -------------------------------------- |
| `Image.vue`              | 原图加载、占位/失败态、单图预览入口与 group 消费                  | 公开 props/emits/slots、原生 img attrs |
| `ImagePreview.vue`       | 受控/非受控 group 状态、递归识别/克隆 Image VNode、提供预览上下文 | 公开具名 `ImagePreview`                |
| `ImagePreviewInner.vue`  | Teleport、遮罩、键盘/滚轮、body scroll lock、图片切换与操作区组合 | Image 内部，亦由 ImagePreview 复用     |
| `ImagePreviewImage.vue`  | 图片加载、适应/原始尺寸、缩放、旋转、拖拽和 resize                | Image 内部                             |
| `ImagePreviewHeader.vue` | group 标题、关闭入口和自定义 header/close icon                    | Image 内部                             |
| `ImagePreviewFooter.vue` | 默认/自定义操作区，组合 Slider/Tooltip/Divider/Icon               | Image 内部                             |
| `ImageNodeRenderer.ts`   | 原样承载 VNodeChild prop/slot 内容                                | Image 内部                             |
| `image-context.ts`       | 类型化 group provide/inject，provider 集中修改状态                | Image 内部                             |
| `types.ts` / `index.ts`  | Vue 原生公开类型及根/子路径导出                                   | 公开                                   |

模板可表达的 DOM 使用 SFC；只有递归识别并克隆真实 Image 子 VNode 的 group 适配使用范围受限的 render function。Foundation、DOM 实例、Map 与 timer 均保持 shallow/raw，不接受无意深层代理。

## Image API、默认值与 Vue 映射

| React v2.102.0                     | Vue 契约                              | 默认值 / 映射                                                          | 结论         |
| ---------------------------------- | ------------------------------------- | ---------------------------------------------------------------------- | ------------ |
| `src/width/height/alt/crossOrigin` | 同名 props                            | 原生 img 语义；width/height 同时用于根尺寸                             | 等价         |
| `className/style`                  | 同名兼容 prop + Vue `class/style`     | 合并到 `.semi-image` 根节点                                            | Vue 原生映射 |
| `imgCls/imgStyle`                  | 同名 props                            | 仅落在内部 `img.semi-image-img`                                        | 等价         |
| 其它 img attributes                | Vue attrs                             | 除 class/style/listener 外落到 img；原生 listener 与组件事件不重复触发 | Vue 原生映射 |
| `placeholder/fallback`             | 同名 prop 或 `#placeholder/#fallback` | slot 优先；字符串 fallback 生成 `img[alt=fallback]`                    | Vue 原生映射 |
| `preview`                          | `boolean \| ImagePreviewOptions`      | 缺省 `true`；显式 false 禁用；对象可受控 visible 和覆盖预览 src        | 等价         |
| `onLoad/onError/onClick`           | `@load/@error/@click`                 | load/error 先通知再更新状态；click 始终通知，随后按 preview/group 打开 | Vue emit     |
| `setDownloadName`                  | 同名函数 prop                         | group provider 优先于单图 Preview 配置                                 | 等价         |

`preview` 必须覆盖缺省、显式 `false`、显式 `true` 三态。group 读取子 VNode 时，缺省按 Image 默认 true，SFC 裸 `preview=""` 与 render function `preview: true` 均为启用，只有显式 false 禁用；测试同时使用真实 SFC 模板宿主与 `h()` 宿主。

## ImagePreview API、状态与事件顺序

- `src` 接受 string/string[]；默认 `[]`。group 最终来源顺序为显式 src 后接默认 slot 中递归发现且 preview 未禁用的 Image；preview 对象的 src 覆盖缩略图 src。
- `visible/defaultVisible`、`currentIndex/defaultCurrentIndex` 分别按原始 VNode prop 存在性决定受控；`v-model:visible` 与 `v-model:currentIndex` 作为 Vue 等价双向契约，仍保留 `visibleChange/change` 事件。
- 默认：`lazyLoad=true`、`lazyLoadMargin="0px 100px 100px 0px"`、`closable=true`、`showTooltip=false`、`zoomStep=0.1`、`infinite=false`、`closeOnEsc=true`、`preLoad=true`、`preLoadGap=2`、`zIndex=1070`、`maskClosable=true`、`viewerVisibleDelay=10000`、`minZoom=0.1`、`maxZoom=5`。
- 点击 group Image：先 emit Image `click`，再设置/通知 group currentIndex，最后打开预览并通知 visible；受控模式只 emit 更新，不越权改变外部值。
- prev/next：计算循环/边界目标，受控 group 先请求 index 更新；随后按 `change(index)` 再 `prev(index)` 或 `next(index)` 通知，并把 rotation 重置为 0、ratio 重置 adaptation。
- close icon / Esc：先请求 visible=false，再通知 `close`；遮罩关闭只请求 visible=false，不额外发 close。`maskClosable=false`、拖动超过任一轴 5px、header/footer/左右按钮命中时均不关闭。
- zoom：步进与 wheel 均 clamp 到 min/max，实际变化才触发 zoomIn/zoomOut；ratio、rotate、download 分别触发对应回调。下载先启动固定 fetch/blob 流程，再同步通知 download；失败通知 downloadError。
- `initialZoom` 每个 src 首次加载应用一次并 clamp；切换同图的 ratio/resize 不重复应用。

## DOM、样式、Portal 与动效

```text
div.semi-image
  img.semi-image-img[.semi-image-img-preview|.semi-image-img-error]
  div.semi-image-overlay? > loading/status/fallback

Teleport target
  div.semi-portal[.semi-portal-rtl]
    div.semi-image-preview[.semi-image-preview-popup]
      section.semi-image-preview-header
      div.semi-image-preview-image > img + private Spin?
      div.semi-image-preview-icon.semi-image-preview-prev?
      div.semi-image-preview-icon.semi-image-preview-next?
      section.semi-image-preview-footer.semi-image-preview-footer-wrapper
```

- 默认 Portal 首次可见即挂到 body；显式 `getPopupContainer` 优先于 ConfigProvider 容器并在首次可见时解析，容器场景使用 `position: static` 的 portal wrapper 与 `position:absolute` 的 preview。
- 默认容器打开时记录 body 原 overflow/width，锁定滚动并补偿 scrollbar；自定义容器不修改 body。关闭与卸载必须恢复原值、移除 keydown/resize/wheel、timer、IntersectionObserver 和预加载回调引用。
- preview 全屏 fixed、overlay Token、opacity 500ms；header 60px、footer 48px，左右按钮 40px；页脚复用固定 Slider/Divider/Icon class 与几何。
- viewer 无操作超时只给 header/footer/左右按钮增加 `.semi-image-preview-hide`，图片仍显示；有效鼠标移动恢复并重启 timer。
- light/dark 由 Token 驱动；RTL 由 `.semi-rtl` / `.semi-portal-rtl` 交换 prev/next、旋转图标与 footer gap。响应式不发明上游断点，移动 viewport 只验证自然裁剪与操作区几何。

## 键盘、焦点、ARIA、国际化与 SSR

- 固定 Adapter 仅注册 window Escape；不为非交互 div 补造 tabIndex/role 或左右键导航。close、prev/next 和 footer Icon 沿用固定 Icon DOM，可点击能力与上游一致。
- 原图 `alt`/`aria-*`/data attrs 保留；预览大图固定 `alt="previewImag"`。自定义 VNode/slot 的 ARIA 由调用方负责。
- Image locale 默认中英文覆盖 preview、prev/next、zoom、rotate、download、adaptive/origin；ConfigProvider 注入的 `locale.Image` 优先，57 Locale 数据由既有 inventory 完整性门禁保持，上游缺失字段回退当前 code 的 zh-CN/en-US 默认值。
- SSR import/setup 不访问 window/document/Image/IntersectionObserver。Image SSR 输出 loading overlay；ImagePreview SSR 输出 group 内容但不创建 Teleport、observer、listener 或 body 副作用；hydration 后再建立客户端能力。

## 测试与发布门禁

- 单元：Image load/error/src 重置、placeholder/fallback、原生 attrs、class/style、preview 三态与单图受控 visible；group template/h() VNode 识别、受控/非受控 index/visible、lazy observer 命中与清理；preview switch/close/mask/Esc、zoom/ratio/rotate、disableDownload、body lock/custom container 与卸载恢复。
- SSR：根/`image` 子路径 import；Image 默认/禁用 preview；ImagePreview group 和显式 src；没有 Teleport/observer/listener/DOM 副作用。
- React/Vue 共享场景：`preview=false` 单图、两张带标题的 group、默认操作区与稳定内联 SVG；所有图片不依赖外网。loading/error/fallback、受控状态、自定义内容和 custom container 由单元/SSR 覆盖。
- Chromium：桌面 `1440×900` 与移动 `390×844` 的 light/dark、LTR/RTL；open/close、prev/next、wheel 缩放、原始尺寸、旋转、Esc、body lock/cleanup；关键颜色/显示/行高 computed style 精确相等，全部 bounding rect 轴差 `<=0.5px`。
- 截图：`threshold<=0.1`、`maxDiffPixelRatio<=0.001`。关闭场景的桌面/移动 light/dark 与 RTL 裁剪图、打开后的预览大图分别直接比较独立 React/Vue PNG buffer 且字节相等；打开态整层和 footer 保留各自独立基线，footer 文本固有排版宽度差 `0.015625 CSS px`，按统一几何门槛验收，不宣称该裁剪 PNG 字节相等。
- 发布：根与 `@aifuxi/semi-ui-vue/image` ESM/声明、默认 `Image` 和具名 `ImagePreview`、`@aifuxi/semi-theme-default/image.css`、tree-shaking、SSR-safe import、真实 tarball 安装、许可证/第三方声明/SBOM；声明与运行时不得泄漏 `vendor/**` 或私有 Foundation 类型。固定上游没有 `Image.Preview` 静态成员，本项目不虚构该入口。

## Deviation

- React render props 映射为 Vue scoped slots：`#header="{ title }"`、`#previewMenu="menuProps"`、`#leftIcon/#rightIcon`、`#closeIcon`；同名函数 props 保留以便程序化调用，slot 优先。迁移表逐项说明，能力不减少。
- Skeleton.Image 与 Spin 尚未作为独立公开 Vue 组件 ready；Image 内部只复现固定加载节点与本组件所需样式，不导出这些私有实现，也不据此声称 Skeleton/Spin 完成。
- 当前无 accepted visual/behavior deviation。Footer 的 `1/2` 文本由 React/Vue 渲染器产生 `0.015625 CSS px` 的亚像素宽度差，颜色、display、line-height 与所有其余轴一致，远低于既定 `0.5 CSS px` 几何门槛；这是已测量的框架排版量化差，不扩大为像素相等结论。

## 验收状态

- 当前状态：`ready`，没有 accepted deviation。
- 行为门禁：Image 聚焦 `13/13`（11 个单元 + 2 个 SSR）通过；全仓 `75` 个测试文件、`554` 个单元与 SSR 测试通过。
- 浏览器门禁：Image 定向 `7/7`、全量 Chromium `292/292` 通过；桌面/移动 light/dark、RTL、打开态交互与运行时错误均完成验收。
- 视觉门禁：关闭场景五组 React/Vue 裁剪 PNG 与打开态预览大图直接字节相等；footer 关键 computed style 精确相等，最大已测几何差为 `0.015625 CSS px`。
- 发布门禁：根/`image` 子路径 ESM 与公开声明、独立 `image.css`、SSR-safe import、真实 tarball 安装、许可证/第三方声明/SBOM 全部通过，产物未泄漏 `vendor/**` 或私有 Foundation 类型。
