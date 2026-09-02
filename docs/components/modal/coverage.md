# Modal 文档覆盖清单

- 状态：`ready`
- 正式页面：`apps/docs/src/content/docs/{zh-CN,en-US}/components/modal.mdx`
- Vue Demo：`apps/docs/src/demos/modal/Showcase.vue`
- API 元数据：`apps/docs/src/data/api/modal.ts`
- 固定上游：`vendor/semi-design/content/show/modal/index{,-en-US}.md`

## 上游内容映射

| 上游章节                                         | 迁移结果                                            |
| ------------------------------------------------ | --------------------------------------------------- |
| 基本、遮罩、按钮文案/属性、头部/页脚、样式、全屏 | 合并进入 Showcase、Slots 与 Props 表                |
| 命令式调用、useModal、Promise                    | 迁入正式命令式 API 与示例                           |
| 可拖拽 Modal                                     | 映射 `modalRender`；DragMove 的独立文档不在本页复制 |
| ARIA、键盘、焦点、Portal、SSR                    | 迁入正式可访问性与运行时边界                        |
| 文案、设计变量、FAQ                              | 迁入使用说明或由主题 Token 契约承载                 |
| Related Material                                 | 排除；不迁移上游生态市场和营销内容                  |

正式页面已吸收原 `index*` 与 `react-to-vue.md` 的用户内容；源码证据继续保留在 `alignment.md`。
