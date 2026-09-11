# AI 工作记录：FloatButton 文档严格验收

- 日期：2026-09-11
- 状态：完成

## 目标与范围

从 `920a237` 干净工作区按下一批队列验收 FloatButton 七项：Basic、Size、Shape、Link、Colorful、Badge、Group。唯一参考为只读 vendor 的 v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。开始与结束均检查既有七批证据，本轮未使其失效。

## 修改与取舍

- 双语 14 个独立示例增加 transform 容器，建立 fixed 定位包含块，消除各示例按钮叠加到整页右下角的问题。340px 高度及原 bottom/insetInlineEnd 保留，Badge 的数值 DOM 样式显式补 px。React 适配器直接读取固定 Markdown，并使用相同容器；不复制维护上游实现。
- 修正文档形状说明为 round 默认、square 可选，dot 默认 false、overflowCount 未设置时不截断。Group 文案明确 event.target.dataset.value 的委托边界，点击后代图标可返回 undefined；保留固定上游 Group 的双语反向描述。说明 target 仅特殊处理 _blank，Group 不执行 item 的 href/target/disabled，组 disabled 不拦截回调。
- 新增独立批次、审阅矩阵及 56 项 Chromium 用例。比较文本、可访问性属性、逐节点样式、0.5 CSS px 几何和逐按钮/组局部截图；默认、hover、active 均保留 threshold=0.1、maxDiffPixelRatio=0.001，不使用 mask。
- 验证真实 popup 导航（仅拦截目标网络响应）、回调日志、Group item 与 SVG 后代点击、Enter/Space 无默认激活，以及双语源码、重置、编辑器首帧和退出。Basic 真实编辑 size 为 large 并运行，确认 40px 结果。未改变公开组件运行时、类型或依赖。

## 定位记录

首次 Basic 诊断在编辑器 large 类计数处失败：外层和 body 均具有该类，实际有两个节点。限定外层 `.semi-floatButton.semi-floatButton-large` 后，编辑运行断言通过。

首次代表矩阵在 Group 渐变图标的动态 SVG ID 字符串比较处失败。改为解析本页面 ID 指向的渐变定义，仍逐项比较实际定义并验证像素；没有忽略 fill 或放宽截图门槛。Group 定点通过，随后 22 项代表全部通过。另修正本批测试的多余正则转义与验收 metadata 上游路径，最终 lint 和正式报告校验通过。

IDE 已确认目标项目，未提供合适 Run Configuration。最后一次 create_new_file 调用在文件落盘后超时（300 秒），后续通过 CLI/文件补丁推进，并检查最终文件与差异；长任务按进程退出码确认，不将超时当作成功。

## 实际验证

- 本批 ESLint、Prettier、git diff --check 通过。
- `pnpm test:tooling`：73 + 6 项通过，无失败或跳过；`pnpm typecheck:root` 通过。
- Nuxt 静态生成、类型、198 页内容及静态产物门禁通过；1761 个 Demo 注册，859/859 上游索引映射。构建准备按内容校验复用公共包资源，文档内容变化时重建 site，测试输入变化时重建 checks。
- Group 定点 1 项、代表矩阵 22 项通过；实际查看 Basic 亮色、Badge 暗色 RTL、Group 暗色 RTL 局部截图。
- Playwright `--list` 确认完整 56 项。正式 `accept:nuxt:batch float-button`：56/56 通过，最终浏览器 33.1 秒，无重试、跳过或失败，正式入口退出码 0。
- 正式证据写入 `docs/documentation/evidence/float-button.json` 与压缩报告，源码指纹和报告校验通过。当前有效验收 52/859，剩余 807 项。章节/API/迁移审阅绑定实际内容指纹；补齐审阅记录和 API 边界说明后重新执行本批正式矩阵并生成当前证据。
- 生成空 Changeset；最终 Changesets 检查及八批 `--affected --plan` 均通过。

## 剩余范围

下一批为 Grid 七项。文档剩余严格验收、全量 API/迁移审阅、站点回归、许可审计及外部发布接入仍按既定计划推进；本轮不宣称项目已满足稳定发布的全部条件。
