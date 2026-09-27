---
title: 'Cascader 级联选择'
description: '用于选择多级分类下的某个选项。'
type: 'input'
order: 36
icon: 'doc-cascader'
---

## 使用场景

与 TreeSelect 组件的区别:

- TreeSelect: 核心价值在于**目标节点**，层级结构是为了方便用户快速筛选出目标选项，最终的节点才是用户想要的内容，常见于文件/文件夹选择、组织架构、权限分配等场景。
- Cascader: 核心价值在于**路径**，用户选择的不是一个孤立的点，而是一条从根到叶的完整路径，常用于地理位置，商品分类等场景。

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/cascader` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-input-cascader-1" title="如何引入" kind="import" />

### 基本用法

最简单的用法，默认只可以选叶子节点。

<DemoBlock id="zh-CN-input-cascader-2" title="基本用法" kind="live" />

### 多选

设置 `multiple`，可以进行多选。

<DemoBlock id="zh-CN-input-cascader-3" title="多选" kind="live" />

### 可搜索的

通过设置 `filterTreeNode` 属性可支持搜索功能。

默认对 `label` 值进行搜索（使用字符串的 includes 方法进行匹配，不区分大小写），可通过 `treeNodeFilterProp` 指定其他属性值进行搜索。
如 `label` 为 VNodeChild，可在 treeData 中使用其他字段存储纯文本，并通过 `treeNodeFilterProp` 指定该字段进行搜索。

默认搜索结果只会展示叶子结点的路径，想要显示更多的结果，可以设置 `filterLeafOnly` 为 `false`。

<DemoBlock id="zh-CN-input-cascader-4" title="可搜索的" kind="live" />

### 可搜索的多选

支持多选和搜索同时使用，在这种场景下，可以通过按下 BackSpace 键来删除对应的已选项目。

<DemoBlock id="zh-CN-input-cascader-5" title="可搜索的多选" kind="live" />

可以使用 `filterSorter` 对筛选后的数据进行排序， `filterSorter` 于 v2.28.0 开始提供。

<DemoBlock id="zh-CN-input-cascader-6" title="可搜索的多选" kind="live" />

如果想要自定义渲染搜索后的选项，可以使用 `filterRender` 实现整行的自定义渲染，`filterRender` 于 v2.28.0 开始提供，函数参数如下：

<DemoBlock id="zh-CN-input-cascader-7" title="可搜索的多选" kind="code" />

使用示例如下

<DemoBlock id="zh-CN-input-cascader-8" title="可搜索的多选" kind="live" />

如果搜索结果中存在大量 Option，可以通过设置 virtualizeInSearch 开启搜索结果面板的虚拟化来优化性能，virtualizeInSearch 自 v2.44.0 提供。virtualizeInSearch 是一个包含下列值的对象：

- height: Option 列表高度值
- width: Option 列表宽度值
- itemSize: 每行 Option 的高度

<DemoBlock id="zh-CN-input-cascader-9" title="可搜索的多选" kind="live" />

### 限制标签展示数量

在多选的场景中，利用 maxTagCount 可以限制展示的标签数量，超出部分将以 +N 的方式展示。

使用 showRestTagsPopover 可以设置在超出 maxTagCount 后，hover +N 是否显示 Popover，默认为 false。并且，还可以在 restTagsPopoverProps 属性中配置 Popover。

<DemoBlock id="zh-CN-input-cascader-10" title="限制标签展示数量" kind="live" />

### 限制选中数量

在多选的场景中，利用 max 可以限制多选选中的数量。超出 max 后将触发 `exceed` 事件。

<DemoBlock id="zh-CN-input-cascader-11" title="限制选中数量" kind="live" />

### 选择即改变

在单选的情况下，还可以通过设置 `changeOnSelect`，允许选中父级选项。

<DemoBlock id="zh-CN-input-cascader-12" title="选择即改变" kind="live" />

### 自定义显示

可以通过 `displayProp` 设置回填选项显示的属性值，默认为 `label`。

<DemoBlock id="zh-CN-input-cascader-13" title="自定义显示" kind="live" />

可以通过设置 `displayRender` 可以设定返回格式。

单选 (`multiple=false`) 时, `displayRender((labelPath: string[]) => VNodeChild)`, 其中 labelPath 是由 label 构成的 path 数组。

多选 (`multiple=true`) 时, `displayRender((item: Entity, index: number) => VNodeChild)`, 其中 item 为节点的相关数据。

<DemoBlock id="zh-CN-input-cascader-14" title="自定义显示" kind="code" />

<DemoBlock id="zh-CN-input-cascader-15" title="自定义显示" kind="live" />

### 自定义分隔符

版本: >=2.2.0

可以使用 `separator` 设置分隔符, 包括：搜索时显示在下拉框的内容以及单选时回显到 Trigger 的内容的分隔符。

<DemoBlock id="zh-CN-input-cascader-16" title="自定义分隔符" kind="live" />

### 禁用

<DemoBlock id="zh-CN-input-cascader-17" title="禁用" kind="live" />

### 严格禁用

可以使用 disableStrictly 来开启严格禁用。开启严格禁用后，当节点是 disabled 的时候，则不能通过子级或者父级的关系改变选中状态。

以下面的 demo 为例，节点"宁波"开启了严格禁用，因此，当我们改变其父节点"浙江省"的选中状态时，也不会影响到节点"宁波"的选中状态。

<DemoBlock id="zh-CN-input-cascader-18" title="严格禁用" kind="live" />

### 展示子菜单的时机

可以使用 `showNext` 设置展开 Dropdown 子菜单的触发时机，可选: `click`（默认）、`hover`。

<DemoBlock id="zh-CN-input-cascader-19" title="展示子菜单的时机" kind="live" />

### 点击选中

在多选模式下，默认情况下点击非叶子节点不会触发选中。你可以通过 `clickToSelect` 开启点击任意节点即选中的功能。

这个 API 在配合 `showNext="hover"` 使用时特别有用：鼠标悬浮展开子菜单，点击则选中当前节点。

<DemoBlock id="zh-CN-input-cascader-20" title="点击选中" kind="live" />

### 在顶部/底部渲染附加项

级联选择器提供 `#top` 与 `#bottom` 插槽，也兼容 `topSlot`、`bottomSlot` 属性。

<DemoBlock id="zh-CN-input-cascader-21" title="在顶部/底部渲染附加项" kind="live" />

### 受控

使用 `v-model` 管理受控值，或通过 `value` 与 `change` 事件配合管理。

<DemoBlock id="zh-CN-input-cascader-22" title="受控" kind="live" />

### 自动合并 value

在多选（multiple=true）场景中，当我们选中祖先节点时，如果希望 value 不包含它对应的子孙节点，则可以通过 `autoMergeValue` 来设置，默认为 true。当 autoMergeValue 和 leafOnly 同时开启时，后者优先级更高。

<DemoBlock id="zh-CN-input-cascader-23" title="自动合并 value" kind="live" />

### 仅叶子节点

版本: >=2.2.0

在多选时，可以通过开启 leafOnly 来设置 value 只包含叶子节点，即显示的 Tag 和 `change` 事件的 value 参数 只包含 value。

<DemoBlock id="zh-CN-input-cascader-24" title="仅叶子节点" kind="live" />

### 节点选中关系

版本：>= 2.71.0

多选时，可以使用 `checkRelation` 来设置节点之间选中关系的类型，可选：'related'（默认）、'unRelated'。当选中关系为 'unRelated' 时，意味着节点之间的选中互不影响。

<DemoBlock id="zh-CN-input-cascader-25" title="节点选中关系" kind="live" />

### 动态更新数据

<DemoBlock id="zh-CN-input-cascader-26" title="动态更新数据" kind="live" />

### 异步加载数据

可以使用 loadData 实现异步加载数据

**不能与搜索同时使用**

<DemoBlock id="zh-CN-input-cascader-27" title="异步加载数据" kind="live" />

### 远程搜索

**v>=2.97.0** 起 Cascader 支持远程搜索。设置 `remote` 后，搜索输入不再走本地匹配，而是仅触发 `search` 事件，由你根据输入异步拉取 `treeData`。这与 Select 的 `remote` 行为一致。

<DemoBlock id="zh-CN-input-cascader-28" title="远程搜索" kind="live" />

### 超长列表

当你的数据结构层级特别深时，Cascader下拉菜单可能会超出屏幕，此时我们建议为下拉菜单设置 overflow-x: auto 以及一个合适的 width 宽度（ 建议以N+0.5列的宽度为准，最右侧显示半列，以给用户一种右侧尚有待展开项，可以水平方向滚动的视觉暗示）

<DemoBlock id="zh-CN-input-cascader-29" title="超长列表" kind="live" />

<DemoBlock id="zh-CN-input-cascader-30" title="超长列表" kind="code" />

### 自定义 Trigger

如果默认的触发器样式满足不了你的需求，可以用`triggerRender`自定义选择框的展示

triggerRender 入参如下

<DemoBlock id="zh-CN-input-cascader-31" title="自定义 Trigger" kind="code" />

<DemoBlock id="zh-CN-input-cascader-32" title="自定义 Trigger" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/cascader/types.ts`、`packages/ui/src/cascader/index.ts` 的公开类型为准。

- `v-model` 对应 `modelValue`，同时支持 `v-model:value`。

#### Vue 实例方法

**Cascader ref**

| 方法     | 签名                       | 说明           |
| -------- | -------------------------- | -------------- |
| `open`   | () =&gt; void              | 展开弹出层     |
| `close`  | () =&gt; void              | 关闭弹出层     |
| `focus`  | () =&gt; void              | 聚焦选择框     |
| `blur`   | () =&gt; void              | 移除选择框焦点 |
| `search` | (value: string) =&gt; void | 手动触发搜索   |

#### Vue 事件

**Cascader**

| 事件          | 参数                                                       | 说明               |
| ------------- | ---------------------------------------------------------- | ------------------ |
| blur          | [event: unknown]                                           | 选择框失去焦点     |
| change        | [value: CascaderValue]                                     | 选中值变化         |
| clear         | []                                                         | 点击清除按钮       |
| exceed        | [checkedItems: CascaderEntity[]]                           | 选中数量超过 max   |
| focus         | [event: unknown]                                           | 选择框获得焦点     |
| listScroll    | [event: Event, panel: CascaderScrollPanelProps]            | 下拉面板滚动       |
| load          | [loadedKeys: Set&lt;string&gt;, data: CascaderData]        | 异步节点加载完成   |
| search        | [value: string]                                            | 搜索值变化         |
| select        | [value: string \| number \| Array&lt;string \| number&gt;] | 节点选中           |
| visibleChange | [visible: boolean]                                         | 弹出层展示状态变化 |

#### Vue 插槽

**Cascader**

| 插槽       | 作用域参数                                                   | 说明           |
| ---------- | ------------------------------------------------------------ | -------------- |
| arrowIcon  | {}                                                           | 下拉箭头图标   |
| bottom     | {}                                                           | 弹出层底部内容 |
| clearIcon  | {}                                                           | 清除图标       |
| display    | { selected: VNodeChild[] \| CascaderEntity; index?: number } | 已选内容       |
| empty      | {}                                                           | 搜索无结果内容 |
| expandIcon | {}                                                           | 展开图标       |
| filter     | CascaderFilterRenderProps                                    | 搜索结果项     |
| prefix     | {}                                                           | 选择框前缀     |
| suffix     | {}                                                           | 选择框后缀     |
| top        | {}                                                           | 弹出层顶部内容 |
| trigger    | CascaderTriggerRenderProps                                   | 自定义触发器   |

### Cascader

| 属性                 | 说明                                                                                                                                                                                                               | 类型                                                                                         | 默认值                            | 版本    |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- | --------------------------------- | ------- |
| ariaDescribedby      | —                                                                                                                                                                                                                  | string                                                                                       | —                                 |         |
| ariaErrormessage     | —                                                                                                                                                                                                                  | string                                                                                       | —                                 |         |
| ariaInvalid          | —                                                                                                                                                                                                                  | boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling'                                      | —                                 |         |
| ariaLabel            | —                                                                                                                                                                                                                  | string                                                                                       | —                                 |         |
| ariaLabelledby       | —                                                                                                                                                                                                                  | string                                                                                       | —                                 |         |
| ariaRequired         | —                                                                                                                                                                                                                  | boolean \| 'false' \| 'true'                                                                 | —                                 |         |
| arrowIcon            | 自定义右侧下拉箭头 Icon，当 showClear 开关打开且当前有选中值时，hover 会优先显示 clear icon                                                                                                                        | VNodeChild                                                                                   | -                                 | -       |
| autoAdjustOverflow   | 是否自动调整下拉框展开方向，用于边缘遮挡时自动调整展开方向                                                                                                                                                         | boolean                                                                                      | true                              | -       |
| autoClearSearchValue | —                                                                                                                                                                                                                  | boolean                                                                                      | —                                 |         |
| autoMergeValue       | 设置自动合并 value。具体而言是，开启后，当某个父节点被选中时，value 将不包括该节点的子孙节点。不支持动态切换                                                                                                       | boolean                                                                                      | true                              | -       |
| borderless           | 无边框模式                                                                                                                                                                                                         | boolean                                                                                      | false                             | 2.33.0  |
| bottomSlot           | 底部插槽                                                                                                                                                                                                           | VNodeChild                                                                                   | -                                 | -       |
| changeOnSelect       | 是否允许选择非叶子节点                                                                                                                                                                                             | boolean                                                                                      | false                             | -       |
| checkRelation        | 多选时，节点之间选中状态的关系，可选：'related'、'unRelated'。                                                                                                                                                     | CascaderCheckRelation                                                                        | 'related'                         | 2.71.0  |
| class                | —                                                                                                                                                                                                                  | HTMLAttributes['class']                                                                      | —                                 |         |
| className            | 选择框的 className 属性                                                                                                                                                                                            | HTMLAttributes['class']                                                                      | -                                 | -       |
| clearIcon            | 可用于自定义清除按钮, showClear为true时有效                                                                                                                                                                        | VNodeChild                                                                                   | -                                 | 2.25.0  |
| clickToSelect        | 多选时，点击任意节点即可触发选中，常配合 showNext="hover" 使用，悬浮展开子菜单，点击选中当前节点                                                                                                                   | boolean                                                                                      | false                             | -       |
| defaultOpen          | 设置是否默认打开下拉菜单                                                                                                                                                                                           | boolean                                                                                      | false                             | -       |
| defaultValue         | 指定默认选中的条目                                                                                                                                                                                                 | CascaderValue                                                                                | -                                 | -       |
| disabled             | 是否禁用                                                                                                                                                                                                           | boolean                                                                                      | false                             | -       |
| disableStrictly      | 设置是否开启严格禁用。开启后，当节点是 disabled 的时候，则不能通过子级或者父级的关系改变选中状态                                                                                                                   | boolean                                                                                      | false                             | -       |
| displayProp          | 设置回填选项显示的属性值                                                                                                                                                                                           | string                                                                                       | `label`                           | -       |
| displayRender        | 设置回填格式                                                                                                                                                                                                       | (selected: VNodeChild[] \| CascaderEntity, index?: number) =&gt; VNodeChild                  | selected =&gt; selected.join('/') | -       |
| dropdownClassName    | 下拉菜单的 className 属性                                                                                                                                                                                          | HTMLAttributes['class']                                                                      | -                                 | -       |
| dropdownMargin       | 下拉菜单计算溢出时的增加的冗余值，详见[issue#549](https://github.com/aifuxi/semi-ui-vue/issues/549)，作用同 Tooltip margin                                                                                         | PopoverMargin                                                                                | -                                 | 2.25.0  |
| dropdownStyle        | 下拉菜单的样式                                                                                                                                                                                                     | StyleValue                                                                                   | -                                 | -       |
| emptyContent         | 当搜索无结果时展示的内容                                                                                                                                                                                           | VNodeChild                                                                                   | `暂无数据`                        | -       |
| enableLeafClick      | 多选时，是否启动点击叶子节点选项触发勾选                                                                                                                                                                           | boolean                                                                                      | false                             | 2.2.0   |
| expandIcon           | 自定义展开 icon                                                                                                                                                                                                    | VNodeChild                                                                                   | -                                 | 2.68.0  |
| filterLeafOnly       | 搜索结果是否只展示叶子结点路径                                                                                                                                                                                     | boolean                                                                                      | true                              | -       |
| filterRender         | 自定义渲染筛选后的选项                                                                                                                                                                                             | (props: CascaderFilterRenderProps) =&gt; VNodeChild                                          | -                                 | 2.28.0  |
| filterSorter         | 对筛选后的选项进行排序                                                                                                                                                                                             | (first: CascaderData[], second: CascaderData[], inputValue: string) =&gt; number             | -                                 | 2.28.0  |
| filterTreeNode       | 设置筛选，默认用 treeNodeFilterProp 的值作为要筛选的 TreeNode 的属性值， data 参数自 v2.28.0 开始提供                                                                                                              | boolean \| ((inputValue: string, treeNodeString: string, data?: CascaderData) =&gt; boolean) | false                             | -       |
| getPopupContainer    | 指定父级 DOM，下拉框将会渲染至该 DOM 中，自定义需要设置 position: relative 这会改变浮层 DOM 树位置，但不会改变视图渲染位置。                                                                                       | () =&gt; HTMLElement                                                                         | () =&gt; document.body            | -       |
| id                   | —                                                                                                                                                                                                                  | string                                                                                       | —                                 |         |
| insetLabel           | —                                                                                                                                                                                                                  | VNodeChild                                                                                   | —                                 |         |
| insetLabelId         | —                                                                                                                                                                                                                  | string                                                                                       | —                                 |         |
| keyMaps              | 自定义节点中 value、label、children、disabled、isLeaf 的字段                                                                                                                                                       | CascaderKeyMaps                                                                              | -                                 | 2.100.0 |
| leafOnly             | 多选时设置 value 只包含叶子节点，即显示的 Tag 和 `change` 事件的 value 参数只包含叶子节点。不支持动态切换                                                                                                          | boolean                                                                                      | false                             | 2.2.0   |
| loadData             | 异步加载数据，需要返回一个Promise                                                                                                                                                                                  | (selectOptions: CascaderData[]) =&gt; Promise&lt;void&gt;                                    | -                                 | -       |
| loadedKeys           | —                                                                                                                                                                                                                  | string[]                                                                                     | —                                 |         |
| max                  | 多选时，限制多选选中的数量，超出 max 后将触发 `exceed` 事件                                                                                                                                                        | number                                                                                       | -                                 | -       |
| maxTagCount          | 多选时，标签的最大展示数量，超出后将以 +N 形式展示                                                                                                                                                                 | number                                                                                       | -                                 | -       |
| modelValue           | —                                                                                                                                                                                                                  | CascaderValue                                                                                | —                                 |         |
| motion               | 设置下拉框弹出的动画                                                                                                                                                                                               | boolean                                                                                      | true                              | -       |
| mouseEnterDelay      | 鼠标移入后，延迟显示下拉框的时间，单位毫秒                                                                                                                                                                         | number                                                                                       | 50                                | -       |
| mouseLeaveDelay      | 鼠标移出后，延迟消失下拉框的时间，单位毫秒                                                                                                                                                                         | number                                                                                       | 50                                | -       |
| multiple             | 设置多选                                                                                                                                                                                                           | boolean                                                                                      | false                             | -       |
| onChangeWithObject   | 是否将选中项 option 的其他属性作为回调。设为 true 时，`change` 事件的参数类型会从 string/number 变为 TreeNode。此时如果是受控，也需要把 value 设置成 CascaderData 类型，且必须含有 value 的键值，defaultValue 同理 | boolean                                                                                      | false                             | -       |
| placeholder          | 选择框默认文字                                                                                                                                                                                                     | string                                                                                       | -                                 | -       |
| position             | 方向，可选值：`top`,`topLeft`,`topRight`,`left`,`leftTop`,`leftBottom`,`right`,`rightTop`,`rightBottom`,`bottom`,`bottomLeft`,`bottomRight`                                                                        | PopoverPosition                                                                              | `bottom`                          | 2.16.0  |
| prefix               | 前缀标签                                                                                                                                                                                                           | VNodeChild                                                                                   | -                                 | -       |
| preventScroll        | 指示浏览器是否应滚动文档以显示新聚焦的元素，作用于组件内的 focus 方法                                                                                                                                              | boolean                                                                                      | -                                 | 2.15.0  |
| remote               | 是否开启远程搜索。开启后，搜索输入时不再做本地过滤，仅触发 `search` 事件，由用户根据输入异步更新 `treeData` 来展示远程搜索结果，行为与 Select 的 remote 一致                                                       | boolean                                                                                      | false                             | 2.97.0  |
| restTagsPopoverProps | Popover 的配置属性，可以控制 position、zIndex、trigger 等，具体参考[Popover](/zh-CN/show/popover#API%20%E5%8F%82%E8%80%83)                                                                                         | PopoverProps                                                                                 | {}                                | -       |
| searchPlaceholder    | 搜索框默认文字                                                                                                                                                                                                     | string                                                                                       | -                                 | -       |
| searchPosition       | 设置搜索框的位置，可选: `trigger`、`custom`                                                                                                                                                                        | CascaderSearchPosition                                                                       | `trigger`                         | 2.54.0  |
| separator            | 自定义分隔符，包括：搜索时显示在下拉框的内容以及单选时回显到 Trigger 的内容的分隔符                                                                                                                                | string                                                                                       | `/`                               | 2.2.0   |
| showClear            | 是否展示清除按钮                                                                                                                                                                                                   | boolean                                                                                      | false                             | -       |
| showNext             | 设置展开 Dropdown 子菜单的方式，可选: `click`、`hover`                                                                                                                                                             | CascaderShowNext                                                                             | `click`                           | -       |
| showRestTagsPopover  | 当超过 maxTagCount，hover 到 +N 时，是否通过 Popover 显示剩余内容                                                                                                                                                  | boolean                                                                                      | false                             | -       |
| size                 | 选择框大小，可选 `large`，`small`，`default`                                                                                                                                                                       | CascaderSize                                                                                 | `default`                         | -       |
| stopPropagation      | 是否阻止下拉框上的点击事件冒泡                                                                                                                                                                                     | boolean \| string                                                                            | true                              | -       |
| style                | 选择框的样式                                                                                                                                                                                                       | StyleValue                                                                                   | -                                 | -       |
| suffix               | 后缀标签                                                                                                                                                                                                           | VNodeChild                                                                                   | -                                 | -       |
| topSlot              | 顶部插槽                                                                                                                                                                                                           | VNodeChild                                                                                   | -                                 | -       |
| treeData             | 展示数据，具体属性参考 [CascaderData](#CascaderData)                                                                                                                                                               | CascaderData[]                                                                               | []                                | -       |
| treeNodeFilterProp   | 搜索时输入项过滤对应的 CascaderData 属性                                                                                                                                                                           | string                                                                                       | `label`                           | -       |
| triggerRender        | 自定义触发器渲染方法                                                                                                                                                                                               | (props: CascaderTriggerRenderProps) =&gt; VNodeChild                                         | -                                 | -       |
| validateStatus       | trigger 的校验状态，仅影响展示样式。可选: default、error、warning                                                                                                                                                  | CascaderValidateStatus                                                                       | `default`                         | -       |
| value                | （受控）选中的条目                                                                                                                                                                                                 | CascaderValue                                                                                | -                                 | -       |
| virtualizeInSearch   | 搜索列表虚拟化，用于大量树节点的情况，由 height, width, itemSize 组成                                                                                                                                              | CascaderVirtualize                                                                           | -                                 | -       |
| zIndex               | 下拉菜单的 zIndex                                                                                                                                                                                                  | number                                                                                       | 1030                              | -       |

### CascaderData

| 属性     | 说明               | 类型             | 默认值 |
| -------- | ------------------ | ---------------- | ------ |
| value    | 属性值（必填）     | string \| number | -      |
| label    | 展示的文本（必填） | VNodeChild       | -      |
| disabled | 不可选状态         | boolean          | -      |
| isLeaf   | 叶子节点           | boolean          | -      |
| loading  | 正在加载           | boolean          | -      |
| children | 子节点             | CascaderData[]   | -      |

## Methods

绑定在组件实例上的方法，可以通过 ref 调用实现某些特殊交互

| 方法                  | 说明                                                                                          | 版本    |
| --------------------- | --------------------------------------------------------------------------------------------- | ------- |
| close                 | 调用时可以手动关闭下拉列表                                                                    | v2.30.0 |
| open                  | 调用时可以手动展开下拉列表                                                                    | v2.30.0 |
| focus                 | 调用时可以手动聚焦                                                                            | v2.34.0 |
| blur                  | 调用时可以手动失焦                                                                            | v2.34.0 |
| search(value: string) | 手动触发搜索，需同时设置 filterTreeNode 开启搜索，searchPosition 为 `custom` 自定义展示搜素框 | v2.54.0 |

## Accessibility

### ARIA

- Cascader 支持传入 `aria-label`、`aria-describedby`、`aria-errormessage`、`aria-invalid`、`aria-labelledby`、`aria-required` 来表示该 Cascader 的相关信息;
- Cascader 支持通过按下 Enter 键来选中选项、清空选项、展开下拉框

## 文案规范

- 选择器选项
- 如果没有默认选项，就使用“Select”做占位文案
- 选项要按首字母顺序或者其他有逻辑的排列顺序，使用户更好地找到选项
- 使用语句书写规范（首字母大写，其余小写），避免在句尾使用逗号和分号
- 清晰表达出选项所表示的选择目的
