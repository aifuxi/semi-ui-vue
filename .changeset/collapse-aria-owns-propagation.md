---
'@aifuxi/semi-ui-vue': patch
---

修复 CollapsePanel 的 `aria-owns` 渲染传播：面板 id 在挂载后赋值且不触发渲染，固定 Adapter 会在展开集变化时重渲染全部面板，Vue 此前只有自身重渲染过的面板才输出 id；现按同一时机传播，默认态仍保持空值。同步完成 Collapse 双语文档严格验收。
