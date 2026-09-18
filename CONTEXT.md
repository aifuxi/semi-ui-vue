# 项目术语

| 术语                 | 含义                                                                             |
| -------------------- | -------------------------------------------------------------------------------- |
| 固定基线             | 根 AGENTS.md 指定的 Semi 版本与只读源码，是正确性来源                            |
| Foundation / Adapter | 框架无关逻辑 / 连接框架状态、生命周期与 DOM 的适配层                             |
| 公开面               | 固定基线的公开导出、文档 API 与发布资产；不按目录数量猜测                        |
| 组件 ready           | 组件完整切片的契约与交付物齐全，见[组件契约](docs/testing/component-contract.md) |
| 可接受差异           | 无法等价且已记录源码依据、原因、用户影响与验收结论的差异；未实现能力仍是待办     |
| SSR-safe import      | 无 DOM 环境能导入公开入口；不同于 SSR render/hydration 通过                      |
| 发布候选             | 具体提交及其已验证的准确包产物，按[发布手册](docs/releasing.md)发布              |
| 对照工作台           | 维护者运行真实 React/Vue 场景的测试应用                                          |

工程边界见[工作区架构](docs/architecture/workspace.md)。Nuxt 文档站及文档 `accepted` 协议已[退役](docs/documentation/README.md)，历史映射或通过数量不用于判定当前组件状态。历史 ADR、计划和工作记录描述当时决策，不作为每次任务的必读规则。
