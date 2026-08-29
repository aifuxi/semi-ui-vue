# Timeline v2.102.0 对齐矩阵

## 路线与权威来源

- 当前路线：实时提交历史已完成 `Tag`；`Timeline` 是固定 `vendor/semi-design/content/order.js` 中紧邻其后的公开组件。
- 已就绪依赖：Icons、ConfigProvider RTL、主题、SSR、发布与 Chromium 基础设施均已进入 `ready`。Timeline 不依赖后续 Banner、Notification 或 Feedback，可独立形成验收闭环。
- 唯一基线：`vendor/semi-design` 的 `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- Adapter/DOM：`packages/semi-ui/timeline/index.tsx`、`item.tsx`；样式/常量/RTL：`packages/semi-foundation/timeline/`；中英文 API、测试与示例：`content/show/timeline/`、`packages/semi-ui/timeline/__test__/` 与 `_story/`。

## 组件边界

- `Timeline.vue`：根列表、四种 mode、dataSource/默认 slot 优先级、子 VNode 位置 class 装饰和数据/ARIA 透传。
- `TimelineItem.vue`：节点、连接线、内容、extra/time、自定义 dot、点击事件与固定 DOM/class。
- `TimelineNodeRenderer.ts`：只负责安全渲染 `VNodeChild`，不持有状态。

## 公开 API 与 Vue 映射

| v2.102.0 React API             | 固定源码默认值 | Vue API / 验收                                                              |
| ------------------------------ | -------------- | --------------------------------------------------------------------------- |
| `Timeline.mode`                | `left`         | `left/right/center/alternate`；根 class 与子项位置 class 同步               |
| `Timeline.dataSource`          | 无             | `TimelineData[]`；非空时优先于默认 slot，空数组回退 slot                    |
| `Timeline.children`            | 无             | 默认 slot；直接有效 VNode 继承位置 class，注释与空白不污染索引              |
| `className/style/aria-label`   | 无             | `class`/`className`、`StyleValue`、`ariaLabel`/原生 attr                    |
| `TimelineItem.children`        | 无             | 默认 slot；dataSource 使用 `content`                                        |
| `color`                        | 无             | 自定义节点背景色；仍保留 type class                                         |
| `type`                         | `default`      | `default/ongoing/success/warning/error`                                     |
| `dot`                          | 无             | 同名 prop 或 `#dot`，slot 优先；存在时增加 `head-custom`                    |
| `extra/time`                   | `undefined/''` | 同名 prop 或 `#extra/#time`，slot 优先；仅 truthy 内容渲染对应 wrapper      |
| `position`                     | 无             | `left/right`；仅在 `center/alternate` 覆盖父 mode                           |
| `TimelineItem.className/style` | 无             | `class`/`className`、`StyleValue`，与 Timeline 注入的位置 class 合并        |
| `TimelineItem.onClick`         | noop           | 原生 `click` emit，payload 为 `MouseEvent`                                  |
| `data-*`                       | 透传           | Timeline 与 TimelineItem 仅透传 `data-*`，避免把 React 专属剩余属性落到 DOM |

## 状态、事件、VNode 与优先级门禁

- Timeline/TimelineItem 均无内部可变状态、受控模式、Observer、Portal 或动效；更新完全由 props/slots 派生。
- `dataSource && dataSource.length` 时忽略默认 slot；空数组与缺省 dataSource 均渲染 slot。dataSource 对象浅复制后创建 Item，不修改调用方数据。
- `alternate` 默认按有效子项索引 left/right 交替；`center` 默认 left；两者尊重子项显式 `position`。`left/right` mode 强制统一位置，不读取子项 position。
- 子 VNode 同时覆盖真实 SFC 模板与 `h()` 宿主：展开 Fragment、跳过 Comment/纯空白 Text、保留 key/class/style/事件，并把位置 class 合并而非覆盖。
- 非 TimelineItem 的有效元素按 React `cloneElement` 语义同样获得位置 class；文本节点原样保留但不参与位置索引。
- TimelineItem 点击只 emit 一次且保持 dataSource `onClick` 与组件监听器的 Vue 合并顺序；装饰性 tail/head 均为 `aria-hidden="true"`。

## DOM、样式、主题、RTL、国际化与 SSR

- 根节点固定为 `ul.semi-timeline.semi-timeline-{mode}`；子项固定为 `li.semi-timeline-item`，内部依次为 tail、head、content，extra 在 time 之前。
- 独立 `timeline.css` 编译 theme/global 与 Timeline 固定 SCSS/RTL；根 CSS 已包含固定 Timeline SCSS。
- dark 由 `--semi-*` Token 驱动；RTL 由 ConfigProvider 的 `.semi-rtl` 祖先触发固定 `rtl.scss`，反转 tail/head/content 的左右定位与文本方向。
- 组件无 Locale 内置文案；zh-CN/en-US 内容均作为 slot/data 正常渲染。
- SSR import/render 不访问 `window`/`document`，且输出固定 `ul/li`、ARIA 与 class。

## 测试与发布证据

- 单元：四种 mode、五种 type、dataSource/slot 优先级、VNode template+h() 门禁、position 覆盖、内容/extra/time/dot/color、data/ARIA/class/style 与 click。
- SSR：Timeline/Item、dataSource、custom VNode 与 RTL wrapper 可渲染，无浏览器全局访问。
- Chromium：同进程 React/Vue 来源、点击、computed style 与 bounding rect；桌面/移动 light/dark 和 RTL 成对局部 PNG，另做独立 buffer 直接比较。
- 发布：根/`timeline` ESM 与声明、逐组件 CSS、SSR-safe import、tree-shaking、合规产物和真实 tarball 消费。

## Deviation 与状态

- React `children/ReactNode/className` 映射为 Vue slots/`VNodeChild`/class；框架映射不构成能力损失。
- Vue Fragment 会展开后按可见有效子 VNode计算位置；React Fragment 本身是单个可克隆元素但 class 无法落到 DOM。Vue 映射避免位置 class 丢失，并让模板注释/空白不改变交替顺序。
- 当前没有 accepted visual/behavior deviation。当前状态：`ready`；固定源码、单元/SSR、主题/打包与 Chromium 全量门禁均已通过。
