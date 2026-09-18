# JsonViewer 文档覆盖清单

本页保留历史内容映射，以下路径与状态属于已[退役的文档站](../../documentation/README.md)。组件当前契约见 [alignment.md](alignment.md)，历史映射和通过记录不代表当前验收。

- 状态：`ready`
- 当前静态文档：[index.md](index.md)、[index.en-US.md](index.en-US.md)、[react-to-vue.md](react-to-vue.md)
- 正式页面：`apps/docs/content/{zh-cn,en-us}/components/json-viewer.md`
- Vue Demo：`apps/docs/src/demos/json-viewer/Showcase.vue`
- API 元数据：`apps/docs/src/data/api/json-viewer.ts`
- 固定上游：`vendor/semi-design/content/plus/jsonviewer/index{,-en-US}.md`

## 上游内容映射

| 上游章节                                 | 迁移结果                                      |
| ---------------------------------------- | --------------------------------------------- |
| 基本查看与编辑、尺寸、只读、换行、格式化 | 合并进入 Showcase、options 与 Props 表        |
| 搜索、替换、搜索入口                     | 迁入事件、slot、renderSearchButton 与实例方法 |
| 静态补全、自定义 token 渲染              | 迁入 JsonViewerOptions 说明                   |
| Worker、SSR、清理                        | 迁入正式运行时边界与可访问性说明              |
| React render prop 与 ref                 | 迁入正式 React→Vue 映射                       |

正式页面已吸收原 `index*` 与 `react-to-vue.md` 的用户内容；源码证据与 Worker 验证继续保留在 `alignment.md`。
