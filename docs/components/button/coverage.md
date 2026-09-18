# Button 文档覆盖清单

本页保留历史内容映射，以下路径与状态属于已[退役的文档站](../../documentation/README.md)。组件当前契约见 [alignment.md](alignment.md)，历史映射和通过记录不代表当前验收。

- 状态：`ready`
- 当前静态文档：[index.md](index.md)、[index.en-US.md](index.en-US.md)、[react-to-vue.md](react-to-vue.md)
- 正式页面：`apps/docs/content/{zh-cn,en-us}/components/button.md`
- Vue Demo：`apps/docs/src/demos/button/Showcase.vue`
- API 元数据：`apps/docs/src/data/api/button.ts`
- 固定上游：`vendor/semi-design/content/basic/button/index{,-en-US}.md`

## 上游内容映射

| 上游章节                                          | 迁移结果                                                 |
| ------------------------------------------------- | -------------------------------------------------------- |
| 类型、主题、尺寸、块级、图标、禁用、加载、AI 多彩 | 合并进入正式说明、Showcase 与 Props 表                   |
| ButtonGroup、SplitButtonGroup                     | 合并进入 Showcase 与 API                                 |
| ARIA、键盘、焦点、文案                            | 迁入正式页面的使用约束                                   |
| 设计变量                                          | 由公开主题 CSS 与 `--semi-*` 契约承载，不复制上游生成表  |
| 链接按钮                                          | 排除；上游示例属于 Typography.Link，不是 Button 公开能力 |
| Related Material                                  | 排除；不迁移上游生态市场和营销内容                       |

正式页面已吸收原 `index*` 的用户内容；源码证据与视觉结论继续保留在 `alignment.md`。
