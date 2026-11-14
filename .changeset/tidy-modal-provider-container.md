---
'@aifuxi/semi-ui-vue': patch
---

修复 Modal 继承 ConfigProvider 自定义容器时错误启用局部 absolute 定位，避免空 relative 宿主导致弹窗裁切及页尾按钮超出视口；保留 Modal 显式容器的局部定位行为。
