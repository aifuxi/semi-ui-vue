# Collapse v2.102.0 对齐矩阵

## 路线、固定源码与组件边界

- 当前路线：实时 README 为 `66 / 85`，最近完成 `Form`；固定 `vendor/semi-design/content/order.js` 与 README 均把 `Collapse` 指定为下一项。
- 已就绪依赖：Collapse 复用已经 `ready` 的公共 `Collapsible` 与 `IconChevronDown` / `IconChevronUp`，不依赖未完成的 Chat、Markdown、音视频或 AI 模块，可独立完成发布与浏览器闭环。
- React Adapter：`vendor/semi-design/packages/semi-ui/collapse/index.tsx`、`item.tsx`、`collapse-context.tsx`。
- Foundation：`vendor/semi-design/packages/semi-foundation/collapse/foundation.ts`、`constants.ts`。
- 样式：`vendor/semi-design/packages/semi-foundation/collapse/collapse.scss`、`variables.scss`、`rtl.scss`，并包含运行时依赖的 Collapsible 样式。
- 文档与测试：`vendor/semi-design/content/show/collapse/index.md`、`index-en-US.md` 与 `packages/semi-ui/collapse/__test__/collapse.test.js`。
- 组件图：`Collapse.vue` 只负责默认值、受控/非受控 activeSet、Foundation 与 provider；`CollapsePanel.vue` 只负责单面板 header/ARIA/点击热区和 Collapsible 组合；`collapse-context.ts` 提供类型化跨层契约；`CollapseNodeRenderer.ts` 只渲染 prop 形式的 VNodeChild。

## API 与 Vue 映射

| React v2.102.0                 | Vue API                                                | 默认值 / 行为                                                                      | 结论             |
| ------------------------------ | ------------------------------------------------------ | ---------------------------------------------------------------------------------- | ---------------- |
| `activeKey`                    | `activeKey`、`v-model:active-key`                      | 受控；交互只发事件，父级回传后更新                                                 | Vue v-model 映射 |
| `defaultActiveKey`             | 同名 prop                                              | `''`；仅初始化非受控状态                                                           | 等价             |
| `accordion`                    | 同名 Boolean                                           | `false`；初始化数组只取第一项，交互只保留一项                                      | 等价             |
| `clickHeaderToExpand`          | 同名 Boolean                                           | `true`；为 false 时只有图标热区切换                                                | 等价             |
| `expandIcon` / `collapseIcon`  | 同名 VNodeChild prop或 `#expandIcon` / `#collapseIcon` | 缺省分别为 ChevronDown / ChevronUp                                                 | Vue slot 映射    |
| `expandIconPosition`           | 同名 prop                                              | `right`；支持 `left` / `right`                                                     | 等价             |
| `keepDOM`                      | 同名 Boolean                                           | `false`；传给公共 Collapsible                                                      | 等价             |
| `motion`                       | 同名 Boolean                                           | `true`；缺省/显式 false/显式 true 分开验证                                         | 等价             |
| `lazyRender`                   | 同名 Boolean                                           | `false`；与 keepDOM 联用                                                           | 等价             |
| `className` / `style`          | `className` / `style`，另接收 Vue `class` / `style`    | 合并至根 `.semi-collapse`                                                          | Vue 原生映射     |
| `onChange(activeKey, e)`       | `@change`                                              | Foundation 固定实际发出 key 数组，再发 `update:activeKey`                          | Vue emit         |
| `children`                     | 默认 slot                                              | 组合 `Collapse.Panel`；Fragment/普通节点按 Vue slot 原样保留                       | Vue 原生映射     |
| Panel `itemKey`                | 同名必填 string                                        | 匹配 activeSet                                                                     | 等价             |
| Panel `header` / `extra`       | prop 或 `#header` / `#extra`                           | header 为 string prop 时生成 right 区并支持 extra；header slot/节点自行占据 header | Vue slot 映射    |
| Panel `showArrow` / `disabled` | 同名 Boolean                                           | 分别为 `true` / `false`                                                            | 等价             |
| Panel `reCalcKey`              | 同名 string/number                                     | 传给 Collapsible 触发高度重算                                                      | 等价             |
| Panel `onMotionEnd`            | `@motion-end`，兼容 `onMotionEnd` listener             | Collapsible transitionend 后触发                                                   | Vue emit         |

## 默认值、VNode 与状态门禁

- Collapse 使用固定 `getDefaultPropsFromGlobalConfig` 优先级：显式 prop > `semiGlobal.config.overrideDefaultProps.Collapse` > v2.102.0 默认值。默认 true 的 `clickHeaderToExpand` / `motion` 必须覆盖缺省、显式 false、显式 true；不使用普通 truthiness 判断显式性。
- Panel 的 `showArrow` / `disabled` 由自身 Boolean prop 归一化；模板裸属性、`:prop="false"` 与 `h()` true/false 都以最终 DOM、ARIA 和事件落点验收。
- 非受控模式由 Foundation 替换 activeSet；受控模式只触发 `change` 与 `update:activeKey`，不先行修改 DOM。`activeKey` 变化按固定 Adapter 的 truthy 受控同步语义处理。
- Foundation `handleChange` 总是把 `Set` 转为数组通知，即使 accordion=true；事件顺序为固定 `change` 回调后 Vue `update:activeKey`。
- 不克隆、不修改调用方 Panel VNode；通过 provider/inject 传递 activeSet 和动作，同时保留 template 与 `h()` compound host 门禁。

## DOM、交互、ARIA 与动效

- 根固定为 `div.semi-collapse`，只转发 `data-*`；Panel 根为 `.semi-collapse-item`，展开时增加 `-active`，并保留 Panel 的 class/style/rest attrs。
- header 固定 `role="button"`、`tabindex="0"`、`.semi-collapse-header`；disabled 增加 `-disabled` 并阻止切换。固定上游没有 Enter/Space handler，因此键盘聚焦可用但按键不切换，此行为如实记录而不私自扩展。
- `aria-disabled`、`aria-expanded` 与状态同步；`aria-owns` 与内容 `id` 沿用固定 Adapter 的 mounted 后短 id 时序，内容同步 `aria-hidden`。
- string header 的 DOM 为可选左图标 + 文本 span + `.semi-collapse-header-right`（extra + 可选右图标）；VNode/slot header 直接占据中间区域，extra 不自动插入。
- 无内容或 disabled 时图标增加 `.semi-collapse-header-iconDisabled`；`showArrow=false` 不创建图标。`clickHeaderToExpand=false` 时正文点击无效但 icon span 点击有效。
- 内容固定为公共 Collapsible > `.semi-collapse-content` > `.semi-collapse-content-wrapper`；motion、keepDOM、lazyRender、reCalcKey 和 motionEnd 直接复用已验收的 Collapsible 状态机。
- 动画验收先等待 transition 终态再比较；不比较 React/Vue 不同中间帧。关闭终态 height=0 时 DOM 可按 keepDOM 保留。

## 主题、RTL、国际化与 SSR

- `@workspace/theme-default/collapse.css` 同时编译固定 Collapse 与 Collapsible SCSS；light/dark 由 `--semi-color-*` Token 驱动。
- RTL 由 `.semi-rtl` / `.semi-portal-rtl` 驱动 direction 与 header-right padding 翻转；图标 position 的 DOM 顺序不被适配层擅自交换。
- Collapse 没有 Locale 文案；zh-CN/en-US 场景内容由调用方提供，结构与事件保持一致。
- 模块求值和 SSR render 不访问 DOM、window、ResizeObserver 或 crypto；服务端保持固定结构，hydration 后才创建 Collapsible observer，并无警告。

## 测试、视觉与发布门禁

- 单元：默认 DOM、单/多 default key、accordion、受控/非受控、change/v-model 顺序、header/icon 热区、disabled/showArrow 三态、string/VNode header、extra、自定义图标、keepDOM/lazyRender/motion/reCalcKey/motionEnd 透传、class/style/data/rest attrs、全局默认和模板/`h()` host。
- SSR：默认关闭、defaultActiveKey、compound slot、class/style/data attrs、无 browser global import/render/hydration。
- React/Vue 场景：基础多开、accordion/disabled、左图标与 extra、自定义图标、受控切换、keepDOM/lazyRender；比较 header/content/icon 的 computed style 与几何。
- 视觉：桌面 `1440x900`、移动 `390x844`、light/dark 与 RTL；关键 computed style 精确相等，bounding rect 各轴误差 `<= 0.5px`，截图 `threshold <= 0.1` / `maxDiffPixelRatio <= 0.001`，并独立比较 React/Vue 成对 PNG 字节。
- 根与 `@workspace/ui/collapse` 子路径导出 Collapse、CollapsePanel 和公开类型；真实 tarball 验证 ESM、声明、样式、tree-shaking、SSR-safe import、许可证和 SPDX SBOM。

## Deviation

- ReactNode 映射为 Vue `VNodeChild` 与命名 slot；`v-model:active-key` / `update:activeKey` 是 Vue 原生双向绑定补充，不改变固定 `change` 参数与受控状态时序。
- 固定 React Adapter 为 header 提供 role/tabindex 但没有 Enter/Space 行为；Vue 保持该 v2.102.0 行为，不将其误报为已修复的无障碍能力。
- 当前无 accepted visual/behavior deviation；任一未解释差异均阻止 `pending -> ready`。

## 验收状态

- 当前状态：`ready`。
- 固定 vendor 已核验为 `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`，工作区开始时干净。
- Collapse 定向单元/SSR/入口回归为 5 files / 177 tests；仓库单元门禁为 126 files / 902 tests，类型、lint、format、源码边界和全 workspace build 均通过。
- Collapse Chromium 对照为 7 / 7，工作台 smoke 为 2 / 2；桌面/移动 light/dark 与 RTL 的 React/Vue 对应截图独立生成且直接字节相等，无 mask、无 accepted visual deviation。
- 根入口、`@workspace/ui/collapse`、`@workspace/theme-default/collapse.css`、SSR-safe import、许可证/SBOM 与真实 tarball consumer 已通过。
