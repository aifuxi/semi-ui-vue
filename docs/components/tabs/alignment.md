# Tabs 对齐矩阵

## 选择与依赖

- 固定 `content/order.js` 中 Tabs 紧随已完成的 Steps，是当前路线的下一项。
- Button、Icon、ConfigProvider、Tooltip/Portal 已就绪。上游 Tabs 内部使用 OverflowList、Dropdown 与 ResizeObserver；本切片只在 Tabs 边界内实现所需滚动、更多菜单与观察能力，不将这些尚未完成的公开组件标记为 `ready`。
- 唯一参考是 `vendor/semi-design` 的 `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。

## 组件边界

| 模块               | 单一职责                                                                | 公开边界                             |
| ------------------ | ----------------------------------------------------------------------- | ------------------------------------ |
| `Tabs.vue`         | 收集直接 TabPane、连接 Foundation、管理受控/非受控 activeKey 与面板挂载 | props / emits / slots / v-model      |
| `TabBar.vue`       | 渲染四种栏、extra、more、滚动折叠和可见项回调                           | 内部组件                             |
| `TabItem.vue`      | 单个 tab 的 DOM、键盘、点击、关闭与 ARIA                                | 导出为 `TabItem`                     |
| `TabPane.vue`      | 面板语义、keepDOM/lazyRender 与切换动效壳层                             | 导出为 `TabPane`                     |
| `TabsDropdown.vue` | Tabs 专用 hover/click Portal 菜单                                       | 内部组件，不宣称 Dropdown 完成       |
| `tabs.js`          | 私有边界导出固定 Tabs Foundation                                        | declaration facade + bundled runtime |
| `tabs.scss`        | 编译 Tabs 及内部 Button/Dropdown/Popover/OverflowList/Icon 样式         | `tabs.css`                           |

## 固定源码证据

- Adapter、公开类型、默认值和 DOM：`packages/semi-ui/tabs/{index,TabBar,TabItem,TabPane,interface}.tsx`。
- 状态、事件与键盘顺序：`packages/semi-foundation/tabs/{foundation,constants}.ts`。
- 样式、动效与 RTL：`packages/semi-foundation/tabs/{variables,tabs,animation,rtl}.scss`。
- 默认主题与 Token：`packages/semi-theme-default/scss/{index,global,animation}.scss`。
- 文档与行为用例：`content/navigation/tabs/`、`packages/semi-ui/tabs/{__test__,_story}/`。

## Tabs API 与 Vue 映射

| v2.102.0 React                             | 默认                 | Vue 契约/门禁                                                                          |
| ------------------------------------------ | -------------------- | -------------------------------------------------------------------------------------- |
| `activeKey`                                | 无                   | 同名受控 prop；另提供 `modelValue` / `v-model`，显式控制按原始 VNode prop 键判断       |
| `defaultActiveKey`                         | 首个非 disabled pane | 非受控初值；动态删除当前 pane 后回退首项                                               |
| `tabList`                                  | 无                   | `PlainTab[]`；存在非空数组时优先于 TabPane 元数据                                      |
| children / `TabPane`                       | `[]`                 | 直接默认 slot；过滤注释/空白并展开 Fragment，收集 `tab/icon/disabled/itemKey/closable` |
| `type`                                     | `line`               | `line                                                                                  | card                                                            | button                                   | slash`，保留 `.semi-tabs-bar-*` DOM/class |
| `size`                                     | `large`              | `small                                                                                 | medium                                                          | large`；上游样式只对 line 的尺寸产生差异 |
| `tabPosition`                              | `top`                | `top                                                                                   | left`，同步 tablist `aria-orientation` 与面板布局               |
| `keepDOM`                                  | `true`               | 缺省/裸属性/显式 false/true 均覆盖；false 仅挂载当前 TabPane并关闭 pane motion         |
| `lazyRender`                               | `false`              | 首次激活前不渲染 pane 内容，激活后保持已访问内容                                       |
| `tabPaneMotion`                            | `true`               | 使用固定 200ms class/Token；keepDOM=false 时无离场面板                                 |
| `collapsible`                              | `false`              | `boolean                                                                               | 'auto'`；客户端 ResizeObserver 检测溢出，SSR 输出稳定非测量 DOM |
| `showRestInDropdown`                       | `true`               | 折叠箭头 hover 时显示隐藏项 Portal；false 只滚动                                       |
| `arrowPosition`                            | `both`               | `start                                                                                 | end                                                             | both`，控制滚动箭头位置                  |
| `more`                                     | 无                   | number 或 `{ count, render, dropdownProps }`；尾部项目收入“更多”菜单                   |
| `tabBarExtraContent`                       | 无                   | 同名 VNodeChild prop及 `#tabBarExtraContent` slot，slot 优先                           |
| `renderTabBar`                             | 无                   | Vue 用 `#tabBar="props"` scoped slot；默认 renderer 不暴露 React ComponentType         |
| `renderArrow`                              | 无                   | Vue 用 `#arrow="{ items, position, click, defaultNode }"` scoped slot                  |
| `onVisibleTabsChange`                      | 无                   | `visibleTabsChange(Map<string, boolean>)` emit；Map 是新实例且键为 itemKey             |
| `className/style`、bar/content class/style | 无                   | 同名兼容，合并 Vue class/style；根只透传 data/aria 属性                                |
| `onChange`                                 | noop                 | activeKey 真正变化时 `change`，并派发 `update:activeKey` / `update:modelValue`         |
| `onTabClick`                               | noop                 | 未禁用 tab 每次点击或 Enter/Space 都派发 `tabClick`，当前项不重复 `change`             |
| `onTabClose`                               | noop                 | 点击 Close 或 closable tab 的 Delete/Backspace 派发 `tabClose`，不擅自删数据           |
| `preventScroll`                            | false                | 键盘移动焦点时传给 `HTMLElement.focus`                                                 |

## TabPane / TabItem API

- `TabPane`：`itemKey`、`tab`、`icon`、`disabled`、`closable`、`className/style`、`tabIndex`；Vue 同时提供 `#tab/#icon/default` slots。
- `TabItem`：保留公开拖拽二次封装所需 `selected/type/size/tabPosition/itemKey`、点击/关闭/keydown、根 attrs/ref 语义；内部 TabBar 使用同一实现。
- VNode 收集必须区分“prop 未提供”和显式空值；不得用普通 truthiness 误判 `disabled/closable`。TabPane 必须为直接子节点，与固定文档一致。

## 状态与事件顺序

- 未提供控制键时，初值依次取 `defaultActiveKey`、首个非禁用 pane、空字符串；受控时不在内部改变激活 DOM。
- 未禁用 tab：不同项先发 `change` 与两个 update 事件，再发 `tabClick`；当前项只发 `tabClick`。与 Foundation `_notifyChange → setNewActiveKey → notifyTabClick` 一致。
- Close 图标阻止冒泡，只发 `tabClose`；Delete/Backspace 仅 closable 生效，回调后把焦点移到相邻可用 tab。
- 动态 pane/tabList 改变时重收集；非受控 activeKey 不存在则回退第一项，空列表回退空字符串。
- controlled `activeKey` / `modelValue` 外部更新记录前一激活项，供面板动效方向使用；新增 pane 直接成为受控激活项时抑制首次动效。

## DOM、键盘、焦点与 ARIA

- 根 `.semi-tabs.semi-tabs-{top|left}`；bar 是 `[role=tablist].semi-tabs-bar`，四类型、位置、collapse class 与固定 data-uuid。
- tab 是 `[role=tab]#semiTab{key}[data-tabkey][aria-controls]`，selected 为 `tabindex=0`，其余 `-1`，禁用项 `aria-disabled=true`。
- pane 是 `[role=tabpanel]#semiTabPanel{key}[aria-labelledby][aria-hidden]`，内部保留 `.semi-tabs-pane-motion-overlay`。
- 水平仅响应 Left/Right，垂直仅响应 Up/Down；循环焦点且跳过 disabled。Home/End 首尾；Enter/Space 激活；Delete/Backspace 关闭。
- 上游方向键只移动焦点、不自动激活，Vue 不引入 selection-follows-focus。

## 溢出、Portal、动效、主题、RTL 与国际化

- `collapsible=true/auto` 在客户端测量 scrollWidth/clientWidth 与 tab rect；ResizeObserver、scroll/resize 监听只在 mounted 创建，卸载完整清理。
- 折叠/More 菜单 Teleport 到稳定 ConfigProvider `getPopupContainer` 或 body；第一次显示前解析容器，outside/Escape/选择后关闭。Portal 内容保留 `.semi-portal/.semi-dropdown/.semi-dropdown-menu/.semi-dropdown-item`。
- `Tabs.more` 文案使用 ConfigProvider `locale.Tabs.more`，缺省按 code 回退 zh-CN“更多”/en-US“More”；其它 57 Locale 由 Locale 总门禁覆盖。
- light/dark 共享固定 Token；desktop `1440x900`、mobile `390x844`、light/dark 与 RTL 必测。top/left、四 type、disabled/closable/more/collapse/focus/hover 必须有行为或视觉证据。
- RTL 由 `.semi-rtl/.semi-portal-rtl` 驱动，间距、边框和 Chevron 镜像使用固定 SCSS。

## SSR、发布与合规

- import 与 SSR render 不读取 window/document，不创建 Observer/Portal；hydration 后再启用测量和 popup。
- 根与 `@workspace/ui/tabs` 子路径导出 Tabs、TabPane、TabItem 和公开类型；真实 tarball 验证 ESM、声明、根/`tabs.css`、tree-shaking 与 SSR-safe import。
- Foundation 与 SCSS 经现有边界内联，发布产物不得泄漏 `vendor/**` 或私有 workspace 路径；许可证/SBOM 沿用总门禁。

## Deviation

- Accepted：React `renderTabBar/renderArrow/more.render` 返回 ReactNode；Vue 分别映射为 `#tabBar`、`#arrow`、`#more` scoped slot。节点结构、输入数据与交互不变。
- Accepted：React 回调接收 React SyntheticEvent；Vue emits 接收原生 `MouseEvent | KeyboardEvent`。
- Accepted：内部 OverflowList/Dropdown/ResizeObserver 只实现 Tabs v2.102.0 所需公开行为，不构成这些组件本身的完成声明。

## 验收门禁

- 单元/SSR：四 type、top/left、tabList/TabPane、默认/受控/v-model、动态 panes、keepDOM/lazyRender、Boolean 裸属性、事件顺序、关闭、键盘/焦点/ARIA、extra/自定义 slots、more/collapse、Locale/RTL、Portal 清理、SSR/hydration。
- Chromium：同 BrowserContext 校验本地 React 来源、无运行时错误、computed style/rect、点击/键盘/hover/Portal、desktop/mobile light/dark/RTL 与成对局部截图。
- 发布：完整 `pnpm check:full`，主题根/逐组件入口与真实 tarball 安装验证。

## 完成证据（2026-08-28）

- `pnpm check:full` 通过：50 个单测文件、380 项单元/SSR 测试，全部 workspace 构建、主题/边界/声明/SSR import 与真实 tarball 安装门禁，以及 203 项 Chromium 测试。
- Tabs 专项 Chromium 7 项通过：固定源码请求、四 type/top/left/disabled/closable/More/collapsible DOM，点击、方向键、Enter、hover、Dropdown Portal、computed style、bounding rect、desktop/mobile light/dark 与 RTL。
- 5 对 React/Vue 基线 PNG 落盘文件分别同 SHA-256：desktop/light `c4e30499054a6f2148fee06127e7338fb933820aa94d186d89b5a9aa41a2a0bb`、desktop/dark `ac516733dc20e581d7b1987149931ebe605e37104aae0d7be34c8b0f094c3721`、mobile/light `b614e9d5a3a9c3d49fb3f8fbb7e43486956fc39141546ab5321b52962f5757c8`、mobile/dark `daa62c1682f0b3999a16b1b5df489ead97e185eeae06c17ebfff4007eaf75a8d`、light/RTL `68f01147006f05b0ba936e26dcd28967dff2781df27be1556d6f88b3ea17dbc9`。
- `@workspace/ui` 根/`tabs` 子路径、声明、`@workspace/theme-default/tabs.css`、tree-shaking、SSR-safe import、许可证与 SPDX SBOM 均由真实 tarball 消费项目验证通过。
