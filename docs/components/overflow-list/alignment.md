# OverflowList v2.102.0 对齐矩阵

## 基线与范围

- 唯一基线：`vendor/semi-design` tag `v2.102.0`，提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- 当前路线：最近完成 `Modal`；`OverflowList` 是固定 `vendor/semi-design/content/order.js` 中紧邻其后的公开组件。
- 已就绪依赖：ConfigProvider、默认主题基础设施与浏览器 observer 测试夹具均已完成；OverflowList 不依赖后续 Popover、SideSheet 或 Table，可独立形成发布与浏览器验收闭环。
- React Adapter：`packages/semi-ui/overflowList/index.tsx` 与 `intersectionObserver.tsx`。
- Foundation：`packages/semi-foundation/overflowList/foundation.ts`、`constants.ts`、`overflowList.scss`、`rtl.scss`。
- 文档与证据：`content/show/overflowlist/`、`packages/semi-ui/overflowList/__test__/`、`cypress/e2e/overflowList.spec.js`。
- 公开范围：根导出 `OverflowList`、`OverflowItem`、`OverflowListProps`；Vue 不公开 React 专属 `OverflowListState` 与 `ReactIntersectionObserverProps`，改由浏览器原生 observer 类型和 slots 表达。

## 组件边界

- `OverflowList.vue`：唯一状态拥有者，负责 collapse 测量、scroll 相交状态、ResizeObserver/IntersectionObserver 生命周期与回调顺序。
- `OverflowListNodeRenderer.ts`：仅把 `visibleItem` / `overflow` slot 返回值渲染为 Vue VNodeChild，不持有业务状态。
- Foundation facade：只从私有边界导出固定 `OverflowListFoundation`；公开源码和声明不引用 `vendor/**`。

## 公开 API 与默认值

| React v2.102.0                      | Vue                               | 默认值/语义                                                 |
| ----------------------------------- | --------------------------------- | ----------------------------------------------------------- |
| `items`                             | `items`                           | `[]`；对象数组，scroll 模式要求稳定 key                     |
| `collapseFrom`                      | `collapseFrom`                    | `'end'`                                                     |
| `minVisibleItems`                   | `minVisibleItems`                 | `0`                                                         |
| `renderMode`                        | `renderMode`                      | `'collapse'`                                                |
| `threshold`                         | `threshold`                       | `0.75`                                                      |
| `className` / `style`               | `class`、`className` / `style`    | 合并到 `.semi-overflow-list`                                |
| `wrapperClassName` / `wrapperStyle` | 同名 props                        | 仅 scroll wrapper                                           |
| `itemKey`                           | `itemKey`                         | key 名或 `(item) => key`；缺省读取 `item.key`，再回退 index |
| `overflowRenderDirection`           | 同名 prop                         | `'both'`；保留 Tabs 使用的上游能力                          |
| `visibleItemRenderer`               | `#visibleItem="{ item, index }"`  | Vue 原生作用域插槽                                          |
| `overflowRenderer`                  | `#overflow="{ items, position }"` | collapse 一组；scroll 为 start/end 两组                     |
| `onOverflow`                        | `@overflow`                       | collapse pivot 改变且确有溢出时触发                         |
| `onIntersect`                       | `@intersect`                      | scroll observer 批次处理后触发                              |
| `onVisibleStateChange`              | `@visibleStateChange`             | scroll 可见 Map 更新后触发                                  |

## 状态与事件顺序

- collapse 初始状态为 `calculating` 且 pivot `-1`，根节点保留 DOM 并 `visibility:hidden`；先测容器、overflow renderer 与候选 item，再计算 visible/overflow。
- 宽度总和（包含 overflow renderer）不大于容器时进入 `normal` 并显示全部；超出时 pivot 至少为 `minVisibleItems`。
- `collapseFrom=end` 保留头部；`collapseFrom=start` 保留尾部，最终 DOM 顺序仍与原 items 一致。
- item 宽度改变会重新计算；items/key/style 改变会重置测量缓存，且不应让已经渲染过的 collapse 内容重新闪为隐藏。
- scroll 模式始终渲染全部 items；IntersectionObserver 以 scroll wrapper 为 root，先更新 `visibleState` 与稳定的首尾 overflow 缓存，再依次触发 `visibleStateChange`、`intersect`。
- scroll 列表因整块垂直移出 viewport 而全部不可见时保留上一次缓存，避免将所有 item 误判为横向溢出。

## DOM、class 与样式

- 根：`div.semi-overflow-list`；collapse 模式附加 `max-width:100%` 与计算期 visibility。
- collapse item：`div.semi-overflow-list-item`，包装插槽节点以直接测得包含内容布局后的宽度。
- collapse overflow：有效内容包在 `div.semi-overflow-list-overflow` 中并独立测宽；空插槽不生成包装节点。
- scroll wrapper：`div.semi-overflow-list-scroll-wrapper`，合并 `wrapperClassName` / `wrapperStyle`；每个插槽根元素获得 `data-scrollkey`。
- 固定 SCSS：根 flex/no-wrap/min-width 0，scroll wrapper flex/overflow-x scroll；RTL 在 `.semi-rtl` / `.semi-portal-rtl` 下设置方向。

## Vue VNode/slot 适配门禁

- 插槽返回值可能是单节点、Fragment、数组、文本或空值；renderer 不用 truthiness 丢弃 `0`，也不修改调用方 VNode。
- collapse overflow 仅在存在有效 VNodeChild 时创建测量 wrapper；scroll 的 start/end slot 分别接收对应数组及 `position`。
- scroll 模式需要把 `data-scrollkey` 与测量 ref 放在实际插槽根元素上；若插槽不是单一元素根，Vue 侧使用内部稳定 wrapper，并在迁移文档记录这一结构差异。

## 键盘、焦点与 ARIA

- 固定组件是布局行为组件，不增加 role、tabindex 或键盘处理；焦点、语义和交互由 slot 内容保留。
- 重新分流不克隆可交互内容的状态，不主动聚焦或抢焦点。

## Observer、SSR 与清理

- `ResizeObserver` / `IntersectionObserver` 仅在 mounted 后创建，缺失时安全降级；SSR import/render 不访问 DOM 全局。
- items、模式或 root 改变时重新绑定 observer；卸载时全部 disconnect。
- scroll observer 的 root 必须是当前 wrapper；threshold 精确转发。

## 主题、暗色、RTL、国际化与响应式

- 样式不包含颜色 Token，仍必须覆盖桌面/移动 light/dark；主题入口独立发布为 `overflow-list.css`。
- RTL 覆盖根 direction，collapseFrom 的数据语义仍为数组 start/end，不按视觉方向篡改。
- 无 locale 文本与 locale 分支；以 zh-CN/en-US 文档和 locale-neutral 行为确认不产生硬编码。
- 响应式由真实宽度测量驱动，移动 viewport 必须验证重新分流和 scroll 可见状态。

## 视觉与行为验收

- 单元：默认值、class/style 合并、end/start/minVisibleItems、items 更新、item resize、scroll DOM/key、observer options、事件顺序与卸载清理。
- SSR：无 observer 环境 import/render；hydrate 后无警告并能开始测量。
- Chromium：桌面/移动 light/dark、RTL；对照根/item/overflow/wrapper computed style 与 bounding rect，截图阈值遵循仓库上限。
- 真实包：根与 `@aifuxi/semi-ui-vue/overflow-list` 导入、声明、CSS 子入口、SSR-safe import、license/SBOM 与私有路径扫描。

## Deviation

- Vue 使用 `visibleItem` / `overflow` 作用域插槽替代 React render props；这是框架原生映射，传入数据、调用时机和最终 DOM 保持对齐。
- React scroll 模式把 ref/data attribute clone 到 render prop 返回的单一 ReactElement；Vue slot 可能返回多根。Vue 对单一元素根直接克隆属性，多根时使用 `.semi-overflow-list-scroll-item` 包装以保证 observer 可观察。多根场景会多一层 DOM，但不会改变标准单根场景；验收为框架约束下的 accepted deviation。
- 上游英文文档把部分默认值误写为 `true`；实现以 Adapter `defaultProps` 为准：`renderMode='collapse'`、`items=[]`。

## 完成证据

- 状态：`ready`（2026-08-29）。
- Unit/SSR：OverflowList 聚焦测试 2 个文件、8 个用例通过；全仓 83 个测试文件、604 项测试通过。
- Chromium：OverflowList 来源、折叠/scroll 行为、desktop/mobile light/dark 与 RTL 共 7 项通过；全量 Chromium 回归 320/320 通过。
- 样式与几何：三个专项目标的关键 computed style 精确相等，bounding rect 各轴差值不超过 `0.5 CSS px`；截图未使用 mask，也未放宽仓库阈值。
- 五组 React/Vue PNG 已用独立文件执行 `cmp` 并字节相等：desktop/light `da00aa7305a33b3c7fb3dfce874ce2026a1294fae6a5d1e6ad31bac429b5b5f4`、desktop/dark `d802ab8bc135f9fd2468d6841d22ea38e78d1b2f840eef25d9715f585f3e039c`、mobile/light `c1ad352cd900648783d7e5d153d9ccfcca4a104a1c72a5ceb97194aaf003671b`、mobile/dark `b80417426d8ee5b692ab555449ce7ed82b412eb2182f0eabe5a17f4e9d403acb`、light/RTL `dcc6ac7d5c5c2e930fe7918d3d32ad2b901609bc239fb7953af186d6202b026a`。
- 发布：完整 `pnpm check` 通过，包含固定 vendor/inventory/assets/source-boundary、format、lint、typecheck、unit、全部 workspace build、主题入口、OverflowList 子路径 SSR import 与真实 tarball 安装/exports/ESM/声明/样式/SBOM consumer 验证。
