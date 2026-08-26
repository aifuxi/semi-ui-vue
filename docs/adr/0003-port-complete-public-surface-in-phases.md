---
status: accepted
---

# 分阶段复刻 v2.102.0 的完整公开面

Vue 移植版的最终范围是 Semi Design v2.102.0 的全部公开组件与资产。完整范围以固定源码的公开导出、文档 API 和发布资产为准，包含 AIChat、Markdown、音视频、Lottie、Cropper、JsonViewer 等长尾能力。

项目采用分阶段交付：先完成主题、ConfigProvider、Locale、Portal、Animation、Icon 等横向基础设施和核心组件，再逐步交付数据密集与长尾组件。

## Consequences

- 分阶段只改变优先级和交付顺序，不将任何公开能力默默排除出最终范围。
- 必须先生成完整 inventory，为每个公开导出关联文档、依赖、风险等级、阶段和验收状态。
- 内部组件和工具只在公开能力依赖它们时纳入实现范围。
- 核心阶段完成不等于整个复刻目标完成；必须分别报告阶段完成度和全量完成度。
