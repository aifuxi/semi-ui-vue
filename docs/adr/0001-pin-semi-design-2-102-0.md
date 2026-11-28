---
status: accepted
---

# 固定 Semi Design 为唯一参考基线

Vue 移植版通过只读 Git submodule `vendor/semi-design` 固定官方 `DouyinFE/semi-design` 源码，实现、测试和评审均可追溯到同一提交。

初始版本为 `v2.102.0`（`cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`）。2026-11-27 更新到 `v2.105.2`（`7db305200a2b0fd2b20f0559819f2fa55631e2ba`），升级差异记录在[发布审计](../release-audit-1.0.md#semi-v21052-基线升级2026-11-27)。

## Consequences

- 所有复刻工作先查本地固定源码；在线资料只能补缺，不能覆盖基线。
- 上游目录不得修改，本项目工具链应排除 `vendor/**`。
- 新检出环境必须初始化子模块，并核验 tag 与 SHA。
- 如需升级 Semi，必须显式更新 gitlink，并重新评估所有对齐证据；不能静默跟随上游。
