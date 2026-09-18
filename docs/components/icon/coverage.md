# Icon 文档覆盖清单

本页保留历史内容映射，以下路径与状态属于已[退役的文档站](../../documentation/README.md)。组件当前契约见 [alignment.md](alignment.md)，历史映射和通过记录不代表当前验收。

- 文档批次状态：`accepted`（组件切片状态与文档逐项验收分开记录）
- 当前静态文档：[index.md](index.md)、[index.en-US.md](index.en-US.md)、[react-to-vue.md](react-to-vue.md)
- 正式页面：`apps/docs/content/{zh-cn,en-us}/components/icon.md`
- Vue Demo：`apps/docs/src/demos/icon/{zh-cn,en-us}/*.vue`
- API 元数据：`apps/docs/src/data/api/icon.ts`
- 固定上游：`vendor/semi-design/content/basic/icon/index{,-en-US}.md`

## 上游内容映射

| 上游章节                                 | 迁移结果                                                           |
| ---------------------------------------- | ------------------------------------------------------------------ |
| 图标列表                                 | 由生成的 `@aifuxi/semi-icons-vue` 公开导出承担；试点页覆盖代表图标 |
| 基础、旋转、spin、尺寸、颜色、双色、多色 | 按固定顺序拆为 6 项双语示例与 Props 表                             |
| 自定义图标                               | 第 7 项默认 slot + CustomSvg 多文件示例及 React→Vue 说明           |
| SVGR                                     | 改为 Vue SFC SVG 组件引入说明，不新增 React loader                 |
| ARIA                                     | 第 8 项 aria-label 覆盖示例及装饰图标说明                          |

8 项 live Demo 已建立双语映射，48 条 Chromium 用例全部通过并生成有效 Icon 批次证据。短 fill 调色板顺序缺陷已修复，具体矩阵见 `docs/documentation/icon-acceptance.md`，有效证据见 `docs/documentation/evidence/icon.json`。图标列表仍由公开导出承担，未新增完整图标检索平台。
