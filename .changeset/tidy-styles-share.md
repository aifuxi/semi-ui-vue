---
'@aifuxi/semi-theme-default': major
---

逐组件 CSS 改为通过 `base.css` 和共享样式资源组合依赖。手动导入逐组件 CSS 的使用者需按 `style-dependencies.json` 同时导入对应依赖；`index.css` 全量导入保持不变。
