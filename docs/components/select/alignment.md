# Select v2.102.0 对齐矩阵

## 选择与证据

Select 是 Tooltip PoC 后的第二道复杂度门槛，用来验证搜索、多选、虚拟列表、键盘/焦点和复合 Portal。权威源码为固定 `v2.102.0`：

- Adapter/API/DOM：`packages/semi-ui/select/index.tsx`、`option.tsx`、`optionGroup.tsx`、`utils.tsx`、`virtualRow.tsx`
- 状态机：`packages/semi-foundation/select/foundation.ts`、`optionFoundation.ts`、`constants.ts`
- 样式：`packages/semi-foundation/select/{select,option,animation,rtl}.scss` 与默认主题 Token
- 文档/无障碍：`content/input/select/index.md`、`index-en-US.md`

## Vue 组件边界

| 文件                       | 单一职责                                                                            |
| -------------------------- | ----------------------------------------------------------------------------------- |
| `Select.vue`               | 公开 props/emits/slots/v-model、trigger/listbox/Portal 组合和暴露方法               |
| `use-select-foundation.ts` | 将固定 Foundation Adapter 接入 Vue 浅响应式状态并保持 React setState 的事件观察时序 |
| `SelectOption.vue`         | 声明式候选项数据节点，不拥有选择状态                                                |
| `SelectOptionGroup.vue`    | 声明式分组数据节点，不拥有选择状态                                                  |
| `SelectOptionCollector.ts` | 在真实 render 周期收集 slot VNode，避免 setup/mounted 阶段调用 slot                 |
| `SelectNodeRenderer.ts`    | 渲染公开 VNodeChild 内容，不解析或修改调用方节点                                    |

## API 与默认值

| React v2.102.0                              | Vue API                                                      | 默认值/结论                                                         |
| ------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------- |
| `value` / `defaultValue`                    | `v-model` / `modelValue`、`value` / `defaultValue`           | 支持受控/非受控；事件同时发出 `update:modelValue` 与 `update:value` |
| `multiple`                                  | `multiple`                                                   | `false`；多选值为数组                                               |
| `filter` / `remote`                         | 同名 prop                                                    | `false`；函数过滤和远程不做本地过滤                                 |
| `allowCreate`                               | 同名 prop + `createItem` slot                                | `false`；创建先发 `create`，再进入选择链                            |
| `defaultActiveFirstOption`                  | 同名 prop                                                    | `true`；缺省、显式 false/true 和全局覆盖分开解析                    |
| `autoClearSearchValue`                      | 同名 prop                                                    | `true`                                                              |
| `dropdownMatchSelectWidth`                  | 同名 prop                                                    | `true`；数值或非百分比宽度直接传递，否则读 trigger rect             |
| `showArrow` / `showClear`                   | 同名 prop + `arrowIcon` / `clearIcon` slot                   | `true` / `false`                                                    |
| `max` / `maxTagCount`                       | 同名 prop                                                    | 超限发 `exceed`；折叠为 `+N`                                        |
| `ellipsisTrigger` / `expandRestTagsOnClick` | 同名 prop                                                    | ResizeObserver 驱动可见标签数，保持单行折叠与展开交互               |
| `showRestTagsPopover`                       | 同名 prop + `restTagsPopoverProps`                           | `false`；hover `+N` 展示剩余标签                                    |
| `optionList`                                | 同名 prop                                                    | 与声明式 `SelectOption` 二选一，前者优先                            |
| `renderOptionItem`                          | `option` scoped slot                                         | 接收 option、focused、selected、inputValue 与事件落点               |
| `renderSelectedItem`                        | `selectedItem` scoped slot                                   | 接收 option 与 index                                                |
| `triggerRender`                             | `trigger` scoped slot                                        | 接收 value/inputValue/onSearch/onClear/onRemove                     |
| 四个 `*Slot` ReactNode prop                 | `outerTop` / `innerTop` / `innerBottom` / `outerBottom` slot | 保留 DOM 顺序与键盘 Tab 边界                                        |
| `prefix` / `suffix`                         | 同名 slot                                                    | 保留 `.semi-select-prefix/suffix`                                   |
| `insetLabel` / `insetLabelId`               | `insetLabel` slot / `insetLabelId` prop                      | 保留 inset-label class 与关联 id                                    |
| `virtualize`                                | 同名 prop                                                    | 固定高度窗口、overscan、滚动定位与公开 option 行为                  |
| `getPopupContainer` / position props        | 同名 prop                                                    | 稳定自定义容器首次显示即为 Portal 父节点；默认继承 ConfigProvider   |

其余公开样式/状态 props 原名保留：`size`、`disabled`、`borderless`、`validateStatus`、`loading`、`emptyContent`、`dropdownClassName`、`dropdownStyle`、`dropdownMargin`、`maxHeight`、`spacing`、`zIndex`、`motion`、`autoAdjustOverflow`、`stopPropagation`、`clickToHide`、`preventScroll`、`inputProps`、`searchPosition`、`searchPlaceholder`、`rePosKey`。

事件顺序保持固定 Foundation：`select`/`deselect` → `change` → `update:modelValue`/`update:value`；清空额外发 `clear`；可见性变化发 `dropdownVisibleChange`。`onChangeWithObject` 清理全部内部 `_` 字段后返回公开 option 数据。

## 状态、DOM 与行为

| 维度        | 对齐结论                                                                                                                                                                                                                     |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DOM/class   | trigger 保留 `.semi-select*`；内容保留 selection/content-wrapper/input/tag；Portal 为 `.semi-portal-inner > .semi-popover-wrapper > .semi-popover-content > .semi-select-option-list-wrapper`；候选项、分组和状态 class 保留 |
| 受控/非受控 | 受控选择只通知，不提前替换显示；非受控选择更新内部 Map；optionList 改名会重新解析选中 label                                                                                                                                  |
| 键盘        | Enter/Up/Down/Escape/Backspace/Tab/Shift+Tab 由固定 Foundation 处理；禁用项跳过；`aria-activedescendant` 指向当前候选项                                                                                                      |
| 焦点        | 点击、过滤输入、单/多选、slot 可交互节点和关闭后回焦保持固定时序；`preventScroll` 透传原生 focus                                                                                                                             |
| ARIA        | trigger=`combobox`，panel=`listbox`，item=`option`；保留 expanded/controls/haspopup/multiselectable/selected/disabled 及五个 aria 表单属性                                                                                   |
| Portal/定位 | 复用已验收 Tooltip 定位边界；继承 RTL 默认 bottomRight；Element/Document capture scroll 与卸载清理由 Tooltip 完成                                                                                                            |
| 动效        | Popover 前缀使用固定 Portal/Tooltip/Popover SCSS；`motion=false` 仍在关闭完成点触发 Foundation `popoverClose`                                                                                                                |
| 暗色/RTL    | 默认主题 Token 与 Select RTL SCSS 原样编译；Portal 继承 `.semi-portal-rtl`                                                                                                                                                   |
| 国际化      | 缺省空内容为固定 zh-CN `暂无数据`；文档场景覆盖 zh-CN/en-US，ConfigProvider Locale 数据门禁继续覆盖全部 Locale                                                                                                               |
| SSR         | import 不读 DOM；VNode 收集、Foundation init、Portal、监听和 focus 均在客户端 render/mounted 后发生；`useId()` 保持 hydration id 稳定                                                                                        |

## 易错点门禁

- 默认 `true`：`defaultActiveFirstOption`、`dropdownMatchSelectWidth`、`showArrow`、`autoAdjustOverflow`、`autoClearSearchValue`、`motion`、`stopPropagation` 均区分缺省与显式 false/true；至少对 `showArrow` 验证全局覆盖优先级。
- 子 VNode Boolean：真实 SFC 裸 `disabled`、`:disabled="false"` 与 render function true/false 同时测试最终 ARIA 和点击落点。
- Portal：自定义容器预先存在，首次可见时直接挂入该容器；不引入轮询或 Observer。
- 重定位：沿用 Tooltip 对 Element/Document capture scroll 的门禁；Select 额外用 `rePosKey` 与标签高度变化触发重定位。

## 视觉与发布门禁

同一 Chromium 进程比较 React/Vue 的基础、禁用、占位、多选、分组搜索和打开浮层；桌面/移动、light/dark、RTL 均执行。computed style 和 bounding rect 沿用 `0.5 CSS px`，截图沿用 `threshold <= 0.1`、`maxDiffPixelRatio <= 0.001`。发布包必须验证根/`select` 子路径、声明、`select.css`、SSR-safe import、tree-shaking、SBOM 与许可清单。

## Deviation

无 accepted deviation。

## Locale/Pagination 菜单回归（2026-09-06）

固定 option.tsx 仅为字符串 children 添加 semi-select-option-text；VNode/数字内容直接作为 option 子节点。补充字符串与 VNode 菜单结构及选择行为回归，消除分页大小菜单多出的包裹节点；不更改过滤/选中值或默认 true 的处理。

固定 Select.componentDidUpdate 仅在选项变化时调用 handleOptionListChange 并重置 focusIndex；单独 value 变化保留当前焦点。Vue 使用稳定的 optionList computed 作为深度监听源，防止 runtimeProps 因 value 更新而创建新对象时误重置焦点。补充受控值变化时悬停项保持的公开行为测试，并由 Locale 语言选择后再次打开菜单的 RTL 对照验证。

打开浮层后按上游 handlePopoverVisibleChange 滚动首个已选项到列表中部；计算 offsetTop 时扣除列表 offsetTop，保留键盘焦点项滚动的相同坐标系。Locale 长语言菜单在重复打开后逐项比较位置，覆盖中文/英文与 RTL。

## SideSheet 文档组合场景修复（2026-09-13）

- Custom 首开附件完整比较137个节点，仅4个多选选项 Tag 缺少 `semi-tag-square` 与 `max-width:100%`，其余节点样式、属性、文本及几何一致。
- 固定 Select `renderTag` 使用 Tag 并显式传 `style={{ maxWidth: '100%' }}`，Tag 默认 `shape: 'square'`。Vue Select 内联结构现补默认 square 类；已选选项及剩余选项标签保留100%宽度上限，+N标签不新增该限制。不修改 Tag 公共实现或选择交互。
- 现有多选公开行为测试增加默认Tag形状和选项宽度上限断言，先红后绿；正式组合场景及历史证据由主 agent 统一重验。
