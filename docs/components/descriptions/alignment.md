# Descriptions v2.102.0 对齐矩阵

## 路线、固定源码与组件边界

- 当前路线：最近完成 `Collapsible`；`Descriptions` 是固定 `vendor/semi-design/content/order.js` 中紧邻其后的公开组件。
- 已就绪依赖：Descriptions 只使用基础 Vue VNode、ConfigProvider 全局默认值和默认主题 Token，不依赖后续 Dropdown、Image、Modal、Popover 等未完成公开切片，可独立形成发布与浏览器验收闭环。
- React Adapter：`vendor/semi-design/packages/semi-ui/descriptions/index.tsx`、`item.tsx` 与 `descriptions-context.ts`。
- Foundation：`vendor/semi-design/packages/semi-foundation/descriptions/foundation.ts`、`constants.ts`。
- 样式：`vendor/semi-design/packages/semi-foundation/descriptions/descriptions.scss`、`variables.scss`、`rtl.scss`，Token 来自固定 `semi-theme-default/scss`。
- 文档与测试：`vendor/semi-design/content/show/descriptions/index.md`、`index-en-US.md` 与 `packages/semi-ui/descriptions/__test__/descriptions.test.js`。
- `Descriptions.vue` 负责数据/Item VNode 归一化、横向分组和根 table；`DescriptionsItem.vue` 只负责一项的 th/td 或 plain td DOM。横向分组复用私有 `DescriptionsFoundation`，公开声明不得泄漏 `vendor/**` 或私有 workspace 路径。

## API 与 Vue 映射

| React v2.102.0                        | Vue API                                             | 默认值 / 行为                                                   | 结论           |
| ------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------- | -------------- |
| `align`                               | `align`                                             | `center`；支持 `center` / `justify` / `left` / `plain`          | 等价           |
| `row`                                 | `row`                                               | `false`；启用双行展示并增加尺寸 class                           | 等价           |
| `size`                                | `size`                                              | `medium`；仅改变双行字体与间距                                  | 等价           |
| `data`                                | `data`                                              | `[]`；有非空 data 时优先于默认 slot                             | Vue VNode 映射 |
| `layout`                              | `layout`                                            | `vertical`；`horizontal` 按 column/span 分行                    | 等价           |
| `column`                              | `column`                                            | `3`；仅横向布局参与分组                                         | 等价           |
| `className` / `style`                 | `className` / `style`，另接收 Vue `class` / `style` | 合并至根 div                                                    | Vue 原生映射   |
| `children`                            | 默认 slot                                           | 支持 `Descriptions.Item`；vertical 保持 slot 顺序               | Vue 原生映射   |
| `Data.key` / `value`                  | `VNodeChild` / `VNodeChild \| (() => VNodeChild)`   | value 函数在渲染时调用                                          | Vue VNode 映射 |
| `hidden`                              | 同名 Boolean                                        | hidden 项不生成单元格且不计入横向 span                          | 等价           |
| `span`                                | 同名 number                                         | 默认 1；末行最后一项未显式 span 时自动补齐                      | 等价           |
| `keyStyle`                            | 同名 `StyleValue`                                   | 落在 `.semi-descriptions-key`                                   | 等价           |
| `Descriptions.Item`                   | `Descriptions.Item` 与命名导出 `DescriptionsItem`   | `itemKey` prop 或 `#key`，内容为默认 slot                       | Vue slot 映射  |
| Item `className` / `style` / `data-*` | 同名 props/原生 attrs                               | vertical 落在 tr；horizontal 的固定结构不为单元格组增加 wrapper | 等价           |

## 子 VNode、数据优先级与 Foundation 门禁

- 横向默认 slot 只把真正的 `DescriptionsItem` VNode 交给 Foundation；Fragment 会递归展开，空白文本/注释忽略，意外子节点不伪装成 Item。
- 同时覆盖 SFC 模板宿主与 `h()` render function 宿主；`item-key` / `itemKey`、裸 `hidden`、`:hidden="false"` 与 render-function Boolean 均按 Vue VNode 真实形态读取。
- data 非空时完全优先于默认 slot；空 data 回退到 slot，与固定 Adapter 的 `data?.length` 判断一致。
- 传给 Foundation 的记录均为新对象。固定 Foundation 会给末行最后一个无 span 项补写 span；Vue 适配不得修改用户传入的 data 对象或 VNode props。
- 分组先过滤 hidden，再累计 `span || 1`；累计达到或超过 column 立即结束当前行。末行不足且最后一项 span 为 NaN/缺省时，补为 `column - used + 1`。

## DOM、样式、主题与 RTL

- 根固定为 `div.semi-descriptions`，按状态增加 `semi-descriptions-{align}`（非 row）、`semi-descriptions-double`、`semi-descriptions-double-{size}`、`semi-descriptions-horizontal|vertical`；内部固定 `table > tbody`。
- 非 plain 项为 `tr > th.semi-descriptions-item-th + td.semi-descriptions-item-td`；plain 为 `tr > td`。horizontal 只把多项单元格放入同一 tr，不额外产生 Item tr。
- key/value 固定为 `.semi-descriptions-key` / `.semi-descriptions-value`；plain key 后保留冒号，其他 align 不增加冒号。
- 横向非 plain 的 value `colspan = span * 2 - 1`，plain 的 value 单元格 `colspan = span`；hidden 项完全不渲染。
- 默认主题直接编译固定 Descriptions SCSS；light/dark 由 `--semi-color-text-0/2` Token 驱动。RTL 由 ConfigProvider `.semi-rtl` 驱动方向、padding 与 text-align 翻转。

## 交互、ARIA、国际化与 SSR

- Descriptions 是静态语义 table，不创建 tabindex、role、键盘处理、事件、Portal、Observer 或动效；浏览器验证确保不会引入伪交互语义。
- 组件没有内置文案与 Locale 数据；zh-CN/en-US 使用相同结构，内容由调用方提供。
- `data-*` 按固定 `getDataAttr` 边界转发；根或 Item 的任意 `aria-*` 不应被误转发。
- 模块求值与 SSR render 不访问 browser global；vertical/horizontal、data/slot、plain、hidden、class/style/data attrs 均能稳定 SSR，并在 hydration 后无警告。

## 测试、视觉与发布门禁

- 单元：默认 data DOM、hidden、四种 align、row 三种 size、value 函数、key VNode、class/style/data attrs、data 优先、Item 模板/render-function、Boolean 形态、横向分组/补 span/不改输入、全局默认与显式 prop 优先级。
- SSR：默认、plain、horizontal/data、Item slot、class/style/data attrs、无 browser global import/render/hydration。
- React/Vue 场景：vertical center/plain、double-row sizes、horizontal span/hidden、VNode key 与函数 value；比较对应单元格 computed style 和 geometry。
- 视觉：桌面 `1440x900`、移动 `390x844`、light/dark 与 RTL；关键 computed style 精确相等，bounding rect 各轴误差 `<= 0.5px`，截图 `threshold <= 0.1` / `maxDiffPixelRatio <= 0.001`，并独立比较成对 PNG 字节。
- 根与 `@workspace/ui/descriptions` 子路径导出组件、Item 和公开类型；`@workspace/theme-default/descriptions.css` 编译固定样式。真实 tarball 验证 ESM、声明、样式入口、tree-shaking、SSR-safe import、许可证和 SPDX SBOM。

## Deviation

- ReactNode 映射为 Vue `VNodeChild`；`Data.value` 与 Item 默认 slot 继续支持延迟函数/slot 渲染。
- React `Descriptions.Item itemKey={ReactNode}` 可直接映射为 `itemKey` VNodeChild，也可用 Vue `#key` slot；slot 优先，能力不损失。
- 当前无 accepted visual/behavior deviation；任一未解释差异均阻止 `pending -> ready`。

## 验收状态

- 当前状态：`ready`（2026-08-29）。
- `pnpm check` 全量通过：66 个单元/SSR 测试文件、495 项测试，以及 vendor/inventory/icon/source-boundary、格式、lint、类型、全包构建、主题产物、SSR import 与真实 tarball 安装/类型/样式/许可证/SBOM 门禁均通过。
- `pnpm test:browser` 全量通过：固定 Chromium 中 259 项测试全部通过；Descriptions 专项 7 项覆盖真实 vendor 来源、vertical/plain/double/horizontal/Item、span/hidden、无交互语义、桌面/移动 light/dark 与 RTL。
- 6 个专项目标的关键 computed style 精确相等、bounding rect 各轴差值不超过 `0.5 CSS px`；5 组 React/Vue 成对截图既通过 Playwright 阈值，也通过独立 Buffer 字节相等验证。未使用 mask，React/Vue 使用独立截图文件名。
- 无 accepted visual/behavior deviation；固定 vendor 仍为 `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21` 且未修改。
