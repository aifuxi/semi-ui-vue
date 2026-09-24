---
version: alpha
name: semi-ui-vue 默认设计系统
description: 与 Semi Design v2.102.0 默认主题对齐的独立 Vue 组件库视觉规范
colors:
  primary: '#0064FA'
  secondary: '#0095EE'
  tertiary: '#6B7075'
  success: '#3BB346'
  warning: '#FC8800'
  danger: '#F93920'
  text-primary: '#1C1F23'
  surface: '#FFFFFF'
  inverse-text: '#FFFFFF'
  fill-default-on-white: '#F5F5F5'
  border: 'rgba(28, 31, 35, 0.08)'
  primary-dark: '#54A9FF'
  text-primary-dark: '#F9F9F9'
  surface-dark: '#16161A'
  surface-raised-dark: '#232429'
  surface-overlay-dark: '#35363C'
  fill-default-dark: 'rgba(255, 255, 255, 0.12)'
  border-dark: 'rgba(255, 255, 255, 0.08)'
typography:
  body:
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Segoe UI, Helvetica Neue, Helvetica, Arial, sans-serif'
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  caption:
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Segoe UI, Helvetica Neue, Helvetica, Arial, sans-serif'
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  button:
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Segoe UI, Helvetica Neue, Helvetica, Arial, sans-serif'
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
  heading-1:
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Segoe UI, Helvetica Neue, Helvetica, Arial, sans-serif'
    fontSize: 32px
    fontWeight: 600
    lineHeight: 44px
  heading-2:
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Segoe UI, Helvetica Neue, Helvetica, Arial, sans-serif'
    fontSize: 28px
    fontWeight: 600
    lineHeight: 40px
rounded:
  extra-small: 3px
  small: 3px
  medium: 6px
  large: 12px
spacing:
  super-tight: 2px
  extra-tight: 4px
  tight: 8px
  base-tight: 12px
  base: 16px
  base-loose: 20px
  loose: 24px
  extra-loose: 32px
  super-loose: 40px
components:
  button-primary-solid:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.inverse-text}'
    typography: '{typography.button}'
    rounded: '{rounded.small}'
    height: 32px
  input-default:
    backgroundColor: '{colors.fill-default-on-white}'
    textColor: '{colors.text-primary}'
    typography: '{typography.body}'
    rounded: '{rounded.small}'
    height: 32px
  card-default:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.text-primary}'
    typography: '{typography.body}'
    rounded: '{rounded.medium}'
---

# semi-ui-vue 设计系统

## Overview

`semi-ui-vue` 是独立的 Vue 3 组件库，视觉与行为基线固定为 Semi Design `v2.102.0`。界面应保持清晰的信息层级、适度紧凑的企业应用密度，以及一致的交互和可访问性。此文件描述当前默认主题的视觉语言；具体组件 API 和完成状态以本仓库的公开导出、类型与组件契约为准。

本文件的 YAML 颜色是默认主题的已解析参考值；`fill-default-on-white` 是半透明填充叠在白色表面后的结果。应用代码应使用 `--semi-*` 语义变量，让浅色、深色和主题覆盖继续生效。主题来源是 `packages/theme-default/src/index.scss` 编译的 CSS，不以本文件替代 CSS。

## Colors

- 主要操作使用 `var(--semi-color-primary)`；次要强调、第三层操作分别使用 `--semi-color-secondary`、`--semi-color-tertiary`。成功、警告和危险仅用于对应状态，使用 `--semi-color-success`、`--semi-color-warning`、`--semi-color-danger`。
- 页面和浮层按层级使用 `--semi-color-bg-0` 至 `--semi-color-bg-4`；正文、辅助文字和占位文字使用 `--semi-color-text-0` 至 `--semi-color-text-3`。边框使用 `--semi-color-border`，中性填充及其 hover、active 状态分别使用 `--semi-color-fill-0`、`--semi-color-fill-1`、`--semi-color-fill-2`。
- 焦点、禁用、链接和交互状态使用已有的 `--semi-color-focus-border`、`--semi-color-disabled-*`、`--semi-color-link*` 及语义色的 `-hover`、`-active` 变量。AI 元素和图表分别使用已有的 `--semi-color-ai-*` 与 `--semi-color-data-0` 至 `--semi-color-data-19`，不要另造色板。
- 深色由默认主题 CSS 的 `body[theme-mode="dark"]` 选择器切换；局部始终浅色区域可使用主题已有的 `.semi-always-light`。YAML 中的 `*-dark` 值仅说明对应模式的解析结果，组件仍引用同一个语义变量。

## Typography

默认字体是 Inter 与系统字体回退栈，中文依次回退到 PingFang SC、Hiragino Sans GB、Microsoft YaHei。正文为 14px/20px、400；小字为 12px/16px、400；Button 为 14px/20px、600。标题 H1 至 H6 分别是 32/44、28/40、24/32、20/28、18/24、16/22px，字重 600。文字颜色按 `--semi-color-text-*` 层级选择，不用缩小字号代替层级。

## Layout

间距按 YAML 中的 2、4、8、12、16、20、24、32、40px 序列取值。标准控件高 32px，小号 24px，大号 40px；图标常用 16px，可选 8、12、20、24px。页面布局使用 `Row`、`Col` 的 24 列栅格；响应式断点为 xs ≤575px、sm ≥576px、md ≥768px、lg ≥992px、xl ≥1200px、xxl ≥1600px。组件库没有统一页面最大宽度，不在此文件指定一个。

## Elevation & Depth

普通内容以背景层级和边框区分；Card 默认保持平面，可通过公开的边框或阴影能力改变。Popover、Modal、Toast 等浮层使用各自组件样式和 `--semi-shadow-elevated`，避免在应用侧叠加另一套阴影。阴影在浅色和深色模式下由同一变量切换。

## Shapes

基础控件如 Button、Input、Select 使用 `--semi-border-radius-small`（3px）；Card 和 Popover 使用 `--semi-border-radius-medium`（6px）。`--semi-border-radius-large` 为 12px，但不应把所有容器统一改成此值。圆形和胶囊形使用组件现有能力与 `--semi-border-radius-circle/full`。组件边框、间距和圆角以实际主题 CSS 为准。

## Components

优先组合 `@aifuxi/semi-ui-vue` 已公开的 Vue 组件。根入口和组件子路径以 `packages/ui/package.json` 的 `exports` 为准；组件用法、props、emits、slots、v-model 与已知差异查 `docs/components/<component>/` 和对应公开类型。样式来自 `@aifuxi/semi-theme-default` 的编译 CSS；按消费项目的构建方式确认是否需要显式导入，不重复注入默认主题。

- **Button：** `type` 表达动作语义，`theme` 表达 solid、light、outline、borderless 视觉层级；默认是 `type="primary"`、`theme="light"`，最强强调才使用 solid。图标按钮提供可访问名称。
- **Input、Select、Form：** 使用已有的 32px 标准控件和验证状态；受控输入优先按该组件的 Vue `v-model` 契约使用。不要用颜色单独表达错误。
- **Table：** 让表头、单元格、选择、分页和空态由 Table 公开能力实现；数据密度和滚动按内容决定，不给所有表格强加固定高度。
- **Card、Popover、Modal：** 使用各自的背景、圆角与浮层行为；Card 的实际圆角是 6px。布局用 `Row`/`Col`、`Space` 等公开组件，避免重写 `.semi-*` 结构。

## Do's and Don'ts

- 使用 `var(--semi-*)` 和已有组件状态，不把 YAML 中的浅色十六进制值硬编码到应用；扩展主题前核对默认 CSS 中现有变量。
- 保留键盘焦点、语义标签、ARIA 与禁用状态；图标按钮必须有可访问名称。需要 RTL 时使用 `ConfigProvider` 的 `direction="rtl"`，不要只翻转 CSS。
- 不把 `vendor/semi-design` 的 React API、上游 `DESIGN.md` 或未完成组件能力当作当前 Vue 公开契约。本项目是独立实现，不使用 Semi Design 官方品牌身份。

依据：`packages/theme-default/src/index.scss`、`vendor/semi-design/packages/semi-theme-default/scss/`、`packages/ui/src/` 与 `docs/components/`；文档格式遵循 [Google Labs DESIGN.md alpha 规范](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md)。
