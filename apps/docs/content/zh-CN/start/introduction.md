---
title: 'Introduction 介绍'
description: '介绍 Semi Design 的设计理念及 Semi UI Vue 与其的关系。'
type: 'start'
order: 1
icon: 'doc-intro'
---

## 什么是 Semi

Semi Design 是由抖音前端团队、MED 产品设计团队设计、开发并维护的设计系统。Semi UI Vue 是基于该设计系统的独立 Vue 3 实现，并非 Semi Design 官方项目。本页介绍 Semi Design 的设计理念和历史实践；其中提及的上游工具与规划不属于 Semi UI Vue 的交付承诺。

## Semi Design 的愿景

Semi 多用于前缀或词组中，表示「一半」 —— 正如同一个完整的企业应用，通常由业务逻辑与前端界面构成，Semi Design 希望成为这不可或缺的一半，为企业应用前端提供坚实且优质的基础。
Semi Design 团队认为，设计系统的价值在于降低前端搭建成本，并提供设计和工程化标准。

### 设计 —— 不变与多变

近年来，越来越多的 SaaS 产品如 Slack，Notion，Figma，开始依靠优秀的用户体验来推动增长。对产品的评判标准，已从采购方逐渐转移到终端用户；一个产品体验的好与坏，将直接影响用户是否继续使用，B 端产品的体验设计也变得愈发重要。

Semi Design 始终致力于提升企业应用的体验。通过提炼简洁轻量，现代化的设计风格，细致打磨原子组件的交互，并在字节跳动的海量业务场景下进行迭代，沉淀了一套优质的默认基础 —— 它将保证 Semi 打造的企业应用产品，天生拥有连贯一致的「语言」，和明显优于陈旧系统的质量基线。

此外，一个好的设计系统必须是「活的」，它需要能跟随业务的增长而发展、更新。因此，Semi 从未尝试约束用户，固化所谓的「统一规范」，而是在默认基础上，充分进行模块化解耦，并开放自定义能力，方便用户进行二次裁剪与定制，搭建适用于不同形态产品的前端资产。

![基于 Semi Design 的多元化产品与团队组件](https://lf9-static.semi.design/obj/semi-tos/images/introduction-showcase.gif)

**坚守优质且稳定的默认基础(不变)，并在需要时充分开放自定义的灵活度(多变)，这是 Semi Design 独特的，并将一直遵循的设计原则。**

### 主题化 —— 品牌一键定制

Semi 是如何在连贯统一的基础上，做到灵活多变的？答案是强大的主题化方案。

通过对数千个设计变量 (Design Token) 的分层和梳理，设计师和开发者可在全局、乃至组件级别，对 表现层进行深度定制 —— 即使你不了解 CSS，也可以**通过主题编辑器(DSM)，打造符合业务和品牌多样化视觉需求的风格**。开发者则可通过 npm 包一键发布并替换，轻松定制，易于管理。

你可以在[Semi DSM](https://semi.design/dsm_store)，查看 Semi 在抖音、剪映、飞书、火山引擎等不同品牌场景下的官方示例主题。

![全面覆盖的设计变量用例、文档与编辑器](https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/tech-doc/p3.gif)

DSM还支持 **从线上到设计工具的实时同步** —— Design Token可以同时在工程项目与Figma中进行消费，在提升效率的同时，进一步保证设计和研发的持续对齐，降低产研间的沟通成本。

### 深色模式

为了兼容更多用户群体在不同生产环境下的使用偏好，作为浅色模式的补充，Semi Design 的任意主题均自动支持深色模式，并能在应用运行时动态切换。

不仅如此，Semi 并且允许用户在应用内局部区域开启深色模式，以兼容 SDK 或插件型产品的使用场景。通过进阶设置，用户也可以实现应用和系统主题自动保持一致。

固定上游另有面向存量工程的暗色模式迁移工具；该工具不属于 Semi UI Vue 的公开包或支持范围。

![Semi 深色模式在业务系统中的应用](https://lf26-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/tech-doc/p4darkmode.gif)

### 国际化 —— 多元兼容

在字节跳动全球化业务实践下，Semi Design 经过 30+ 版本迭代，已具备完善的国际化特性 —— 覆盖简/繁体中文，英语、日语、韩语、葡萄牙语等 20+ 语言，日期时间组件提供全球时区支持，全部组件可自动适配阿拉伯文 RTL 布局。

随着业务拓展，也有海外开发者使用 Semi 构建应用。Semi Design 官方站点为此提供了双语文档。

![海外运营平台产品 Powered by Semi Design](https://lf9-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/tech-doc/p5global.png)

### 跨框架技术方案

Semi Design 采用 F/A 分层设计，将组件逻辑拆分为 Foundation 和 Adapter。不同框架可以通过各自的 Adapter 复用 Foundation 逻辑。

![F/A架构](https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/tech-doc/crossFrame.png)

#### Foundation

Foundation 包含最能代表 Semi Design 组件交互的业务逻辑，包括 UI 行为触发后的各种计算、分支判断等逻辑，它并不直接操作或者引用 DOM，任意需要 DOM 操作，驱动组件渲染更新的部分会委派给 Adapter 执行。

#### Adapter

Adapter 是一个接口，具有 Foundation 实现 Semi Design 业务逻辑所需的所有方法，并负责 1. 组件 DOM 结构声明 2.负责所有跟 DOM 操作/更新相关的逻辑，通常会使用框架 API 进行 setState、getState、addEventListener、removeListener 等操作。适配器可以有许多实现，允许与不同框架的互操作性。

固定上游提供 React Adapter；Semi UI Vue 通过私有集成边界复用固定 Foundation，并以 Vue props、emits、slots 与 v-model 暴露公开 API。如果你对 Semi 的架构设计感兴趣，可以进一步查阅[这篇文章](https://bytedance.feishu.cn/docs/doccnTgc0iGOVPubHZkwPpxXSNh#)。

## Semi Design 的历史设计实践

以下内容介绍原设计系统的工具与实践，仅作为背景资料。

### Design to Code

Semi Design 团队曾探索通过自动化方式改进设计与研发流程，包括设计稿到前端页面的转换。

其 Design to Code 实践曾用于落地页、表单页和表格页等场景；相关能力属于 Semi Design 官方工具。

组件级识别与转译曾通过 Code2Design 和 Design2Code 探索；可参阅 [Semi Figma Plugin](https://www.figma.com/community/plugin/1166339852662786534/Semi-Design-%E8%AE%BE%E8%AE%A1%E8%BD%AC%E4%BB%A3%E7%A0%81---%E7%A4%BE%E5%8C%BA%E7%89%88) 了解官方工具。

页面设计模板转代码是原设计系统的后续方向，不属于 Semi UI Vue 的功能范围。

![Semi 页面模板 & 落地页转代码 (内部)](https://lf9-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/tech-doc/semiPro.gif)

### A11y

Semi Design 重视 Web 可访问性，在语义标签、主题色彩对比度和文本感知性等方面持续改进。

各组件文档保留固定基线的 Accessibility 说明；Semi UI Vue 的语义、键盘与焦点能力以对应组件契约和当前浏览器验证为准，未记录的能力不作额外承诺。

固定上游的后续规划不自动成为 Semi UI Vue 的交付承诺；本项目按固定 v2.102.0 基线维护已记录的可访问性契约。

### 多框架

可扩展性贯穿 Semi Design 的架构、API 和样式设计。Semi Design 2.0 使用 TypeScript，并通过 Foundation/Adapter 分层支持不同框架的适配。

Foundation 层以 MIT 协议开源；Semi UI Vue 通过私有集成边界使用该层，并以 Vue API 提供组件能力。

上述多框架展望来自固定上游文档；Semi UI Vue 当前只维护 Vue 3.5+ 的公开实现。

## 设计资源

![Figma Logo](https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Figma-logo.svg/64px-Figma-logo.svg.png)

- 设计师可以从 Figma 组件库 [Semi Design System](https://www.figma.com/@semi) 获得色盘、样式库及组件。

## 兼容性

- 下表是固定上游的兼容性参考；Semi UI Vue 当前发布门禁固定完整 Chromium，其他现代浏览器未建立发布矩阵。主题依赖 CSS variables，不支持 IE11。

| [](http://godban.github.io/browsers-support-badges/) Edge | [](http://godban.github.io/browsers-support-badges/) Firefox | [](http://godban.github.io/browsers-support-badges/) Chrome | [](http://godban.github.io/browsers-support-badges/) Safari | [](http://godban.github.io/browsers-support-badges/) Opera | [](http://godban.github.io/browsers-support-badges/) Electron |
| --------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------- |
| last 2 versions                                           | last 2 versions                                              | last 2 versions                                             | last 2 versions                                             | last 2 versions                                            | last 2 versions                                               |
