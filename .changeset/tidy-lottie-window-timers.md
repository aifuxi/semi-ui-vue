---
'@aifuxi/semi-ui-vue': patch
---

修复内置 Lottie 就绪轮询使用 Node 全局定时器，导致 jsdom 测试环境销毁后访问 document 并抛出未捕获异常的问题。轮询由所属 window 创建和清理，保留原有动画加载行为。
