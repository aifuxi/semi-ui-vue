# List v2.102.0 对齐矩阵

## 路线与权威来源

- 当前路线：实时提交历史已完成 `Cropper`；`List` 是固定 `vendor/semi-design/content/order.js` 中紧随其后的公开组件，不按目录或字母顺序选择。
- Adapter/类型/DOM：`vendor/semi-design/packages/semi-ui/list/{index,item,list-context}.tsx`。
- Foundation/主题：`vendor/semi-design/packages/semi-foundation/list/{constants,list,variables,rtl}.scss`；List 没有运行时 Foundation class。
- 文档/测试：`vendor/semi-design/content/show/list/` 与 `vendor/semi-design/packages/semi-ui/list/__test__/list.test.js`。
- 已就绪依赖：Grid、Avatar、Button、ConfigProvider/Locale 已完成。固定 Adapter 的 Spin 只作为 List 私有 loading 包裹复现本场景所需 DOM、SVG 与样式，不提前公开 Spin API。

## Vue 组件边界

| 组件           | 单一职责                                                                                                         | 公开契约                |
| -------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `List.vue`     | 选择 dataSource/renderItem 或默认 slot，输出空态、Grid/ul、loading/header/footer/loadMore 并提供 item 事件上下文 | typed props/emits/slots |
| `ListItem.vue` | 输出固定 li/body/header/main/extra，并在 grid 模式包裹 Col                                                       | typed props/emits/slots |
| `ListSpin.vue` | 只复现 List 所需的 Spin large block/hidden DOM 与 SVG                                                            | 私有，不导出            |

## 公开 API 与 Vue 映射

### List

| React v2.102.0                        | 默认值     | Vue API                                       | 对齐要求                                                       |
| ------------------------------------- | ---------- | --------------------------------------------- | -------------------------------------------------------------- |
| `bordered`                            | `false`    | 同名 Boolean prop                             | 缺省/false/true                                                |
| `split`                               | `true`     | 同名 Boolean prop                             | 缺省/false/true；不得用 truthiness 丢失显式 false              |
| `loading`                             | `false`    | 同名 Boolean prop                             | Spin large；空数据时仍显示 empty                               |
| `layout`                              | `vertical` | `ListLayout`                                  | horizontal 增加 `semi-list-flex`                               |
| `size`                                | `default`  | `ListSize`                                    | 固定尺寸 class 与 padding                                      |
| `dataSource<T>`                       | -          | `readonly T[]`                                | 非空时调用 item slot/renderItem；与显式默认 slot 可并存        |
| `renderItem(item,index)`              | -          | 同名函数 prop；推荐 `#item="{ item, index }"` | slot 优先；稳定 fallback key                                   |
| `grid`                                | -          | `ListGrid`                                    | Row 只取 align/gutter/justify/type，Col 取其余 span/响应式字段 |
| `header/footer/loadMore/emptyContent` | -          | 同名 VNodeChild prop 或命名 slot              | slot 优先；保留 x-semi-prop                                    |
| `onClick/onRightClick`                | noop       | `click` / `rightClick` emits                  | 仅 ListItem 未提供同名本地监听时由上下文触发                   |
| `className/style`                     | -          | 同名兼容 prop以及 Vue `class/style`           | 根 div 合并；其余 HTML/ARIA 属性透传                           |
| `children`                            | -          | 默认 slot                                     | dataSource 非空时仍追加在生成项之后                            |

### List.Item

| React v2.102.0              | 默认值       | Vue API                             | 对齐要求                                    |
| --------------------------- | ------------ | ----------------------------------- | ------------------------------------------- |
| `align`                     | `flex-start` | 同名枚举 prop                       | body class 精确保留                         |
| `header/main/extra`         | -            | 同名 VNodeChild prop或命名 slot     | slot 优先；仅 header/main 有内容时创建 body |
| `onClick/onRightClick`      | -            | `click` / `rightClick` emits        | 本地监听覆盖 List 上下文回调                |
| `onMouseEnter/onMouseLeave` | noop         | `mouseEnter` / `mouseLeave` emits   | 使用原生 mouseenter/mouseleave              |
| `className/style`           | -            | 同名兼容 prop以及 Vue `class/style` | li 合并；其余 HTML/ARIA 属性透传            |
| `children`                  | -            | 默认 slot                           | 位于 body 后、extra 前                      |

## 状态、DOM、事件与适配门禁

- 根 class：`semi-list`，条件增加 `semi-list-flex|{size}|grid|split|bordered`。非 grid 内容包在 `ul.semi-list-items`；grid 内容包在 `Row(type=flex)`。
- 数据源非空时，`#item` 优先于 `renderItem` 并逐项执行；无 renderItem 时生成项为空，但默认 slot 仍保留。数据源空且没有可渲染默认 slot 时显示空态。
- `emptyContent` slot/prop 有可渲染内容时输出 `x-semi-prop=emptyContent`；否则读取 `ConfigProvider.locale.List.emptyText`，缺省为 `暂无数据`。
- `ListItem` 的本地 click/rightClick 监听覆盖 List 上下文监听；mouseEnter/mouseLeave 只属于 item。回调接收原生 MouseEvent，组件不伪造键盘或 role/tabindex。
- `split` 是默认 true Boolean，单元和真实 SFC 模板必须覆盖缺省、显式 false、裸属性 true；render-function 也覆盖 true/false。
- 默认 slot/renderItem 不需要读取或装饰子 VNode props；只为生成列表项提供 renderer key，不修改调用方 VNode。

## 样式、主题、RTL、响应式与动效

- 逐组件 CSS 编译 List、Grid 与 Spin 固定 SCSS；保留 `.semi-*` 和 Token。light/dark 通过 `--semi-color-border/text-2/primary` 驱动。
- RTL 由 ConfigProvider 根 `.semi-rtl` 驱动：header/extra margin 互换，horizontal split 从右边框切到左边框。
- Grid 继续使用既有 24 栏与六断点实现；移动 viewport 验证响应式列宽和 gutter。普通 List 没有自己的断点。
- loading Spin 保留固定 SVG 旋转、children opacity/遮罩与 hidden 终态；截图等待稳定布局，不以不同旋转中间帧比较像素。

## 可访问性、SSR 与发布边界

- 固定 Adapter 使用语义 `ul/li`，不添加 listbox、button、tabindex 或键盘状态机；Grid 模式因上游 Row/Col 包裹保留 `div > div > li` 结构。
- Spin SVG `aria-hidden=true`；loading 根通过固定 class/DOM 表达，不新增上游不存在的 live region。
- import/SSR render/hydration 不访问 DOM；无 Observer、Portal、全局监听或卸载资源。
- 根导出、`@aifuxi/semi-ui-vue/list` 子路径、`@aifuxi/semi-theme-default/list.css`、SSR-safe import、真实 tarball 类型/样式/tree-shaking/许可/SBOM均需验证；公开声明不得泄漏 vendor 或私有包路径。

## 视觉与行为验收矩阵

- 单元：默认/slot/dataSource、item slot/renderItem 优先级、空态与 locale、header/footer/loadMore、三 size、horizontal、bordered/split Boolean 门禁、loading、Grid/响应式、item header/main/extra/align、上下文/本地事件覆盖、attrs。
- SSR：普通/空态/Grid/loading 输出及无警告 hydration。
- Chromium：桌面 `1440x900` 与窄视口 `390x844` 的 light/dark，LTR/RTL；窄视口只验证公开响应式 Grid 契约，不表示移动端兼容；基础、header/body/extra、horizontal、grid、empty、loading；computed style 精确相等且对应 bounding rect 各轴差 `<=0.5px`。
- 截图阈值遵守仓库门禁；动画 loading 场景优先验证结构/终态 computed style，不对旋转中间帧宣称字节一致。

## 实际验收证据

- `pnpm check` 全绿：固定 vendor、inventory、源码边界、格式、lint、类型、79 个测试文件/583 项单测、全 workspace 构建、86 个主题根入口、SSR import 与真实 tarball 安装/exports/类型/样式/许可验证全部通过。
- List 定向 Chromium 验收 7/7 通过；随后完整 Chromium 回归 306/306 通过，执行期间未触发重试。
- React/Vue 的 desktop/narrow × light/dark 四组 List PNG 均通过独立 `cmp` 字节相等；RTL 场景也以独立截图 buffer 直接相等验收。对应 target 的 computed style 精确相等，bounding rect 各轴差不超过 `0.5px`。
- 截图未使用 mask，未放宽仓库 `threshold <= 0.1`、`maxDiffPixelRatio <= 0.001` 门禁；List 对齐结论不依赖阈值通过。

## Deviation

- Vue 将 React `renderItem` 同时映射为 typed `renderItem` prop 和更自然的 `#item` scoped slot；slot 存在时优先。用户影响：模板调用无需 render function，DOM/行为不变，验收为等价适配。
- List 内部 Spin 不作为公开组件导出；用户侧 List loading 的 DOM、样式、视觉和 SSR 契约完整，不据此宣称 Spin 完成。
