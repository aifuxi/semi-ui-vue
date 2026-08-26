---
status: accepted
---

# 固定 Semi Design 2.102.0 为唯一参考基线

Vue 移植版固定使用官方 `DouyinFE/semi-design` 的 `v2.102.0`（`cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`），并通过只读 Git submodule 存放在 `vendor/semi-design`。相比跟随 `main`、依赖会漂移的在线文档或复制源码快照，精确 submodule 能让实现、测试和评审都追溯到同一份输入，同时保留官方仓库历史身份。

## Consequences

- 所有复刻工作先查本地固定源码；在线资料只能补缺，不能覆盖基线。
- 上游目录不得修改，本项目工具链应排除 `vendor/**`。
- 新检出环境必须初始化子模块，并核验 tag 与 SHA。
- 如需升级 Semi，必须显式更新 gitlink，并重新评估所有对齐证据；不能静默跟随上游。
