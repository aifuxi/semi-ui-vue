# Dropdown v2.102.0 对齐矩阵

## 路线与源码证据

- 当前路线：最近完成 `Descriptions`；`Dropdown` 是固定 `vendor/semi-design/content/order.js` 中紧邻其后的公开组件。
- 已就绪依赖：Tooltip/Portal/定位、Icon、ConfigProvider 与默认主题基础设施均已进入 `ready`。Dropdown 不依赖后续 Empty、Image、Modal 或 Popover，可独立形成发布与浏览器验收闭环。
- React Adapter：`vendor/semi-design/packages/semi-ui/dropdown/index.tsx`、`dropdownMenu.tsx`、`dropdownItem.tsx`、`dropdownTitle.tsx`、`dropdownDivider.tsx`、`context.ts`。
- Foundation：`vendor/semi-design/packages/semi-foundation/dropdown/foundation.ts`、`menuFoundation.ts`、`constants.ts` 与 `utils/a11y.ts`。
- 样式：`vendor/semi-design/packages/semi-foundation/dropdown/dropdown.scss`、`variables.scss`、`animation.scss`、`rtl.scss`，Token 来自固定 `semi-theme-default/scss`。
- 文档与测试：`vendor/semi-design/content/show/dropdown/index.md`、`index-en-US.md` 与 `packages/semi-ui/dropdown/__test__/dropdown.test.js`。

## Vue 组件边界

- `Dropdown.vue` 只负责触发方式、受控/非受控可见性、Tooltip Portal/定位、全局默认值和嵌套层级。
- `DropdownMenu.vue` 只负责 `role="menu"`、方向和菜单键盘导航。
- `DropdownItem.vue` 只负责菜单项状态 class、图标/勾选、事件和 `role="menuitem"`。
- `DropdownTitle.vue` 与 `DropdownDivider.vue` 只输出固定展示 DOM；节点值由私有 renderer 转换为 Vue VNode。
- 根 `Dropdown` 为组合面，公开复合组件同时暴露 `Menu`、`Item`、`Title`、`Divider`。

## 公开 API 与默认值

| React v2.102.0          | Vue 公开契约                  | 默认值 / 规则                                              | 结论             |
| ----------------------- | ----------------------------- | ---------------------------------------------------------- | ---------------- |
| `children`              | 默认 slot                     | 单一 VNode 作为 trigger；保留原事件、class、style 与 ref   | Vue slot 映射    |
| `render`                | `#content`                    | 优先于 `menu`；内容放入固定 `.semi-dropdown-content`       | Vue slot 映射    |
| `menu`                  | `menu`                        | `readonly DropdownMenuItem[]`；支持 item/title/divider     | 等价             |
| `visible`               | `visible` + `v-model:visible` | 未传时内部维护；显式值受控                                 | Vue 原生双向契约 |
| `trigger`               | 同名                          | `hover`；另支持 focus/click/custom/contextMenu             | 等价             |
| `position`              | 同名                          | `bottom`                                                   | 等价             |
| `spacing`               | 同名                          | 一级 4px；嵌套缺省 2px；显式数值优先                       | 等价             |
| `mouseEnterDelay`       | 同名                          | 沿用 Tooltip 50ms                                          | 等价             |
| `mouseLeaveDelay`       | 同名                          | 100ms（Dropdown 覆盖 Tooltip 默认）                        | 等价             |
| `motion`                | 同名                          | `true`                                                     | 等价             |
| `zIndex`                | 同名                          | `1060`                                                     | 等价             |
| `showTick`              | 同名                          | `false`；通过 context 覆盖 Item 局部值                     | 等价             |
| `className`             | `class`                       | 落在 `.semi-dropdown-wrapper`                              | Vue class 映射   |
| `contentClassName`      | 同名                          | 与 `.semi-dropdown` 合并                                   | 等价             |
| `style`                 | 同名                          | 落在 `.semi-dropdown` 内容根                               | 等价             |
| `getPopupContainer`     | 同名                          | 显式 prop → ConfigProvider → `document.body`               | 等价             |
| Tooltip 定位/行为 props | 保留同名                      | `margin`、`rePosKey`、overflow、click/outside、Esc、传播等 | 等价             |
| `onVisibleChange`       | `visibleChange` emit          | 内部状态更新后通知，并同步 `update:visible`                | Vue emit 映射    |
| `onClickOutSide`        | `clickOutside` emit           | 保留 Tooltip 事件时机                                      | Vue emit 映射    |
| `onEscKeyDown`          | `escKeydown` emit             | `closeOnEsc=true`，关闭后焦点回 trigger                    | Vue emit 映射    |
| 实例 ref                | `DropdownExposed`             | `focusTrigger/getPopupId/rePosition`                       | Vue exposed 映射 |

### 子组件

| 组件               | Vue props / slots / events                                                                                       | 固定默认与 DOM                                                             |
| ------------------ | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `Dropdown.Menu`    | 默认 slot、原生 class/style/data/aria                                                                            | `ul.semi-dropdown-menu[role=menu][aria-orientation=vertical]`              |
| `Dropdown.Item`    | `active/disabled/icon/showTick/type/hover`、默认与 `#icon` slot、click/mouseenter/mouseleave/contextmenu/keydown | `li.semi-dropdown-item[role=menuitem][tabindex=-1]`；disabled 阻断鼠标事件 |
| `Dropdown.Title`   | 默认 slot、class/style/data                                                                                      | `div.semi-dropdown-title`；showTick 时增加 `-withTick`                     |
| `Dropdown.Divider` | class/style/data                                                                                                 | `div.semi-dropdown-divider`                                                |

## 状态、事件与嵌套

- `showTick && active` 输出 `IconTick`；未 active 仍保留透明勾以稳定缩进；无 showTick 时不输出勾。Item slot 图标包在 `.semi-dropdown-item-icon`。
- disabled Item 固定 `aria-disabled="true"`，不绑定 click/mouseenter/mouseleave/contextmenu；keydown 仍按上游落在 Item。
- 一级 Item 用 click；嵌套 Dropdown 内的 Item 把左键 click 回调改挂到 mousedown，避免父级 click 隐藏先截断子项动作。
- visible 事件顺序为：内部显示状态更新 → `visibleChange` → `update:visible`；trigger 的键盘处理先执行 Dropdown Foundation，再执行调用方原 `keydown`。
- `class` 只属于 popup wrapper；触发节点在显示时增加 `.semi-dropdown-showing`，并固定 `aria-haspopup="true"`、`aria-expanded` 与 `data-popupid`。

## DOM、样式、主题、RTL 与动效

- Portal 固定为 `.semi-portal > .semi-portal-inner > .semi-dropdown-wrapper[role=tooltip][x-placement]`；wrapper 内保留 Tooltip 的第一层 `.semi-dropdown-content`，再包含 `.semi-dropdown > .semi-dropdown-content`。
- `.semi-dropdown-wrapper` 使用主题背景、圆角与 elevated shadow；Item 最大宽度、padding、类型颜色、hover/active/focus-visible、disabled、图标和 divider 全部直接编译固定 SCSS。
- light/dark 由 `--semi-color-bg-3/text-0/text-2/fill-*` 等 Token 驱动；RTL 由 `.semi-rtl` / `.semi-portal-rtl` 翻转 wrapper direction、tick/title padding 与图标 margin。
- motion 使用 Tooltip 的 Dropdown prefix 动效 class；专项行为测试关闭 motion 消除定时噪声，桌面/移动 light/dark/RTL 视觉场景在稳定终态截图。

## 键盘、焦点与 ARIA

- click trigger 的 Enter/Space 等价 click；打开后首个非 disabled Item 获得焦点。trigger 上 ArrowDown/ArrowUp 聚焦首/末可用项并在已打开时阻止默认滚动。
- Menu 内 ArrowDown/ArrowUp 循环移动可用 Item，Enter/Space 激活，打印字符按首字符跳转；disabled Item 排除在导航集合。
- Esc 关闭 popup，调用 `escKeydown`，并由 Tooltip `returnFocusOnClose` 把焦点还给 trigger。
- Menu 固定 `role=menu` / `aria-orientation=vertical`，Item 固定 `role=menuitem` / `aria-disabled`；不擅自增加 `aria-selected`。

## Portal、定位与生命周期门禁

- 稳定自定义容器必须在首次可见时就是 `.semi-portal` 父节点；不为场景 ref 时序引入轮询或 Observer。
- Element capture scroll、Document/page scroll、resize、`rePosKey` 和 popup ResizeObserver 均复用已验收 Tooltip Foundation；测试验证最终几何，并确认卸载清理 Portal/listener/observer。
- popup container、Foundation、DOM/Observer 等身份敏感对象保持 shallow/raw，不进入深层代理。

## 国际化与 SSR

- Dropdown 本身无 Locale 文本；`name` 与 slots 原样渲染，57 Locale 完整性由 ConfigProvider 总门禁覆盖。
- SSR 只输出 trigger，不访问 document/window、不输出 Portal；客户端 custom visible 能稳定挂载/卸载并保持公开声明可导入。

## React → Vue 迁移与 deviation

- `render={<Dropdown.Menu />}` 映射为 `#content`；`children` 映射为 trigger 默认 slot；`icon`/`name` 可传 VNodeChild 或 renderer 函数。
- React `className` 映射 Vue 原生 `class`；事件 prop 映射 Vue emits/listeners；复合静态成员调用形式保持 `Dropdown.Menu/Item/Title/Divider`。
- React 文档把 Item `type` 写成 `tertiary` 默认值，但固定 Adapter 未设置该默认值；本实现按运行时源码保留 `undefined`，默认文本由 `.semi-dropdown-item` Token 决定。
- 上述均为框架原生映射或源码/文档冲突裁决，不构成能力损失。当前无 accepted visual/behavior deviation；任一未解释差异均阻止 `pending -> ready`。

## 验收状态

- 当前状态：`ready`；无 accepted visual/behavior deviation。
- 行为门禁：Dropdown 专项单元/SSR 2 个文件、11 项通过，覆盖模板与 `h()` trigger 装饰、缺省/显式 Boolean、菜单数组/slot、受控/非受控、hover/focus/click/custom/contextMenu、outside click、事件顺序、disabled/nested、键盘/焦点/ARIA、稳定自定义 Portal、卸载清理与 SSR/hydration；仓库全量为 68 个文件、507 项通过。
- 视觉门禁：同 Chromium 的 desktop 1440×900 与 mobile 390×844，DPR 1，light/dark，并追加 RTL；Dropdown 专项 7/7、仓库浏览器回归 266/266 通过。6 个关键目标的 computed style 精确相等、bounding rect 各轴差值不超过 0.5 CSS px；5 组成对场景共 10 张独立 PNG 经测试内 `Buffer.equals` 与命令行 `cmp` 双重确认逐字节相同。
- 发布门禁：`pnpm check` 通过固定 vendor/inventory、源码边界、格式、lint、类型、全量构建、主题和 SSR；真实 tarball 的根/子路径 ESM、公开声明、逐组件 CSS、隔离安装/import、许可证与 SPDX SBOM 全部通过。
