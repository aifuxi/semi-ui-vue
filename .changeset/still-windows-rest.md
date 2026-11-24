---
'@aifuxi/semi-ui-vue': patch
---

修复在 Vitest/jsdom 中导入 Checkbox 后立即销毁测试环境时，Lottie 就绪轮询访问已释放的 document 并抛出未捕获异常的问题。
