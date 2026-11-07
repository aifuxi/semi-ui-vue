---
'@aifuxi/semi-ui-vue': patch
---

修复 Dropdown 未提供可选 Boolean 参数时将 false 透传给 Tooltip、关闭默认防溢出的问题。未传或显式 undefined 的 autoAdjustOverflow 继续使用全局覆盖与下层默认值，保留显式 false，并支持运行时参数切换。
