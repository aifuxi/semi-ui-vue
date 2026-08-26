# Semi Design v2.102.0 上游 Inventory

本目录由 `pnpm inventory:generate` 从只读 `vendor/semi-design` 生成。JSON 是后续组件对齐矩阵、里程碑规划和缺口检查的机器可读输入；不要手工修改生成文件。

## 固定来源

- Tag：`v2.102.0`
- Commit：`cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`
- 根入口：`vendor/semi-design/packages/semi-ui/index.ts`

## 汇总

| 维度                           |          数量 |
| ------------------------------ | ------------: |
| 根入口公开导出                 |           130 |
| 根入口模块组                   |            85 |
| 外部 Foundation 根导出         |             7 |
| `typesVersions` 公开子路径     |           537 |
| 文档页面                       |           102 |
| 中文 / 英文文档                |     102 / 102 |
| Foundation 顶层目录            |            85 |
| Locale                         |            57 |
| 稳定图标 / Lab 图标 / 插画导出 | 526 / 84 / 16 |
| 默认主题 CSS Token             |           375 |

## Inventory 覆盖面

- `publicApi.rootExports`：`semi-ui/index.ts` 的运行时与类型导出。
- `publicApi.publicSubpaths`：发布清单声明的全部 TypeScript 子路径兼容面。
- `modules`：按根入口来源目录聚合 Adapter、entry API、Foundation、依赖、文档和测试资产。
- `documentation`：中英文页面、API 标题、live demo 与 Markdown 表格行统计。
- `upstreamPackages`：UI/Foundation/默认主题/图标/Lab/插画的依赖与公开导出。
- `assets`：全部 Locale、默认主题 SCSS 文件和 CSS Token。

## 需要人工归类的上游缺口

以下清单是源事实，不自动等同于 Vue 侧缺陷。技术导出、全局 Provider 或命令式 API 可能天然没有独立文档、Foundation 或测试，进入组件里程碑前必须逐项解释。

### 没有直接匹配文档的根模块

- `_base`
- `_utils`
- `iconButton`

### 没有同名 Foundation 目录的根模块

- `configProvider`
- `iconButton`
- `locale`

### 没有上游单元测试文件的根模块

- `_base`
- `_utils`
- `aiChatDialogue`
- `audioPlayer`
- `chat`
- `codeHighlight`
- `configProvider`
- `cropper`
- `feedback`
- `floatButton`
- `highlight`
- `iconButton`
- `icons`
- `jsonViewer`
- `locale`
- `lottie`
- `resizable`
- `sideBar`
- `userGuide`
- `videoPlayer`

### 没有上游 Story 文件的根模块

- `_utils`

## 校验

`pnpm check:inventory` 会重新读取固定 submodule 并逐字比较 JSON/Markdown；上游基线、生成逻辑或生成物不一致时直接失败。
