# 变更意图

使用 `pnpm changeset` 记录使用者能观察到的变化：修复用 patch，新功能用 minor，破坏性变化用 major 并说明迁移方法。影响公开产物的 Foundation、主题、生成资产和构建变更同样需要记录。

纯文档、测试或内部工具修改使用 `pnpm changeset --empty`。CI 区分空记录与遗漏记录。不要在功能 PR 手改公开版本或手工打标签；五包通过 fixed 分组同步升版。

机器人维护版本 PR。当前 next 状态由官方命令生成；中间版本 0.1.0 仅用于清除旧 alpha 计数，没有发布。必须保留首份 major 记录，首个版本 PR 应产生五包 1.0.0-next.0。

日常操作和恢复步骤见 [发布手册](../docs/releasing.md)。
