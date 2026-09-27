---
title: 'Customized Themes 定制主题'
type: 'advanced'
order: 4
icon: 'doc-theme'
---

## 定制方式

Semi 提供完整的主题配置流程，既保持颜色、字体、圆角、阴影、布局等在视觉语言上的统一连贯，又能满足业务和品牌多样化的视觉需求。
你可以前往 [Semi 设计系统管理站点](https://semi.design/dsm/) （又称DSM） 选择或者创造一套符合你的需求的主题风格。

目前DSM支持全局、组件级别的样式定制，并在 Figma 和线上代码之间保持同步。**使用 DSM，将 Semi Design 适配为 Any Design**

- 🎨 全局样式 变量管理
  支持色盘、圆角、字体排版、描边、阴影的可视化编辑预览

- 🔁 设计变量双向同步
  设计变量可以在 Web 端与 Figma 插件侧双向实时同步。

- 🧩 深度的组件样式定制
  对单个组件的样式进行深度定制，例如组件的 高度 / 间距等样式定制；

### 创造主题

你也可以从已发布的主题出发，或者选择 **立即创造** 来创造一个新的主题，也可以更新已发布的主题。选取主色后，我们的颜色算法会为你生成一套高可用的色盘。在此基础上你可以修改通用变量并产出对应的主题包。一键发布即可推送到 npm 中。

![主题创建](https://lf9-static.bytednsdoc.com/obj/eden-cn/nuhpxphk/dsm/dsm_welcome.png)

![主题编辑](https://lf9-static.bytednsdoc.com/obj/eden-cn/nuhpxphk/dsm/dsm_console.png)

![基础色调整](https://lf9-static.bytednsdoc.com/obj/eden-cn/nuhpxphk/dsm/dsm_palette.png)

![色盘调整](https://lf9-static.bytednsdoc.com/obj/eden-cn/nuhpxphk/dsm/dsm_usage.png)

## 接入主题

创建或下载主题后，直接导入主题包提供的编译 CSS。Webpack 与 Vite 都遵循标准 CSS 顺序，后导入的规则覆盖先导入的规则：

1. 通过 DSM 生成的 npm 主题包
2. 通过项目内本地的 Scss 文件
3. 通过业务作用域覆盖组件样式

### 使用 Webpack 作为构建工具时

Webpack 可直接加载主题包 CSS；Semi UI Vue 不要求安装额外主题插件。

安装你的主题包后，在应用入口导入其 CSS。

#### 通过 npm 包接入

<DemoBlock id="zh-CN-advanced-customize-theme-1" title="通过 npm 包接入" kind="code" />

#### 通过本地 Scss 文件

<DemoBlock id="zh-CN-advanced-customize-theme-2" title="通过本地 Scss 文件" kind="code" />

<DemoBlock id="zh-CN-advanced-customize-theme-3" title="通过本地 Scss 文件" kind="code" />

#### 通过参数覆盖变量

<DemoBlock id="zh-CN-advanced-customize-theme-4" title="通过参数覆盖变量" kind="code" />

#### 使用业务作用域隔离覆盖

Semi UI Vue 保留 `.semi-*` 兼容类名；需要隔离覆盖时增加业务作用域：

<DemoBlock id="zh-CN-advanced-customize-theme-5" title="使用业务作用域隔离覆盖" kind="code" />

兼容类名仍保持 `.semi-*`；业务作用域只限制覆盖规则的生效范围。

### 使用 Vite 作为构建工具时

Vite 可直接加载主题包 CSS；Semi UI Vue 不要求安装额外主题插件。

安装你的主题包后，在应用入口导入其 CSS。

#### 通过 npm 包接入

<DemoBlock id="zh-CN-advanced-customize-theme-6" title="通过 npm 包接入" kind="code" />

#### 通过本地 Scss 文件

<DemoBlock id="zh-CN-advanced-customize-theme-7" title="通过本地 Scss 文件" kind="code" />

<DemoBlock id="zh-CN-advanced-customize-theme-8" title="通过本地 Scss 文件" kind="code" />

#### 通过参数覆盖变量

<DemoBlock id="zh-CN-advanced-customize-theme-9" title="通过参数覆盖变量" kind="code" />

#### 使用业务作用域隔离覆盖

<DemoBlock id="zh-CN-advanced-customize-theme-10" title="使用业务作用域隔离覆盖" kind="code" />

兼容类名仍保持 `.semi-*`；业务作用域只限制覆盖规则的生效范围。

> 主题包只提供编译 CSS；构建工具的 CSS Layer、代码分割和全局样式限制由消费项目自行配置。

消费项目只需保证主题 CSS 先于业务覆盖加载；框架专属插件不属于本项目的公开契约。

### 覆盖组件级样式

需要覆盖单个组件时，在主题 CSS 之后加载对应业务样式：

<DemoBlock id="zh-CN-advanced-customize-theme-11" title="覆盖组件级样式" kind="code" />

## 更新主题

Semi UI Vue 固定对齐 Semi Design v2.102.0。使用自定义主题时应核对其变量与该基线兼容，不自动跟随上游后续版本。
