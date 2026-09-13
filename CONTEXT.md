# 项目术语

| 术语                  | 含义                                                                               |
| --------------------- | ---------------------------------------------------------------------------------- |
| 固定基线              | 根 AGENTS.md 指定的 Semi 版本与只读源码，是正确性来源                              |
| Foundation / Adapter  | 框架无关逻辑 / 连接框架状态、生命周期与 DOM 的适配层                               |
| 公开面                | 固定基线的公开导出、文档 API 与发布资产；不按目录数量猜测                          |
| 组件 ready            | 组件完整切片的契约与交付物齐全，见[组件契约](docs/testing/component-contract.md)   |
| 文档已映射            | 上游示例已关联双语 Vue 实现，不代表运行或严格验收通过                              |
| 文档 accepted         | 语义审阅和完整正式矩阵对当前输入有效，见[文档流程](docs/documentation/workflow.md) |
| 可接受差异            | 无法等价且已记录源码依据、原因、用户影响与验收结论的差异；未实现能力仍是待办       |
| SSR-safe import       | 无 DOM 环境能导入公开入口；不同于 SSR render/hydration 通过                        |
| 发布候选              | 具体提交及其已验证的准确包产物，按[发布手册](docs/releasing.md)发布                |
| 文档门户 / 对照工作台 | 面向使用者的静态站 / 维护者的 React-Vue 测试应用                                   |

工程边界见[工作区架构](docs/architecture/workspace.md)，当前队列见[文档计划](docs/documentation/batch-plan.md)。历史 ADR、计划和工作记录描述当时决策，不作为每次任务的必读规则。
