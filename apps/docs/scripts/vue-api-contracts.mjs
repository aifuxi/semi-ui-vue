/**
 * 已完成人工核对的 Vue API 契约。
 *
 * 上游表格继续承载属性说明、默认值与版本信息；这里仅声明需要从 React 语义中
 * 分离出的 emits / slots / v-model，以及少量正文措辞。每条契约都指向公开类型来源，
 * 不根据上游 onXxx 名称做全局猜测。
 */

const event = (name, parameters, description) => ({ name, parameters, description });
const slot = (name, scope, description) => ({ name, scope, description });

export const vueTypeRewrites = [
  ['React.ReactNode', 'VNodeChild'],
  ['ReactNode', 'VNodeChild'],
  ['React.CSSProperties', 'StyleValue'],
  ['CSSProperties', 'StyleValue'],
  ['React.MouseEvent', 'MouseEvent'],
  ['React.KeyboardEvent', 'KeyboardEvent'],
  ['React.FocusEvent', 'FocusEvent'],
  ['ReactEvent', 'Event'],
  ['ReactElement', 'VNodeChild'],
  ['JSX.Element', 'VNodeChild'],
];

export const vueApiContracts = new Map([
  [
    '/zh-CN/basic/button',
    {
      sources: ['packages/ui/src/button/types.ts'],
      propSections: [
        {
          heading: 'Button',
          level: 3,
          source: 'packages/ui/src/button/types.ts',
          interfaces: ['ButtonProps'],
          aliases: { contentClass: 'contentClassName' },
        },
        {
          heading: 'ButtonGroup',
          level: 3,
          source: 'packages/ui/src/button/types.ts',
          interfaces: ['ButtonGroupProps'],
        },
        {
          heading: 'SplitButtonGroup **V1.12.0新增**',
          level: 3,
          source: 'packages/ui/src/button/types.ts',
          interfaces: ['SplitButtonGroupProps'],
        },
      ],
      eventSections: [
        {
          heading: 'Button',
          level: 3,
          rows: ['onClick', 'onMouseDown', 'onMouseEnter', 'onMouseLeave'],
        },
      ],
      eventGroups: [
        {
          name: 'Button 原生事件',
          items: [
            event('click', '[event: MouseEvent]', '点击原生 button 时触发'),
            event('mousedown', '[event: MouseEvent]', '按下鼠标按钮时触发'),
            event('mouseenter', '[event: MouseEvent]', '指针进入按钮时触发'),
            event('mouseleave', '[event: MouseEvent]', '指针离开按钮时触发'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Button',
          items: [
            slot('default', '{}', '按钮内容'),
            slot('icon', '{ fill, iconSize, iconStyle }', '自定义图标'),
          ],
        },
      ],
    },
  ],
  [
    '/zh-CN/input/input',
    {
      sources: ['packages/ui/src/input/types.ts'],
      propSections: [
        {
          heading: 'Input',
          level: 3,
          source: 'packages/ui/src/input/types.ts',
          interfaces: ['InputProps'],
        },
        {
          heading: 'TextArea',
          level: 3,
          source: 'packages/ui/src/input/types.ts',
          interfaces: ['TextAreaProps'],
        },
        {
          heading: 'InputGroup',
          level: 3,
          source: 'packages/ui/src/input/types.ts',
          interfaces: ['InputGroupProps'],
        },
      ],
      models: ['Input / TextArea：`v-model` 对应 `modelValue`；同时保留 `value` 兼容入口。'],
      eventSections: [
        {
          heading: 'Input',
          level: 3,
          rows: [
            'onBlur',
            'onChange',
            'onClear',
            'onEnterPress',
            'onFocus',
            'onKeyDown',
            'onKeyPress',
            'onKeyUp',
            'onCompositionStart',
            'onCompositionEnd',
            'onCompositionUpdate',
          ],
        },
        {
          heading: 'TextArea',
          level: 3,
          rows: [
            'onBlur',
            'onChange',
            'onClear',
            'onEnterPress',
            'onFocus',
            'onKeyDown',
            'onKeyPress',
            'onKeyUp',
            'onResize',
            'onCompositionStart',
            'onCompositionEnd',
            'onCompositionUpdate',
          ],
        },
        { heading: 'InputGroup', level: 3, rows: ['onBlur', 'onFocus'] },
      ],
      eventGroups: [
        {
          name: 'Input',
          items: [
            event('change', '[value: string, event: Event]', '输入值变化'),
            event('input', '[event: Event]', '原生 input 事件'),
            event('clear', '[event: Event]', '点击清除按钮'),
            event('enterPress', '[event: KeyboardEvent]', '按下 Enter'),
            event('focus / blur', '[event: FocusEvent]', '获得或失去焦点'),
            event('keydown / keypress / keyup', '[event: KeyboardEvent]', '键盘事件'),
            event(
              'compositionStart / compositionUpdate / compositionEnd',
              '[event: CompositionEvent]',
              '输入法组合事件',
            ),
          ],
        },
        {
          name: 'TextArea',
          items: [
            event('change', '[value: string, event: Event]', '输入值变化'),
            event('resize', '[data: { height: number; width?: number }]', '文本域尺寸变化'),
            event('clear / enterPress / focus / blur', '见 Input 对应事件', '交互事件'),
            event('keydown / keypress / keyup', '[event: KeyboardEvent]', '键盘事件'),
            event(
              'compositionStart / compositionUpdate / compositionEnd',
              '[event: CompositionEvent]',
              '输入法组合事件',
            ),
          ],
        },
        {
          name: 'InputGroup',
          items: [event('focus / blur', '[event: FocusEvent]', '组内输入框获得或失去焦点')],
        },
      ],
      slotGroups: [
        {
          name: 'Input',
          items: [
            slot('addonBefore / addonAfter', '{}', '前置或后置标签'),
            slot('prefix / suffix', '{}', '输入框前缀或后缀'),
            slot('clearIcon', '{}', '清除图标'),
            slot('insetLabel', '{}', '内嵌标签'),
          ],
        },
        { name: 'InputGroup', items: [slot('default', '{}', '组合内的输入控件')] },
      ],
      textRewrites: [
        [
          '`Input` 值完全取决于传入的 `value` 值，配合 `onChange` 回调函数使用',
          '`Input` 可通过 `v-model` 双向绑定，也可使用 `modelValue` 并监听 `change` 事件。',
        ],
        [
          '`onChange` 不会在输入法未确认（如拼音过程中）触发，而是在输入法确认后触发一次',
          '`change` 事件不会在输入法未确认（如拼音过程中）触发，而是在输入法确认后触发一次',
        ],
        [
          '开启后输入法未确认期间不会触发 onChange，输入法确认后触发一次 onChange',
          '开启后输入法未确认期间不会触发 change 事件，输入法确认后触发一次 change 事件',
        ],
        [
          'disabled、onFocus、onBlur 三个属性会被子组件继承覆盖',
          '`disabled` 属性以及 `focus`、`blur` 监听器会由组内输入控件统一继承',
        ],
      ],
    },
  ],
  [
    '/zh-CN/input/select',
    {
      sources: ['packages/ui/src/select/types.ts'],
      propSections: [
        {
          heading: 'Select Props',
          level: 3,
          source: 'packages/ui/src/select/types.ts',
          interfaces: ['SelectProps'],
        },
        {
          heading: 'Option Props',
          level: 3,
          source: 'packages/ui/src/select/types.ts',
          interfaces: ['SelectOptionProps'],
          aliases: { class: 'className' },
        },
        {
          heading: 'OptGroup Props',
          level: 3,
          source: 'packages/ui/src/select/types.ts',
          interfaces: ['SelectOptionGroupProps'],
          aliases: { class: 'className' },
        },
      ],
      models: ['`v-model` 对应 `modelValue`；单选和多选值由 `SelectModelValue` 统一约束。'],
      eventSections: [
        {
          heading: 'Select Props',
          level: 3,
          rows: [
            'onBlur',
            'onChange',
            'onCreate',
            'onClear',
            'onDropdownVisibleChange',
            'onListScroll',
            'onSearch',
            'onSelect',
            'onDeselect',
            'onExceed',
            'onFocus',
          ],
        },
      ],
      eventGroups: [
        {
          name: 'Select',
          items: [
            event('change', '[value: SelectModelValue]', '选中值变化'),
            event('select / deselect', '[value, option]', '选择或取消选择候选项'),
            event('create', '[option: SelectOptionProps]', '创建候选项'),
            event('clear', '[]', '清除当前值'),
            event('dropdownVisibleChange', '[visible: boolean]', '下拉层显隐变化'),
            event('search', '[value: string, event?: Event]', '搜索文本变化'),
            event('listScroll', '[event: Event]', '候选列表滚动'),
            event('exceed', '[option: SelectOptionProps]', '选择数量超过 max'),
            event('focus / blur', '[event: FocusEvent]', '获得或失去焦点'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Select',
          items: [
            slot('default', '{}', 'Option / OptGroup 子组件'),
            slot(
              'trigger',
              '{ value, inputValue, disabled, placeholder, onSearch, onClear, onRemove }',
              '自定义触发器',
            ),
            slot('option', 'SelectOptionRenderProps', '自定义候选项'),
            slot('selectedItem', '{ option, index }', '自定义已选项'),
            slot('createItem', '{ inputValue, focused, style }', '自定义创建项'),
            slot('prefix / suffix', '{}', '触发器前缀或后缀'),
            slot('arrowIcon / clearIcon', '{}', '下拉或清除图标'),
            slot('emptyContent', '{}', '空状态内容'),
            slot('innerTop / innerBottom', '{}', '候选列表内部附加内容'),
            slot('outerTop / outerBottom', '{}', '候选列表外部附加内容'),
            slot('insetLabel', '{}', '内嵌标签'),
          ],
        },
      ],
      textRewrites: [
        ['同时会触发`onExceed`回调', '同时会触发 `exceed` 事件'],
        [
          '默认情况下`onChange`只能拿到 value，如果需要拿选中节点的其他属性，可以使用`onChangeWithObject`属性',
          '默认情况下 `change` 事件只返回 value；如果需要选中节点的其他属性，可以启用 `onChangeWithObject`。',
        ],
        [
          '此时`onChange`函数的入参将会是 object，包含 option 的各种属性，例如 `onChange({ value, label, ...rest })`',
          '此时 `change` 事件的入参是包含 option 属性的对象，例如 `{ value, label, ...rest }`。',
        ],
        ['Option 的 children 或 label', 'Option 的默认插槽或 label'],
        ['通过 jsx 方式声明 children', '通过模板声明 Option 子组件'],
        ['option.label 或 option.children', 'option.label 或 Option 默认插槽'],
        [
          '但你可以通过 `renderSelectedItem` 自定义选择框中已选项标签的渲染结构',
          '可以通过 `#selectedItem="{ option, index }"` 自定义选择框中已选项标签的渲染结构',
        ],
        [
          '- 单选时 `renderSelectedItem(optionNode:object) => content:VNodeChild`',
          '- 插槽参数 `option` 是当前选项，`index` 是已选项索引',
        ],
        [
          '- 多选时 `renderSelectedItem(optionNode:object, { index:number, onClose:function }) => { isRenderInTag:bool, content:VNodeChild }`',
          '- 多选项的移除和交互仍由 Select 管理，插槽只负责内容渲染',
        ],
        [
          "允许通过 `renderCreateItem` 自定义创建标签时的内容显示（通过返回 VNodeChild，注意你需要自定义样式），该函数默认值为 (input, isFocus, style) => '创建' + input",
          '允许通过 `#createItem="{ inputValue, focused, style }"` 自定义创建项；使用虚拟列表时应将作用域中的 style 绑定到根元素。',
        ],
        [
          '如果 Select 默认的触发器样式满足不了你的需求，可以用`triggerRender`自定义选择框的展示',
          '如果默认触发器不能满足需求，可以使用 `#trigger` 作用域插槽自定义展示。',
        ],
        ['triggerRender 入参如下', '`trigger` 插槽参数如下'],
        ['通过 triggerRender 为 Select 增加排序', '通过 `trigger` 插槽为 Select 增加排序'],
        [
          '通过 Option 的 label 属性或者 children 传入 VNodeChild',
          '通过 Option 的 label 属性或默认插槽传入内容',
        ],
        [
          '通过传入`renderOptionItem`，你可以完全接管列表中候选项的渲染，并且从回调入参中，获取到相关的状态值。',
          '通过 `#option` 作用域插槽可以接管候选项渲染，并从插槽参数中获取相关状态。',
        ],
        ['innerTopSlot', '#innerTop'],
        ['innerBottomSlot', '#innerBottom'],
        ['outerTopSlot', '#outerTop'],
        ['outerBottomSlot', '#outerBottom'],
        ['triggerRender', '`trigger` 插槽'],
        ['renderSelectedItem', '`selectedItem` 插槽'],
        ['renderCreateItem', '`createItem` 插槽'],
        ['renderOptionItem', '`option` 插槽'],
        ['optionList / children', 'optionList / Option 子组件'],
        ['optionList 或者 children', 'optionList 或 Option 子组件'],
        ['children VNodeChild 的 key', 'Option 子组件的 key'],
        ['children jsx 方式声明 Options', '通过 Option 子组件声明 Options'],
        ['使用 jsx 方式声明 Option', '通过 Option 子组件声明 Option'],
        ['若无则取 children、value', '若无则取默认插槽、value'],
        ['`remote={true}`', '`:remote="true"`'],
        [
          'props 传入的 style 需在 wrapper dom 上进行消费，否则在虚拟化场景下会无法正常使用',
          '插槽参数中的 `style` 需要绑定到自定义内容的根元素，否则虚拟化场景无法正确定位。',
        ],
        [
          'props 传入的 className、onMouseEnter 需在 wrapper dom 上进行消费，否则上下键盘操作时显示会有问题',
          '插槽参数中的 `class` 与 `onMouseenter` 也需要绑定到根元素，确保键盘高亮与鼠标交互一致。',
        ],
        [
          '选中(selected)、聚焦(focused)、禁用(disabled)等状态的样式需自行加上，你可以从 props 中获取到相对的 boolean 值',
          '选中（`selected`）、聚焦（`focused`）、禁用（`disabled`）等状态可从插槽参数读取，自定义内容需自行应用相应样式。',
        ],
        [
          '如果你的自定义 item 为 Select.Option，需要将 renderProps.onClick 透传给 Option 的 onSelect prop',
          '自定义根元素需要调用插槽参数提供的 `onClick`；不要在 `#option` 中再次嵌套 `Select.Option`。',
        ],
        [
          '请不要传入 value、ref、onChange、onFocus，否则会覆盖 Select 相关回调，影响组件行为',
          '请不要传入 value、ref、change 或 focus 监听器，否则会覆盖 Select 的内部交互',
        ],
        [
          '设为 true 时，onChange 的入参类型会从 string 变为 object',
          '设为 true 时，change 事件的入参会从 string 变为 object',
        ],
        ['配合 `onChange` 使用', '配合 `v-model` 或 `change` 事件使用'],
      ],
    },
  ],
  [
    '/zh-CN/input/form',
    {
      sources: ['packages/ui/src/form/types.ts', 'packages/ui/src/form/index.ts'],
      propSections: [
        {
          heading: 'Form Props',
          level: 2,
          source: 'packages/ui/src/form/types.ts',
          interfaces: ['FormProps'],
        },
        {
          heading: 'Field Props',
          level: 2,
          source: 'packages/ui/src/form/types.ts',
          interfaces: ['CommonFieldProps'],
        },
        {
          heading: 'ArrayField Props',
          level: 2,
          source: 'packages/ui/src/form/types.ts',
          interfaces: ['ArrayFieldProps'],
        },
        {
          heading: 'Form.Section',
          level: 2,
          source: 'packages/ui/src/form/types.ts',
          interfaces: ['FormSectionProps'],
        },
        {
          heading: 'Form.Label',
          level: 2,
          source: 'packages/ui/src/form/types.ts',
          interfaces: ['FormLabelProps'],
        },
        {
          heading: 'Form.ErrorMessage',
          level: 2,
          source: 'packages/ui/src/form/types.ts',
          interfaces: ['FormErrorMessageProps'],
        },
      ],
      eventSections: [
        {
          heading: 'Form Props',
          level: 2,
          rows: [
            'onChange',
            'onValueChange',
            'onErrorChange',
            'onReset',
            'onSubmit',
            'onSubmitFail',
          ],
        },
      ],
      eventGroups: [
        {
          name: 'Form',
          items: [
            event('change', '[formState: FormState<Values>]', '表单状态变化'),
            event('valueChange', '[values: Values, changedValues: Partial<Values>]', '字段值变化'),
            event('errorChange', '[errors, changedErrors]', '校验错误变化'),
            event('reset', '[]', '表单重置'),
            event('submit', '[values: Values, event?: Event]', '校验成功后提交'),
            event('submitFail', '[errors, values: Values, event?: Event]', '校验失败后提交'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Form',
          items: [slot('default', '{ formState, formApi, values }', '表单内容与作用域状态')],
        },
        {
          name: 'ArrayField',
          items: [slot('default', '{ add, addWithInitValue, arrayFields }', '动态字段列表')],
        },
      ],
      textRewrites: [
        ['通过 child render function', '通过默认插槽'],
        ['child render function 方式声明表单', '默认插槽方式声明表单'],
        ['通过 props.component', '通过 component prop'],
        ['以 VNodeChild 形式传入', '以组件形式传入'],
        [
          'Form 的 children 是一个 function，return 出所有表单控件',
          'Form 的默认插槽可以接收 `formState`、`formApi` 与 `values`，并返回全部表单控件。',
        ],
        ['不可与 render、props.children 同时使用', '不可与 `render` 或默认插槽同时使用'],
        ['不可与 component、props.children 同时使用', '不可与 `component` 或默认插槽同时使用'],
        [
          '你可以通过监听 Field 的 onChange 事件，然后使用 formApi 进行相关修改，来使 Field 之间达到联动',
          '你可以监听字段组件的 `change` 事件，再通过 `formApi` 修改其他字段，实现字段联动。',
        ],
        [
          'Form 组件在 ComponentDidMount 阶段，会执行 props 传入的 getFormApi 回调',
          'Form 组件初始化后会执行 `getFormApi` 回调',
        ],
      ],
    },
  ],
  [
    '/zh-CN/show/table',
    {
      sources: ['packages/ui/src/table/types.ts'],
      propSections: [
        {
          heading: 'Table',
          level: 2,
          source: 'packages/ui/src/table/types.ts',
          interfaces: ['TableProps'],
        },
        {
          heading: 'Column',
          level: 2,
          source: 'packages/ui/src/table/types.ts',
          interfaces: ['TableColumn'],
        },
        {
          heading: 'rowSelection',
          level: 2,
          source: 'packages/ui/src/table/types.ts',
          interfaces: ['TableRowSelection'],
        },
        {
          heading: 'scroll',
          level: 2,
          source: 'packages/ui/src/table/types.ts',
          interfaces: ['TableScroll'],
        },
        {
          heading: 'Resizable',
          level: 2,
          source: 'packages/ui/src/table/types.ts',
          interfaces: ['TableResizable'],
        },
      ],
      eventSections: [
        { heading: 'Table', level: 2, rows: ['onChange', 'onExpand', 'onExpandedRowsChange'] },
      ],
      eventGroups: [
        {
          name: 'Table',
          items: [
            event('change', '[changeInfo: TableChangeInfo<RecordType>]', '分页、排序或筛选变化'),
            event('expand', '[expanded, record, event?: MouseEvent]', '展开状态变化'),
            event('expandedRowsChange', '[expandedRows: RecordType[]]', '展开行集合变化'),
            event('pageChange', '[currentPage: number, pageSize: number]', '分页变化'),
            event('select', '[record, selected, selectedRows, event?]', '选择单行'),
            event('selectAll', '[selected, selectedRows, changedRows]', '全选状态变化'),
            event('selectChange', '[selectedRowKeys, selectedRows]', '选择集合变化'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Table',
          items: [
            slot('default', '{}', '声明式 Table.Column'),
            slot('cell', '{ column, record, rowIndex, text }', '单元格内容'),
            slot('headerCell', '{ column }', '表头单元格'),
            slot('expandedRow', '{ expanded, index, record }', '展开行'),
            slot('title / footer', '{ pageData }', '表格标题或尾部'),
            slot('pagination', '{ pagination }', '分页器'),
            slot('groupSection', '{ group, groupKey }', '分组表头'),
            slot('empty', '{}', '空状态内容'),
          ],
        },
      ],
      textRewrites: [
        [
          'Semi Table 底层借助了 `react-window` 的能力来实现虚拟化，因此 `react-window` `VariableSizeList` 所支持的其他参数也可以通过 `virtualized`(object) 传入，例如 `overscanCount`',
          'Table 的虚拟化模式支持通过 `virtualized` 对象补充配置，例如 `overscanCount`。',
        ],
        ['表头除了通过 `children` 写法进行合并外', '表头除了通过嵌套列配置进行合并外'],
        [
          'React 需要的 key，如果已经设置了唯一的 dataIndex，可以忽略这个属性',
          '列的稳定 key；如果已经设置唯一的 dataIndex，可以忽略该属性',
        ],
        [
          '- Table 的树形数据暂不支持 RTL（[Chrome、Safari 浏览器表现与 Firefox 表现不同](https://codesandbox.io/s/table-rtl-treedata-uy7gzl?file=/src/App.jsx)）',
          '- Table 的树形数据暂不支持 RTL；Chrome、Safari 与 Firefox 的表现存在差异。',
        ],
        [
          '表头的 tr 定义了 `onMouseEnter`/`onMouseLeave`',
          '表头的 `tr` 绑定了 `mouseenter` / `mouseleave` 监听器',
        ],
        [
          '你也可以使用 JSX 语法定义 `columns`，注意 Table 仅支持 `columns` 的 JSX 语法定义。你不能够使用任何组件包裹 `Table.Column` 组件。',
          '你也可以通过 `Table.Column` 子组件声明列；不要再用其他组件包裹 `Table.Column`，也不要与 `columns` 配置同时使用。',
        ],
        [
          '使用 JSX 写法时，请不要与配置写法同时使用；如果同时使用，仅配置写法生效，不会进行聚合操作。',
          '使用 `Table.Column` 时，请不要与 `columns` 配置同时使用；如果同时使用，仅配置写法生效。',
        ],
        ['JSX 或者配置式写法', '`Table.Column` 或配置式写法'],
        ['JSX 写法', '声明式列写法'],
        ['React.RefObject', '{ current: TableVirtualizedListRef | null }'],
      ],
    },
  ],
  [
    '/zh-CN/show/modal',
    {
      sources: ['packages/ui/src/modal/types.ts'],
      propSections: [
        {
          heading: 'Modal',
          level: 3,
          source: 'packages/ui/src/modal/types.ts',
          interfaces: ['ModalProps'],
        },
        {
          heading: 'Modal.method()',
          level: 3,
          source: 'packages/ui/src/modal/types.ts',
          interfaces: ['ModalProps', 'ModalConfirmProps'],
        },
      ],
      models: [
        '`v-model:visible` 对应 `visible` 与 `update:visible`。`onOk` / `onCancel` 是保留的 callback props。',
      ],
      eventGroups: [
        {
          name: 'Modal',
          items: [
            event('update:visible', '[visible: boolean]', '可见状态更新，用于 `v-model:visible`'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Modal',
          items: [
            slot('default / body', '{}', '对话框正文'),
            slot('header / title', '{}', '头部或标题'),
            slot('footer', '{}', '底部操作区'),
            slot('closeIcon', '{}', '关闭图标'),
            slot('icon', '{}', '状态图标'),
          ],
        },
      ],
      textRewrites: [
        ['Hooks 用法', 'useModal 用法'],
        [
          '注意：命令式调用的 Modal 需要通过这两个属性来设置 i18 的文本，因为我们无法修改 React 组件树，命令式调用插入的 Component 无法消费到 Locale 相关的 Context',
          '注意：命令式 Modal 不在当前组件的注入层级内，需要通过这两个属性显式设置国际化文案。',
        ],
        [
          'Modal 使用 Portal 将浮层节点插入到 DOM 树中。但这个操作仅能改变节点在 DOM 树中的位置，无法改变节点在 React 节点树中的位置，LocalProvider是基于 Context 机制传递的，必须是从属的 React 子结点才可消费到 Local 相关 Context。因此命令式的 Modal 的内置文本无法自动适配国际化。',
          '命令式 Modal 由独立应用实例挂载，不在当前 `ConfigProvider` 的 provide/inject 层级内，因此不会自动继承国际化配置。',
        ],
        [
          '在1.2版本之后，你也可以通过 Modal.useModal 方法来返回 modal 实体以及 contextHolder 节点。将 contextHolder 插入到你需要获取 context 位置，即可使 Modal 获取到对应的 Context，如 ConfigProvider 或者 LocaleProvider 的配置。',
          '也可以使用 `Modal.useModal()` 获取 modal 方法和 `ContextHolder` 组件，并在需要继承配置的位置渲染该组件，使其读取对应的 `ConfigProvider` 配置。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/show/tooltip',
    {
      sources: ['packages/ui/src/tooltip/types.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/tooltip/types.ts',
          interfaces: ['TooltipProps'],
        },
      ],
      models: ['`v-model:visible` 对应 `visible` 与 `update:visible`。'],
      eventSections: [
        { heading: 'API 参考', level: 2, rows: ['onVisibleChange', 'onClickOutSide'] },
      ],
      eventGroups: [
        {
          name: 'Tooltip',
          items: [
            event('visibleChange', '[visible: boolean]', '显隐状态变化'),
            event('clickOutside', '[event: MouseEvent]', '点击触发器和浮层以外区域'),
            event('afterClose', '[]', '关闭动画完成'),
            event('escKeydown', '[event: KeyboardEvent]', '按下 Escape'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Tooltip',
          items: [
            slot('default', '{}', '触发元素'),
            slot('content', '{ initialFocusRef }', '浮层内容'),
            slot('arrow', '{}', '自定义箭头'),
          ],
        },
      ],
      textRewrites: [
        ['非Children、非浮层', '非触发元素、非浮层'],
        [
          'Tooltip 需要将 DOM 事件监听器应用到 children 中，如果子元素是自定义的组件，你需要确保它能将属性传递至底层的 DOM 元素',
          'Tooltip 会把 DOM 事件监听器合并到默认插槽的触发元素；使用自定义组件时，需要将 attrs 透传到底层 DOM 元素。',
        ],
        [
          '同时为了计算弹出层的定位，需要获取到 children 的真实 DOM 元素，因此 Tooltip 支持如下类型的 children',
          '定位计算需要取得触发元素的真实 DOM 节点，因此默认插槽应提供以下类型的内容：',
        ],
        [
          '1. 使用 forwardRef 包裹后的函数式组件，将 props 与 ref 透传到 children 内真实的 DOM 节点上',
          '1. 能够透传 attrs，并最终渲染为单个 DOM 根节点的 Vue 组件',
        ],
        ['2. 真实 DOM 节点, 如 span，div，p...', '2. 原生 DOM 元素，例如 `span`、`div`、`p`'],
        [
          '3. Class Component，不强制绑定ref，但需要确保 props 可被透传至真实的 DOM 节点上 (**注**: 此条规则仅在 React 版本低于 v19 时使用 @aifuxi/semi-ui-vue 可行， 在 React v19 版本使用 @aifuxi/semi-ui-vue-19 不可行，详情见 [React v19 适配注意事项](https://semi.design/zh-CN/start/react19#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9))',
          '3. 多个根节点或特殊节点会按 `wrapWhenSpecial` 的设置使用包装元素。',
        ],
        [
          'Tooltip、Popconfirm、Popover 都需要劫持 children 的相关事件（onMouseEnter/onMouseLeave/onClick....），用于配置 trigger。',
          'Tooltip、Popconfirm、Popover 会在默认插槽的触发元素上合并鼠标或点击监听器，用于实现 `trigger`；触发元素需要能够接收并透传 DOM 事件。',
        ],
        ['children', '触发元素'],
      ],
    },
  ],
  [
    '/zh-CN/input/upload',
    {
      sources: ['packages/ui/src/upload/types.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/upload/types.ts',
          interfaces: ['UploadProps'],
        },
      ],
      models: ['`v-model` 对应 `modelValue`；也支持 `v-model:fileList`。'],
      eventSections: [
        {
          heading: 'API 参考',
          level: 2,
          rows: [
            'onAcceptInvalid',
            'onChange',
            'onClear',
            'onDrop',
            'onError',
            'onExceed',
            'onFileChange',
            'onOpenFileDialog',
            'onPreviewClick',
            'onProgress',
            'onPastingError',
            'onRemove',
            'onRetry',
            'onSizeError',
            'onSuccess',
          ],
        },
      ],
      eventGroups: [
        {
          name: 'Upload',
          items: [
            event('change', '[payload: UploadChangePayload]', '文件列表或当前文件变化'),
            event('fileChange', '[files: File[]]', '选择文件'),
            event('success / error / progress', '见 UploadEmits', '上传状态变化'),
            event('remove / retry / clear', '见 UploadEmits', '列表操作'),
            event('drop', '[event: Event, files, fileList]', '释放拖拽文件'),
            event('exceed / acceptInvalid / sizeError', '见 UploadEmits', '文件限制校验'),
            event('previewClick', '[file: UploadFileItem]', '点击文件卡片'),
            event('openFileDialog', '[]', '打开系统文件选择器'),
            event('pastingError', '[error: Error | PermissionStatus]', '读取粘贴内容失败'),
            event('cropError', '[error: Error]', '图片裁切失败；同时保留 `onCropError` prop'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Upload',
          items: [
            slot('default', '{}', '上传触发区'),
            slot('dragIcon / dragMainText / dragSubText', '{}', '拖拽区内容'),
            slot('prompt', '{}', '提示内容'),
            slot('fileItem', 'UploadRenderFileItemProps', '文件项'),
            slot(
              'thumbnail / picInfo / picPreviewIcon',
              'UploadRenderFileItemProps',
              '图片列表内容',
            ),
            slot('picClose', 'UploadRenderPictureCloseProps', '图片关闭按钮'),
            slot('fileOperation', 'UploadRenderFileItemProps', '文件操作区'),
            slot('fileListTitle', 'UploadRenderFileListTitleProps', '文件列表标题'),
          ],
        },
      ],
      textRewrites: [
        ['字符串或 VNodeChild 形式', '字符串、VNodeChild 或插槽形式'],
        ['通过 `children` 传入 VNodeChild', '通过默认插槽传入内容'],
        ['children', '默认插槽内容'],
        ['并不会触发onExceed回调', '并不会触发 `exceed` 事件'],
        ['通过设置 `onSizeError` 可以设置超出限制时的回调', '超出限制时会触发 `sizeError` 事件'],
        ['- `onClear`: 清空文件的回调函数', '- `clear`：清空文件时触发的事件'],
        [
          '当传入`fileList`时，作为受控组件使用。需要监听 onChange 回调，并且将 fileList 回传给 Upload（注意需传入一个新的数组对象）',
          '传入 `fileList` 时组件受控；推荐使用 `v-model:fileList`，也可以监听 `change` 事件并回传新的数组对象。',
        ],
        [
          '可以通过 `renderPicPreviewIcon`，`onPreviewClick` 来自定义预览图标',
          '可以通过 `#picPreviewIcon` 插槽自定义预览图标，并监听 `previewClick` 事件',
        ],
        [
          '使用 `renderPicPreviewIcon` 监听图标点击事件即可',
          '使用 `#picPreviewIcon` 插槽并监听 `previewClick` 事件即可',
        ],
        [
          '`onPreviewClick` 监听的是单张图片容器的点击事件',
          '`previewClick` 在点击单张图片容器时触发',
        ],
      ],
    },
  ],
]);
