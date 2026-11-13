---
'@aifuxi/semi-ui-vue': patch
---

修复 runAfterTicks 延迟回调失败时返回的 Promise 永久等待，并将同步异常和异步拒绝一致地传递给调用方。
