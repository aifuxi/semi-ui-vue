# FloatButton 文档批次验收

基线：Semi Design v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。

## 范围

固定 basic/floatbutton 双语各七项，分别为 Basic、Size、Shape、Link、Colorful、Badge、Group。全部覆盖双语 × light/dark × LTR/RTL，共 56 项。章节、API、迁移说明按固定 FloatButton、FloatButtonGroup、Badge Adapter 及 SCSS 审阅。

## 场景与对齐

| 示例     | 主要验收                                                        |
| -------- | --------------------------------------------------------------- |
| Basic    | 32px round、默认/hover/active、点击回调                         |
| Size     | large 40px、点击回调                                            |
| Shape    | square 8px 圆角、点击回调                                       |
| Link     | href/target 的真实新窗口导航                                    |
| Colorful | AI 渐变默认/hover/active、真实新窗口导航                        |
| Badge    | 四项独立定位、禁用、dot、999+、VIP、徽章几何                    |
| Group    | 组背景/阴影/间距、三项 hover/active、委托 value 与深层 SVG 点击 |

逐节点样式精确一致，几何各轴差不超过 0.5 CSS px。每个按钮或组单独裁剪，包含徽章和固定阴影范围；threshold=0.1、maxDiffPixelRatio=0.001，不 mask 或扩大容差。双语亮色 LTR 检查源码、重置、编辑器首帧和退出恢复；基本用法额外验证编辑运行。交互用真实时钟和 Chromium，不用 jsdom 替代。

FloatButton 与 Group 原生是 div，没有默认 role、tabindex 或键盘激活；保持固定源码语义，验证 Enter/Space 不触发，不额外注入按钮能力。Group 保留 event.target.dataset.value 委托，点击 item 自身返回 value，点击图标后代可为 undefined。示例无受控状态、Portal 或断点契约；外链通过真实 popup 捕获，测试拦截目标网络返回空页面，不依赖线上站点或改写 href。

## 预览适配与迁移

原站各 fixed 按钮共用页面右下角。拆成独立 Vue Demo 后，双侧以 min-height:340px、transform:translateZ(0) 容器隔离固定定位，保留上游 bottom/insetInlineEnd 数值；不改组件 position:fixed 或尺寸。数值 DOM 样式显式加 px；不向公共组件加入 React 数值样式转换规则。编辑器也保留同一 SFC 容器。

文案保留固定语言差异，包含上游 Group 中反向语言的描述。修正上游形状说明和额外 Badge API 表中的默认值错误：实际 round 默认、square 可选；dot 默认 false；overflowCount 未设置时不截断。children/VNode 改为 icon/item slot 与 h() 节点，class/style 使用 Vue 原生属性，onClick 改为 emits。Group 的公开 item 能力按实际固定 Adapter 说明，不承诺每项继承的 href/disabled 等被 Group 执行。

无 accepted deviation；正式入口通过后才计入 accepted。Demo 为 ClientOnly，文档静态生成不等于组件 SSR render 证据。
