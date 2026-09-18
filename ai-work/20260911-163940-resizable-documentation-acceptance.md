# AI 工作记录：Resizable 文档严格验收

- 日期：2026-09-11
- 状态：完成

## 目标与范围

从 Layout 完成提交 f9979e8 接续既定严格验收队列，处理 Resizable 14 项。起始十批 67/859 有效，固定参考为 v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。本轮不扩展下一组件，不推送或发布。

## 修改与依据

- React 参考直接编译固定双语 Markdown，复用已有固定 Resizable 家族入口。补遗漏 Toast/Button 导入；未公开的 IconTransfer 用 IconHandle 替换。grid=100 在 Foundation 内等价于 [100,100]，参考使用元组避免固定 React PropTypes 的错误声明产生警告。
- 修正双语 Direction 的两处 margin：Vue 原生 style 对象必须明确写 8px。API 文档补完整 snap 的 x/y 类型、英文 @change 回调和 ResizeItem.defaultSize 的固定尺寸/权重含义。
- 更正旧映射对英文 Grid 缺少闭合标签的误记：固定源码本身已有闭合标签。
- 保持 0.5 CSS px、像素 threshold=0.1、差异比例=0.001，不 mask，不修改 vendor 或组件运行时。

## 定位记录

- CUA 观察基本示例真实右侧手柄与动态方向切换；React 独立运行。初始 reference dev 仅监听 ::1，调整启动参数绑定 127.0.0.1；未修改仓库服务配置。
- Direction 首帧高度 224/246px 差异来自 Vue 数值 margin，不是 Typography 或 Resizable 的运行时缺陷。修正后 Direction 与 DynamicDirection 统一诊断通过。
- 首轮扩展在 Grid 控制台警告处失败；其尺寸与截图对照已通过。Foundation 源码支持标量，React PropTypes 仅声明数组；参考适配为等价元组，不过滤 console error。
- Toast 隔离采样初稿将同 context 时钟逐页推进。Trace 证实 clockRunFor 属于 BrowserContext，累计推进使参考第一条提前退出。改为独立 context、双侧操作后只推进一次，编辑器 context 始终保留真实时钟。
- WebStorm 项目与 Run Configuration 两个只读调用均在 300 秒超时，使用 CLI/文件补丁推进。

## 验证

- 最终 43 项自动代表全部通过，浏览器 99.3 秒；查看了 Direction 英文亮色、Handle/ComplexNested 英文暗色 RTL，以及 Nested/Toast 的局部截图。报告和截图归档在 ignored 的 apps/docs/.data/documentation-smoke/resizable/representatives-passed 与 toast-passed。
- 最终示例/适配器/spec 的 ESLint、Prettier 与 git diff --check 通过；Playwright --list 确认完整 112 项。
- 统一入口实际完成 Nuxt 静态生成、类型、198 页内容与产物检查，1761 个 Demo 注册。Direction/API 修改使 site 重建一次；后续纯测试修正复用 resources/site，按输入重新执行 checks。
- `accept:nuxt:batch resizable --affected`：112/112 通过，无失败、重试或跳过。浏览器命令 253.1 秒，正式整轮 267.491 秒；正式入口复用验证过的准备产物，运行前后输入及产物校验通过。
- 历史十批保持有效，新证据为 docs/documentation/evidence/resizable.json 及同目录压缩报告，覆盖账本 81/859，剩余 778 项。当前十一批共 528 条正式矩阵用例。下一批为 Space 5 项。
- 空 changeset 为 .changeset/short-breads-check.md，check:changesets 通过，保留既有 major 计划。

## 其他定位与剩余边界

- Group 第二项已达上限后继续向外拖不会变化，符合限制；恢复探针改为向内拖动，不放宽尺寸变化断言。
- Switch 背景相差一个色阶来自采样顺序：先等待动效再移开指针会新触发 hover 退出过渡。改为先对齐并移开鼠标再等待动效，英文四种主题/方向定点通过，随后完整代表与正式矩阵通过。
- 最终自审修正新批次依赖清单的目录误替换，明确追踪 apps/docs/src/layouts；正式证据包含正确输入。
- 本批没有未解决问题；文档预览为 ClientOnly，不将它作为 SSR/hydration 证据。未改公开包或组件运行时，未重复执行全组件矩阵和真实包安装。未推送、发布或继续下一组件。
