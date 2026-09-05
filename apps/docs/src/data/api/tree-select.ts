import type { ApiSection } from './types';

export const treeSelectApi = [
  {
    id: 'tree-select-props',
    kind: 'props',
    title: {
      'zh-CN': '属性',
      'en-US': 'Props',
    },
    items: [
      {
        name: 'ariaDescribedby',
        type: 'string',
        defaultValue: '—',
        description: {
          'zh-CN': '关联补充说明元素的 ID；模板使用 aria-describedby。',
          'en-US': 'ID of supplementary help text; use aria-describedby in templates.',
        },
      },
      {
        name: 'ariaErrormessage',
        type: 'string',
        defaultValue: '—',
        description: {
          'zh-CN': '关联错误消息元素的 ID；模板使用 aria-errormessage。',
          'en-US': 'ID of the error message; use aria-errormessage in templates.',
        },
      },
      {
        name: 'ariaInvalid',
        type: 'boolean',
        defaultValue: '—',
        description: {
          'zh-CN': '标记值无效；模板使用 aria-invalid。',
          'en-US': 'Marks the value as invalid; use aria-invalid in templates.',
        },
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "'TreeSelect'",
        description: {
          'zh-CN': '触发器的无障碍名称；模板使用 aria-label。',
          'en-US': 'Accessible trigger name; use aria-label in templates.',
        },
      },
      {
        name: 'ariaLabelledby',
        type: 'string',
        defaultValue: '—',
        description: {
          'zh-CN': '关联可见标签元素的 ID；模板使用 aria-labelledby。',
          'en-US': 'ID of a visible label; use aria-labelledby in templates.',
        },
      },
      {
        name: 'ariaRequired',
        type: 'boolean',
        defaultValue: '—',
        description: {
          'zh-CN': '标记必填；模板使用 aria-required。',
          'en-US': 'Marks the field as required; use aria-required in templates.',
        },
      },
      {
        name: 'arrowIcon',
        type: 'VNodeChild',
        defaultValue: 'IconChevronDown',
        description: {
          'zh-CN':
            '自定义右侧下拉箭头Icon，当showClear开关打开且当前有选中值时，hover会优先显示clear icon',
          'en-US':
            'Customize the right drop-down arrow Icon, when the showClear switch is turned on and there is currently a selected value, hover will give priority to the clear icon',
        },
      },
      {
        name: 'autoAdjustOverflow',
        type: 'boolean',
        defaultValue: 'true',
        description: {
          'zh-CN': '浮层被遮挡时是否自动调整方向（暂时仅支持竖直方向，且插入的父级为 body）',
          'en-US':
            'Whether the pop-up layer automatically adjusts the direction when it is obscured (only vertical direction is supported for the time being, and the inserted parent is body)',
        },
      },
      {
        name: 'autoExpandParent',
        type: 'boolean',
        defaultValue: 'false',
        description: {
          'zh-CN': '是否自动展开父节点',
          'en-US': 'Toggle whether to expand parent nodes automatically',
        },
      },
      {
        name: 'autoMergeValue',
        type: 'boolean',
        defaultValue: 'true',
        description: {
          'zh-CN':
            '设置自动合并 value。具体而言是，开启后，当某个父节点被选中时，value 将不包括该节点的子孙节点。（在leafOnly为false的情况下生效）。v2.61.0 后提供',
          'en-US':
            'Sets the automerge value. Specifically, when enabled, when a parent node is selected, the value will not include the descendants of the node. (Works if leafOnly is false)',
        },
      },
      {
        name: 'borderless',
        type: 'boolean',
        defaultValue: 'false',
        description: {
          'zh-CN': '无边框模式，v2.33.0后提供',
          'en-US': 'borderless mode >=2.33.0',
        },
      },
      {
        name: 'checkRelation',
        type: 'TreeCheckRelation',
        defaultValue: "'related'",
        description: {
          'zh-CN': "多选时，节点之间选中状态的关系，可选：'related'、'unRelated'。v2.5.0后提供",
          'en-US':
            "In multiple, the relationship between the checked states of the nodes, optional: 'related'、'unRelated'",
        },
      },
      {
        name: 'class',
        type: "HTMLAttributes['class']",
        defaultValue: '—',
        description: {
          'zh-CN': 'Vue 原生 class；附加到触发器。',
          'en-US': 'Native Vue class, applied to the trigger.',
        },
      },
      {
        name: 'className',
        type: "HTMLAttributes['class']",
        defaultValue: '—',
        description: {
          'zh-CN': '兼容的触发器 class 名称。',
          'en-US': 'Compatible trigger class name.',
        },
      },
      {
        name: 'clearIcon',
        type: 'VNodeChild',
        defaultValue: 'IconClear',
        description: {
          'zh-CN': '可用于自定义清除按钮, showClear为true时有效。v2.25.0后提供',
          'en-US': 'Can be used to customize the clear button, valid when showClear is true',
        },
      },
      {
        name: 'clickToHide',
        type: 'boolean',
        defaultValue: 'true',
        description: {
          'zh-CN': '选择后是否自动关闭下拉弹层，仅单选模式有效',
          'en-US':
            'Whether to close the drop-down layer automatically when selecting, only works in single-selection mode',
        },
      },
      {
        name: 'clickTriggerToHide',
        type: 'boolean',
        defaultValue: 'true',
        description: {
          'zh-CN': '面板打开状态下，点击 Trigger 后是否关闭面板。v2.32.0后提供',
          'en-US': 'When the panel is open, whether to close the panel after clicking the Trigger',
        },
      },
      {
        name: 'defaultExpandAll',
        type: 'boolean',
        defaultValue: 'false',
        description: {
          'zh-CN':
            '设置在初始化时是否展开所有节点。而如果后续数据(treeData)发生改变，这个 api 是无法影响节点的展开情况的，如果有这个需要可以使用 expandAll',
          'en-US':
            'Set whether to expand all nodes during initialization. And if the data (treeData) changes, this api cannot affect the expansion of the node. If you need this, you can use expandAll',
        },
      },
      {
        name: 'defaultExpandedKeys',
        type: 'string[]',
        defaultValue: '[]',
        description: {
          'zh-CN': '默认展开的节点，显示其直接子级',
          'en-US': 'Keys of default expanded nodes. Direct child nodes will be displayed.',
        },
      },
      {
        name: 'defaultOpen',
        type: 'boolean',
        defaultValue: 'false',
        description: {
          'zh-CN': '默认展开下拉菜单',
          'en-US': 'Toggle whether to open dropdown menu by default',
        },
      },
      {
        name: 'defaultValue',
        type: 'TreeValue',
        defaultValue: '—',
        description: {
          'zh-CN': '非受控初始值，仅初始化时使用。',
          'en-US': 'Initial uncontrolled selection, read on initialization.',
        },
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: {
          'zh-CN': '是否禁用，多选状态下支持',
          'en-US': 'Disabled, supported in multiple select mode',
        },
      },
      {
        name: 'disableStrictly',
        type: 'boolean',
        defaultValue: 'false',
        description: {
          'zh-CN': '是否严格禁用',
          'en-US': 'Disable Strictly',
        },
      },
      {
        name: 'dropdownClassName',
        type: "HTMLAttributes['class']",
        defaultValue: '—',
        description: {
          'zh-CN': '下拉菜单的 className 属性',
          'en-US': 'className property for dropDown',
        },
      },
      {
        name: 'dropdownMargin',
        type: 'PopoverMargin',
        defaultValue: '—',
        description: {
          'zh-CN':
            '下拉菜单计算溢出时的增加的冗余值，详见issue#549，作用同 Tooltip margin。v2.25.0后提供',
          'en-US':
            'Popup layer calculates the size of the safe area when the current direction overflows, used in scenes covered by fixed elements, more detail refer to issue#549, same as Tooltip margin',
        },
      },
      {
        name: 'dropdownMatchSelectWidth',
        type: 'boolean',
        defaultValue: 'true',
        description: {
          'zh-CN': '下拉菜单最小宽度是否等于Select',
          'en-US': 'Toggle if min-width of dropDown menu should be same as width of select box',
        },
      },
      {
        name: 'dropdownStyle',
        type: 'StyleValue',
        defaultValue: '—',
        description: {
          'zh-CN': '下拉菜单的样式',
          'en-US': 'Style for dropDown',
        },
      },
      {
        name: 'emptyContent',
        type: 'VNodeChild',
        defaultValue: 'Locale.Tree.emptyText',
        description: {
          'zh-CN': '无结果时的内容；优先使用 #empty 插槽，缺省采用 Locale 文案。',
          'en-US': 'Empty result content; #empty takes precedence. Falls back to the Locale text.',
        },
      },
      {
        name: 'expandAction',
        type: 'TreeExpandAction',
        defaultValue: 'false',
        description: {
          'zh-CN':
            "展开逻辑，可选 false, 'click', 'doubleClick'。默认值为 false，即仅当点击展开按钮时才会展开",
          'en-US':
            "Expand logic, one of false, 'click', 'doubleClick'. Default is set to false, which means item will not be expanded on clicking except on expand icon",
        },
      },
      {
        name: 'expandAll',
        type: 'boolean',
        defaultValue: 'false',
        description: {
          'zh-CN':
            '设置是否默认展开所有节点，若后续数据(treeData)发生改变，默认的展开情况也是会受到这个 api 影响的',
          'en-US':
            'Set whether to expand all nodes by default. If the data (treeData) changes, the default expansion will still be affected by this api',
        },
      },
      {
        name: 'expandedKeys',
        type: 'string[]',
        defaultValue: '—',
        description: {
          'zh-CN': '（受控）展开的节点，默认展开节点显示其直接子级',
          'en-US': '（Controlled）Keys of expanded nodes. Direct child nodes will be displayed.',
        },
      },
      {
        name: 'expandIcon',
        type: 'VNodeChild | ((props: TreeExpandIconSlotProps) => VNodeChild)',
        defaultValue: '—',
        description: {
          'zh-CN': '自定义展开图标，使用示例',
          'en-US': 'Custom expand icon, example',
        },
      },
      {
        name: 'filterTreeNode',
        type: 'boolean | ((inputValue: string, treeNodeString: string, data?: TreeNodeData) => boolean)',
        defaultValue: 'false',
        description: {
          'zh-CN':
            '是否根据输入项进行筛选，默认用 treeNodeFilterProp 的值作为要筛选的 TreeNodeData 的属性值, data 参数自 v2.28.0 开始提供',
          'en-US':
            'Toggle whether searchable or pass in a function to customize search behavior, data parameter provided since v2.28.0',
        },
      },
      {
        name: 'getPopupContainer',
        type: '() => HTMLElement',
        defaultValue: 'document.body',
        description: {
          'zh-CN': '浮层容器函数；容器应已挂载并设置 position: relative。',
          'en-US':
            'Returns the popup container; mount it before opening and set position: relative.',
        },
      },
      {
        name: 'insetLabel',
        type: 'VNodeChild',
        defaultValue: '—',
        description: {
          'zh-CN': '选择框内嵌标签。',
          'en-US': 'Label displayed inside the trigger.',
        },
      },
      {
        name: 'insetLabelId',
        type: 'string',
        defaultValue: '—',
        description: {
          'zh-CN': '内嵌标签的 ID，用于无障碍关联。',
          'en-US': 'ID of the inset label for accessible labelling.',
        },
      },
      {
        name: 'keyMaps',
        type: 'TreeKeyMaps',
        defaultValue: '—',
        description: {
          'zh-CN':
            '映射节点 key/label/value/children 等字段；搜索时同时设置 treeNodeFilterProp 或自定义 filterTreeNode。',
          'en-US':
            'Maps key/label/value/children fields; configure treeNodeFilterProp or a custom filterTreeNode when searching.',
        },
      },
      {
        name: 'labelEllipsis',
        type: 'boolean',
        defaultValue: 'virtualize ? true : false',
        description: {
          'zh-CN': '是否开启label的超出省略，默认虚拟化状态下开启',
          'en-US': 'Toggle whether to ellipsis label when overflow',
        },
      },
      {
        name: 'leafOnly',
        type: 'boolean',
        defaultValue: 'false',
        description: {
          'zh-CN': '多选模式下是否开启 change 回调入参及展示标签只有叶子节点',
          'en-US':
            'Toggle whether to display tags for leaf nodes only and for change callback params in multiple mode',
        },
      },
      {
        name: 'loadData',
        type: '(node?: TreeNodeData) => Promise<void>',
        defaultValue: '—',
        description: {
          'zh-CN': '展开未加载节点时调用；返回 Promise<void> 并更新 treeData。',
          'en-US':
            'Called when an unloaded node expands; return Promise<void> and update treeData.',
        },
      },
      {
        name: 'loadedKeys',
        type: 'string[]',
        defaultValue: '—',
        description: {
          'zh-CN': '受控的已加载节点 key 数组；load 事件返回的 Set 需转为数组回传。',
          'en-US':
            'Controlled array of loaded keys; convert the Set emitted by load to an array before passing it back.',
        },
      },
      {
        name: 'maxTagCount',
        type: 'number',
        defaultValue: '—',
        description: {
          'zh-CN': '最多显示多少个 tag',
          'en-US': 'Maximum number of tags displayed',
        },
      },
      {
        name: 'modelValue',
        type: 'TreeValue',
        defaultValue: '—',
        description: {
          'zh-CN': 'Vue v-model 受控值；同时传 value 时 modelValue 优先。',
          'en-US': 'Controlled v-model value; modelValue takes precedence over value.',
        },
      },
      {
        name: 'motion',
        type: 'boolean',
        defaultValue: 'true',
        description: {
          'zh-CN': '浮层进入与退出动效。',
          'en-US': 'Enables enter and exit motion for the popup.',
        },
      },
      {
        name: 'motionExpand',
        type: 'boolean',
        defaultValue: 'true',
        description: {
          'zh-CN': '是否开启选项树节点动画',
          'en-US': 'Toggle whether to turn on animation for expansion',
        },
      },
      {
        name: 'mouseEnterDelay',
        type: 'number',
        defaultValue: '—',
        description: {
          'zh-CN': '悬停触发时打开浮层的延迟，单位毫秒。',
          'en-US': 'Popup open delay in milliseconds for hover triggering.',
        },
      },
      {
        name: 'mouseLeaveDelay',
        type: 'number',
        defaultValue: '—',
        description: {
          'zh-CN': '悬停触发时关闭浮层的延迟，单位毫秒。',
          'en-US': 'Popup close delay in milliseconds for hover triggering.',
        },
      },
      {
        name: 'multiple',
        type: 'boolean',
        defaultValue: 'false',
        description: {
          'zh-CN': '是否支持多选',
          'en-US': 'Toggle whether in multi-choice mode',
        },
      },
      {
        name: 'onChangeWithObject',
        type: 'boolean',
        defaultValue: 'false',
        description: {
          'zh-CN': '启用后，change 接收 node 或 node[] 与事件；受控值也需使用含 value 的节点对象。',
          'en-US':
            'When enabled, change receives node or node[] and the event; controlled values must also be node objects with value.',
        },
      },
      {
        name: 'optionListStyle',
        type: 'CSSProperties',
        defaultValue: '—',
        description: {
          'zh-CN': 'optionList的样式',
          'en-US': 'Style for optionList',
        },
      },
      {
        name: 'outerBottomSlot',
        type: 'VNodeChild',
        defaultValue: '—',
        description: {
          'zh-CN': '浮层底部内容；推荐 #outerBottom 插槽。',
          'en-US': 'Content below the list; prefer #outerBottom.',
        },
      },
      {
        name: 'outerTopSlot',
        type: 'VNodeChild',
        defaultValue: '—',
        description: {
          'zh-CN': '浮层顶部内容；存在时替代下拉搜索框。推荐 #outerTop 插槽。',
          'en-US': 'Content above the list, replacing the dropdown search field. Prefer #outerTop.',
        },
      },
      {
        name: 'placeholder',
        type: 'string',
        defaultValue: '—',
        description: {
          'zh-CN': '选择框默认文字',
          'en-US': 'Placeholder for input box',
        },
      },
      {
        name: 'position',
        type: 'PopoverPosition',
        defaultValue: "'bottomLeft'",
        description: {
          'zh-CN': '下拉菜单位置，可选值参考 Tooltip position。v2.25.0后提供',
          'en-US': 'Pop-up position, optional values refer to Tooltip position',
        },
      },
      {
        name: 'prefix',
        type: 'VNodeChild',
        defaultValue: '—',
        description: {
          'zh-CN': '前缀标签',
          'en-US': 'Prefix',
        },
      },
      {
        name: 'preventScroll',
        type: 'boolean',
        defaultValue: '—',
        description: {
          'zh-CN': '指示浏览器是否应滚动文档以显示新聚焦的元素，作用于组件内的 focus 方法',
          'en-US':
            'Indicates whether the browser should scroll the document to display the newly focused element, acting on the focus method inside the component, excluding the component passed in by the user',
        },
      },
      {
        name: 'remote',
        type: 'boolean',
        defaultValue: 'false',
        description: {
          'zh-CN':
            '是否启用远程搜索。开启后，输入时跳过本地过滤，仅触发 search 回调，用户可自行处理远程数据获取并更新 treeData',
          'en-US':
            'Enable remote search. When enabled, local filtering is skipped on input, only search callback is triggered, allowing users to handle remote data fetching and update treeData',
        },
      },
      {
        name: 'renderFullLabel',
        type: '(props: TreeFullLabelSlotProps) => VNodeChild',
        defaultValue: '—',
        description: {
          'zh-CN': '完全自定义label的渲染函数，入参及用法详见',
          'en-US': 'Custom option render function, Detailed Params and Usage',
        },
      },
      {
        name: 'renderLabel',
        type: '(label?: VNodeChild, data?: TreeNodeData, searchWord?: string) => VNodeChild',
        defaultValue: '—',
        description: {
          'zh-CN': '自定义label的渲染函数，searchWord 参数自 2.65.0 开始支持。入参及用法详见',
          'en-US':
            'Custom label render function. The searchWord parameter is supported since 2.65.0',
        },
      },
      {
        name: 'renderSelectedItem',
        type: '( node: TreeNodeData, other?: { index: number; onClose(content?: VNodeChild, event?: MouseEvent): void }, ) => VNodeChild | { content: VNodeChild; isRenderInTag: boolean }',
        defaultValue: '—',
        description: {
          'zh-CN':
            '单选返回 VNodeChild；多选返回 { content, isRenderInTag }，或使用 #selectedItem。',
          'en-US':
            'Return VNodeChild for single selection or { content, isRenderInTag } for multiple selection; #selectedItem is also available.',
        },
      },
      {
        name: 'restTagsPopoverProps',
        type: 'PopoverProps',
        defaultValue: '{}',
        description: {
          'zh-CN':
            'Popover 的配置属性，可以控制 position、zIndex、trigger 等，具体参考Popover 。v2.22.0后提供',
          'en-US': 'The configuration properties of the Popover',
        },
      },
      {
        name: 'searchAutoFocus',
        type: 'boolean',
        defaultValue: 'false',
        description: {
          'zh-CN': '搜索框自动聚焦',
          'en-US': 'Whether autofocus for search box',
        },
      },
      {
        name: 'searchPlaceholder',
        type: 'string',
        defaultValue: '—',
        description: {
          'zh-CN': '搜索框默认文字',
          'en-US': 'Placeholder for search box',
        },
      },
      {
        name: 'searchPosition',
        type: 'TreeSelectSearchPosition',
        defaultValue: "'dropdown'",
        description: {
          'zh-CN': '设置搜索框的位置，可选: dropdown、trigger',
          'en-US': 'Set the position of the search box, one of: dropdown、trigger',
        },
      },
      {
        name: 'searchRender',
        type: '((props: TreeSelectSearchRenderProps) => VNodeChild) | boolean',
        defaultValue: '—',
        description: {
          'zh-CN': '自定义搜索框的函数；false 隐藏搜索框，也可使用 #search 插槽。',
          'en-US':
            'Function rendering the search field; false hides it. The #search slot is also supported.',
        },
      },
      {
        name: 'showClear',
        type: 'boolean',
        defaultValue: 'false',
        description: {
          'zh-CN': '当值不为空时，trigger 是否展示清除按钮',
          'en-US': 'When the value is not empty, whether the trigger displays the clear button',
        },
      },
      {
        name: 'showFilteredOnly',
        type: 'boolean',
        defaultValue: 'false',
        description: {
          'zh-CN': '搜索状态下是否只展示过滤后的结果',
          'en-US': 'Toggle whether to displayed filtered result only in search mode',
        },
      },
      {
        name: 'showLine',
        type: 'boolean',
        defaultValue: 'false',
        description: {
          'zh-CN': '选项面板中选项显示连接线。v2.50.0后提供',
          'en-US': 'The option in the options panel shows connecting lines',
        },
      },
      {
        name: 'showRestTagsPopover',
        type: 'boolean',
        defaultValue: 'false',
        description: {
          'zh-CN':
            '当超过 maxTagCount，hover 到 +N 时，是否通过 Popover 显示剩余内容。v2.22.0后提供',
          'en-US':
            'When the number of tags exceeds maxTagCount and hover reaches +N, whether to display the remaining content through Popover',
        },
      },
      {
        name: 'showSearchClear',
        type: 'boolean',
        defaultValue: 'true',
        description: {
          'zh-CN': '是否显示搜索框的清除按钮',
          'en-US': 'Toggle whether to support clear search box',
        },
      },
      {
        name: 'size',
        type: 'TreeSelectSize',
        defaultValue: "'default'",
        description: {
          'zh-CN': '选择框大小，可选 large，small，default',
          'en-US': 'Size for input box，one of large，small，default',
        },
      },
      {
        name: 'stopPropagation',
        type: 'boolean | string',
        defaultValue: 'true',
        description: {
          'zh-CN': '透传给 Popover 的事件传播配置。',
          'en-US': 'Event propagation configuration forwarded to Popover.',
        },
      },
      {
        name: 'style',
        type: 'StyleValue',
        defaultValue: '—',
        description: {
          'zh-CN': '选择框的样式',
          'en-US': 'Inline style',
        },
      },
      {
        name: 'suffix',
        type: 'VNodeChild',
        defaultValue: '—',
        description: {
          'zh-CN': '后缀标签',
          'en-US': 'Suffix',
        },
      },
      {
        name: 'treeData',
        type: 'TreeNodeData[]',
        defaultValue: '[]',
        description: {
          'zh-CN': '节点数组；key 在整个树中唯一。value 应全部省略或全部填写且唯一。',
          'en-US':
            'Nodes with keys unique across the tree. Either omit every value or supply unique values for all nodes.',
        },
      },
      {
        name: 'treeNodeFilterProp',
        type: 'string',
        defaultValue: "'label'",
        description: {
          'zh-CN': '搜索时输入项过滤对应的 TreeNodeData 属性',
          'en-US': 'Property in a TreeNodeData used to search',
        },
      },
      {
        name: 'treeNodeLabelProp',
        type: 'string',
        defaultValue: "'label'",
        description: {
          'zh-CN': '回填展示使用的节点字段，默认 label。',
          'en-US': 'Node field used for the selected label, label by default.',
        },
      },
      {
        name: 'triggerRender',
        type: '(props: TreeSelectTriggerRenderProps) => VNodeChild',
        defaultValue: '—',
        description: {
          'zh-CN': '自定义触发器渲染方法',
          'en-US': 'Method to create a custom trigger',
        },
      },
      {
        name: 'triggerTagWrap',
        type: 'boolean',
        defaultValue: 'false',
        description: {
          'zh-CN':
            '是否允许在 trigger 内将多选标签换行展示。仅在 multiple 且 filterTreeNode 开启、并且 searchPosition="trigger" 时生效',
          'en-US':
            'Whether to allow selected tags to wrap into multiple lines within the trigger. Only works when multiple and filterTreeNode are enabled, and searchPosition="trigger"',
        },
      },
      {
        name: 'validateStatus',
        type: 'TreeSelectValidateStatus',
        defaultValue: "'default'",
        description: {
          'zh-CN': '仅控制背景和边框的校验视觉，不执行数据校验。',
          'en-US': 'Controls validation styling only; it does not validate data.',
        },
      },
      {
        name: 'value',
        type: 'TreeValue',
        defaultValue: '—',
        description: {
          'zh-CN': '受控选择值；通过 change 或 update:value 回传。支持 v-model:value。',
          'en-US':
            'Controlled selection updated through change or update:value; supports v-model:value.',
        },
      },
      {
        name: 'virtualize',
        type: 'TreeVirtualize',
        defaultValue: '—',
        description: {
          'zh-CN':
            '列表虚拟化，用于大量树节点的情况，由 height, width, itemSize 组成，参考 Tree - Virtualize Object。开启后将关闭动画效果。',
          'en-US':
            'Efficiently rendering large lists, refer to Tree - VirtualizeObj. Motion is disabled when tree is rendered as virtualized list.',
        },
      },
      {
        name: 'zIndex',
        type: 'number',
        defaultValue: '1030',
        description: {
          'zh-CN': 'treeSelect下拉菜单的zIndex',
          'en-US': 'zIndex for treeSelect dropDown menu',
        },
      },
    ],
  },
  {
    id: 'tree-select-emits',
    kind: 'emits',
    title: {
      'zh-CN': '事件',
      'en-US': 'Emits',
    },
    items: [
      {
        name: 'blur',
        type: '[event: unknown]',
        description: {
          'zh-CN': '失焦事件。',
          'en-US': 'Emitted on blur.',
        },
      },
      {
        name: 'change',
        type: '[valueOrNode: unknown, nodeOrEvent?: unknown, event?: unknown]',
        description: {
          'zh-CN':
            '选择变化；默认参数为 (value, node, event)，onChangeWithObject 时为 (node, event)。',
          'en-US':
            'Selection changes: (value, node, event), or (node, event) when onChangeWithObject is enabled.',
        },
      },
      {
        name: 'clear',
        type: '[event: MouseEvent | KeyboardEvent]',
        description: {
          'zh-CN': '清空选择后触发。',
          'en-US': 'Emitted after clearing selection.',
        },
      },
      {
        name: 'expand',
        type: '[expandedKeys: string[], detail: TreeExpandDetail]',
        description: {
          'zh-CN': '展开键变化及 { expanded, node }。',
          'en-US': 'Expanded keys and { expanded, node }.',
        },
      },
      {
        name: 'focus',
        type: '[event: unknown]',
        description: {
          'zh-CN': '聚焦事件。',
          'en-US': 'Emitted on focus.',
        },
      },
      {
        name: 'load',
        type: '[loadedKeys: Set<string>, node?: TreeNodeData]',
        description: {
          'zh-CN': '加载结束，返回 Set<string> 与节点。',
          'en-US': 'Load completion with a Set<string> and the node.',
        },
      },
      {
        name: 'search',
        type: '[input: string, filteredExpandedKeys: string[], filteredNodes: TreeNodeData[]]',
        description: {
          'zh-CN': '搜索输入、因搜索/选择展开的 key 与命中节点；remote 模式由应用更新结果。',
          'en-US':
            'Search input, expanded keys and matched nodes; the application supplies results in remote mode.',
        },
      },
      {
        name: 'select',
        type: '[key: string, selected: boolean, node: TreeNodeData]',
        description: {
          'zh-CN': '选中 key、选中状态和节点；先于 change。',
          'en-US': 'Selected key, selection state and node; emitted before change.',
        },
      },
      {
        name: 'visibleChange',
        type: '[visible: boolean]',
        description: {
          'zh-CN': '浮层打开或关闭。',
          'en-US': 'Popup visibility changes.',
        },
      },
      {
        name: 'update:expandedKeys',
        type: '[expandedKeys: string[]]',
        description: {
          'zh-CN': '配合 v-model:expanded-keys 的展开状态回传。',
          'en-US': 'Expanded state for v-model:expanded-keys.',
        },
      },
      {
        name: 'update:modelValue',
        type: '[value: unknown]',
        description: {
          'zh-CN': '配合 v-model 的选择值回传。',
          'en-US': 'Selection value for v-model.',
        },
      },
      {
        name: 'update:value',
        type: '[value: unknown]',
        description: {
          'zh-CN': '配合 v-model:value 的选择值回传。',
          'en-US': 'Selection value for v-model:value.',
        },
      },
    ],
  },
  {
    id: 'tree-select-slots',
    kind: 'slots',
    title: {
      'zh-CN': '插槽',
      'en-US': 'Slots',
    },
    items: [
      {
        name: 'arrowIcon',
        type: '() => VNodeChild',
        description: {
          'zh-CN': '下拉箭头。',
          'en-US': 'Dropdown arrow.',
        },
      },
      {
        name: 'clearIcon',
        type: '() => VNodeChild',
        description: {
          'zh-CN': '清除按钮图标。',
          'en-US': 'Clear button icon.',
        },
      },
      {
        name: 'empty',
        type: '() => VNodeChild',
        description: {
          'zh-CN': '空结果或加载状态。',
          'en-US': 'Empty result or loading state.',
        },
      },
      {
        name: 'expandIcon',
        type: '(props: TreeExpandIconSlotProps) => VNodeChild',
        description: {
          'zh-CN': '节点展开按钮；透传 onClick 和 className。',
          'en-US': 'Node expansion control; forward onClick and className.',
        },
      },
      {
        name: 'fullLabel',
        type: '(props: TreeFullLabelSlotProps) => VNodeChild',
        description: {
          'zh-CN': '完全自定义节点行；保留传入的事件与样式。',
          'en-US': 'Entire node row; preserve the supplied events and styles.',
        },
      },
      {
        name: 'label',
        type: '(props: { label?: VNodeChild; node: TreeNodeData; searchWord?: string }) => VNodeChild',
        description: {
          'zh-CN': '节点标签，带节点和搜索词。',
          'en-US': 'Node label, with node and search term.',
        },
      },
      {
        name: 'outerBottom',
        type: '() => VNodeChild',
        description: {
          'zh-CN': '列表下方内容。',
          'en-US': 'Content below the options.',
        },
      },
      {
        name: 'outerTop',
        type: '() => VNodeChild',
        description: {
          'zh-CN': '列表上方内容，替换默认下拉搜索框。',
          'en-US': 'Content above the options, replacing the default dropdown search field.',
        },
      },
      {
        name: 'prefix',
        type: '() => VNodeChild',
        description: {
          'zh-CN': '触发器前缀。',
          'en-US': 'Trigger prefix.',
        },
      },
      {
        name: 'search',
        type: '(props: TreeSelectSearchRenderProps) => VNodeChild',
        description: {
          'zh-CN': '搜索框，透传 value/onChange。',
          'en-US': 'Search field; forward value/onChange.',
        },
      },
      {
        name: 'selectedItem',
        type: '(props: TreeSelectSelectedItemProps) => VNodeChild',
        description: {
          'zh-CN': '已选项自定义内容；多选时由插槽负责标签包装与 onClose。',
          'en-US':
            'Custom selected content; in multiple mode the slot owns tag wrapping and onClose.',
        },
      },
      {
        name: 'suffix',
        type: '() => VNodeChild',
        description: {
          'zh-CN': '触发器后缀。',
          'en-US': 'Trigger suffix.',
        },
      },
      {
        name: 'trigger',
        type: '(props: TreeSelectTriggerRenderProps) => VNodeChild',
        description: {
          'zh-CN': '自定义触发器；使用 value/inputValue/onSearch/onRemove 完成联动。',
          'en-US': 'Custom trigger wired through value/inputValue/onSearch/onRemove.',
        },
      },
    ],
  },
  {
    id: 'tree-select-methods',
    kind: 'methods',
    title: {
      'zh-CN': '实例方法',
      'en-US': 'Methods',
    },
    items: [
      {
        name: 'close',
        type: 'close(): void',
        description: {
          'zh-CN': '关闭浮层。',
          'en-US': 'Closes the popup.',
        },
      },
      {
        name: 'search',
        type: 'search(value: string): void',
        description: {
          'zh-CN': '从外部输入框触发搜索。',
          'en-US': 'Triggers search from an external input.',
        },
      },
    ],
  },
] satisfies ApiSection[];
