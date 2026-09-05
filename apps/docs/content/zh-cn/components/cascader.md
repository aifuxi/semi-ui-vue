---
title: '级联选择'
description: '用于选择多级分类下的某个选项。'
locale: 'zh-CN'
slug: 'cascader'
category: 'input'
order: 36
englishTitle: 'Cascader'
icon: 'doc-cascader'
upstream: 'input/cascader'
---

## 使用场景

与 TreeSelect 组件的区别:

- TreeSelect: 核心价值在于**目标节点**，层级结构是为了方便用户快速筛选出目标选项，最终的节点才是用户想要的内容，常见于文件/文件夹选择、组织架构、权限分配等场景。
- Cascader: 核心价值在于**路径**，用户选择的不是一个孤立的点，而是一条从根到叶的完整路径，常用于地理位置，商品分类等场景。

## 代码演示

### 如何引入

```ts
import { Cascader } from '@aifuxi/semi-ui-vue/cascader';
import '@aifuxi/semi-theme-default/cascader.css';
```

### 基本用法

最简单的用法，默认只可以选叶子节点。

::demo-block{demo="cascader/zh-cn/Basic" title="基本用法"}
::

### 多选

设置 `multiple`，可以进行多选。

::demo-block{demo="cascader/zh-cn/Multiple" title="多选"}
::

### 可搜索的

通过设置 `filterTreeNode` 属性可支持搜索功能。

默认对 `label` 值进行搜索（使用字符串的 includes 方法进行匹配，不区分大小写），可通过 `treeNodeFilterProp` 指定其他属性值进行搜索。
如 `label` 为 VNodeChild，可在 treeData 中使用其他字段存储纯文本，并通过 `treeNodeFilterProp` 指定该字段进行搜索。

默认搜索结果只会展示叶子结点的路径，想要显示更多的结果，可以设置 `filterLeafOnly` 为 `false`。

::demo-block{demo="cascader/zh-cn/Search" title="可搜索的"}
::

### 可搜索的多选

支持多选和搜索同时使用，在这种场景下，可以通过按下 BackSpace 键来删除对应的已选项目。

::demo-block{demo="cascader/zh-cn/SearchMultiple" title="可搜索的多选"}
::

可以使用 `filterSorter` 对筛选后的数据进行排序， `filterSorter` 于 v2.28.0 开始提供。

::demo-block{demo="cascader/zh-cn/SearchSort" title="可搜索的多选"}
::

如果想要自定义渲染搜索后的选项，可以使用 `filterRender` 实现整行的自定义渲染，`filterRender` 于 v2.28.0 开始提供，函数参数如下：

```ts
export interface CascaderFilterRenderProps {
  className: string;
  inputValue: string;
  disabled: boolean;
  data: CascaderData[];
  checkStatus: { checked: boolean; halfChecked: boolean };
  selected: boolean;
  onClick(event: MouseEvent | KeyboardEvent): void;
  onCheck(event: MouseEvent | KeyboardEvent): void;
  style?: CSSProperties;
}
```

使用示例如下

::demo-block{demo="cascader/zh-cn/SearchRender" title="可搜索的多选"}
::

如果搜索结果中存在大量 Option，可以通过设置 virtualizeInSearch 开启搜索结果面板的虚拟化来优化性能，virtualizeInSearch 自 v2.44.0 提供。virtualizeInSearch 是一个包含下列值的对象：

- height: Option 列表高度值
- width: Option 列表宽度值
- itemSize: 每行 Option 的高度

::demo-block{demo="cascader/zh-cn/VirtualSearch" title="可搜索的多选"}
::

### 限制标签展示数量

在多选的场景中，利用 maxTagCount 可以限制展示的标签数量，超出部分将以 +N 的方式展示。

使用 showRestTagsPopover 可以设置在超出 maxTagCount 后，hover +N 是否显示 Popover，默认为 false。并且，还可以在 restTagsPopoverProps 属性中配置 Popover。

::demo-block{demo="cascader/zh-cn/MaxTagCount" title="限制标签展示数量"}
::

### 限制选中数量

在多选的场景中，利用 max 可以限制多选选中的数量。超出 max 后将触发 @exceed 回调。

::demo-block{demo="cascader/zh-cn/Max" title="限制选中数量"}
::

### 选择即改变

在单选的情况下，还可以通过设置 `changeOnSelect`，允许选中父级选项。

::demo-block{demo="cascader/zh-cn/ChangeOnSelect" title="选择即改变"}
::

### 自定义显示

可以通过 `displayProp` 设置回填选项显示的属性值，默认为 `label`。

::demo-block{demo="cascader/zh-cn/DisplayProp" title="自定义显示"}
::

可以通过设置 `displayRender` 可以设定返回格式。

单选 (`multiple=false`) 时, `#display="{ selected }"`, 其中 labelPath 是由 label 构成的 path 数组。

多选 (`multiple=true`) 时, `#display="{ selected, index }"`, 其中 item 为节点的相关数据。

```ts
export interface CascaderEntity extends Record<string, unknown> {
  _notExist?: boolean;
  children?: CascaderEntity[];
  data: CascaderData;
  ind: number;
  key: string;
  level: number;
  parent?: CascaderEntity;
  parentKey?: string | null;
  path: string[];
  pos: string;
  valuePath: Array<string | number>;
}
```

::demo-block{demo="cascader/zh-cn/DisplayRender" title="自定义显示"}
::

### 自定义分隔符

版本: >=2.2.0

可以使用 `separator` 设置分隔符, 包括：搜索时显示在下拉框的内容以及单选时回显到 Trigger 的内容的分隔符。

::demo-block{demo="cascader/zh-cn/Separator" title="自定义分隔符"}
::

### 禁用

::demo-block{demo="cascader/zh-cn/Disabled" title="禁用"}
::

### 严格禁用

可以使用 disableStrictly 来开启严格禁用。开启严格禁用后，当节点是 disabled 的时候，则不能通过子级或者父级的关系改变选中状态。

以下面的 demo 为例，节点"宁波"开启了严格禁用，因此，当我们改变其父节点"浙江省"的选中状态时，也不会影响到节点"宁波"的选中状态。

::demo-block{demo="cascader/zh-cn/DisableStrictly" title="严格禁用"}
::

### 展示子菜单的时机

可以使用 `showNext` 设置展开 Dropdown 子菜单的触发时机，可选: `click`（默认）、`hover`。

::demo-block{demo="cascader/zh-cn/Hover" title="展示子菜单的时机"}
::

### 点击选中

在多选模式下，默认情况下点击非叶子节点不会触发选中。你可以通过 `clickToSelect` 开启点击任意节点即选中的功能。

这个 API 在配合 `showNext="hover"` 使用时特别有用：鼠标悬浮展开子菜单，点击则选中当前节点。

::demo-block{demo="cascader/zh-cn/ClickToSelect" title="点击选中"}
::

### 在顶部/底部渲染附加项

我们在级联选择器的顶部、底部分别预留了插槽，你可以通过 `topSlot` 或 `bottomSlot` 来设置。

::demo-block{demo="cascader/zh-cn/BottomSlot" title="在顶部/底部渲染附加项"}
::

### 受控

传入 `value` 时即为受控组件，可以配合 `@change` 使用。

::demo-block{demo="cascader/zh-cn/Controlled" title="受控"}
::

### 自动合并 value

在多选（multiple=true）场景中，当我们选中祖先节点时，如果希望 value 不包含它对应的子孙节点，则可以通过 `autoMergeValue` 来设置，默认为 true。当 autoMergeValue 和 leafOnly 同时开启时，后者优先级更高。

::demo-block{demo="cascader/zh-cn/AutoMerge" title="自动合并 value"}
::

### 仅叶子节点

版本: >=2.2.0

在多选时，可以通过开启 leafOnly 来设置 value 只包含叶子节点，即显示的 Tag 和 @change 的参数 value 只包含 value。

::demo-block{demo="cascader/zh-cn/LeafOnly" title="仅叶子节点"}
::

### 节点选中关系

版本：>= 2.71.0

多选时，可以使用 `checkRelation` 来设置节点之间选中关系的类型，可选：'related'（默认）、'unRelated'。当选中关系为 'unRelated' 时，意味着节点之间的选中互不影响。

::demo-block{demo="cascader/zh-cn/CheckRelation" title="节点选中关系"}
::

### 动态更新数据

::demo-block{demo="cascader/zh-cn/DynamicData" title="动态更新数据"}
::

### 异步加载数据

可以使用 loadData 实现异步加载数据

**不能与搜索同时使用**

::demo-block{demo="cascader/zh-cn/LoadData" title="异步加载数据"}
::

### 远程搜索

**v>=2.97.0** 起 Cascader 支持远程搜索。设置 `remote` 后，搜索输入不再走本地匹配，而是仅触发 `@search` 回调，由你根据输入异步拉取 `treeData`。这与 Select 的 `remote` 行为一致。

> 搜索时建议自行处理以下几点：
>
> - **防抖（debounce）**：避免每次按键都打请求，常见做法是用 `lodash.debounce` 包裹搜索逻辑（如 200~300ms）。
> - **竞态保护**：用一个递增 token 或 `AbortController` 丢弃过期请求结果，避免后发先到时旧响应覆盖新响应。
> - **loading 提示**：在请求期间通过外层 `Spin` 或简单的提示元素告知用户「加载中」，否则用户会看到「暂无数据」误以为无结果。
> - **初始 / 空输入处理**：输入被清空时把 `treeData` 还原为初始数据，避免空查询拉数据。

::demo-block{demo="cascader/zh-cn/Remote" title="远程搜索"}
::

### 超长列表

当你的数据结构层级特别深时，Cascader下拉菜单可能会超出屏幕，此时我们建议为下拉菜单设置 overflow-x: auto 以及一个合适的 width 宽度（ 建议以N+0.5列的宽度为准，最右侧显示半列，以给用户一种右侧尚有待展开项，可以水平方向滚动的视觉暗示）

::demo-block{demo="cascader/zh-cn/LongList" title="超长列表"}
::

```css
.components-cascader-demo {
  .semi-cascader-option-lists {
    max-width: 510px;
    overflow-x: auto;
  }
}
```

### 自定义 Trigger

如果默认的触发器样式满足不了你的需求，可以用`#trigger`自定义选择框的展示

#trigger 入参如下

```ts
export interface CascaderTriggerRenderProps {
  componentProps: CascaderProps;
  disabled: boolean;
  value?: string | Set<string>;
  inputValue: string;
  placeholder?: string;
  onSearch(inputValue: string): void;
  /** @deprecated Use onSearch. */
  onChange(inputValue: string): void;
  onClear(event?: MouseEvent | KeyboardEvent): void;
  onRemove(position: string): void;
}
```

::demo-block{demo="cascader/zh-cn/Trigger" title="自定义 Trigger"}
::

## API 参考

### CascaderProps

| 属性                   | 类型                                                                                        | 默认值       | 说明                                                                                                                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ariaDescribedby`      | `string`                                                                                    | `—`          | 关联描述节点 id。                                                                                                                                                                                             |
| `ariaErrormessage`     | `string`                                                                                    | `—`          | 关联错误信息节点 id。                                                                                                                                                                                         |
| `ariaInvalid`          | `boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling'`                                   | `—`          | ARIA 无效状态。                                                                                                                                                                                               |
| `ariaLabel`            | `string`                                                                                    | `'Cascader'` | 无障碍名称，模板使用 aria-label。                                                                                                                                                                             |
| `ariaLabelledby`       | `string`                                                                                    | `—`          | 关联标签节点 id；模板写为 aria-labelledby。                                                                                                                                                                   |
| `ariaRequired`         | `boolean \| 'false' \| 'true'`                                                              | `—`          | ARIA 必填状态。                                                                                                                                                                                               |
| `arrowIcon`            | `VNodeChild`                                                                                | `—`          | 自定义右侧下拉箭头 Icon，当 showClear 开关打开且当前有选中值时，hover 会优先显示 clear icon                                                                                                                   |
| `autoAdjustOverflow`   | `boolean`                                                                                   | `true`       | 是否自动调整下拉框展开方向，用于边缘遮挡时自动调整展开方向                                                                                                                                                    |
| `autoClearSearchValue` | `boolean`                                                                                   | `true`       | 选中后清空搜索文本。                                                                                                                                                                                          |
| `autoMergeValue`       | `boolean`                                                                                   | `true`       | 设置自动合并 value。具体而言是，开启后，当某个父节点被选中时，value 将不包括该节点的子孙节点。不支持动态切换                                                                                                  |
| `borderless`           | `boolean`                                                                                   | `false`      | 无边框模式                                                                                                                                                                                                    |
| `bottomSlot`           | `VNodeChild`                                                                                | `—`          | 底部插槽                                                                                                                                                                                                      |
| `changeOnSelect`       | `boolean`                                                                                   | `false`      | 是否允许选择非叶子节点                                                                                                                                                                                        |
| `checkRelation`        | `CascaderCheckRelation`                                                                     | `'related'`  | 多选时，节点之间选中状态的关系，可选：'related'、'unRelated'。                                                                                                                                                |
| `class`                | `HTMLAttributes['class']`                                                                   | `—`          | Vue 类名。                                                                                                                                                                                                    |
| `className`            | `HTMLAttributes['class']`                                                                   | `—`          | 选择框的 className 属性                                                                                                                                                                                       |
| `clearIcon`            | `VNodeChild`                                                                                | `—`          | 可用于自定义清除按钮, showClear为true时有效                                                                                                                                                                   |
| `clickToSelect`        | `boolean`                                                                                   | `false`      | 多选时，点击任意节点即可触发选中，常配合 showNext="hover" 使用，悬浮展开子菜单，点击选中当前节点                                                                                                              |
| `defaultOpen`          | `boolean`                                                                                   | `false`      | 设置是否默认打开下拉菜单                                                                                                                                                                                      |
| `defaultValue`         | `CascaderValue`                                                                             | `—`          | 指定默认选中的条目                                                                                                                                                                                            |
| `disabled`             | `boolean`                                                                                   | `false`      | 不可选状态                                                                                                                                                                                                    |
| `disableStrictly`      | `boolean`                                                                                   | `false`      | 设置是否开启严格禁用。开启后，当节点是 disabled 的时候，则不能通过子级或者父级的关系改变选中状态                                                                                                              |
| `displayProp`          | `string`                                                                                    | `'label'`    | 设置回填选项显示的属性值                                                                                                                                                                                      |
| `displayRender`        | `(selected: VNodeChild[] \| CascaderEntity, index?: number) => VNodeChild`                  | `—`          | 自定义选中内容，单选参数是显示值数组，多选参数是 CascaderEntity；也可用 display 插槽。                                                                                                                        |
| `dropdownClassName`    | `HTMLAttributes['class']`                                                                   | `—`          | 下拉菜单的 className 属性                                                                                                                                                                                     |
| `dropdownMargin`       | `PopoverMargin`                                                                             | `—`          | 下拉菜单计算溢出时的增加的冗余值，详见[issue#549](https://github.com/DouyinFE/semi-design/issues/549)，作用同 Tooltip margin                                                                                  |
| `dropdownStyle`        | `StyleValue`                                                                                | `—`          | 下拉菜单的样式                                                                                                                                                                                                |
| `emptyContent`         | `VNodeChild`                                                                                | `—`          | 当搜索无结果时展示的内容                                                                                                                                                                                      |
| `enableLeafClick`      | `boolean`                                                                                   | `false`      | 多选时，是否启动点击叶子节点选项触发勾选                                                                                                                                                                      |
| `expandIcon`           | `VNodeChild`                                                                                | `—`          | 自定义展开 icon                                                                                                                                                                                               |
| `filterLeafOnly`       | `boolean`                                                                                   | `true`       | 搜索结果是否只展示叶子结点路径                                                                                                                                                                                |
| `filterRender`         | `(props: CascaderFilterRenderProps) => VNodeChild`                                          | `—`          | 自定义搜索结果，使用 filter 插槽更便于编写模板。                                                                                                                                                              |
| `filterSorter`         | `(first: CascaderData[], second: CascaderData[], inputValue: string) => number`             | `—`          | 对匹配路径排序，接收两个 CascaderData[] 路径及输入文本。                                                                                                                                                      |
| `filterTreeNode`       | `boolean \| ((inputValue: string, treeNodeString: string, data?: CascaderData) => boolean)` | `false`      | 设置筛选，默认用 treeNodeFilterProp 的值作为要筛选的 TreeNode 的属性值， data 参数自 v2.28.0 开始提供                                                                                                         |
| `getPopupContainer`    | `() => HTMLElement`                                                                         | `—`          | 指定父级 DOM，下拉框将会渲染至该 DOM 中，自定义需要设置 position: relative 这会改变浮层 DOM 树位置，但不会改变视图渲染位置。                                                                                  |
| `id`                   | `string`                                                                                    | `—`          | 组件节点 id。                                                                                                                                                                                                 |
| `insetLabel`           | `VNodeChild`                                                                                | `—`          | 内嵌标签，支持 insetLabel 插槽。                                                                                                                                                                              |
| `insetLabelId`         | `string`                                                                                    | `—`          | 内嵌标签节点 id。                                                                                                                                                                                             |
| `keyMaps`              | `CascaderKeyMaps`                                                                           | `({})`       | 自定义节点中 value、label、children、disabled、isLeaf 的字段                                                                                                                                                  |
| `leafOnly`             | `boolean`                                                                                   | `false`      | 多选时设置 value 只包含叶子节点，即显示的 Tag 和 @change 的 value 参数只包含叶子节点。不支持动态切换                                                                                                          |
| `loadData`             | `(selectOptions: CascaderData[]) => Promise<void>`                                          | `—`          | 异步加载数据，需要返回一个Promise                                                                                                                                                                             |
| `loadedKeys`           | `string[]`                                                                                  | `—`          | 已经完成异步加载的节点 key 列表。                                                                                                                                                                             |
| `max`                  | `number`                                                                                    | `—`          | 多选时，限制多选选中的数量，超出 max 后将触发 @exceed 回调                                                                                                                                                    |
| `maxTagCount`          | `number`                                                                                    | `—`          | 多选时，标签的最大展示数量，超出后将以 +N 形式展示                                                                                                                                                            |
| `modelValue`           | `CascaderValue`                                                                             | `—`          | v-model 的受控值。                                                                                                                                                                                            |
| `motion`               | `boolean`                                                                                   | `true`       | 设置下拉框弹出的动画                                                                                                                                                                                          |
| `mouseEnterDelay`      | `number`                                                                                    | `—`          | 鼠标移入后，延迟显示下拉框的时间，单位毫秒                                                                                                                                                                    |
| `mouseLeaveDelay`      | `number`                                                                                    | `—`          | 鼠标移出后，延迟消失下拉框的时间，单位毫秒                                                                                                                                                                    |
| `multiple`             | `boolean`                                                                                   | `false`      | 设置多选                                                                                                                                                                                                      |
| `onChangeWithObject`   | `boolean`                                                                                   | `false`      | 是否将选中项 option 的其他属性作为回调。设为 true 时，@change 的入参类型会从 string/number 变为 TreeNode。此时如果是受控，也需要把 value 设置成 CascaderData 类型，且必须含有 value 的键值，defaultValue 同理 |
| `placeholder`          | `string`                                                                                    | `—`          | 选择框默认文字                                                                                                                                                                                                |
| `position`             | `PopoverPosition`                                                                           | `—`          | 方向，可选值：`top`,`topLeft`,`topRight`,`left`,`leftTop`,`leftBottom`,`right`,`rightTop`,`rightBottom`,`bottom`,`bottomLeft`,`bottomRight`                                                                   |
| `prefix`               | `VNodeChild`                                                                                | `—`          | 前缀标签                                                                                                                                                                                                      |
| `preventScroll`        | `boolean`                                                                                   | `—`          | 指示浏览器是否应滚动文档以显示新聚焦的元素，作用于组件内的 focus 方法                                                                                                                                         |
| `remote`               | `boolean`                                                                                   | `false`      | 是否开启远程搜索。开启后，搜索输入时不再做本地过滤，仅触发 `@search` 回调，由用户根据输入异步更新 `treeData` 来展示远程搜索结果，行为与 Select 的 remote 一致                                                 |
| `restTagsPopoverProps` | `PopoverProps`                                                                              | `({})`       | 剩余标签提示配置，以当前公开类型为准。Select 使用 Partial。                                                                                                                                                   |
| `searchPlaceholder`    | `string`                                                                                    | `—`          | 搜索框默认文字                                                                                                                                                                                                |
| `searchPosition`       | `CascaderSearchPosition`                                                                    | `'trigger'`  | 设置搜索框的位置，可选: `trigger`、`custom`                                                                                                                                                                   |
| `separator`            | `string`                                                                                    | `' / '`      | 自定义分隔符，包括：搜索时显示在下拉框的内容以及单选时回显到 Trigger 的内容的分隔符                                                                                                                           |
| `showClear`            | `boolean`                                                                                   | `false`      | 是否展示清除按钮                                                                                                                                                                                              |
| `showNext`             | `CascaderShowNext`                                                                          | `'click'`    | 设置展开 Dropdown 子菜单的方式，可选: `click`、`hover`                                                                                                                                                        |
| `showRestTagsPopover`  | `boolean`                                                                                   | `false`      | 当超过 maxTagCount，hover 到 +N 时，是否通过 Popover 显示剩余内容                                                                                                                                             |
| `size`                 | `CascaderSize`                                                                              | `'default'`  | 选择框大小，可选 `large`，`small`，`default`                                                                                                                                                                  |
| `stopPropagation`      | `boolean \| string`                                                                         | `true`       | 是否阻止下拉框上的点击事件冒泡                                                                                                                                                                                |
| `style`                | `StyleValue`                                                                                | `—`          | 选择框的样式                                                                                                                                                                                                  |
| `suffix`               | `VNodeChild`                                                                                | `—`          | 后缀标签                                                                                                                                                                                                      |
| `topSlot`              | `VNodeChild`                                                                                | `—`          | 顶部插槽                                                                                                                                                                                                      |
| `treeData`             | `CascaderData[]`                                                                            | `[]`         | 展示数据，具体属性参考 [CascaderData](#CascaderData)                                                                                                                                                          |
| `treeNodeFilterProp`   | `string`                                                                                    | `'label'`    | 搜索时输入项过滤对应的 CascaderData 属性                                                                                                                                                                      |
| `triggerRender`        | `(props: CascaderTriggerRenderProps) => VNodeChild`                                         | `—`          | 自定义触发器；推荐 trigger 作用域插槽。                                                                                                                                                                       |
| `validateStatus`       | `CascaderValidateStatus`                                                                    | `'default'`  | trigger 的校验状态，仅影响展示样式。可选: default、error、warning                                                                                                                                             |
| `value`                | `CascaderValue`                                                                             | `—`          | 属性值（必填）                                                                                                                                                                                                |
| `virtualizeInSearch`   | `CascaderVirtualize`                                                                        | `—`          | 搜索列表虚拟化，用于大量树节点的情况，由 height, width, itemSize 组成                                                                                                                                         |
| `zIndex`               | `number`                                                                                    | `1030`       | 下拉菜单的 zIndex                                                                                                                                                                                             |

### CascaderData

| 属性       | 类型               | 默认值 | 说明               |
| ---------- | ------------------ | ------ | ------------------ |
| `value`    | `string \| number` | `—`    | 属性值（必填）     |
| `label`    | `VNodeChild`       | `—`    | 展示的文本（必填） |
| `disabled` | `boolean`          | `—`    | 不可选状态         |
| `isLeaf`   | `boolean`          | `—`    | 叶子节点           |
| `loading`  | `boolean`          | `—`    | 正在加载           |
| `children` | `CascaderData[]`   | `—`    | 子节点             |

### CascaderKeyMaps

| 属性       | 类型     | 默认值 | 说明               |
| ---------- | -------- | ------ | ------------------ |
| `value`    | `string` | `—`    | 属性值（必填）     |
| `label`    | `string` | `—`    | 展示的文本（必填） |
| `disabled` | `string` | `—`    | 不可选状态         |
| `children` | `string` | `—`    | 子节点             |
| `isLeaf`   | `string` | `—`    | 叶子节点           |

### CascaderVirtualize

| 属性       | 类型               | 默认值 | 说明                      |
| ---------- | ------------------ | ------ | ------------------------- |
| `itemSize` | `number`           | `—`    | 每项的固定高度，单位 px。 |
| `height`   | `number \| string` | `—`    | 虚拟列表高度。            |
| `width`    | `number \| string` | `—`    | 虚拟列表宽度。            |

### 事件

| 事件                | 参数                                                   |
| ------------------- | ------------------------------------------------------ |
| `blur`              | `[event: unknown]`                                     |
| `change`            | `[value: CascaderValue]`                               |
| `clear`             | `[]`                                                   |
| `exceed`            | `[checkedItems: CascaderEntity[]]`                     |
| `focus`             | `[event: unknown]`                                     |
| `listScroll`        | `[event: Event, panel: CascaderScrollPanelProps]`      |
| `load`              | `[loadedKeys: Set<string>, data: CascaderData]`        |
| `search`            | `[value: string]`                                      |
| `select`            | `[value: string \| number \| Array<string \| number>]` |
| `visibleChange`     | `[visible: boolean]`                                   |
| `update:modelValue` | `[value: CascaderValue]`                               |
| `update:value`      | `[value: CascaderValue]`                               |

模板中使用 `@dropdown-visible-change`（AutoComplete/Select）或 `@visible-change`（Cascader），其他 camelCase 事件同样转为 kebab-case。`onChangeWithObject` 是 Boolean prop，不是事件。

### 插槽

| 插槽          | 签名                                                                                  |
| ------------- | ------------------------------------------------------------------------------------- |
| `#arrowIcon`  | `() => VNodeChild`                                                                    |
| `#bottom`     | `() => VNodeChild`                                                                    |
| `#clearIcon`  | `() => VNodeChild`                                                                    |
| `#display`    | `(props: { selected: VNodeChild[] \| CascaderEntity; index?: number }) => VNodeChild` |
| `#empty`      | `() => VNodeChild`                                                                    |
| `#expandIcon` | `() => VNodeChild`                                                                    |
| `#filter`     | `(props: CascaderFilterRenderProps) => VNodeChild`                                    |
| `#prefix`     | `() => VNodeChild`                                                                    |
| `#suffix`     | `() => VNodeChild`                                                                    |
| `#top`        | `() => VNodeChild`                                                                    |
| `#trigger`    | `(props: CascaderTriggerRenderProps) => VNodeChild`                                   |

### 相关类型

```ts
export type CascaderSimpleValue = string | number | CascaderData;
export type CascaderValue = CascaderSimpleValue | CascaderSimpleValue[] | CascaderSimpleValue[][];
export interface CascaderEntity extends Record<string, unknown> {
  _notExist?: boolean;
  children?: CascaderEntity[];
  data: CascaderData;
  ind: number;
  key: string;
  level: number;
  parent?: CascaderEntity;
  parentKey?: string | null;
  path: string[];
  pos: string;
  valuePath: Array<string | number>;
}
export interface CascaderFilterRenderProps {
  className: string;
  inputValue: string;
  disabled: boolean;
  data: CascaderData[];
  checkStatus: { checked: boolean; halfChecked: boolean };
  selected: boolean;
  onClick(event: MouseEvent | KeyboardEvent): void;
  onCheck(event: MouseEvent | KeyboardEvent): void;
  style?: CSSProperties;
}
export interface CascaderTriggerRenderProps {
  componentProps: CascaderProps;
  disabled: boolean;
  value?: string | Set<string>;
  inputValue: string;
  placeholder?: string;
  onSearch(inputValue: string): void;
  /** @deprecated Use onSearch. */
  onChange(inputValue: string): void;
  onClear(event?: MouseEvent | KeyboardEvent): void;
  onRemove(position: string): void;
}
export interface CascaderScrollPanelProps {
  panelIndex: number;
  activeNode: CascaderData | null;
}
export type CascaderSize = 'small' | 'default' | 'large';
export type CascaderValidateStatus = 'success' | 'default' | 'error' | 'warning';
export type CascaderShowNext = 'click' | 'hover';
export type CascaderSearchPosition = 'trigger' | 'custom';
export type CascaderCheckRelation = 'related' | 'unRelated';
```

## Methods

使用模板 ref 获取组件实例，调用公开方法。

```ts
export interface CascaderExposed {
  open(): void;
  close(): void;
  focus(): void;
  blur(): void;
  search(value: string): void;
}
```

## Accessibility

### ARIA

- Cascader 支持传入 `aria-label`、`aria-describedby`、`aria-errormessage`、`aria-invalid`、`aria-labelledby`、`aria-required` 来表示该 Cascader 的相关信息;
- Cascader 支持通过按下 Enter 键来选中选项、清空选项、展开下拉框

### 键盘和焦点

使用 Tab / Shift + Tab 移动焦点，Enter 打开面板、选择或清空；Escape 关闭面板。自定义 filter/trigger 插槽要保留槽参数提供的操作回调和可访问名称。

## 文案规范

- 选择器选项
  - 如果没有默认选项，就使用“Select”做占位文案
  - 选项要按首字母顺序或者其他有逻辑的排列顺序，使用户更好地找到选项
  - 使用语句书写规范（首字母大写，其余小写），避免在句尾使用逗号和分号
  - 清晰表达出选项所表示的选择目的

## 设计变量

::token-table{component="cascader"}
::

## React → Vue 迁移

| React                                              | Vue                                                                        |
| -------------------------------------------------- | -------------------------------------------------------------------------- |
| `@douyinfe/semi-ui`                                | `@aifuxi/semi-ui-vue/cascader` + `@aifuxi/semi-theme-default/cascader.css` |
| `useState` / `useMemo` / `useCallback`             | `shallowRef` / `computed` / 局部函数                                       |
| `value` + `onChange`                               | `v-model` / `v-model:value` / `:value` + `@change`                         |
| `className` / `ReactNode`                          | Vue `class` / `VNodeChild` 与插槽                                          |
| `ref.current`                                      | 模板 ref 的公开方法                                                        |
| `filterRender` / `displayRender` / `triggerRender` | `#filter` / `#display` / `#trigger` 或公开 VNode 返回函数                  |
| `bottomSlot` / `topSlot`                           | `#bottom` / `#top`                                                         |
| `onDropdownVisibleChange`                          | `@visible-change`                                                          |
| `loadData`                                         | `(selected: CascaderData[]) => Promise<void>`                              |

异步与动态数据示例使用固定序列、固定延迟和请求序号，并在卸载时清理定时器；不发出真实网络请求。

## FAQ

### value 的数组结构如何选择？

单选路径使用一维数组；多选多个路径使用二维数组。onChangeWithObject 返回节点对象；autoMergeValue、leafOnly、checkRelation 决定多选结果保留哪些节点。

### loadData 与远程搜索有什么区别？

loadData 返回 Promise<void> 并在展开节点时补充 children；叶子节点标记 isLeaf。remote 搜索由 search 事件驱动，外部替换 treeData，不在当前树上执行本地筛选。

### 自定义 Trigger 中 value 是业务值吗？

不是。trigger 插槽 value 是节点位置字符串或其 Set；onRemove 接受位置字符串。业务受控值仍通过 v-model 使用 CascaderValue。
