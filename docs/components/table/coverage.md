# Table 文档覆盖清单

- 状态：`ready`
- 正式页面：`apps/docs/src/content/docs/{zh-CN,en-US}/components/table.mdx`
- Vue Demo：`apps/docs/src/demos/table/Showcase.vue`
- API 元数据：`apps/docs/src/data/api/table.ts`
- 固定上游：`vendor/semi-design/content/show/table/index{,-en-US}.md`

## 上游内容映射

| 上游章节                                   | 迁移结果                                                                       |
| ------------------------------------------ | ------------------------------------------------------------------------------ |
| 基础数据、列、分页、排序、筛选、远程数据   | 合并进入类型化数据说明、Showcase 与 change 契约                                |
| 行选择、展开、树数据、分组                 | 合并进入 Showcase、Props、Slots 与事件表                                       |
| 固定列/表头、滚动、ellipsis、sticky        | 合并进入 scroll/sticky/column API                                              |
| 自定义行/单元格、合并表头、rowSpan/colSpan | 映射为列函数、`#cell` / `#headerCell` 与 components API                        |
| 列宽调整、虚拟化、无限滚动                 | 迁入 resizable、virtualized、实例引用契约                                      |
| 拖拽排序                                   | 排除上游 `@dnd-kit/*` 第三方集成代码；Table 只记录 `components`/行事件接入边界 |
| ARIA、RTL、文案、设计变量、FAQ             | 迁入正式说明或由公开主题契约承载                                               |
| Related Material                           | 排除；不迁移上游生态市场和营销内容                                             |

正式页面已吸收原 `index*` 与 `react-to-vue.md` 的用户内容；复杂场景的浏览器证据继续保留在 `alignment.md` 与现有 parity suite。
