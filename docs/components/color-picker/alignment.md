# ColorPicker v2.102.0 对齐矩阵

## 路线与固定证据

- 当前路线：Cascader 完成后，`README.md` 与固定 `content/order.js` 都指向 ColorPicker；其 Popover、Input、InputNumber、Select、Button 与 Icon 依赖均已进入 `ready`，可独立验证。
- 唯一基线：`vendor/semi-design` tag `v2.102.0`，提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- React Adapter：`packages/semi-ui/colorPicker/{index,AlphaSlider,ColorChooseArea,ColorSlider,DataPart}/index.tsx`。
- Foundation：`packages/semi-foundation/colorPicker/{foundation,AlphaSliderFoundation,ColorChooseAreaFoundation,ColorSliderFoundation,DataPartFoundation,constants,interface}.ts` 与 `utils/`。
- 主题：`packages/semi-foundation/colorPicker/{colorPicker,variables}.scss`、Popover/Input/InputNumber/Select/Button/Icon 固定样式依赖与默认主题 Token。
- 文档与行为证据：`content/input/colorpicker/{index,index-en-US}.md`、`packages/semi-ui/colorPicker/__test__/colorPicker.test.js` 与 `_story/`。

## Vue 组件边界

| 组件              | 单一职责                                                          | 通信                                                          |
| ----------------- | ----------------------------------------------------------------- | ------------------------------------------------------------- |
| `ColorPicker`     | 管理受控/非受控颜色，桥接固定 Foundation，组合内联或 Popover 模式 | typed props/emits/slots、`v-model`、静态 `colorStringToValue` |
| `ColorChooseArea` | 渲染饱和度/明度二维区域并把鼠标坐标转换为 `{s,v}`                 | typed props + `change`；不拥有颜色源状态                      |
| `ColorSlider`     | 渲染色相条并把横向坐标转换为 `h`                                  | typed props + 根 Foundation；仅持有拖拽状态                   |
| `AlphaSlider`     | 渲染透明度棋盘/渐变并把横向坐标转换为 `a`                         | typed props + 根 Foundation；仅持有拖拽状态                   |
| `ColorDataPart`   | 同步 hex/rgba/hsva 输入、透明度百分比、格式选择和 EyeDropper      | typed props + 根 Foundation；仅持有输入格式与文本             |

## 公开 API 与 Vue 映射

| React v2.102.0                        | 固定默认值                                      | Vue 契约                                                                                     |
| ------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `value` / `defaultValue`              | 内置 `#39c5bb` 三格式对象                       | 保留，并增加 `modelValue` / `update:modelValue`；显式 `value` 或 `modelValue` 时受控         |
| `onChange(value)`                     | -                                               | `change`，随后发 `update:modelValue` 与 `update:value`；受控模式不自行改写显示值             |
| `alpha`                               | 文档为 `true`，固定 Adapter 未声明 defaultProps | Vue 对外按文档默认 `true`；显式 `false` 隐藏透明度条与百分比输入，既有 `ColorValue.a` 仍保留 |
| `eyeDropper`                          | `true`                                          | 保留缺省/显式 false/显式 true；仅客户端且浏览器存在 EyeDropper 时调用                        |
| `defaultFormat`                       | `hex`                                           | `'hex'                                                                                       | 'rgba' | 'hsva'`，只决定初始手动输入格式 |
| `width` / `height`                    | `280` / `280`                                   | number；颜色区域使用显式 px，滑条与数据区共享 width                                          |
| `usePopover`                          | `false`                                         | `false` 内联；`true` 复用公开 Popover，默认触发器为当前颜色 24px 色块                        |
| `popoverProps`                        | -                                               | `PopoverProps`，其 class 与 `semi-colorPicker-popover` 合并；事件仍由 Popover 公开契约处理   |
| `className` / `style`                 | -                                               | 保留并增加 Vue 原生 `class`；只落在 picker 根节点，不误传给 Popover trigger                  |
| `topSlot` / `bottomSlot`              | -                                               | VNode prop 加 `#top` / `#bottom` slot，slot 优先                                             |
| React `children`                      | 默认色块 trigger                                | Vue 默认 slot；缺省时渲染固定 class 的默认色块                                               |
| `ColorPicker.colorStringToValue(raw)` | 支持 `#hex`、`rgb(a)`、`hsv(a)`                 | 作为组合组件静态方法保留；非法输入抛出固定错误前缀                                           |
| Foundation 色彩类型                   | `Hsv/Hsva/Rgb/Rgba/Hsl/Hsla/ColorValue`         | UI 自有公开类型，声明产物不泄漏 `vendor/**` 或私有 Foundation 路径                           |

## 状态、交互与事件顺序

- 初始颜色优先级：显式受控 `modelValue` → 显式受控 `value` → `defaultValue` → 固定默认颜色。
- 颜色区、色相条、透明度条和输入区都先计算完整 `ColorValue`，再调用 `change` / `update:*`；非受控随后更新当前颜色，受控视图等待父级回写。
- 色相条和透明度条把横向坐标钳制到 `[0,width]`；二维颜色区沿用固定 Foundation 语义，超出横向或纵向边界时不更新。
- mousedown 立即按当前位置更新并进入拖拽；mousemove 期间连续更新；mouseup 与卸载都移除 window/DOM listener，不保留计时器或全局资源。
- hex 输入允许省略 `#`，固定正则接受 6/8 位表示；rgba/hsva 逗号输入校验各通道范围。格式改变后立即同步当前颜色对应的输入文本。
- Alpha 百分比输入转换为两位小数；`alpha=false` 只关闭透明度编辑 UI，不擅自改写既有颜色中的 alpha。
- EyeDropper 缺失或用户取消时静默结束；返回 `sRGBHex` 时按固定转换链通知一次变化。

## DOM、class、样式与 ARIA

- 根：`.semi-colorPicker`；Popover 内容额外 `.semi-colorPicker-popover`；默认触发器 `.semi-colorPicker-popover-defaultChildren`。
- 颜色区：`.semi-colorPicker-colorChooseArea > .semi-colorPicker-handle`，保留双渐变、固定圆角与抓取 cursor；`aria-label="Color"`，`aria-valuetext="Saturation …%, Brightness …%"`。
- 色相条：`.semi-colorPicker-colorSlider.colorSliderWrapper > .semi-colorPicker-handle`，保留固定彩虹渐变。
- 透明度条：`.semi-colorPicker-alphaSlider.alphaSliderWrapper > .semi-colorPicker-alphaSliderInner > .semi-colorPicker-alphaHandle`；`aria-label="Alpha"` 与百分比 `aria-valuetext`。
- 数据区：固定 demo block、InputGroup/Input/InputNumber/Select/Button class 结构和 20px 色块、58px alpha 输入、80px format Select。
- 默认主题直接编译固定 ColorPicker SCSS，并组合其公开运行时所需的 Popover/Input/InputNumber/Select/Button/Icon 样式；dark 依赖既有全局 Token，RTL 不改写水平颜色数学，React/Vue 都保持固定 Adapter 行为。

## Portal、主题、国际化与 SSR

- `usePopover=true` 时复用已完成的 Popover。稳定 `getPopupContainer` 必须在首次打开就成为 Teleport 父节点；不为未被固定契约承诺的迟到容器新增 Observer/轮询。
- `popoverProps` 中 Element/Document capture-scroll、Escape、outside click、关闭和卸载清理由 Popover 的已验证契约承担，本切片增加集成门禁。
- 固定字符串 `Color`、`Alpha`、`Saturation`、`Brightness` 不读取 Locale；57 Locale 数据完整性由 ConfigProvider 既有门禁覆盖。本组件场景仍覆盖 zh-CN/en-US 可渲染。
- import 与 SSR render 不读取 `window`/`document`；EyeDropper 和拖拽 listener 只在客户端事件/生命周期中创建；SSR 的 Popover 不渲染 Teleport 内容。
- 桌面 `1440×900`、移动 `390×844`、DPR 1 均覆盖 light/dark；方向敏感最低门禁增加 RTL。内联 picker 与 Popover picker 分别裁剪对照。

## Deviation

- Vue 使用 `modelValue`/`update:modelValue`、`#top/#bottom` 和默认 slot 映射 React 的 value/回调、ReactNode 与 children，这是框架原生等价映射，不改变用户可见行为。
- 固定 React Adapter 的文档表将 `alpha` 标成默认 `true`，但 class `defaultProps` 未设置该字段。Vue 以公开文档默认值为准，同时 React/Vue 对照场景显式传 `alpha=true`，避免把上游内部矛盾隐藏为视觉差异。
- 固定 SCSS 没有 ColorPicker 专属 RTL 规则，Foundation 也始终以 `clientX` 从左向右计算；本实现保持该行为，不擅自镜像色相/透明度数学。

## 完成门禁

- Vue 源码、Foundation facade、根/子路径导出、独立 ColorPicker CSS。
- 中英文文档、React→Vue 迁移、React/Vue 同数据同状态场景。
- 单元/SSR/类型：转换、受控/非受控、输入格式、拖拽/清理、ARIA、EyeDropper、Popover 自定义容器、dark/RTL/locale。
- 同一 Chromium 中先通过 computed style 与几何，再以 `threshold <= 0.1`、`maxDiffPixelRatio <= 0.001` 验证桌面/移动 light/dark/RTL；阈值通过后直接比较成对 PNG。
- 真实 tarball 安装、根/子路径 ESM、声明、样式、tree-shaking、SSR-safe import、许可与 SBOM 验证。
