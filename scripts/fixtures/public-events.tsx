import { Modal as SizedModal } from '@aifuxi/semi-ui-vue/modal';
import { SideSheet as SizedSideSheet } from '@aifuxi/semi-ui-vue/side-sheet';
import * as UI from '@aifuxi/semi-ui-vue';
import {
  Checkbox,
  type CheckboxChangeEvent,
  type CheckboxExposed,
} from '@aifuxi/semi-ui-vue/checkbox';
import { Dropdown, DropdownItem, type DropdownExposed } from '@aifuxi/semi-ui-vue/dropdown';
import { Form, FormInput, FormInputNumber, FormUpload } from '@aifuxi/semi-ui-vue/form';

/** 用公开 Props 提供必填参数，让矩阵专注事件属性；此文件只编译、不执行。 */
declare function requiredProps<Props>(component: new () => { $props: Props }): Props;
/** 对照回调可以忽略参数，精确参数推导由下方专项用例验证。 */
declare const ignoreEvent: () => void;
/** 通过赋值兼容性检查推导类型，不使用 any 或类型断言兜底。 */
declare function expectType<Type>(value: Type): void;

/** 覆盖调查确认的普通组件与静态成员，保留 update: 和连字符事件的原始名称。 */
export const componentBindings = [
  <UI.Avatar
    {...requiredProps(UI.Avatar)}
    onClick={ignoreEvent}
    onMouseenter={ignoreEvent}
    onMouseleave={ignoreEvent}
  />,
  <UI.Badge
    {...requiredProps(UI.Badge)}
    onClick={ignoreEvent}
    onMouseenter={ignoreEvent}
    onMouseleave={ignoreEvent}
  />,
  <UI.Banner {...requiredProps(UI.Banner)} onClose={ignoreEvent} />,
  <UI.Calendar
    {...requiredProps(UI.Calendar)}
    onClick={ignoreEvent}
    onClose={ignoreEvent}
    onMoreClick={ignoreEvent}
  />,
  <UI.Chat
    {...requiredProps(UI.Chat)}
    onUpdate:chats={ignoreEvent}
    onChats-change={ignoreEvent}
    onMessage-delete={ignoreEvent}
    onMessage-reset={ignoreEvent}
    onMessage-copy={ignoreEvent}
    onMessage-good-feedback={ignoreEvent}
    onMessage-bad-feedback={ignoreEvent}
    onMessage-send={ignoreEvent}
    onInput-change={ignoreEvent}
    onHint-click={ignoreEvent}
    onClear={ignoreEvent}
    onStop-generator={ignoreEvent}
  />,
  <UI.Carousel {...requiredProps(UI.Carousel)} onChange={ignoreEvent} />,
  <UI.Cascader
    {...requiredProps(UI.Cascader)}
    onBlur={ignoreEvent}
    onChange={ignoreEvent}
    onClear={ignoreEvent}
    onExceed={ignoreEvent}
    onFocus={ignoreEvent}
    onListScroll={ignoreEvent}
    onLoad={ignoreEvent}
    onSearch={ignoreEvent}
    onSelect={ignoreEvent}
    onVisibleChange={ignoreEvent}
    onUpdate:modelValue={ignoreEvent}
    onUpdate:value={ignoreEvent}
  />,
  <UI.Collapsible {...requiredProps(UI.Collapsible)} onMotionEnd={ignoreEvent} />,
  <UI.CollapsePanel {...requiredProps(UI.CollapsePanel)} onMotionEnd={ignoreEvent} />,
  <UI.Collapse
    {...requiredProps(UI.Collapse)}
    onChange={ignoreEvent}
    onUpdate:activeKey={ignoreEvent}
  />,
  <UI.Collapse.Panel {...requiredProps(UI.Collapse.Panel)} onMotionEnd={ignoreEvent} />,
  <UI.ColorPicker
    {...requiredProps(UI.ColorPicker)}
    onChange={ignoreEvent}
    onUpdate:modelValue={ignoreEvent}
    onUpdate:value={ignoreEvent}
  />,
  <UI.DatePicker
    {...requiredProps(UI.DatePicker)}
    onBlur={ignoreEvent}
    onCancel={ignoreEvent}
    onChange={ignoreEvent}
    onClear={ignoreEvent}
    onClickOutside={ignoreEvent}
    onConfirm={ignoreEvent}
    onFocus={ignoreEvent}
    onMaxSelect={ignoreEvent}
    onOpenChange={ignoreEvent}
    onPanelChange={ignoreEvent}
    onPresetClick={ignoreEvent}
    onUpdate:modelValue={ignoreEvent}
    onUpdate:open={ignoreEvent}
    onUpdate:value={ignoreEvent}
  />,
  <UI.DropdownItem
    {...requiredProps(UI.DropdownItem)}
    onClick={ignoreEvent}
    onContextmenu={ignoreEvent}
    onKeydown={ignoreEvent}
    onMouseenter={ignoreEvent}
    onMouseleave={ignoreEvent}
  />,
  <UI.Dropdown
    {...requiredProps(UI.Dropdown)}
    onAfterClose={ignoreEvent}
    onClickOutside={ignoreEvent}
    onEscKeydown={ignoreEvent}
    onVisibleChange={ignoreEvent}
    onUpdate:visible={ignoreEvent}
  />,
  <UI.Dropdown.Item
    {...requiredProps(UI.Dropdown.Item)}
    onClick={ignoreEvent}
    onContextmenu={ignoreEvent}
    onKeydown={ignoreEvent}
    onMouseenter={ignoreEvent}
    onMouseleave={ignoreEvent}
  />,
  <UI.Feedback {...requiredProps(UI.Feedback)} onUpdate:visible={ignoreEvent} />,
  <UI.HotKeys {...requiredProps(UI.HotKeys)} onClick={ignoreEvent} onHotKey={ignoreEvent} />,
  <UI.AutoComplete
    {...requiredProps(UI.AutoComplete)}
    onBlur={ignoreEvent}
    onChange={ignoreEvent}
    onClear={ignoreEvent}
    onDropdownVisibleChange={ignoreEvent}
    onFocus={ignoreEvent}
    onKeydown={ignoreEvent}
    onSearch={ignoreEvent}
    onSelect={ignoreEvent}
    onUpdate:modelValue={ignoreEvent}
    onUpdate:value={ignoreEvent}
  />,
  <UI.CheckboxGroup
    {...requiredProps(UI.CheckboxGroup)}
    onChange={ignoreEvent}
    onUpdate:value={ignoreEvent}
    onUpdate:modelValue={ignoreEvent}
  />,
  <UI.Checkbox
    {...requiredProps(UI.Checkbox)}
    onChange={ignoreEvent}
    onUpdate:checked={ignoreEvent}
    onUpdate:modelValue={ignoreEvent}
  />,
  <UI.Checkbox.Group
    {...requiredProps(UI.Checkbox.Group)}
    onChange={ignoreEvent}
    onUpdate:value={ignoreEvent}
    onUpdate:modelValue={ignoreEvent}
  />,
  <UI.Form
    {...requiredProps(UI.Form)}
    onChange={ignoreEvent}
    onErrorChange={ignoreEvent}
    onReset={ignoreEvent}
    onSubmit={ignoreEvent}
    onSubmitFail={ignoreEvent}
    onValueChange={ignoreEvent}
  />,
  <UI.InputGroup {...requiredProps(UI.InputGroup)} onBlur={ignoreEvent} onFocus={ignoreEvent} />,
  <UI.TextArea
    {...requiredProps(UI.TextArea)}
    onBlur={ignoreEvent}
    onChange={ignoreEvent}
    onClear={ignoreEvent}
    onCompositionEnd={ignoreEvent}
    onCompositionStart={ignoreEvent}
    onCompositionUpdate={ignoreEvent}
    onEnterPress={ignoreEvent}
    onFocus={ignoreEvent}
    onInput={ignoreEvent}
    onKeydown={ignoreEvent}
    onKeypress={ignoreEvent}
    onKeyup={ignoreEvent}
    onResize={ignoreEvent}
    onUpdate:modelValue={ignoreEvent}
    onUpdate:value={ignoreEvent}
  />,
  <UI.Input
    {...requiredProps(UI.Input)}
    onBlur={ignoreEvent}
    onChange={ignoreEvent}
    onClear={ignoreEvent}
    onCompositionEnd={ignoreEvent}
    onCompositionStart={ignoreEvent}
    onCompositionUpdate={ignoreEvent}
    onEnterPress={ignoreEvent}
    onFocus={ignoreEvent}
    onInput={ignoreEvent}
    onKeydown={ignoreEvent}
    onKeypress={ignoreEvent}
    onKeyup={ignoreEvent}
    onUpdate:modelValue={ignoreEvent}
    onUpdate:value={ignoreEvent}
  />,
  <UI.Input.Group {...requiredProps(UI.Input.Group)} onBlur={ignoreEvent} onFocus={ignoreEvent} />,
  <UI.Input.TextArea
    {...requiredProps(UI.Input.TextArea)}
    onBlur={ignoreEvent}
    onChange={ignoreEvent}
    onClear={ignoreEvent}
    onCompositionEnd={ignoreEvent}
    onCompositionStart={ignoreEvent}
    onCompositionUpdate={ignoreEvent}
    onEnterPress={ignoreEvent}
    onFocus={ignoreEvent}
    onInput={ignoreEvent}
    onKeydown={ignoreEvent}
    onKeypress={ignoreEvent}
    onKeyup={ignoreEvent}
    onResize={ignoreEvent}
    onUpdate:modelValue={ignoreEvent}
    onUpdate:value={ignoreEvent}
  />,
  <UI.RadioGroup
    {...requiredProps(UI.RadioGroup)}
    onChange={ignoreEvent}
    onUpdate:value={ignoreEvent}
    onUpdate:modelValue={ignoreEvent}
  />,
  <UI.Radio
    {...requiredProps(UI.Radio)}
    onChange={ignoreEvent}
    onMouseenter={ignoreEvent}
    onMouseleave={ignoreEvent}
    onUpdate:checked={ignoreEvent}
    onUpdate:modelValue={ignoreEvent}
  />,
  <UI.Radio.Group
    {...requiredProps(UI.Radio.Group)}
    onChange={ignoreEvent}
    onUpdate:value={ignoreEvent}
    onUpdate:modelValue={ignoreEvent}
  />,
  <UI.Rating
    {...requiredProps(UI.Rating)}
    onBlur={ignoreEvent}
    onChange={ignoreEvent}
    onClick={ignoreEvent}
    onFocus={ignoreEvent}
    onHoverChange={ignoreEvent}
    onKeyDown={ignoreEvent}
    onUpdate:modelValue={ignoreEvent}
    onUpdate:value={ignoreEvent}
  />,
  <UI.Layout.Sider {...requiredProps(UI.Layout.Sider)} onBreakpoint={ignoreEvent} />,
  <UI.ListItem
    {...requiredProps(UI.ListItem)}
    onClick={ignoreEvent}
    onRightClick={ignoreEvent}
    onMouseEnter={ignoreEvent}
    onMouseLeave={ignoreEvent}
  />,
  <UI.List.Item
    {...requiredProps(UI.List.Item)}
    onClick={ignoreEvent}
    onRightClick={ignoreEvent}
    onMouseEnter={ignoreEvent}
    onMouseLeave={ignoreEvent}
  />,
  <UI.OverflowList
    {...requiredProps(UI.OverflowList)}
    onOverflow={ignoreEvent}
    onIntersect={ignoreEvent}
    onVisibleStateChange={ignoreEvent}
  />,
  <UI.ScrollItem onSelect={ignoreEvent} />,
  <UI.ScrollList.Item onSelect={ignoreEvent} />,
  <UI.SidebarContainer
    {...requiredProps(UI.SidebarContainer)}
    onCancel={ignoreEvent}
    onAfter-visible-change={ignoreEvent}
  />,
  <UI.Sidebar
    {...requiredProps(UI.Sidebar)}
    onActive-option-change={ignoreEvent}
    onFile-content-change={ignoreEvent}
    onBack-ward={ignoreEvent}
    onDetail-content-copy={ignoreEvent}
    onCancel={ignoreEvent}
    onAfter-visible-change={ignoreEvent}
  />,
  <UI.Sidebar.Container
    {...requiredProps(UI.Sidebar.Container)}
    onCancel={ignoreEvent}
    onAfter-visible-change={ignoreEvent}
  />,
  <UI.Table
    {...requiredProps(UI.Table)}
    onChange={ignoreEvent}
    onExpand={ignoreEvent}
    onExpandedRowsChange={ignoreEvent}
    onPageChange={ignoreEvent}
    onSelect={ignoreEvent}
    onSelectAll={ignoreEvent}
    onSelectChange={ignoreEvent}
  />,
  <UI.Tag
    {...requiredProps(UI.Tag)}
    onClick={ignoreEvent}
    onClose={ignoreEvent}
    onKeydown={ignoreEvent}
    onMouseenter={ignoreEvent}
    onUpdate:visible={ignoreEvent}
  />,
  <UI.TagGroup
    {...requiredProps(UI.TagGroup)}
    onPlusNMouseenter={ignoreEvent}
    onTagClose={ignoreEvent}
  />,
  <UI.TimelineItem {...requiredProps(UI.TimelineItem)} onClick={ignoreEvent} />,
  <UI.Timeline.Item {...requiredProps(UI.Timeline.Item)} onClick={ignoreEvent} />,
  <UI.Select
    {...requiredProps(UI.Select)}
    onBlur={ignoreEvent}
    onChange={ignoreEvent}
    onClear={ignoreEvent}
    onCreate={ignoreEvent}
    onDeselect={ignoreEvent}
    onDropdownVisibleChange={ignoreEvent}
    onExceed={ignoreEvent}
    onFocus={ignoreEvent}
    onListScroll={ignoreEvent}
    onSearch={ignoreEvent}
    onSelect={ignoreEvent}
    onUpdate:modelValue={ignoreEvent}
    onUpdate:value={ignoreEvent}
  />,
  <UI.Slider
    {...requiredProps(UI.Slider)}
    onAfterChange={ignoreEvent}
    onChange={ignoreEvent}
    onMouseUp={ignoreEvent}
    onUpdate:modelValue={ignoreEvent}
    onUpdate:value={ignoreEvent}
  />,
  <UI.Step {...requiredProps(UI.Step)} onClick={ignoreEvent} onKeyDown={ignoreEvent} />,
  <UI.Steps {...requiredProps(UI.Steps)} onChange={ignoreEvent} />,
  <UI.Steps.Step {...requiredProps(UI.Steps.Step)} onClick={ignoreEvent} onKeyDown={ignoreEvent} />,
  <UI.TabItem
    {...requiredProps(UI.TabItem)}
    onClick={ignoreEvent}
    onKeyDown={ignoreEvent}
    onClose={ignoreEvent}
  />,
  <UI.Tabs
    {...requiredProps(UI.Tabs)}
    onChange={ignoreEvent}
    onTabClick={ignoreEvent}
    onTabClose={ignoreEvent}
    onVisibleTabsChange={ignoreEvent}
    onUpdate:activeKey={ignoreEvent}
    onUpdate:modelValue={ignoreEvent}
  />,
  <UI.Tabs.TabItem
    {...requiredProps(UI.Tabs.TabItem)}
    onClick={ignoreEvent}
    onKeyDown={ignoreEvent}
    onClose={ignoreEvent}
  />,
  <UI.Switch
    {...requiredProps(UI.Switch)}
    onChange={ignoreEvent}
    onUpdate:checked={ignoreEvent}
    onUpdate:modelValue={ignoreEvent}
  />,
  <UI.TagInput
    {...requiredProps(UI.TagInput)}
    onAdd={ignoreEvent}
    onBlur={ignoreEvent}
    onChange={ignoreEvent}
    onExceed={ignoreEvent}
    onFocus={ignoreEvent}
    onInputChange={ignoreEvent}
    onInputExceed={ignoreEvent}
    onKeyDown={ignoreEvent}
    onRemove={ignoreEvent}
    onUpdate:inputValue={ignoreEvent}
    onUpdate:modelValue={ignoreEvent}
    onUpdate:value={ignoreEvent}
  />,
  <UI.TimePicker
    {...requiredProps(UI.TimePicker)}
    onBlur={ignoreEvent}
    onChange={ignoreEvent}
    onFocus={ignoreEvent}
    onOpenChange={ignoreEvent}
    onUpdate:modelValue={ignoreEvent}
    onUpdate:open={ignoreEvent}
    onUpdate:value={ignoreEvent}
  />,
  <UI.UserGuide
    {...requiredProps(UI.UserGuide)}
    onChange={ignoreEvent}
    onFinish={ignoreEvent}
    onNext={ignoreEvent}
    onPrev={ignoreEvent}
    onSkip={ignoreEvent}
    onUpdate:current={ignoreEvent}
  />,
  <UI.Transfer
    {...requiredProps(UI.Transfer)}
    onChange={ignoreEvent}
    onSelect={ignoreEvent}
    onDeselect={ignoreEvent}
    onSearch={ignoreEvent}
    onUpdate:value={ignoreEvent}
    onUpdate:modelValue={ignoreEvent}
  />,
  <UI.NavItem
    {...requiredProps(UI.NavItem)}
    onClick={ignoreEvent}
    onMouseenter={ignoreEvent}
    onMouseleave={ignoreEvent}
  />,
  <UI.Nav
    {...requiredProps(UI.Nav)}
    onClick={ignoreEvent}
    onCollapseChange={ignoreEvent}
    onDeselect={ignoreEvent}
    onOpenChange={ignoreEvent}
    onSelect={ignoreEvent}
    onUpdate:isCollapsed={ignoreEvent}
    onUpdate:openKeys={ignoreEvent}
    onUpdate:selectedKeys={ignoreEvent}
  />,
  <UI.Nav.Footer {...requiredProps(UI.Nav.Footer)} onClick={ignoreEvent} />,
  <UI.Nav.Item
    {...requiredProps(UI.Nav.Item)}
    onClick={ignoreEvent}
    onMouseenter={ignoreEvent}
    onMouseleave={ignoreEvent}
  />,
  <UI.Tree
    {...requiredProps(UI.Tree)}
    onChange={ignoreEvent}
    onContextMenu={ignoreEvent}
    onDoubleClick={ignoreEvent}
    onDragEnd={ignoreEvent}
    onDragEnter={ignoreEvent}
    onDragLeave={ignoreEvent}
    onDragOver={ignoreEvent}
    onDragStart={ignoreEvent}
    onDrop={ignoreEvent}
    onExpand={ignoreEvent}
    onLoad={ignoreEvent}
    onSearch={ignoreEvent}
    onSelect={ignoreEvent}
    onUpdate:expandedKeys={ignoreEvent}
    onUpdate:modelValue={ignoreEvent}
    onUpdate:value={ignoreEvent}
  />,
  <UI.TreeSelect
    {...requiredProps(UI.TreeSelect)}
    onBlur={ignoreEvent}
    onChange={ignoreEvent}
    onClear={ignoreEvent}
    onExpand={ignoreEvent}
    onFocus={ignoreEvent}
    onLoad={ignoreEvent}
    onSearch={ignoreEvent}
    onSelect={ignoreEvent}
    onVisibleChange={ignoreEvent}
    onUpdate:expandedKeys={ignoreEvent}
    onUpdate:modelValue={ignoreEvent}
    onUpdate:value={ignoreEvent}
  />,
  <UI.AIChatInputConfigure
    {...requiredProps(UI.AIChatInputConfigure)}
    onChange={ignoreEvent}
    onUpdate:value={ignoreEvent}
  />,
  <UI.AIChatInput
    {...requiredProps(UI.AIChatInput)}
    onContentChange={ignoreEvent}
    onFocus={ignoreEvent}
    onBlur={ignoreEvent}
    onPaste={ignoreEvent}
    onReferenceDelete={ignoreEvent}
    onReferenceClick={ignoreEvent}
    onUploadChange={ignoreEvent}
    onMessageSend={ignoreEvent}
    onStopGenerate={ignoreEvent}
    onConfigureChange={ignoreEvent}
    onSuggestClick={ignoreEvent}
    onSkillChange={ignoreEvent}
    onTemplateVisibleChange={ignoreEvent}
  />,
  <UI.AIChatInput.Configure
    {...requiredProps(UI.AIChatInput.Configure)}
    onChange={ignoreEvent}
    onUpdate:value={ignoreEvent}
  />,
];

/** 字段包装器与静态入口都必须保留控件监听器。 */
export const fieldBindings = [
  <UI.FormInput {...requiredProps(UI.FormInput)} onChange={ignoreEvent} />,
  <UI.Form.Input {...requiredProps(UI.Form.Input)} onChange={ignoreEvent} />,
  <UI.FormInputNumber {...requiredProps(UI.FormInputNumber)} onChange={ignoreEvent} />,
  <UI.Form.InputNumber {...requiredProps(UI.Form.InputNumber)} onChange={ignoreEvent} />,
  <UI.FormTextArea {...requiredProps(UI.FormTextArea)} onChange={ignoreEvent} />,
  <UI.Form.TextArea {...requiredProps(UI.Form.TextArea)} onChange={ignoreEvent} />,
  <UI.FormSelect {...requiredProps(UI.FormSelect)} onChange={ignoreEvent} />,
  <UI.Form.Select {...requiredProps(UI.Form.Select)} onChange={ignoreEvent} />,
  <UI.FormCheckboxGroup {...requiredProps(UI.FormCheckboxGroup)} onChange={ignoreEvent} />,
  <UI.Form.CheckboxGroup {...requiredProps(UI.Form.CheckboxGroup)} onChange={ignoreEvent} />,
  <UI.FormCheckbox {...requiredProps(UI.FormCheckbox)} onChange={ignoreEvent} />,
  <UI.Form.Checkbox {...requiredProps(UI.Form.Checkbox)} onChange={ignoreEvent} />,
  <UI.FormRadioGroup {...requiredProps(UI.FormRadioGroup)} onChange={ignoreEvent} />,
  <UI.Form.RadioGroup {...requiredProps(UI.Form.RadioGroup)} onChange={ignoreEvent} />,
  <UI.FormRadio {...requiredProps(UI.FormRadio)} onChange={ignoreEvent} />,
  <UI.Form.Radio {...requiredProps(UI.Form.Radio)} onChange={ignoreEvent} />,
  <UI.FormDatePicker {...requiredProps(UI.FormDatePicker)} onChange={ignoreEvent} />,
  <UI.Form.DatePicker {...requiredProps(UI.Form.DatePicker)} onChange={ignoreEvent} />,
  <UI.FormSwitch {...requiredProps(UI.FormSwitch)} onChange={ignoreEvent} />,
  <UI.Form.Switch {...requiredProps(UI.Form.Switch)} onChange={ignoreEvent} />,
  <UI.FormSlider {...requiredProps(UI.FormSlider)} onChange={ignoreEvent} />,
  <UI.Form.Slider {...requiredProps(UI.Form.Slider)} onChange={ignoreEvent} />,
  <UI.FormTimePicker {...requiredProps(UI.FormTimePicker)} onChange={ignoreEvent} />,
  <UI.Form.TimePicker {...requiredProps(UI.Form.TimePicker)} onChange={ignoreEvent} />,
  <UI.FormTreeSelect {...requiredProps(UI.FormTreeSelect)} onChange={ignoreEvent} />,
  <UI.Form.TreeSelect {...requiredProps(UI.Form.TreeSelect)} onChange={ignoreEvent} />,
  <UI.FormCascader {...requiredProps(UI.FormCascader)} onChange={ignoreEvent} />,
  <UI.Form.Cascader {...requiredProps(UI.Form.Cascader)} onChange={ignoreEvent} />,
  <UI.FormRating {...requiredProps(UI.FormRating)} onChange={ignoreEvent} />,
  <UI.Form.Rating {...requiredProps(UI.Form.Rating)} onChange={ignoreEvent} />,
  <UI.FormAutoComplete {...requiredProps(UI.FormAutoComplete)} onChange={ignoreEvent} />,
  <UI.Form.AutoComplete {...requiredProps(UI.Form.AutoComplete)} onChange={ignoreEvent} />,
  <UI.FormUpload {...requiredProps(UI.FormUpload)} onChange={ignoreEvent} />,
  <UI.Form.Upload {...requiredProps(UI.Form.Upload)} onChange={ignoreEvent} />,
  <UI.FormTagInput {...requiredProps(UI.FormTagInput)} onChange={ignoreEvent} />,
  <UI.Form.TagInput {...requiredProps(UI.Form.TagInput)} onChange={ignoreEvent} />,
  <UI.FormPinCode {...requiredProps(UI.FormPinCode)} onChange={ignoreEvent} />,
  <UI.Form.PinCode {...requiredProps(UI.Form.PinCode)} onChange={ignoreEvent} />,
];

// 已正常的组件作为对照，防止修复把公开类型放宽为任意属性。
/** 保留原有事件类型正常的代表性组件。 */
export const controls = [
  <UI.Button onClick={ignoreEvent} />,
  <UI.InputNumber onChange={ignoreEvent} />,
  <UI.PinCode onChange={ignoreEvent} />,
  <UI.JsonViewer {...requiredProps(UI.JsonViewer)} onChange={ignoreEvent} />,
  <UI.LayoutSider onBreakpoint={ignoreEvent} />,
  <UI.Modal onUpdate:visible={ignoreEvent} />,
  <UI.Upload action="/upload" onChange={ignoreEvent} />,
  <UI.Tooltip onVisibleChange={ignoreEvent} />,
  <UI.Typography.Text onCopy={ignoreEvent} />,
];

/** 子路径导出的回调应提供上下文类型，错误类型仍会被拒绝。 */
export const checkboxInference = (
  <Checkbox
    onChange={
      // Checkbox change 使用组件公开事件，不能退化为 DOM Event 或 any。
      (event) => {
        expectType<CheckboxChangeEvent>(event);
        expectType<boolean>(event.target.checked);
        // @ts-expect-error checked 是 boolean，不能被推导为 string。
        expectType<string>(event.target.checked);
      }
    }
  />
);
/** 可见性事件应保留 boolean 参数。 */
export const dropdownInference = (
  <Dropdown
    onVisibleChange={
      // 不手动标注参数，以验证发布声明提供的上下文推导。
      (visible) => {
        expectType<boolean>(visible);
        // @ts-expect-error 可见性不能被当作字符串。
        expectType<string>(visible);
      }
    }
  />
);
/** 菜单项点击仍约束为 MouseEvent。 */
export const itemInference = (
  <DropdownItem
    onClick={
      // 标准事件回调应推导鼠标坐标等 DOM 字段。
      (event) => {
        expectType<MouseEvent>(event);
        // @ts-expect-error MouseEvent 不是 KeyboardEvent。
        expectType<KeyboardEvent>(event);
      }
    }
  />
);
/** Form 字段 change 附加表单值，blur 等普通事件不附加参数。 */
export const formInference = (
  <FormInput
    field="name"
    onChange={
      // 字段回调必须同时保留底层的值、原始事件和包装层追加的表单值。
      (value, event, values) => {
        expectType<string>(value);
        expectType<Event>(event);
        expectType<Record<string, unknown>>(values);
        // @ts-expect-error 文本字段的值不能被推导为 number。
        expectType<number>(value);
      }
    }
  />
);
/** number 字段和 Upload 包装器也必须具备正确的专有参数类型。 */
export const numberInference = (
  <FormInputNumber
    field="count"
    onChange={
      // 验证包装层没有将控件值统一放宽为 unknown。
      (value, event, values) => {
        expectType<string | number | undefined>(value);
        expectType<Event | null | undefined>(event);
        expectType<Record<string, unknown>>(values);
      }
    }
  />
);
/** Upload change 沿用 payload，并在其后追加当前表单值。 */
export const uploadInference = (
  <FormUpload
    field="files"
    action="/upload"
    onChange={
      // 文件列表来自 UploadChangePayload，不是 Form 自行定义的替代结构。
      (payload, values) => {
        expectType<UI.UploadFileItem[]>(payload.fileList);
        expectType<Record<string, unknown>>(values);
      }
    }
  />
);

/** 未注入表单的 Checkbox 沿用底层事件；表单值只在注入后追加。 */
export const optionalFieldInference = (
  <Form.Checkbox
    onChange={
      // 不传 field 时不能承诺一定存在表单值。
      (event, values) => {
        expectType<CheckboxChangeEvent>(event);
        expectType<Record<string, unknown> | undefined>(values);
        // @ts-expect-error 可选字段的表单值可能不存在。
        expectType<Record<string, unknown>>(values);
      }
    }
  />
);

/** 连字符事件用对象的 satisfies 检查键名，避免 TSX 对未知连字符属性的特殊放行。 */
export const hyphenatedListeners = {
  'onAfter-visible-change': ignoreEvent,
} satisfies InstanceType<typeof UI.Sidebar>['$props'];

/** 用错误的字符串参数检查监听器约束，避免正向用例被宽泛类型蒙混通过。 */
declare const stringHandler: (value: string) => void;
/** 可见性和文本字段均不接受 number 参数。 */
declare const numberHandler: (value: number) => void;
/** 菜单项点击不接受 KeyboardEvent。 */
declare const keyboardHandler: (event: KeyboardEvent) => void;
// @ts-expect-error Checkbox change 不能接受 string 回调。
export const invalidCheckbox = <Checkbox onChange={stringHandler} />;
// @ts-expect-error Dropdown 可见性回调不能接受 number。
export const invalidDropdown = <Dropdown onVisibleChange={numberHandler} />;
// @ts-expect-error 菜单项点击不能接受键盘事件回调。
export const invalidItem = <DropdownItem onClick={keyboardHandler} />;
// @ts-expect-error Form.Input change 不能接受 number 值。
export const invalidField = <Form.Input field="name" onChange={numberHandler} />;
// @ts-expect-error 未声明的事件必须被拒绝。
export const invalidEvent = <UI.Select onMadeUp={ignoreEvent} />;

/** 类型修复还应保留组件通过 defineExpose 提供的方法。 */
declare const checkboxRef: InstanceType<typeof Checkbox>;
/** Dropdown 的定位和弹层方法来自其公开实例。 */
declare const dropdownRef: InstanceType<typeof Dropdown>;
expectType<CheckboxExposed>(checkboxRef);
expectType<DropdownExposed>(dropdownRef);

/** 根入口与子路径均须公开关闭按钮尺寸，合法档位可用于模板及 TSX。 */
export const overlayCloseSizes = [
  <UI.Modal closeButtonSize="default" />,
  <UI.SideSheet closeButtonSize="large" />,
  <SizedModal closeButtonSize="small" />,
  <SizedSideSheet closeButtonSize="default" />,
];
// @ts-expect-error ButtonSize 不支持 medium，不能将弹层 size 枚举混入关闭按钮。
export const invalidModalCloseSize = <SizedModal closeButtonSize="medium" />;
// @ts-expect-error SideSheet 同样必须限制为 ButtonSize。
export const invalidSideSheetCloseSize = <SizedSideSheet closeButtonSize="medium" />;
