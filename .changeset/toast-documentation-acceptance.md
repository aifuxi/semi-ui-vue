---
'@aifuxi/semi-ui-vue': patch
---

对齐 Toast 固定基线：`useToast` holder 改为就地渲染裸 Toast（不再包 `.semi-toast-innerWrapper`）、空 holder 不渲染节点且列表位移为 0；完成九项双语示例（含英文独有 Stacking）的严格视觉与行为验收。
