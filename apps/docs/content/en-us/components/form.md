---
title: 'Form'
description: 'Field values, validation, layouts and dynamic forms.'
locale: 'en-US'
slug: 'form'
category: 'input'
order: 40
englishTitle: 'Form'
icon: 'doc-form'
upstream: 'input/form'
---

Form manages field values, errors, touched state, validation, submission and reset. This page adapts all **39 live examples** from the pinned Semi Design **v2.102.0** documentation using Vue props, emits, slots and composables. Documentation coverage does not imply completed React/Vue pixel comparison.

## Forms and fields

Form owns state; a Field binds a control to a field path. Initialize through initValues/initValue, not the underlying control value, defaultValue, checked, defaultChecked or an additional v-model. Checkbox/Radio children inside their corresponding Group do not need individual field paths.

```vue
<script setup lang="ts">
import { Form } from '@aifuxi/semi-ui-vue/form';
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
</script>

<template>
  <Form :init-values="{ name: 'Semi' }">
    <Form.Input field="name" label="Name" />
  </Form>
</template>
```

Import public component and style subpaths only. Form CSS supplies layout; Input, Select and other controls also need their own styles. Vue supports both Form.Input compound members and named exports such as FormInput.

## Examples

### Basic declaration

Use field to declare a value path. Labels default to the field name. Form manages the value of Form.Input and other fields; @value-change receives the value snapshot and the changed fields.

::demo-block{demo="form/en-US/Basic" title="Basic declaration"}
::

### Declaring content with render

The render callback receives { formState, formApi, values } and returns a Vue VNode. This example uses h(RenderFields, scope) to delegate the template to an SFC. Do not combine render with component or a default slot.

::demo-block{demo="form/en-US/Render" title="Declaring content with render"}
::

### Default scoped slot

The default scoped slot is the recommended Vue declaration. formState contains values, errors and touched; reading these in the template displays current state.

::demo-block{demo="form/en-US/ScopedSlot" title="Default scoped slot"}
::

### Declaring a component

component accepts a Vue component that receives the same scope as props. Separate components can reuse field groups. Injection composables still need to run below the Form provider.

::demo-block{demo="form/en-US/Component" title="Declaring a component"}
::

### Supported fields

Supported controls include Input, InputNumber, TextArea, Select, Checkbox/CheckboxGroup, Radio/RadioGroup, DatePicker, TimePicker, Switch, Slider, TreeSelect, Cascader, Rating, AutoComplete, Upload, TagInput and PinCode. Original control props such as size and placeholder remain available. Dates are fixed and Upload uses a custom trigger for local file selection without requests.

::demo-block{demo="form/en-US/SupportedFields" title="Supported fields"}
::

### Binding field paths

field accepts dot paths, array indices and quoted keys. These six fields create nested objects and arrays directly; there is no need to flatten nested business data.

::demo-block{demo="form/en-US/ValuePaths" title="Binding field paths"}
::

### Vertical layout

The default vertical layout arranges fields in rows. The slot value values.agree controls submission. @submit fires only after validation succeeds and this example displays its result locally.

::demo-block{demo="form/en-US/Vertical" title="Vertical layout"}
::

### Horizontal layout

layout="horizontal" arranges fields horizontally with wrapping. labelPosition independently controls where labels appear.

::demo-block{demo="form/en-US/Horizontal" title="Horizontal layout"}
::

### Label position and alignment

labelPosition supports top, left and inset. This example compares top/left dynamically. labelAlign controls text alignment and labelWidth controls width; explicit field props override Form defaults.

::demo-block{demo="form/en-US/LabelLayout" title="Label position and alignment"}
::

### Grid layout

Use Grid Row/Col to arrange several fields in one row. The example compares three and four columns. Grid controls field containers while control styles determine their own width.

::demo-block{demo="form/en-US/Grid" title="Grid layout"}
::

### Form sections

Form.Section adds a title and separator without creating another FormState. Basic information, pass criteria, timing and participants share one Form.

::demo-block{demo="form/en-US/Sections" title="Form sections"}
::

### wrapperCol / labelCol

labelCol and wrapperCol accept Grid span/offset. This example uses 2/20 columns with left-positioned, right-aligned labels. Provide both props to enable the two-column field layout.

::demo-block{demo="form/en-US/LabelColumns" title="wrapperCol / labelCol"}
::

### Hidden labels and pure

noLabel removes only the label and retains field/error wrappers. pure manages data only and omits Label, ErrorMessage and extraText DOM. Provide accessible names when visible labels are omitted.

::demo-block{demo="form/en-US/NoLabel" title="Hidden labels and pure"}
::

### Inset labels

labelPosition="inset" places labels inside controls that support it. Input, Select and DatePicker are demonstrated; custom third-party controls do not automatically support this layout.

::demo-block{demo="form/en-US/Inset" title="Inset labels"}
::

### Using Form.Slot

Form.Label and Form.ErrorMessage are also usable independently. Form.Slot gives arbitrary content the Form label layout, but does not register a field or manage its value. This example explicitly composes ErrorMessage.

::demo-block{demo="form/en-US/Slot" title="Using Form.Slot"}
::

### Validation status and helpText

helpText shares the validation message area and errors take priority. extraText may remain visible alongside errors. Password length switches between error/warning/success; a weak password is a warning that passes validation. The generated demo value is deterministic.

::demo-block{demo="form/en-US/HelpText" title="Validation status and helpText"}
::

### extraText position

extraTextPosition="middle" places hints between label and control; bottom places them after the control. Field props override Form settings. A multiline middle hint may affect first-line alignment with a left label.

::demo-block{demo="form/en-US/ExtraText" title="extraText position"}
::

### Combining fields with InputGroup

Form.InputGroup combines a dialing prefix and phone number under one label. Each Field still owns its value and validation. Initialize with initValue, not the underlying control defaultValue.

::demo-block{demo="form/en-US/InputGroup" title="Combining fields with InputGroup"}
::

### Form inside Modal

Call formApi.validate() from the Modal confirmation handler and handle rejection. Close only after validation succeeds. Do not call the external API before Form mounts. Results remain local.

::demo-block{demo="form/en-US/Modal" title="Form inside Modal"}
::

### Initial values and validation rules

initValues is consumed once at mount. A Field initValue takes precedence. rules uses async-validator; stopValidateWithError stops after the first failing rule.

::demo-block{demo="form/en-US/InitialRules" title="Initial values and validation rules"}
::

### Synchronous form validation

The form-level validator(values) returns an error object or an empty string. When it is configured, submission/manual form validation does not also invoke field validators. Nested errors follow the value structure; this example intentionally retains familyName errors to demonstrate their mapping.

::demo-block{demo="form/en-US/FormValidator" title="Synchronous form validation"}
::

### Asynchronous form validation

A form-level validator can return a Promise. This example waits two seconds and checks name=mike and sex=female locally without a remote service.

::demo-block{demo="form/en-US/AsyncFormValidator" title="Asynchronous form validation"}
::

### Custom field validation

A field validator(value, values) returns an error string, an empty string/undefined on success, or a Promise. validate is a compatibility alias; use validator in new code. trigger controls when validation runs.

::demo-block{demo="form/en-US/FieldValidator" title="Custom field validation"}
::

### Silent validation

validate({ silent: true }) still resolves with values or rejects with errors, but does not update visible errors. Use it to check whether a step can proceed. It does not automatically clear previously displayed errors.

::demo-block{demo="form/en-US/SilentValidation" title="Silent validation"}
::

### Partial validation and reset

validate([paths]) and reset([paths]) operate on selected fields; parent paths can include descendants. An empty array is not whole-form validation. Pass the full scope or omit arguments for a whole-form operation.

::demo-block{demo="form/en-US/PartialValidation" title="Partial validation and reset"}
::

### Dependent fields

Use FormApi in a field @change handler to update another field. Form remains the value owner; do not add an independent v-model to Form.Field.

::demo-block{demo="form/en-US/Dependencies" title="Dependent fields"}
::

### Conditional fields

Use v-if and current values to add or remove fields. Unmounting normally clears the value, error and touched state. To preserve state, use keepState or keep the field mounted.

::demo-block{demo="form/en-US/Dynamic" title="Conditional fields"}
::

### Preserving conditional field state

keepState preserves value/error/touched across unmount and restores them on remount. The example compares retained and ordinary fields with a separate visibility toggle.

::demo-block{demo="form/en-US/KeepState" title="Preserving conditional field state"}
::

### Using ArrayField

The ArrayField slot provides arrayFields, add and addWithInitValue. Render each row with its stable key and supplied field path. Remove a row with its remove() function instead of caching APIs by index.

::demo-block{demo="form/en-US/ArrayFields" title="Using ArrayField"}
::

### Nested ArrayField

A nested ArrayField uses the parent row path followed by .rules. The child SFC manages conditions while the outer scope manages rule groups. Adding/removing rows updates the data paths.

::demo-block{demo="form/en-US/NestedArrays" title="Nested ArrayField"}
::

### useFormApi

Call useFormApi() in setup of a descendant of Form to obtain the nearest provider API. The component that renders Form itself is not yet inside that provider.

::demo-block{demo="form/en-US/UseFormApi" title="useFormApi"}
::

### useFormState

useFormState() returns a read-only reactive Ref, automatically unwrapped in templates. In script, read .value. Do not mutate the returned state to update the form.

::demo-block{demo="form/en-US/UseFormState" title="useFormState"}
::

### useFieldApi

useFieldApi("name") returns getter/setter methods bound to one field. It must also run in a Form descendant.

::demo-block{demo="form/en-US/UseFieldApi" title="useFieldApi"}
::

### useFieldState

useFieldState(field) returns a ComputedRef containing value/error/touched. Separate observer components can track different paths. A one-time API snapshot is not a reactive source.

::demo-block{demo="form/en-US/UseFieldState" title="useFieldState"}
::

### withFormApi

withFormApi(Component) injects a formApi prop for React HOC migration. This example wraps a real SFC declaring a FormApi prop; new Vue code will usually prefer a composable.

::demo-block{demo="form/en-US/WithFormApi" title="withFormApi"}
::

### withFormState

withFormState(Component) injects current FormState and updates it when state changes. The receiving component treats props as read-only.

::demo-block{demo="form/en-US/WithFormState" title="withFormState"}
::

### Wrapping a native control

withField/createFormField connects a native control to the form. Vue options are valueProp, onUpdateEvent (a listener key such as onChange) and valuePath. This example extracts Event.target.value and filters non-DOM props.

::demo-block{demo="form/en-US/CustomNative" title="Wrapping a native control"}
::

### Wrapping a compound control

A compound control can be one object-valued field containing name/role. The child emits a new object rather than mutating its value prop.

::demo-block{demo="form/en-US/CustomObject" title="Wrapping a compound control"}
::

### Using Form.useForm()

useForm() (also Form.useForm()) returns [formApi, formStateRef, valuesComputedRef]. Bind the API with <Form :form="api"> and use events after mount to change values, reset or submit externally.

::demo-block{demo="form/en-US/ExternalForm" title="Using Form.useForm()"}
::

## API reference

The tables preserve the pinned upstream API semantics, with Vue emits and VNodeChild replacing React-specific contracts. Public subpath exports define the TypeScript contract.

### Form Props

| Properties            | Instructions                                                                                                                                                                                                                                                                                   | Type                                               | Default    |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ---------- |
| autoScrollToError     | If setting true，when submit or call formApi.validate () fails verification, it will automatically scroll to the wrong field, object config refer to [options](https://github.com/stipsan/scroll-into-view-if-needed#options)                                                                  | boolean\| object                                   | false      |
| allowEmpty            | Whether to keep the key of the null field in the values, keep the key when true, and remove the key when false                                                                                                                                                                                 | boolean                                            | false      |
| component             | Vue component declaring fields; choose component, render or default slot                                                                                                                                                                                                                       | Component                                          | —          |
| className             | Classname for form tag                                                                                                                                                                                                                                                                         | string                                             |
| disabled              | If true, all fields inside the form structure will automatically inherit the disabled attribute                                                                                                                                                                                                | boolean                                            | false      |
| extraTextPosition     | The extraTextPosition property applied to each Field uniformly controls the display position of extraText. Middle (the vertical direction is displayed in the order of Label, extraText, and Field), bottom (the vertical direction is displayed in the order of Label, Field, and extraText)  | string                                             | 'bottom'   |
| getFormApi            | This function will be executed once when the form is mounted and returns formApi. <br/>formApi can be used to modify the internal state of the form (value, touched, error)                                                                                                                    | function (formApi: object)                         |            |
| form                  | External formApi instance created by `Form.useForm()`. Used to control form state from outside the Form component. **>=2.94.0**                                                                                                                                                                | object                                             |            |
| initValues            | Used to uniformly set the initial value of the form <br/>(will be consumed only once when form is mount)                                                                                                                                                                                       | object                                             |            |
| layout                | The layout of fields, optional `horizontal` or `vertical`                                                                                                                                                                                                                                      | string                                             | 'vertical' |
| labelCol              | Uniformly applied to the label label layout of each Field, with [Col Component](/en-us/components/grid/), <br/>set `span` and `offset`, such as {span: 6, offset: 2}                                                                                                                           | object                                             |
| labelAlign            | Text-align value of label                                                                                                                                                                                                                                                                      | string                                             | 'left'     |
| labelPosition         | Location of label in Field, optional 'top', 'left', 'inset' <br/> (inset label only partial component support)                                                                                                                                                                                 | string                                             | 'top'      |
| labelWidth            | Width of field'r label                                                                                                                                                                                                                                                                         | string\|number                                     |            |
| @change               | Callback invoked when form update, including Fields mount/unmount / value change / <br/> blur / validation status change / error status change.                                                                                                                                                | function (formState: object)                       |            |
| @error-change         | Callback when the validation state of form updated. The first parameter: formState.errors, second parameter: name of the field that has changed and it's error message (available after v2.66)                                                                                                 | function(values:object, changedError: object)      |            |
| @value-change         | Callback invoked when form values update. The first parameter: formState.values, second parameter: name of the field and it's value                                                                                                                                                            | function (values: object, changedValue: object)    |
| @reset                | Callback invoked after clicked on reset button or executed `formApi.reset()`                                                                                                                                                                                                                   | function ()                                        |            |
| @submit               | Callback invoked after clicked on submit button or executed `formApi.submit()`, <br/>and all validation pass.                                                                                                                                                                                  | function (values: object, e: event)                |            |
| @submit-fail          | Callback invoked after clicked on submit button or executed `formApi.submit()`,<br/> but validate failed.                                                                                                                                                                                      | function (error: object, values: object, e: event) |            |
| render                | For declaring fields, not used at the same time as component, default slot                                                                                                                                                                                                                     | function                                           |
| showValidateIcon      | Whether the verification information block in the field automatically adds the corresponding status icon display                                                                                                                                                                               | boolean                                            | true       |
| style                 | inline style of form element                                                                                                                                                                                                                                                                   | object                                             |
| stopValidateWithError | Apply stopValidateWithError to each Field uniformly. For usage instructions, see the API of the same name in Field props (available after v2.42)                                                                                                                                               | boolean                                            | false      |
| stopPropagation       | Whether to prevent submit or reset events from bubbling. This is used in nested Form scenarios to prevent events from propagating outwards when the inner Form submits or resets, triggering events in the outer Form. The default is `{ reset: false, submit: false }`(available after v2.63) | object                                             |            |
| trigger               | Apply the trigger uniformly to each Field to control the timing of verification. For detailed instructions, see the API of the same name in Field props.(available after v2.42)                                                                                                                | string\|array                                      | 'change'   |
| validator             | Form-level custom validation function (**recommended**, available after v2.97.0). Called at submit or formApi.validate(). <br/>Supports synchronous / asynchronous functions                                                                                                                   | function (values)                                  |            |
| validateFields        | Form-level custom validation function (**deprecated**, use validator; still compatible). Called at submit or formApi.validate(). <br/>Supports synchronous / asynchronous functions                                                                                                            | function (values)                                  |            |
| wrapperCol            | Uniformly apply the layout on each Field, with [Col component](/en-us/components/grid/), <br/>set `span`, `span` values, such as {span: 20, offset: 4}                                                                                                                                         | object                                             |

### FormState

| Name    | Instructions                                                                                                                     | Initial value | Example                       |
| ------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------- | ----------------------------- |
| values  | Value Collection of the form                                                                                                     | {}            | {fieldA: 'str', fieldB: true} |
| errors  | Form error information collection, you can decide whether to allow users to submit by judging whether there is error information | {}            | {fieldA: 'length not valid'}  |
| touched | The collection of fields the user has clicked on                                                                                 | {}            | {fieldA: true}                |

### FormApi

| Function      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | example                                                                                                                                                                                                                          |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| getFormProps  | Get Form Component Props, support after v2.57.0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | formApi.getFormProps(propNames?: string[])                                                                                                                                                                                       |
| getFormState  | Get FormState                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | formApi.getFormState()                                                                                                                                                                                                           |
| submitForm    | Manually submit form operation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | formApi.submitForm()                                                                                                                                                                                                             |
| reset         | Reset the form manually                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | formApi.reset(fields?: Array <string\>)                                                                                                                                                                                          |
| validate      | Manually trigger validation of the entire form. the verification of the entire Field will be triggered by default when no parameters are passed , if you want to trigger the verification of some fields, pass in the target field array <br/><br/> After the Form level validator is configured, the Field level validator will not be triggered again when submit or formApi.validate()<br/><br/>**Supported since v2.94.0**: Pass `{ silent: true }` to get validation results without triggering UI updates (no error messages shown, no touched state set). You can also use `{ fields: ['fieldA'], silent: true }` to perform silent validation on specific fields.                                                                                                                          | formApi.validate() <br/>.then(values ​​=> {})<br/>.catch(errors => {})<br/>OR formApi.validate(['fieldA','fieldB'])<br/>OR formApi.validate({ silent: true })<br/>OR formApi.validate({ fields: ['fieldA'], silent: true })<br/> |
| setValues ​​  | Set the values ​​of the entire form. The isOverride in the second parameter is false by default. <br/> **When isOverride is false**: Iterate through all registered fields in the Form, and update the values from `newValues` to `formState.values`. If a registered field is not included in `newValues`, that field will be set to undefined. <br/> **When isOverride is true**: Directly replace `formState.values` with `newValues`, including extra keys in `newValues` that don't have corresponding fields in the form. <br/><br/> **Recommended usage**: If you only need to update some fields, it's recommended to use `formApi.setValue(field, value)` for individual updates, or get current values first then merge: `formApi.setValues({ ...formApi.getValues(), name: newValue })` | formApi.setValues(newValues: object, {isOverride: boolean})                                                                                                                                                                      |
| getValues ​​  | Get the values of all Field                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | formApi.getValues()                                                                                                                                                                                                              |
| setValue      | provides direct modification of formState.values ​​method.<br/>The difference from `setValues` ​​is that it only modifies a single field.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | formApi.setValue(field: string, newFieldValue: any)                                                                                                                                                                              |
| getValue      | Get the value of all / single Field                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | formApi.getValue()<br/>formApi.getValue(field: string)                                                                                                                                                                           |
| setTouched    | Modify formState.touched                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | formApi.setTouched(field: string, isTouched: boolean)<br/>                                                                                                                                                                       |
| getTouched    | Get the touched state of the Field                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | formApi.getTouched(field: string)                                                                                                                                                                                                |
| setError      | Modify the error information of a field                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | formApi.setError(field: string, fieldErrorMessage: string)                                                                                                                                                                       |
| getError      | Get Error Status of Field                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | formApi.getError(field: string)                                                                                                                                                                                                  |
| getFieldExist | Get whether the field exists in the Form                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | formApi.getFieldExist(field: string)                                                                                                                                                                                             |
| scrollToField | Scroll to the specified field, the second input parameter will be passed to scroll-into-view-if-needed                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | formApi.scrollToField(field: string, scrollOpts: [ScrollIntoViewOptions](https://github.com/stipsan/scroll-into-view-if-needed#options))                                                                                         |
| scrollToError | Scroll to the field with validation error. You can pass a specified field or index. If you pass index, scroll to the index-th error DOM. If you do not pass any parameters, scroll to the first validation error position in the DOM tree. Available after v2.61.0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | formApi.scrollToError(<ApiType detail='{field?: string; index?: number; scrollOpts?: ScrollIntoViewOptions }'>ScrollToErrorOptions</ApiType>)                                                                                    |

### Field Props

| Properties            | Description                                                                                                                                                                                                                                                                                                                    | Type                                          | Default   | Examples                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------- | --------- | ------------------------------------------------------------------ |
| field                 | The mapping path of the field's value in formState.values. Form will use this value to distinguish the internal form control. <br/> **Required!!!**                                                                                                                                                                            | string                                        |           |                                                                    |
| label                 | The label text for this field. When not passed, it defaults to the same name as field                                                                                                                                                                                                                                          | string                                        |           |
| labelPosition         | Label position of this field, optional 'top' / 'left' / 'inset'                                                                                                                                                                                                                                                                | string                                        |           |
| labelAlign            | Text-align of the label text of this field                                                                                                                                                                                                                                                                                     | string                                        |           |
| labelWidth            | The width of the label text of this field                                                                                                                                                                                                                                                                                      | string\|number                                |           |
| noLabel               | When you don't need to add label automatically, you can set this value to true                                                                                                                                                                                                                                                 | boolean                                       |           |
| name                  | Field name. When passed in, the corresponding className will be automatically added to the field wrapper div, such as: money => '.semi-form-field-money'. After v2.24, the name will also be transparently transmitted to the underlying component for consumption. For example, you can configure the name attribute of input | string                                        |           |
| fieldClassName        | The className of the entire fieldWrapper is the same as the name parameter, except that the prefix is ​​not automatically appended                                                                                                                                                                                             | string                                        |           |
| fieldStyle            | The inline style of the entire fieldWrapper                                                                                                                                                                                                                                                                                    | object                                        |           |
| initValue             | The initial value of the field (consumed only once when Field mounted, subsequent updates are invalid), it has higher priority than the values ​​in Form's initValues ​​                                                                                                                                                       | any(type depends on current component)        |           |
| validator             | The custom validation function for this form control (**recommended**, available after v2.97.0). Supports synchronous and asynchronous validation. <br/>Rules does not take effect when validator is set                                                                                                                       | function(fieldValue, values)                  |           | (fieldValue) => fieldValue.length>5? 'error balabala': ''          |
| validate              | The custom validation function for this form control (**deprecated**, use validator; still compatible). Supports synchronous and asynchronous validation. <br/>Rules does not take effect when validator/validate is set                                                                                                       | function(fieldValue, values)                  |           | (fieldValue) => fieldValue.length>5? 'error balabala': ''          |
| rules                 | validation rules, validation library based on [async-validator](https://github.com/yiminghe/async-validator)                                                                                                                                                                                                                   | array                                         |           | const rules = \[{type:' string ', message:' invalidate string'} \] |
| validateStatus        | The validation result status of this form control, optional: `success` / `error` / `warning` / `default`                                                                                                                                                                                                                       | string                                        | 'default' |
| trigger               | The timing of triggering the verification, optional: `blur` / `change` / `custom` / `mount` <br/> 1. When set to custom, only formApi will trigger the verification <br/> 2.mount (triggered once when mounting)                                                                                                               | string                                        | 'change'  |
| @change               | Called when the field changes; the final argument contains the latest form values. Use `@change="handleChange"`.                                                                                                                                                                                                               | `(fieldValue, event, ...args, latestValues?)` | —         |
| transform             | transform field values before validation                                                                                                                                                                                                                                                                                       | function(fieldValue)                          |           | (value) => Number(value)                                           |
| allowEmptyString      | Whether to allow values to be empty strings. <br/>When the value is '' by default, the key corresponding to this field will be removed from `values`. <br/>If you want to keep the key, you need to set allowEmptyString to true                                                                                               | boolean                                       |           | false                                                              |
| keepState             | Whether to retain the field state (value, error, touched) after the field is unmounted. When true, the field's value, validation message, and interaction state are preserved after unmounting, and will be automatically restored upon remounting                                                                             | boolean                                       |           | false                                                              |
| convert               | After the field value changes, before rerender, update the value of filed                                                                                                                                                                                                                                                      | function(fieldValue)                          |           | (value) => newValue                                                |
| stopValidateWithError | When it is true, the rules check is used. After encountering the first rule that fails the check, it will no longer trigger the check of subsequent rules                                                                                                                                                                      | boolean                                       |           | false                                                              |
| helpText              | Custom prompt information, which is displayed in the same block as the verification information. When both have values, the verification information is displayed first                                                                                                                                                        | VNodeChild                                    |           |                                                                    |
| extraText             | Additional prompt information, you can use this when both error information and prompt copy are required, after helpText/errorMessage                                                                                                                                                                                          | VNodeChild                                    |           |                                                                    |
| pure                  | Whether to only take over the data stream, when true, it will not automatically insert modules such as ErrorMessage, Label, extraText, etc. The style and DOM structure are consistent with the original components                                                                                                            | boolean                                       | false     |                                                                    |
| extraTextPosition     | controls the display position of extraText. Middle (the vertical direction is displayed in the order of Label, extraText, and Field), bottom (the vertical direction is displayed in the order of Label, Field, and extraText)                                                                                                 | string                                        | 'bottom'  |                                                                    |
| ...other              | The other configurable properties of the component can be passed in together with the above properties, such as the size / placeholder of Input，**Field passes it to the component itself**                                                                                                                                   |

### ArrayField Props

| Properties   | Description                                                                                                                                                                                                                                          | Type        | Default |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------- |
| field        | The mapping path of the value of the form control in formState.values<br/>Required, for example, there is an ArrayField responsible for rendering a[0].name, a[1].name, a[2].name three lines, their The parent is a, here props.field should be `a` | string      |         |
| initValue    | The initial value of ArrayField, if the initial value is configured in both formProps.initValues and arrayFieldProps.initValue, the priority of the latter is higher                                                                                 | Array       | []      |
| default slot | Scope is `{ arrayFields, add, addWithInitValue }`; each row has key/field/remove                                                                                                                                                                     | scoped slot | —       |

### Form.Section

| Properties   | Description        | Type       |
| ------------ | ------------------ | ---------- |
| text         | Title of section   | VNodeChild |
| className    | Classname          | string     |
| style        | Inline style       | object     |
| default slot | Content of section | VNodeChild |

### Form.Label

| Properties | Description                                                                                                                                                                                                                                         | Type       | Default |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------- |
| text       | Label content                                                                                                                                                                                                                                       | VNodeChild |         |
| required   | Whether to show the required \*                                                                                                                                                                                                                     | boolean    | false   |
| extra      | Content after required                                                                                                                                                                                                                              | VNodeChild |         |
| align      | Text-align                                                                                                                                                                                                                                          | string     | 'left'  |
| className  | Classname of label wrapper                                                                                                                                                                                                                          | string     |         |
| style      | Inline style                                                                                                                                                                                                                                        | string     |         |
| width      | Label width                                                                                                                                                                                                                                         | number     |         |
| optional   | Whether to automatically append the "(optional)" text mark after the text (automatically switch the same semantic text according to different languages configured by Locale). When this item is true, the required \* will no longer be displayed. | boolean    | false   | v2.18.0 |

### Form.InputGroup

| Properties        | Description                                                                                                                                                                                                                | Type            | Default  | Version |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | -------- | ------- |
| className         | Classname of Form.InputGroup                                                                                                                                                                                               | string          |          |
| style             | Inline style                                                                                                                                                                                                               | object          |          |
| label             | Label text of Form.InputGroup                                                                                                                                                                                              | Label \| string |          |
| labelPosition     | Label position，optional: 'top'/'left'. When Form and InputGroup are passed in at the same time, the InputGroup props shall prevail                                                                                        | string          | 'top'    |
| extraText         | Additional prompt information, when the error message and prompt text need to appear at the same time, you can use this, located after errorMessage                                                                        | VNodeChild      |          | v2.29.0 |
| extraTextPosition | Control the display position of extraText, optional `middle` (vertical direction is displayed in the order of Label, extraText, Group), `bottom` (vertical direction is displayed in the order of Label, Group, extraText) | string          | 'bottom' | v2.29.0 |

### Form.Slot

| Properties   | Instructions                                                                                                                                                                                            | Type           | Default |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------- |
| label        | Slot's [Label configuration](#Form.Label), for example {text: 'semi', align: 'left'}; can also be passed directly into string, inside the Slot will be automatically encapsulated in legal Label format | object\|string |         |
| className    | Classname of Slot Wrapper                                                                                                                                                                               | string         |         |
| style        | Slot inline style                                                                                                                                                                                       | object         |         |
| default slot | Content of slot. You can place your custom component here                                                                                                                                               | VNodeChild     |         |

The current public FormSlotComponentProps declares label/className/style; runtime error/labelPosition/noLabel support is not fully represented in this type. This page composes Form.ErrorMessage explicitly rather than presenting that typing gap as a new public contract.

### Form.ErrorMessage

| Properties       | Instructions                                                                                                                                     | Type                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------- |
| error            | Error message content                                                                                                                            | array\|VNodeChild\|boolean |
| className        | Classname of ErrorMessage wrapper                                                                                                                | string                     |
| style            | Inline style                                                                                                                                     | object                     |
| showValidateIcon | Whether to automatically add the icon corresponding to validateStatus                                                                            | boolean                    |
| validateStatus   | The verification status of the information, optional: default/error/warning/success (success is generally recommended to be the same as default) | string                     |

### Public type additions

| Scope             | Props / methods                                            | Type / meaning                                                                  |
| ----------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Form              | id, ariaLabel                                              | string; form DOM identity and accessible name; aria-label can also fall through |
| Field             | noErrorMessage                                             | boolean; hides the automatic error area while retaining validation              |
| Field             | labelCol, wrapperCol                                       | ColProps; override Form column settings                                         |
| Field             | required                                                   | boolean; explicit required indication                                           |
| Field             | emptyValue                                                 | unknown; control empty-value adaptation                                         |
| Form.Label        | id, name, disabled                                         | Label identity, associated control name and disabled state                      |
| Form.ErrorMessage | helpText, helpTextId, errorMessageId                       | Hint content and accessible association IDs                                     |
| Form.ErrorMessage | isInInputGroup                                             | boolean; message layout inside a field group                                    |
| FormApi           | getInitValue(field), getInitValues(), getFieldExist(field) | Read initial snapshots and field registration                                   |

### Vue extensions and helper types

| API                                                     | Contract                                                                                      |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| useForm() / Form.useForm()                              | Returns [FormApi, Ref<FormState>, ComputedRef<Values>]; bind the API to Form.form             |
| useFormApi() / useFormState()                           | Nearest API / read-only state Ref in a Form descendant setup                                  |
| useFieldApi(field)                                      | getValue/setValue/getError/setError/getTouched/setTouched                                     |
| useFieldState(field)                                    | ComputedRef containing value, error and touched                                               |
| withFormApi(Component) / withFormState(Component)       | Compatibility wrappers injecting api/state as props                                           |
| withField(Component, options) / createFormField / Field | Converts a control into a field with CommonFieldProps                                         |
| ArrayField slot                                         | add(index?), addWithInitValue(value, index?), arrayFields; each item has key, field, remove() |

### withFieldOption

| Vue option     | Description                                              | Default             |
| -------------- | -------------------------------------------------------- | ------------------- |
| valueProp      | Control value prop, such as value or checked             | value               |
| onUpdateEvent  | Vue listener prop key, such as onChange (not change)     | onChange            |
| valuePath      | Path into the first event argument, such as target.value | The argument itself |
| maintainCursor | Cursor preservation for text controls                    | false               |

### FormApi and state

getValue/getValues/getFormState return snapshots. Update with setValue/setValues rather than mutating returned objects or props. Nested and independent forms have isolated contexts. setValues(values, { isOverride: true }) replaces values; the default updates each registered field and sets omitted fields to undefined; for partial updates use setValue, or merge getValues() with the partial values first. reset restores initial state rather than always clearing it. validate returns a Promise whose rejection must be handled. submitForm() validates before emitting submit or submit-fail.

@change includes mounting, unmounting, blur and validation state updates; @value-change tracks value changes. Field listeners run before Form change/value-change notifications. trigger accepts change/blur/mount/custom or an array; custom validation is initiated by API. An explicit false field prop overrides a Form boolean default; do not use truthiness to infer whether it was passed.

## React → Vue migration

| React v2.102.0                               | Vue                                        | Notes                                                                                 |
| -------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------- |
| onSubmit/onSubmitFail                        | @submit/@submit-fail                       | Same arguments, subscribed through emits                                              |
| onChange/onValueChange/onErrorChange/onReset | @change/@value-change/@error-change/@reset | Field and Form change arguments differ                                                |
| children render function                     | Default scoped slot                        | formState, formApi, values                                                            |
| render returning JSX                         | VNode / h(SFC, scope)                      | Templates are preferred; the render example retains this API                          |
| props.component                              | Vue Component                              | Receives FormSlotProps                                                                |
| React ref                                    | useForm(), getFormApi or component ref     | Do not call the API before mount                                                      |
| Hooks returning state objects                | Ref/ComputedRef                            | .value in script; auto-unwrapped in templates                                         |
| valueKey / onKeyChangeFnName                 | valueProp / onUpdateEvent                  | Use a Vue listener key such as onChange                                               |
| ReactNode                                    | VNodeChild / slot                          | Field validator currently returns string/undefined; use ErrorMessage for presentation |
| className                                    | class or compatible className              | Preserves .semi-* and --semi-* contracts                                              |
| ArrayField children                          | Scoped slot and v-for                      | Bind the supplied stable row key                                                      |

## Accessibility

### ARIA, keyboard and focus

Field builds label associations from id/name/field. Ordinary labels use for; inset labels use a div with aria-labelledby. Required rules/labels provide aria-required with control-specific handling for Switch/CheckboxGroup. Errors associate aria-invalid and aria-errormessage; hints associate aria-describedby. CheckboxGroup does not have exactly the same ARIA behavior as a single Input.

Provide accessible names when using noLabel, pure or custom controls. Keyboard behavior follows the underlying control; action buttons retain button/submit/reset semantics. In applications, move focus to an appropriate field or action after dynamically adding/removing fields. Modal focus and automatic scrolling require real Chromium checks; jsdom is insufficient.

## Content guidelines

Labels should be short field names, not instructions. Put instructions in helpText/extraText. Use sentence case in English. Error text should identify the problem and an actionable correction; submission buttons should name the action. A placeholder alone is not a sufficient accessible name.

## Design variables

Form retains .semi-form, .semi-form-field, label-position attributes and --semi-* tokens. form.css compiles the pinned Foundation SCSS, inheriting text, border and validation colors from the theme. Dark mode, RTL and Locale come from application context. Do not copy upstream SCSS or rename compatibility classes/tokens. The added examples have not yet received individual same-Chromium light/dark screenshot and computed-style comparisons.

## FAQ

- **Values do not update?** Check the required field path. Ordinary controls do not automatically register; wrap custom controls with withField.
- **defaultValue/defaultChecked does nothing?** Form owns the value. Use initValues/initValue initially and FormApi later.
- **Async data does not update initValues?** Initialization is consumed once. Call setValues when data arrives; repeatedly recreating Form can discard user input.
- **Empty strings disappear?** allowEmpty defaults to false. Use Form.allowEmpty or Field.allowEmptyString when appropriate.
- **The API is unavailable or a composable throws?** Injection composables require a Form descendant setup. For external control, use useForm and wait for mount.
- **Submission fails despite updated values?** Check whether a Form validator overrides field validation, and inspect rules, trigger and Promise rejection instead of swallowing failures.
- **How do child controls synchronize?** Use API setters or emit new values, never mutate props or getter snapshots. Keep form instances isolated.

## Sources and acceptance boundary

The source baseline is vendor/semi-design v2.102.0 at cdfba6e520fc83ad871b30f51f36d8af3aaa5a21, checked in adapter/types → Foundation/SCSS → theme → local bilingual documentation order. Live uploads, external business resources, randomness and current dates are replaced by deterministic local demonstrations. React render/HOC chapters retain their corresponding Vue mechanisms. All 39 bilingual mappings are recorded in docs/documentation/mappings/form.json. Types, static compilation and chapter coverage are documentation evidence; pixel parity, real focus, Portal, dark/RTL and published-package acceptance require separate execution.
