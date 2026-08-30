# Spin v2.102.0 对齐矩阵

状态：`ready`（2026-08-29）。唯一基线为本地 Semi Design `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。

## 选择理由与组件边界

- 当前提交历史已完成 `Skeleton`；固定 `vendor/semi-design/content/order.js` 中紧邻其后的公开组件是 `Spin`。
- Spin 只依赖已就绪的 ConfigProvider 全局默认值、默认主题 Token 与现有动效/SSR/Chromium 基础设施，不依赖后续 Toast，可独立形成发布闭环。
- `Spin.vue` 单独负责公开 props/slots、Foundation delay 状态、固定 SVG、包装内容和 attrs 边界；没有可独立复用的业务子区，不拆分额外公开组件。
- delay 计时复用私有 `SpinFoundation` 隔离入口；公开源码、运行时和声明不暴露 `vendor/**`。

## 固定源码证据

- Adapter、公开类型与 DOM：`vendor/semi-design/packages/semi-ui/spin/index.tsx`、`icon.tsx`
- Foundation/常量：`vendor/semi-design/packages/semi-foundation/spin/foundation.ts`、`constants.ts`
- 样式/动效/RTL：`vendor/semi-design/packages/semi-foundation/spin/spin.scss`、`variables.scss`、`animation.scss`、`rtl.scss`
- 行为测试与场景：`vendor/semi-design/packages/semi-ui/spin/__test__/spin.test.js`、`_story/`
- 中英文文档：`vendor/semi-design/content/feedback/spin/index.md`、`index-en-US.md`
- 默认主题：`vendor/semi-design/packages/semi-theme-default/scss/index.scss`、`global.scss`

## 公开 API、默认值与 Vue 映射

| React v2.102.0                          | Vue 公开契约                              | 默认值/优先级                                                       | 结论           |
| --------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------- | -------------- |
| `size?: 'small' \| 'middle' \| 'large'` | 同名 prop                                 | `'middle'`；显式 prop > `semiGlobal` > 固定默认                     | 等价           |
| `spinning?: boolean`                    | 同名 Boolean prop                         | `true`；显式 prop > `semiGlobal` > 固定默认                         | 等价，三态门禁 |
| `delay?: number`                        | 同名 prop                                 | `0ms`；只延迟 false → true，初始 true 仍立即显示                    | 等价           |
| `indicator?: ReactNode`                 | 同名 `VNodeChild` prop；推荐 `#indicator` | slot > prop > 全局默认 > 固定 SVG                                   | Vue 原生映射   |
| `tip?: ReactNode`                       | 同名 `VNodeChild` prop；推荐 `#tip`       | slot > prop；仅 loading 时渲染                                      | Vue 原生映射   |
| `children`                              | 默认 slot                                 | 有内容时增加 `.semi-spin-block`，内容始终位于 `.semi-spin-children` | Vue 原生映射   |
| `wrapperClassName`                      | 同名 prop                                 | 合并到 `.semi-spin` 根                                              | 等价           |
| `style` / `childStyle`                  | 同名 prop                                 | 分别作用于根与 children 包装                                        | 等价           |
| `data-*`                                | Vue attrs                                 | 只透传 data attrs；不扩张固定 Adapter 的 DOM attr 范围              | 等价           |

Spin 没有 emits、`v-model`、公开命令式 ref、Portal 或非受控状态。

## 默认 true Boolean、全局配置与 delay 门禁

- `spinning` 必须覆盖缺省、显式 `false`、显式 `true`；Vue 原始 VNode props 同时识别 camelCase/kebab-case，不能用归一化后的普通 truthiness 判断是否显式传入。
- 全局默认优先级固定为“显式 prop > `semiGlobal.config.overrideDefaultProps.Spin` > 上游默认值”；测试覆盖全局 `spinning=false` 时缺省采用 false、显式 true 仍优先。
- `delay>0` 且初始 `spinning=true` 时立即显示；从 false 切到 true 时保持 hidden，延迟到期后显示；切回 false 立即隐藏。
- Foundation timer 在卸载时清理；测试以 fake timer 验证卸载后不再更新。
- indicator/tip slot 分别优先于同名 VNode prop；自定义 indicator 位于 `.semi-spin-animate[x-semi-prop=indicator]` 并使用固定 1600ms 旋转。

## DOM、class、样式与几何

- 根固定为 `div.semi-spin.semi-spin-{size}`；有 children 追加 `.semi-spin-block`，非 loading 追加 `.semi-spin-hidden`。
- loading 时渲染 `div.semi-spin-wrapper`；默认 SVG 固定为 48×48 viewBox、`aria-hidden=true`、`data-icon=spin`，实际显示尺寸由 small/middle/large 分别限制为 14/20/32px。
- SVG 保留线性渐变与 `currentColor`；SSR/首次 hydration 使用固定 fallback id，挂载后切换为实例唯一 id，避免多个 Spin 的 gradient 冲突。
- 默认 SVG 动画为 `semi-animation-rotate 600ms linear infinite`；自定义 indicator 为 1600ms；wrapper 绝对居中，颜色为 `--semi-color-primary`。
- children 默认 opacity 0.5、`user-select:none`；hidden 后恢复 opacity 1/auto。block 伪元素覆盖内容，hidden 时移除。
- light/dark 由 `--semi-color-primary` 驱动；`.semi-rtl` / `.semi-portal-rtl` 下 Spin 与 container `direction: rtl`。关键 computed style 精确相等，bounding rect 各轴差值不超过 0.5 CSS px。

## 键盘、焦点、ARIA、国际化、动效与 SSR

- Spin 是非交互视觉反馈，不创建 tabindex、键盘/指针处理或焦点管理；默认 SVG 对辅助技术隐藏，固定源码不强加 live region/role。
- 无 Portal、Observer、全局监听与 Locale 文案；tip 内容由调用方提供。视觉矩阵覆盖 desktop/mobile、light/dark 与 RTL，无需 zh-CN/en-US 双份截图。
- 动画行为通过真实 computed style 验证；截图使用 Playwright 固定动画采样，不扩大 mask。
- SSR 不访问 window/document；默认 SVG fallback id 与客户端 hydration 首帧一致，根导入和子路径导入均须 SSR-safe。

## 测试与发布门禁

- 单元：spinning 三态、全局默认优先级、delay 初始/切换/卸载、尺寸、默认 SVG、indicator/tip slot 与 prop、children block/hidden、class/style/childStyle/data attrs 边界。
- SSR：默认/hidden/block、自定义 VNode 内容、fallback gradient、无私有路径。
- Chromium：真实 vendor source 请求，DOM/data/ARIA、三尺寸、包装/hidden、默认与自定义动画、desktop/mobile light/dark、RTL，以及独立 React/Vue PNG 直接比较。
- 发包：根导出、`@aifuxi/semi-ui-vue/spin` 子路径、公开类型、`@aifuxi/semi-theme-default/spin.css`、tree-shaking、SSR-safe import、许可证/SBOM 与隔离 tarball 消费。

## Deviation

- `#indicator` / `#tip` 是 ReactNode prop 的 Vue 原生补充，同名 VNode prop仍保留，不构成能力损失。
- 当前没有 accepted visual/behavior deviation；任何未解释差异均阻止 `pending -> ready`。

## 最终证据

- `pnpm check` 一次通过：106 个测试文件、755 条单元/SSR 测试，并覆盖固定 vendor/inventory、图标/插画、源码边界、格式、lint、全量 typecheck/build、主题、SSR dist 与真实 tarball 安装验证。
- Spin 专项 Chromium 在更新基线后以无更新参数复跑 7/7 通过；共享工作台 smoke 2/2 通过。未运行全仓 `pnpm test:browser`，因为本切片只新增 Spin 注册、组件作用域 harness 与本组件快照，没有修改共享运行时、全局主题、比较算法、Playwright 配置、webServer 或字体/viewport 归一化。
- desktop light/dark、mobile light/dark、desktop RTL 五组 React/Vue PNG 均由两个运行时独立生成；测试内 Buffer 直接比较与系统 `cmp` 二次检查均为 5/5 字节相等。关键 computed style 精确相等，静态根/内容几何各轴差值不超过 0.5 CSS px；动画节点另外验证固定名称、600ms/1600ms 时长与三尺寸。
