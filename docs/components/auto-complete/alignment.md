# AutoComplete v2.102.0 对齐矩阵

## 选择与证据

AutoComplete 是固定文档输入类分组的首个组件。它以 Input 为触发器、以 Popover 为候选层，直接承接已经进入 `ready` 的 Tooltip/Select Portal 与键盘基础设施；相比提前进入 Form、Tree 或日期体系，它不引入新的大型依赖域。

权威源码为只读 `vendor/semi-design` 的固定 `v2.102.0`：

- Adapter/API/DOM：`packages/semi-ui/autoComplete/index.tsx`、`option.tsx`
- 状态机：`packages/semi-foundation/autoComplete/foundation.ts`、`optionFoundation.ts`、`constants.ts`
- 样式：`packages/semi-foundation/autoComplete/{autoComplete,option,animation,rtl,variables}.scss`，以及 Input、Spin、Portal、Tooltip、Popover SCSS
- 文档/无障碍：`content/input/autocomplete/index.md`、`index-en-US.md`
- 行为语料：`packages/semi-ui/autoComplete/__test__/autoComplete.test.js` 与 `cypress/e2e/autoComplete.spec.js`

## Vue 组件边界

| 文件                              | 单一职责                                                                      |
| --------------------------------- | ----------------------------------------------------------------------------- |
| `AutoComplete.vue`                | 公开 props/emits/slots/v-model、Input trigger、listbox、Portal 与暴露方法组合 |
| `use-auto-complete-foundation.ts` | 将固定 Foundation Adapter 接入 Vue 浅响应式状态，保持受控/非受控与事件顺序    |
| `AutoCompleteOption.vue`          | 单个 option 的 class、ARIA、disabled/focused 与点击/悬停落点                  |
| `AutoCompleteNodeRenderer.ts`     | 渲染公开 VNodeChild，不读取、克隆或改写调用方 VNode                           |

## API、默认值与 Vue 映射

| React v2.102.0                         | Vue API                                            | 默认值/结论                                                      |
| -------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------- |
| `value` / `defaultValue`               | `v-model` / `modelValue`、`value` / `defaultValue` | string/number；支持受控/非受控，同时发出两个 update 事件         |
| `data`                                 | 同名 prop                                          | `[]`；支持 primitive 或含 `value` 的对象                         |
| `defaultOpen`                          | 同名 prop                                          | `false`；仅初始化状态                                            |
| `defaultActiveFirstOption`             | 同名 prop                                          | `false`；缺省、显式 false/true 与全局覆盖分开解析                |
| `dropdownMatchSelectWidth`             | 同名 prop                                          | `true`；固定宽度直接使用，否则读取 trigger rect                  |
| `autoAdjustOverflow`                   | 同名 prop                                          | 文档为 `true`；区分缺省和显式 false                              |
| `motion` / `stopPropagation`           | 同名 prop                                          | `true` / `true`；区分缺省和显式 false                            |
| `renderItem`                           | `option` scoped slot，兼容同名函数 prop            | 接收原始 item、归一化 option、focused 与交互落点                 |
| `renderSelectedItem`                   | 同名函数 prop                                      | 返回值必须为 string；选中时决定输入框值                          |
| `triggerRender`                        | `trigger` scoped slot                              | 接收 inputValue、value、组件 props、onSearch/onClear             |
| `prefix` / `suffix` / `insetLabel`     | 同名 slot                                          | 保留 Input DOM class；`insetLabelId` 关联对应节点                |
| `clearIcon` / `emptyContent`           | 同名 slot，也兼容 prop 内容                        | `emptyContent=null`；null 时空列表不渲染占位项                   |
| `getPopupContainer`                    | 同名 prop；未传时继承 ConfigProvider               | 稳定容器首次可见即为 Portal 父节点                               |
| `onSelectWithObject`                   | 同名 prop                                          | `false`；false 发 value，true 发剔除内部字段后的公开 option      |
| `onChangeWithObject`                   | 保留同名 prop                                      | 固定 Foundation 未读取该字段，记录为兼容输入但不改变 change 载荷 |
| `showClear` / `disabled` / `autoFocus` | 同名 prop                                          | 均为 `false`                                                     |
| `size` / `validateStatus`              | 同名 prop                                          | `default` / `default`                                            |
| `position` / `zIndex` / `maxHeight`    | 同名 prop                                          | `bottomLeft` / `1030` / `300`                                    |
| `dropdownClassName` / `dropdownStyle`  | 同名 prop                                          | 落在 `.semi-autocomplete-option-list`                            |
| `className`                            | Vue 原生 `class`                                   | 落在 `.semi-autocomplete` trigger 外层                           |
| `mouseEnterDelay` / `mouseLeaveDelay`  | 同名 prop                                          | 透传 Tooltip                                                     |
| `aria-*`                               | camelCase props                                    | 透传原生 input；combobox/listbox/option 关系额外由组件建立       |

公开事件保持固定 Foundation 顺序：输入为 `search` → `change` → `update:modelValue`/`update:value` → 打开回调；非受控选项点击为内部值/选择更新 → `select` → 关闭回调 → `change` → update；受控选项点击先关闭、通知 `select`，显示值等待调用方回写。另提供 `clear`、`focus`、`blur`、`keydown`、`dropdownVisibleChange`。

## 状态、DOM 与行为

| 维度        | 对齐结论                                                                                                                                                                                                                                      |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DOM/class   | 外层保留 `.semi-autocomplete`；默认 trigger 内保留 `.semi-input-wrapper* > prefix + input.semi-input* + clearbtn + suffix`；Portal 保留 `.semi-portal-inner > .semi-popover-wrapper > .semi-popover-content > .semi-autocomplete-option-list` |
| 受控/非受控 | 是否受控按调用方是否显式传入 `modelValue`/`value` 判断；受控选择不提前漂移显示；data/value 更新重新生成 options、selection 与 focusIndex                                                                                                      |
| 候选项      | primitive 归一化为 value/label；对象保留额外字段；disabled 不触发选择；固定 Adapter 未向内部 Option 传 `inputValue`，默认列表不高亮搜索词；自定义 slot 仍由 `.semi-autocomplete-option` 包裹                                                  |
| 键盘        | focus 后绑定 Up/Down/Enter/Escape/Tab；关闭时箭头/Enter 打开，打开时循环跳过 disabled，Enter 选择，Escape/Tab 关闭；每次仍发 `keydown`                                                                                                        |
| 焦点        | input 为唯一 Tab 焦点；outer `tabindex=-1`；autoFocus、focus/blur 事件与 clear 的 mousedown 保焦对齐                                                                                                                                          |
| ARIA        | outer/input 建立 `combobox`、`aria-expanded`、`aria-controls`、`aria-activedescendant`；候选层=`listbox`，候选项=`option`，保留 selected/disabled                                                                                             |
| Portal/定位 | 复用已验收 Tooltip；默认/自定义容器与 RTL 方向来自 ConfigProvider；数据变化通过 `rePosKey` 重定位；Element/Document capture scroll 和卸载清理由 Tooltip 完成                                                                                  |
| 动效        | 使用 Popover 前缀及固定 Portal/Tooltip/Popover SCSS；`motion=false` 同步完成显示/关闭状态                                                                                                                                                     |
| 暗色/RTL    | 默认主题 Token、Input 与 AutoComplete RTL SCSS 原样编译；Portal 继承 `.semi-portal-rtl`                                                                                                                                                       |
| 国际化      | 固定 AutoComplete 默认 `emptyContent=null`，本组件无 locale 文案；中英文文档与场景使用相同数据                                                                                                                                                |
| SSR         | import/setup 不读取 DOM；Foundation init、测量、Portal、监听和 focus 仅在客户端 mounted 后发生；服务端仍渲染稳定 input/ARIA，且不生成 Portal                                                                                                  |

## Vue Adapter 易错点门禁

- 默认 `true`：`autoAdjustOverflow`、`dropdownMatchSelectWidth`、`motion`、`stopPropagation` 分别保留缺省、显式 false、显式 true；至少对 `dropdownMatchSelectWidth` 验证全局覆盖与显式值优先级。
- VNode：候选项由 data 与 scoped slot 驱动，不把 slot VNode 当 Boolean 数据读取，不克隆或修改调用方 VNode；自定义内容仍断言最终 option DOM/ARIA/事件落点。
- Portal：对照场景先在父级创建稳定容器，mounted 后再渲染 AutoComplete；首次可见 Portal 必须直接进入该容器，不以 body 兜底形成错误基线。
- 重定位：复用 Tooltip 对 Element/Document capture scroll 与清理门禁；AutoComplete 额外验证 data 更新会触发重新定位，卸载后 document mousedown 不再改变状态。

## 测试与视觉矩阵

- 单元：默认/受控/非受控、事件顺序、data 更新、primitive/object、renderItem/selectedItem、clear/loading/empty、尺寸/校验/禁用、键盘循环/跳过 disabled、ARIA、稳定自定义容器、全局默认值、卸载清理与暴露方法。
- SSR：默认值、input/combobox ARIA、无 Portal、无 DOM 副作用，根/子路径 import 安全。
- Chromium 场景：固定中文文档首个基础示例；small/default/large、warning/error/disabled、加载、自定义候选、默认展开与键盘；桌面 `1440×900`、移动 `390×844`、light/dark 与 RTL。
- computed style/geometry：默认 input wrapper、三尺寸、校验态、option/focused、Portal 宽度与位置逐节点比较；bounding rect 差值不超过 `0.5 CSS px`。
- 截图：组件/Portal 最小裁剪，`threshold <= 0.1`、`maxDiffPixelRatio <= 0.001`；数值通过后仍检查局部集中差异。
- 发布：根/`auto-complete` 子路径、声明、`auto-complete.css`、真实 tarball 安装、类型、tree-shaking、SSR import、SBOM 与许可清单。

## Deviation

- `onChangeWithObject` 存在于 v2.102.0 Adapter 类型，但固定 Foundation 与 Adapter 均未读取，且文档未公开。Vue 保留该 prop 的类型入口，不人为赋予新行为；用户可观察行为与固定版本一致。
