# Icon 文档覆盖清单

- 状态：`ready`
- 正式页面：`apps/docs/src/content/docs/{zh-CN,en-US}/components/icon.mdx`
- Vue Demo：`apps/docs/src/demos/icon/Showcase.vue`
- API 元数据：`apps/docs/src/data/api/icon.ts`
- 固定上游：`vendor/semi-design/content/basic/icon/index{,-en-US}.md`

## 上游内容映射

| 上游章节                                 | 迁移结果                                                           |
| ---------------------------------------- | ------------------------------------------------------------------ |
| 图标列表                                 | 由生成的 `@aifuxi/semi-icons-vue` 公开导出承担；试点页覆盖代表图标 |
| 基础、旋转、spin、尺寸、颜色、双色、多色 | 合并进入 Showcase 与 Props 表                                      |
| 自定义图标                               | 迁入默认 slot 与 React→Vue 说明                                    |
| SVGR                                     | 排除；属于 React 构建工具链，不是 Vue 消费契约                     |
| ARIA                                     | 迁入装饰图标与独立图标可访问性说明                                 |

正式页面已吸收原 `index*` 的用户内容；生成范围、DOM 和视觉证据继续保留在 `alignment.md`。
