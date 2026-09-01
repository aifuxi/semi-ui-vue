---
status: accepted
---

# 文档迁移保留来源记录与公开许可归属

迁移自固定 Semi Design v2.102.0 的文档说明、示例、站点样式和资产必须在覆盖清单中记录原始路径与改编结果，并保留适用的 DouyinFE MIT 归属。Semi UI Vue 新增内容使用项目自身 MIT License；Astro、Starlight、Pagefind、Expressive Code 及其他实际进入静态产物的依赖纳入第三方许可清单。

## Consequences

- 静态站提供公开的许可与归属页面，页脚链接该页面并说明项目是基于 Semi Design v2.102.0 的独立 Vue 实现。
- 构建检查确保发布产物携带项目 License、上游归属和实际第三方 Notice，不能只依赖源码仓库中的文件。
- 不迁移来源不清晰的营销图片、客户 Logo、内部服务代码或第三方嵌入内容；排除原因进入文档覆盖清单。
