# ScrollList v2.102.0 对齐矩阵

## 路线与权威来源

- 当前路线：最近完成 `Popover`；`ScrollList` 是固定 `vendor/semi-design/content/order.js` 中紧邻其后的公开组件。
- 固定基线：Semi Design `v2.102.0`，提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- Adapter、公开类型与 DOM：`packages/semi-ui/scrollList/index.tsx`、`scrollItem.tsx`。
- Foundation、滚动算法、常量、样式与 RTL：`packages/semi-foundation/scrollList/foundation.ts`、`itemFoundation.ts`、`scrollTo.ts`、`constants.ts`、`scrollList.scss`、`rtl.scss`。
- 默认主题与 Token：`packages/semi-theme-default/scss/index.scss`、`global.scss`、`variables.scss`。
- 文档与行为语料：`content/show/scrolllist/`、`packages/semi-ui/scrollList/__test__/scrollList.test.js`、`cypress/e2e/scrollList.spec.js` 与 `_story/`。
- ScrollList 不依赖后续 SideSheet、Table 或 Tag；现有 TimePicker 已包含固定 ScrollList 样式并验证基础列布局，因此本切片依赖已就绪且可独立验收。

## Vue 组件边界

| 文件                        | 单一职责                                                             | 公开契约                           |
| --------------------------- | -------------------------------------------------------------------- | ---------------------------------- |
| `ScrollList.vue`            | 组合 header、body、footer，合并根 class/style/data 属性和 bodyHeight | props、默认/header/footer slots    |
| `ScrollItem.vue`            | 渲染 normal/wheel 列，管理循环副本、滚动定位、选择防抖和动画生命周期 | props、`select` emit、公开滚动方法 |
| `ScrollListNodeRenderer.ts` | 将静态 VNode prop 保持为 Vue VNode 输出                              | 仅供 ScrollList 内部使用           |
| `types.ts`                  | 提供 ItemData、props、emits、slots、mode、motion 与公开实例类型      | 根入口和 `scroll-list` 子路径      |

`ScrollList` 不拥有选中状态；`selectedIndex` 是调用方唯一状态来源，用户点击或滚动只通过 `select` 事件通知。`ScrollItem` 内仅保存循环渲染计数、当前/待选 DOM 引用和动画句柄，外部 DOM/动画对象保持浅层或普通非响应式引用。

## 公开 API、默认值与 Vue 映射

### ScrollList

| React v2.102.0        | Vue 契约                       | 默认值 / 映射                                          | 结论         |
| --------------------- | ------------------------------ | ------------------------------------------------------ | ------------ |
| `header`              | `header` prop 或 `#header`     | slot 优先；truthy 内容才创建 header wrapper            | Vue 原生映射 |
| `footer`              | `footer` prop 或 `#footer`     | slot 优先；truthy 内容才创建 footer wrapper            | Vue 原生映射 |
| `children`            | 默认 slot                      | 原样渲染到 `.semi-scrolllist-body`                     | Vue 原生映射 |
| `bodyHeight`          | 同名 prop                      | 未传为空字符串；number 显式序列化为 px                 | 等价         |
| `prefixCls`           | 同名 prop                      | `semi-scrolllist`                                      | 等价         |
| `className` / `style` | `class`、`className` / `style` | 合并到根节点                                           | Vue 原生映射 |
| `data-*`              | fallthrough attrs              | 仅 data 属性透传到根；React BaseComponent 同样过滤其余 | 等价         |

### ScrollItem

| React v2.102.0        | Vue 契约                                 | 默认值 / 映射                                     | 结论         |
| --------------------- | ---------------------------------------- | ------------------------------------------------- | ------------ |
| `mode`                | `'normal' \| 'wheel'`                    | `'wheel'`                                         | 等价         |
| `cycled`              | Boolean prop                             | `false`；仅 wheel 生效                            | 等价         |
| `list`                | `ScrollItemData[]`                       | `[]`；不修改调用方数组或 item                     | 等价         |
| `selectedIndex`       | number                                   | `0`；受控索引，变更后滚动到对应节点               | 等价         |
| `onSelect`            | `@select`                                | 发出 `{ ...item, value, type, index }`            | Vue 原生映射 |
| `transform`           | 同名函数 prop                            | 仅选中项调用；item.transform 优先于公共 transform | 等价         |
| `motion`              | `boolean \| ScrollMotion`                | `true`；缺省/显式 false/显式 true 分别验证        | 等价         |
| `className` / `style` | `class`、`className` / `style`           | 合并到 normal 根或 wheel 根                       | Vue 原生映射 |
| `type`                | string / number                          | 原样写入 select payload                           | 等价         |
| `aria-label`          | `ariaLabel` prop / `aria-label` 模板属性 | 作用于 `ul[role=listbox]`                         | Vue 原生映射 |

Vue 同时支持 `@select` 和 `onSelect` 监听器的原生编译结果；不把 `selectedIndex` 改造成内部 `v-model`，避免与上游受控契约产生第二状态源。`motion` 是默认 true 的可选 Boolean prop，实现必须保留缺省=true，且显式 false 禁用动画；测试同时覆盖缺省、false、true。

## 状态、事件与滚动算法

- normal：每个源 item 只渲染一次；`selectedIndex === index` 添加 `.semi-scrolllist-item-sel`，点击启用项立即发出 select，禁用项不绑定有效选择行为。
- wheel 非循环：渲染源列表一次并添加 `.semi-scrolllist-list-outer-nocycle`；挂载和 selectedIndex 更新时将目标项居中；滚动停止约 33ms 后选择距 selector 顶边最近的未禁用项。
- wheel 循环：根据真实 item/list/wrapper 几何计算头尾副本数；零布局环境不进入无穷循环。滚动时节流调整副本位置，并在防抖后选择最近启用项。
- 点击 wheel 项先阻止同一原生事件的后续立即传播，再走同一防抖选择路径；禁用项不选择。
- select payload 的 `index` 是源数组索引，`type` 来自 prop，其他字段为源 item 的浅拷贝；相同源 index 的循环副本切换不得重复通知。
- selectedIndex 外部更新时，先更新待选节点，再缓存选中节点并滚动；循环索引用模运算判断等价。
- motion=true 且 duration 非零时用固定 120ms scrollTop 动画；新动画开始前销毁旧动画，完成后 wheel 选中节点获得 `.semi-scrolllist-item-selected`。motion=false 直接设置 scrollTop。
- 卸载时取消滚动选择 timer、循环节流 timer、requestAnimationFrame 和当前动画，卸载后不得再 emit 或写 DOM。

## DOM、class、样式与属性

- 根为 `div.semi-scrolllist`；header 为 `.semi-scrolllist-header > .semi-scrolllist-header-title + .semi-scrolllist-line`，body 为 `.semi-scrolllist-body`，footer 为 `.semi-scrolllist-footer`。
- normal 列为 `div.semi-scrolllist-item > ul[role=listbox][aria-multiselectable=false] > li[role=option]`。
- wheel 列为 `div.semi-scrolllist-item-wheel`，子节点顺序固定为 pre shade、selector、post shade、list outer；list outer 内为同一 listbox/option 结构。
- `aria-disabled` 与固定 Adapter 一致写入 option；v2.102.0 源码注释掉 `aria-selected`，因此不擅自增加与参考 DOM 不同的属性，选中语义由固定 class 表示并在 deviation 记录文档矛盾。
- normal 选中 class 是 `-item-sel`；wheel 动画稳定后是 `-item-selected`；禁用 class 是 `-item-disabled`。
- 默认 body 高 300px、item 高 36px；number bodyHeight 输出 px。颜色、阴影、圆角、hover/active、selector、shade 均直接来自固定 SCSS/Token。
- RTL 根在 `.semi-rtl` / `.semi-portal-rtl` 下 direction=rtl；列分隔线由 right 改为 left，wheel padding-right 改为 padding-left。

## 键盘、焦点、ARIA、主题、国际化与 SSR

- 固定 v2.102.0 Adapter 不实现方向键或 roving tabindex，不主动聚焦；Vue 不添加超出基线的键盘状态机。
- listbox 使用 `aria-multiselectable=false` 和可选 `aria-label`；每项为 `role=option`、`aria-disabled`。disabled 点击和滚动最近项均不可选。
- ScrollList 无 Portal；滚动监听仅绑定 wheel column 自身，卸载清理所有异步任务。
- light/dark 由 `--semi-color-*` Token 驱动；方向敏感，必须覆盖 RTL；无 locale 文案和 locale 分支，双语文档及 locale-neutral 场景足以证明不会硬编码。
- SSR import/render 不访问 window/document/HTMLElement；测量、RAF 和 scroll 定位仅在 mounted 后执行。hydrate 后不得产生警告，并在客户端完成首次定位。

## 验收门禁与证据

- 单元：根 header/body/footer、slot/prop 优先级、prefix/bodyHeight/class/style/data；normal 默认/选中/disabled/transform/事件 payload；wheel DOM、cycled 副本、点击/滚动最近启用项、selectedIndex 外部更新、motion 缺省/false/true、动画替换与卸载清理。
- 公开行为：不调用私有方法证明正确；通过点击、scroll、prop 更新、最终 DOM class、scrollTop 与 emit 断言。
- SSR：根与两种 item 模式 renderToString；hydrate 无警告；挂载后初始化且卸载不残留 timer/RAF。
- React/Vue 场景：同一份确定性时段/小时/分钟数据；normal、wheel 非循环和 wheel 循环、disabled、item/common transform、header/footer、bodyHeight、RTL。
- Chromium：同一 Chromium 下对根、body、normal/wheel 列、selected/disabled/selector/shade 执行 computed style 与几何对照；验证点击和滚动行为；桌面 1440×900、移动 390×844 的 light/dark，加 RTL。
- 视觉：裁剪 ScrollList 最小完整场景，`threshold <= 0.1`、`maxDiffPixelRatio <= 0.001`；测试通过后再独立比较 React/Vue PNG 字节。
- 发布：根与 `scroll-list` 子路径 ESM/声明、`scroll-list.css`、tree-shaking、SSR-safe import、真实 tarball 离线消费、许可证和 SBOM。

实际结果：

- ScrollList 定向单元与 SSR：2 个测试文件、10 项通过；全仓单元：86 个测试文件、628 项通过。
- 全仓 `pnpm check` 通过：固定 vendor、130 个根导出/85 个模块组 inventory、图标/插画生成一致、1076 个运行时文件与公开包边界、格式、lint、类型、全量构建均通过。
- 主题产物通过：ScrollList 已进入根 CSS 与独立 `scroll-list.css`，共验证 86 个根入口、3,670,155 字节 CSS。
- SSR 通过：根入口及 `packages/ui/dist/scroll-list/index.js` 在无 DOM 环境可导入；组件 SSR render 与客户端挂载/卸载用例通过。
- 全量 Chromium：333 项通过，其中 ScrollList 6 项覆盖行为和 desktop/mobile light/dark/RTL；5 个 computed-style/geometry 目标逐项对齐。
- 五组 React/Vue 最小完整场景 PNG 既通过 Playwright 阈值，也通过测试内 Buffer equality 与独立 `cmp` 字节相等。
- 真实 tarball 通过离线安装、根/子路径 exports、ESM、公开类型、根/独立样式、SSR import、许可证与 SBOM 消费验证。

## Deviation

- React 的 `header`、`footer`、`children` 映射为 Vue `#header`、`#footer`、默认 slot；静态 prop 仍保留。这只改变框架表达，不减少内容能力。
- React `onSelect` 映射为 Vue `@select`；payload 和调用时机保持一致。
- 上游文档声称使用 `aria-selected`，但固定 v2.102.0 Adapter 明确注释掉该属性。实现以源码 DOM 为准，不额外输出 `aria-selected`；文档与源码差异不构成 Vue deviation。
- 当前没有 accepted visual/behavior deviation，也没有未解释差异。

## 验收结论

当前状态为 `ready`。源码、Foundation 隔离入口、主题、双语文档与迁移表、单元/SSR、同环境 Chromium、五组视觉证据和真实 tarball 均已完成；没有 accepted deviation。
