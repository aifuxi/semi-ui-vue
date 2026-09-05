---
title: 'DatePicker'
description: 'The date selector is used to help the user select a compliant, formatted date (time) or date (time) range.'
locale: 'en-US'
slug: 'date-picker'
category: 'input'
order: 39
englishTitle: 'DatePicker'
icon: 'doc-datepicker'
upstream: 'input/datepicker'
---

## Demos

### How to import

```ts
import { DatePicker } from '@aifuxi/semi-ui-vue/date-picker';
import '@aifuxi/semi-theme-default/date-picker.css';
```

### Basic Use

::demo-block{demo="date-picker/en-us/Basic" title="Basic Use"}
::

### Picker Density

The density can be used to control the size of the picker panel. The `compact` is the small size and the `default` is the default size. Support after v1.17.0.

::demo-block{demo="date-picker/en-us/Density" title="Picker Density"}
::

### Multiple Date Selection

Set `Multiple` to `true`, can choose multiple dates.

::demo-block{demo="date-picker/en-us/Multiple" title="Multiple Date Selection"}
::

### Date and Time Selection

Set `type` to `dateTime`, can choose date and time.  
Starting from version V2.22.0, we changed the default mode of ScrollItem in TimePicker from wheel to normal. If you want to apply the infinite scrolling effect again, you can enable it by passing in a specific configuration through timePickerOpts.

::demo-block{demo="date-picker/en-us/DateTime" title="Date and Time Selection"}
::

### Date Range Selection

Set `type` to `dateRange`, can choose the date range.

::demo-block{demo="date-picker/en-us/Range" title="Date Range Selection"}
::

> **Note**
>
> When you use range selection, if only one date is selected, @change will not be triggered at this time. Only when both the start date and the end date are selected will @change be triggered.

### Date Time Range Selection

Set `type` to `dateTimeRange`, can choose the date range and choose time;

::demo-block{demo="date-picker/en-us/DateTimeRange" title="Date Time Range Selection"}
::

### Input in Panel

Use `insetInput` to control whether the date panel is inset with the input box, the default is `false`. Supported since `v2.7.0`. Inset input boxes are suitable for the following scenarios:

- Date and time selection, you can directly input the time through the embedded input box, no need to select the time through the scroll wheel
- When `triggerRender`+ range selection, use the inset input box to modify the start and end dates independently

After `insetInput` is turned on, it includes the following functions:

- After clicking the trigger, the panel will pop up in the original position by default. You can customize the popup position by `position`
- Click the embedded date input box, the panel switches to date selection; click the embedded time input box, the panel switches to time selection
- Consistent with the external input box, if an illegal date is entered, the date will return to the previous legal date after the panel is closed

> **Notes**
>
> Note that some adjustments and restrictions will be made to the components after opening insetInput:
>
> 1. Trigger style: the trigger is read-only when the panel is not open, and the trigger is disabled when it is open
> 2. Panel style: when type includes time, hide the toggle button at the bottom
> 3. After insetInput is enabled, the `format` API only supports the `dateFormat[ timeFormat]` format. Using other formats will affect the display of the inset input box placeholder and trigger text

::demo-block{demo="date-picker/en-us/InsetInput" title="Input in Panel"}
::

### Synchronously switch months

version：>= 1.28.0

In the scenario of range selection, turning on `syncSwitchMonth` means to switch the two panels simultaneously. The default is false.

> Note: Clicking the year button will also switch the two panels synchronously. Switching the year and month from the scroll wheel will not switch the panels synchronously. This ensures the user's ability to select months at non-fixed intervals.

::demo-block{demo="date-picker/en-us/SyncMonth" title="Synchronously switch months"}
::

### Panel Change Callback

version：>=1.28.0

`@panel-change` will be called when the month or year of the panel is changed.

::demo-block{demo="date-picker/en-us/PanelChange" title="Panel Change Callback"}
::

### Select Week

`daterange` is used with `startDateOffset` and `endDateOffset` to select range with single click, such as weekly selection and biweekly selection. Support after v1.10.0.

::demo-block{demo="date-picker/en-us/Week" title="Select Week"}
::

### Selection

**Version:** > = 0.21.0

Set `type` to `month`, can make year-to-month selection.

::demo-block{demo="date-picker/en-us/Month" title="Selection"}
::

### Year and Month Range Selection

**version：** >= 2.32.0

Set `type` to `monthRange` to select the year and month range, small size and quick panel are not supported yet.

::demo-block{demo="date-picker/en-us/MonthRange" title="Year and Month Range Selection"}
::

### Confirm Date and Time Selection

**Version: > = 0.18.0**

For the selection of "datetime" (type = "dateTime") or "datetime range" (type = "dateTimeRange"), you can confirm it before writing the value into the input box. You can pass `NeedConfirm` = true to enable this behavior.

At the same time, the click callbacks of the "@confirm" and "@cancel" buttons are supported.

The following example binds three callbacks: `@change`, `@confirm` and `@cancel`, and you can open the console to see the difference in print information.

> Note: When opening `needConfirm`, you need to click the cancel button to close the panel, and clicking the blank area will no longer close the panel (v2.2.0)

::demo-block{demo="date-picker/en-us/Confirm" title="Confirm Date and Time Selection"}
::

### Date and Time Selection with Shortcuts

Pass parameter `Presets` to set shortcuts for date selection.

::demo-block{demo="date-picker/en-us/Presets" title="Date and Time Selection with Shortcuts"}
::

### Render TopSlot/BottomSlot

With `topSlot` and `bottomSlot`, you can customize the rendering of the top and bottom extra areas.

::demo-block{demo="date-picker/en-us/Slots" title="Render TopSlot/BottomSlot"}
::

```css
.components-datepicker-demo-slot {
  .semi-tabs-content {
    padding: 0;
  }

  .semi-tabs-bar-line.semi-tabs-bar-top {
    border-bottom: none;
  }
}
```

### Disable Date Selection

::demo-block{demo="date-picker/en-us/Disabled" title="Disable Date Selection"}
::

### Disable Partial Date or Time

Pass in `disabledDate` to disable the specified date, pass in `disabledTime` to disable the specified time, and with `defaultPickerValue` you can specify the year and month when the panel is opened.

`disabledDate` and`disabledTime`, the accepted input parameters are the current date, the former returns a `boolean` value, the latter returns an [object](/en-us/components/time-picker/) It will be directly passed to the `TimePicker` component.

> **Note**
>
> When you use timeZone, the Date of the first parameter is the time under the time zone you choose (similar to the first return value of @change)

::demo-block{demo="date-picker/en-us/DisabledDateTime" title="Disable Partial Date or Time"}
::

When `type` contains `range`, the date can be disabled dynamically according to the rangeStart. The `options` parameter is supported after 1.9.0

::demo-block{demo="date-picker/en-us/DisabledBeforeStart" title="Disable Partial Date or Time"}
::

When `type` contains `range`, dates can be disabled based on the focus state. The focus state is passed through the `rangeInputFocus` parameter in `options`.

::demo-block{demo="date-picker/en-us/DisabledRange" title="Disable Partial Date or Time"}
::

### Custom Display Format

Pass parameter `format` to custom display format.

::demo-block{demo="date-picker/en-us/Format" title="Custom Display Format"}
::

### Custom Trigger

**Version:** >=0.34.0

By default we use the `Input` component as the trigger for the `DatePicker` component. Customize it through the `#trigger` scoped slot or a `triggerRender` function returning VNodeChild.

The custom trigger is a complete customization of the trigger, the default clear button will not take effect, if you need clear function, please customize a clear button.

::demo-block{demo="date-picker/en-us/Trigger" title="Custom Trigger"}
::

> **Note**
>
> When DatePicker is range type, the default date selected after the panel is opened is the start date, and it will switch to the end date selection after selection. The focus is reset when the panel is closed.
> We recommend providing a clear button, when you pass an empty array to DatePicker, DatePicker will also reset focus internally. This allows the user to reselect the date range after clearing. (from v2.15)

::demo-block{demo="date-picker/en-us/RangeTrigger" title="Custom Trigger"}
::

### Custom Render Date Content

**Version：**>=1.4.0

`renderDate: (dayNumber: number, fullDate: string) => VNodeChild`

- `dayNumber`: such as `13`.
- `fullDate`: such as `2020-08-13`.

::demo-block{demo="date-picker/en-us/RenderDate" title="Custom Render Date Content"}
::

### Custom Render Date Box

**Version：**>=1.4.0

`renderFullDate: (dayNumber: number, fullDate: string, dayStatus: object) => VNodeChild`

`dayStatus` is this status of current date box. The included keys are as follows.

```ts
type DatePickerDayStatus = {
  isToday?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  isSelectedStart?: boolean;
  isSelectedEnd?: boolean;
  isInRange?: boolean;
  isHover?: boolean;
  isOffsetRangeStart?: boolean;
  isOffsetRangeEnd?: boolean;
  isHoverInOffsetRange?: boolean;
};
```

::demo-block{demo="date-picker/en-us/RenderFullDate" title="Custom Render Date Box"}
::

```css
.components-datepicker-demo-day-inrange,
.components-datepicker-demo-day-hover {
  background: var(--semi-color-primary-light-hover);
}

.components-datepicker-demo-day-selected,
.components-datepicker-demo-day-selected-start,
.components-datepicker-demo-day-selected-end {
  color: var(--semi-color-bg-2);
  background: var(--semi-color-primary);
}
```

## API Reference

### DatePickerProps

| Property                | Type                                                                                         | Default                             | Description                                                                                                                                                                                                                                   |
| ----------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ariaDescribedby`       | `string`                                                                                     | `—`                                 | Description element IDs forwarded to input aria-describedby.                                                                                                                                                                                  |
| `ariaErrormessage`      | `string`                                                                                     | `—`                                 | Error message ID forwarded to aria-errormessage.                                                                                                                                                                                              |
| `ariaInvalid`           | `boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling'`                                    | `—`                                 | Mark input validity without running validation.                                                                                                                                                                                               |
| `ariaLabelledby`        | `string`                                                                                     | `—`                                 | Label element IDs forwarded to input aria-labelledby.                                                                                                                                                                                         |
| `ariaRequired`          | `boolean \| 'false' \| 'true'`                                                               | `—`                                 | Mark the input as required without running validation.                                                                                                                                                                                        |
| `autoAdjustOverflow`    | `boolean`                                                                                    | `true`                              | Whether the floating layer automatically adjusts its direction when it is blocked                                                                                                                                                             |
| `autoFocus`             | `boolean`                                                                                    | `false`                             | Automatic access to focus                                                                                                                                                                                                                     |
| `autoSwitchDate`        | `boolean`                                                                                    | `true`                              | When the year and month are changed through the left and right buttons and the drop-down menu at the top of the panel, the date is automatically switched. Only valid for `date` type.                                                        |
| `borderless`            | `boolean`                                                                                    | `false`                             | borderless mode >=2.33.0                                                                                                                                                                                                                      |
| `bottomSlot`            | `VNodeChild`                                                                                 | `—`                                 | Extra bottom content, also available through the bottom slot.                                                                                                                                                                                 |
| `class`                 | `HTMLAttributes['class']`                                                                    | `—`                                 | Vue class binding.                                                                                                                                                                                                                            |
| `className`             | `HTMLAttributes['class']`                                                                    | `—`                                 | Class name                                                                                                                                                                                                                                    |
| `clearIcon`             | `VNodeChild`                                                                                 | `—`                                 | Can be used to customize the clear button, valid when showClear is true                                                                                                                                                                       |
| `dateFnsLocale`         | `unknown`                                                                                    | `—`                                 | date-fns locale data; defaults to Chinese or English according to localeCode.                                                                                                                                                                 |
| `defaultOpen`           | `boolean`                                                                                    | `false`                             | Panel displays or hides by default                                                                                                                                                                                                            |
| `defaultPickerValue`    | `DatePickerValue`                                                                            | `—`                                 | Default panel date                                                                                                                                                                                                                            |
| `defaultValue`          | `DatePickerValue`                                                                            | `—`                                 | Initial uncontrolled value; use v-model for subsequent changes.                                                                                                                                                                               |
| `density`               | `DatePickerDensity`                                                                          | `'default'`                         | Density of picker panel, one of `default`, `compact`                                                                                                                                                                                          |
| `disabled`              | `boolean`                                                                                    | `false`                             | Is it disabled?                                                                                                                                                                                                                               |
| `disabledDate`          | `(date?: Date, options?: DatePickerDisabledDateOptions) => boolean`                          | `() => false`                       | The date is prohibited from the judgment method, and the date is prohibited when returned to true. Options parameter supported after 1.9.0, rangeEnd supported after 1.29 and rangeInputFocus is supported since 2.22                         |
| `disabledTime`          | `( date?: Date \| Date[], panelType?: 'left' \| 'right', ) => DatePickerDisabledTimeOptions` | `() => ({})`                        | Time prohibition configuration, the return value will be transparently passed to [`TimePicker`](/en-us/components/time-picker/) as a parameter                                                                                                |
| `disabledTimePicker`    | `boolean`                                                                                    | `—`                                 | Disable time selection or not.                                                                                                                                                                                                                |
| `dropdownClassName`     | `HTMLAttributes['class']`                                                                    | `—`                                 | CSS classname for drop-down menu                                                                                                                                                                                                              |
| `dropdownMargin`        | `PopoverMargin`                                                                              | `—`                                 | Popup layer calculates the size of the safe area when the current direction overflows, used in scenes covered by fixed elements, more detail refer to [issue#549](https://github.com/DouyinFE/semi-design/issues/549), same as Tooltip margin |
| `dropdownStyle`         | `StyleValue`                                                                                 | `—`                                 | Inline style of drop-down menu                                                                                                                                                                                                                |
| `endDateOffset`         | `(selectedDate?: Date) => Date`                                                              | `—`                                 | When type is dateRange, set the end date of the selected range                                                                                                                                                                                |
| `endYear`               | `number`                                                                                     | `—`                                 | end year of the year scroll panel                                                                                                                                                                                                             |
| `format`                | `string`                                                                                     | `type`                              | Date string format displayed in the input box                                                                                                                                                                                                 |
| `getPopupContainer`     | `() => HTMLElement`                                                                          | `ConfigProvider / document.body`    | Specifies the parent DOM, and the bullet layer will be rendered to the DOM, you need to set 'position: relative` This will change the DOM tree position, but not the view's rendering position.                                               |
| `hideDisabledOptions`   | `boolean`                                                                                    | `false`                             | Hide disabled time options.                                                                                                                                                                                                                   |
| `id`                    | `string`                                                                                     | `—`                                 | Internal input ID for association with a visible label.                                                                                                                                                                                       |
| `insetInput`            | `boolean \| DatePickerInsetInputProps`                                                       | `—`                                 | Whether the input box is embedded in the panel. InsetInputProps type supported after v2.29                                                                                                                                                    |
| `insetLabel`            | `VNodeChild`                                                                                 | `—`                                 | Inset input label; also available as the insetLabel slot.                                                                                                                                                                                     |
| `insetLabelId`          | `string`                                                                                     | `—`                                 | Inset label ID.                                                                                                                                                                                                                               |
| `inputReadOnly`         | `boolean`                                                                                    | `false`                             | Is the text box readonly                                                                                                                                                                                                                      |
| `inputStyle`            | `StyleValue`                                                                                 | `—`                                 | Input styles.                                                                                                                                                                                                                                 |
| `leftSlot`              | `VNodeChild`                                                                                 | `—`                                 | Extra content on the left, also available through the left slot.                                                                                                                                                                              |
| `locale`                | `DatePickerLocale`                                                                           | `—`                                 | Override component translations; defaults to ConfigProvider data.                                                                                                                                                                             |
| `localeCode`            | `string`                                                                                     | `—`                                 | Date/time locale code; inherits ConfigProvider by default.                                                                                                                                                                                    |
| `max`                   | `number`                                                                                     | `—`                                 | When multiple is set to true, the number of selected, non-pass or value is null\|undefined, unlimited.                                                                                                                                        |
| `modelValue`            | `DatePickerValue`                                                                            | `—`                                 | Two-way binding via v-model; do not also supply value.                                                                                                                                                                                        |
| `motion`                | `boolean`                                                                                    | `true`                              | Enable panel animation.                                                                                                                                                                                                                       |
| `multiple`              | `boolean`                                                                                    | `false`                             | Whether you can choose multiple, only type = "date" is supported                                                                                                                                                                              |
| `needConfirm`           | `boolean`                                                                                    | `—`                                 | Do you need to "confirm selection", only `type= "dateTime"\| "dateTimeRange"` works.                                                                                                                                                          |
| `onChangeWithDateFirst` | `boolean`                                                                                    | `true`                              | With true, change receives (Date value, formatted text); false reverses them. v-model always receives Date values.                                                                                                                            |
| `open`                  | `boolean`                                                                                    | `—`                                 | The dropdown can be manually opened when calling                                                                                                                                                                                              |
| `placeholder`           | `string \| string[]`                                                                         | `locale.placeholder[type]`          | Input box prompts text                                                                                                                                                                                                                        |
| `position`              | `PopoverPosition`                                                                            | `LTR: bottomLeft; RTL: bottomRight` | Floating layer position, optional value with [Popover #API Reference · position](/en-us/components/popover/)                                                                                                                                  |
| `prefix`                | `VNodeChild`                                                                                 | `—`                                 | Prefix content                                                                                                                                                                                                                                |
| `presetPosition`        | `DatePickerPresetPosition`                                                                   | `'bottom'`                          | Date time shortcut panel position, optional 'left', 'right', 'top', 'bottom'                                                                                                                                                                  |
| `presets`               | `Array<DatePickerPreset \| (() => DatePickerPreset)>`                                        | `[]`                                | Date Time Shortcut, start and end support function type after v2.52                                                                                                                                                                           |
| `preventScroll`         | `boolean`                                                                                    | `—`                                 | Indicates whether the browser should scroll the document to display the newly focused element, acting on the focus method inside the component, excluding the component passed in by the user                                                 |
| `rangeSeparator`        | `string`                                                                                     | `' ~ '`                             | Custom range type picker separator of input trigger                                                                                                                                                                                           |
| `rangeSeparatorNode`    | `VNodeChild`                                                                                 | `—`                                 | Custom separator render node between range inputs (only affects UI render, string parsing still uses `rangeSeparator`)                                                                                                                        |
| `renderDate`            | `(dayNumber?: number, fullDate?: string) => VNodeChild`                                      | `—`                                 | Customize the day number, preferably with the date slot; retains the date cell.                                                                                                                                                               |
| `renderFullDate`        | `( dayNumber?: number, fullDate?: string, status?: DatePickerDayStatus, ) => VNodeChild`     | `—`                                 | Customize complete date cell content, preferably with the fullDate slot; preserve disabled/selected appearance from status.                                                                                                                   |
| `rightSlot`             | `VNodeChild`                                                                                 | `—`                                 | Extra content on the right, also available through the right slot.                                                                                                                                                                            |
| `showClear`             | `boolean`                                                                                    | `true`                              | Do you show the clear button?                                                                                                                                                                                                                 |
| `size`                  | `InputSize`                                                                                  | `'default'`                         | Size, optional: "small," "default," "large"                                                                                                                                                                                                   |
| `spacing`               | `number`                                                                                     | `insetInput ? 1 : 4`                | The distance between the pop-up layer and the children element                                                                                                                                                                                |
| `startDateOffset`       | `(selectedDate?: Date) => Date`                                                              | `—`                                 | When type is dateRange, set the start date of the selected range                                                                                                                                                                              |
| `startYear`             | `number`                                                                                     | `—`                                 | start year of the year scroll panel                                                                                                                                                                                                           |
| `stopPropagation`       | `boolean \| string`                                                                          | `true`                              | Whether to prevent click events on the popup layer from bubbling                                                                                                                                                                              |
| `style`                 | `StyleValue`                                                                                 | `—`                                 | Vue style object or array.                                                                                                                                                                                                                    |
| `syncSwitchMonth`       | `boolean`                                                                                    | `false`                             | In the scene of range, it supports synchronous switching of the month of the dual panel                                                                                                                                                       |
| `timePickerOpts`        | `TimePickerProps`                                                                            | `—`                                 | For other parameters that can be transparently passed to the time selector, see [TimePicker·API Reference](/en-us/components/time-picker/)                                                                                                    |
| `timeZone`              | `string \| number`                                                                           | `ConfigProvider.timeZone`           | Display timezone as a GMT string or an offset in hours; inherits ConfigProvider and preserves the represented timestamp.                                                                                                                      |
| `topSlot`               | `VNodeChild`                                                                                 | `—`                                 | Extra top content, also available through the top slot.                                                                                                                                                                                       |
| `triggerRender`         | `(props: DatePickerTriggerSlotProps) => VNodeChild`                                          | `—`                                 | Custom trigger function; templates can use the trigger scoped slot.                                                                                                                                                                           |
| `type`                  | `DatePickerType`                                                                             | `'date'`                            | format                                                                                                                                                                                                                                        |
| `validateStatus`        | `InputValidateStatus`                                                                        | `'default'`                         | Validation appearance: default / error / warning; does not validate values.                                                                                                                                                                   |
| `value`                 | `DatePickerValue`                                                                            | `—`                                 | Controlled value; v-model:value synchronizes it through update:value.                                                                                                                                                                         |
| `weekStartsOn`          | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6`                                                            | `0`                                 | Take the day of the week as the first day of the week, 0 for Sunday, 1 for Monday, and so on.                                                                                                                                                 |
| `yearAndMonthOpts`      | `Record<string, unknown>`                                                                    | `—`                                 | Configuration forwarded to the year/month ScrollList.                                                                                                                                                                                         |
| `zIndex`                | `number`                                                                                     | `1030`                              | Popup stacking level.                                                                                                                                                                                                                         |

`—` means no independent default. Standard class / style support Vue bindings; Boolean defaults follow the current implementation.

### Events

| Event               | Payload                                                                                                                    | Description                                                                                          |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `blur`              | `[event?: unknown]`                                                                                                        | Input blur; account for focus position in range controls.                                            |
| `cancel`            | `[date: Date \| Date[] \| undefined, dateString: string \| string[] \| undefined]`                                         | Cancel confirmation and return the last confirmed value; applies to date-time with needConfirm=true. |
| `change`            | `[ first: Date \| Date[] \| string \| string[] \| undefined, second: Date \| Date[] \| string \| string[] \| undefined, ]` | The value changed through selection or input.                                                        |
| `clear`             | `[event?: unknown]`                                                                                                        | The clear button was clicked.                                                                        |
| `clickOutside`      | `[event: MouseEvent]`                                                                                                      | A click outside both the trigger and the open panel.                                                 |
| `confirm`           | `[date: Date \| Date[] \| undefined, dateString: string \| string[] \| undefined]`                                         | Confirm the current date/time; applies to date-time with needConfirm=true.                           |
| `focus`             | `[event: unknown, rangeType?: DatePickerRangeType]`                                                                        | The input gained focus.                                                                              |
| `maxSelect`         | `[value?: Date[]]`                                                                                                         | Another date was selected after the maximum count was reached.                                       |
| `openChange`        | `[open: boolean]`                                                                                                          | Panel visibility changed.                                                                            |
| `panelChange`       | `[date: Date \| Date[], dateString: string \| string[]]`                                                                   | The displayed panel month or year changed.                                                           |
| `presetClick`       | `[item: DatePickerPreset, event: MouseEvent]`                                                                              | A date preset was clicked.                                                                           |
| `update:modelValue` | `[value: Date \| Date[] \| undefined]`                                                                                     | Synchronize v-model.                                                                                 |
| `update:open`       | `[open: boolean]`                                                                                                          | Synchronize v-model:open.                                                                            |
| `update:value`      | `[value: Date \| Date[] \| undefined]`                                                                                     | Synchronize v-model:value.                                                                           |

Use kebab-case events in templates, such as @open-change and @panel-change. Use v-model or v-model:value for values; date and time panels also support v-model:open.

### Slots

| Slot              | Signature                                                                                      | Description                                                       |
| ----------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `#bottom`         | `() => VNodeChild`                                                                             | Panel bottom content.                                             |
| `#clearIcon`      | `() => VNodeChild`                                                                             | Clear-button icon.                                                |
| `#date`           | `(props: { dayNumber: number; fullDate: string }) => VNodeChild`                               | Day-number content inside the built-in cell.                      |
| `#fullDate`       | `(props: { dayNumber: number; fullDate: string; status: DatePickerDayStatus; }) => VNodeChild` | Full date-cell content with state provided in status.             |
| `#insetLabel`     | `() => VNodeChild`                                                                             | Inset input label.                                                |
| `#left`           | `() => VNodeChild`                                                                             | Content to the left of the panel.                                 |
| `#prefix`         | `() => VNodeChild`                                                                             | Input prefix.                                                     |
| `#rangeSeparator` | `() => VNodeChild`                                                                             | Range input separator content.                                    |
| `#right`          | `() => VNodeChild`                                                                             | Content to the right of the panel.                                |
| `#top`            | `() => VNodeChild`                                                                             | Panel top content.                                                |
| `#trigger`        | `(props: DatePickerTriggerSlotProps) => VNodeChild`                                            | Custom trigger; use openPanel, close and clear for panel actions. |

## Methods

Call public instance methods through a template ref.

```ts
export interface DatePickerExposed {
  readonly input: HTMLInputElement | null;
  blur(): void;
  close(): void;
  focus(focusType?: 'rangeStart' | 'rangeEnd'): void;
  open(): void;
}
```

::demo-block{demo="date-picker/en-us/Methods" title="Methods"}
::

## Type definitions

```ts
export type DatePickerBaseValue = string | number | Date;

export type DatePickerValue = DatePickerBaseValue | DatePickerBaseValue[];

export type DatePickerType =
  'date' | 'dateRange' | 'dateTime' | 'dateTimeRange' | 'month' | 'monthRange' | 'year';

export type DatePickerDensity = 'default' | 'compact';

export type DatePickerPresetPosition = 'left' | 'right' | 'top' | 'bottom';

export type DatePickerRangeType = 'rangeStart' | 'rangeEnd' | false;

export interface DatePickerDayStatus {
  isToday?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  isSelectedStart?: boolean;
  isSelectedEnd?: boolean;
  isInRange?: boolean;
  isHover?: boolean;
  isOffsetRangeStart?: boolean;
  isOffsetRangeEnd?: boolean;
  isHoverInOffsetRange?: boolean;
}

export interface DatePickerDisabledDateOptions {
  rangeStart?: string;
  rangeEnd?: string;
  rangeInputFocus?: DatePickerRangeType;
}

export interface DatePickerDisabledTimeOptions {
  disabledHours?: () => number[];
  disabledMinutes?: (hour: number) => number[];
  disabledSeconds?: (hour: number, minute: number) => number[];
}

export interface DatePickerPreset {
  start?: DatePickerBaseValue | (() => DatePickerBaseValue);
  end?: DatePickerBaseValue | (() => DatePickerBaseValue);
  text?: string;
}

export interface DatePickerInsetInputProps {
  placeholder?: {
    dateStart?: string;
    dateEnd?: string;
    timeStart?: string;
    timeEnd?: string;
  };
}

export interface DatePickerLocale {
  placeholder: Partial<Record<DatePickerType, string | string[]>>;
  presets: string;
  footer: { confirm: string; cancel: string };
  selectDate: string;
  selectTime: string;
  year: string;
  month: string;
  day: string;
  monthText: string;
  months: Record<number, string>;
  fullMonths: Record<number, string>;
  weeks: Record<string, string>;
  localeFormatToken: { FORMAT_SWITCH_DATE: string };
}

export interface DatePickerTriggerSlotProps {
  value: Date[];
  inputValue: string;
  placeholder: string | string[];
  autoFocus: boolean;
  size: InputSize;
  disabled: boolean;
  inputReadOnly: boolean;
  componentProps: DatePickerProps;
  open: boolean;
  openPanel(): void;
  close(): void;
  clear(event?: Event): void;
}
```

## Accessibility

### ARIA, keyboard and focus

The date panel uses grid, row, columnheader and gridcell. Date cells expose aria-label, aria-disabled and aria-selected; multiple selection adds aria-multiselectable. Use id with a visible label, or ariaLabelledby, to give the input a meaningful name.

Tab / Shift + Tab move through inputs, panel buttons and focusable dates. The public focus method supports rangeStart / rangeEnd. Date cells currently have no arrow-key navigation contract; the grid role does not imply complete grid keyboard support. Custom triggers should be focusable named buttons that preserve panel actions. Custom fullDate content should display selected and disabled states from status.

## Date and Time Format

Adopted in the semi-ui component library [date-fns(v2.30.0)](https://date-fns.org/v2.30.0/docs/Getting-Started) As a date and time engine, formatting token means the following:

- `"y"`: Year
- `"M"`: month
- `"d"`: day
- `"H"`: hours
- `"h"`: hours (12h)
- `"m"`: minutes
- `"s"`: seconds

The following uses `new Date('2023-12-09 08:08:00')` or `[new Date('2023-12-09 08:08:00'), new Date('2023-12-10 10 :08:00')]` as `value` to explain the impact of different types and different `format` values on the displayed value:

| type          | format              | display value                       |
| ------------- | ------------------- | ----------------------------------- |
| date          | yyyy-MM-dd          | 2023-12-09                          |
| dateTime      | yyyy-MM-dd HH:mm:ss | 2023-12-09 08:08:00                 |
| month         | yyyy-MM             | 2023-12                             |
| dateRange     | yyyy-MM-dd          | 2023-12-09 ~ 2023-12-10             |
| dateTimeRange | yyyy-MM-dd HH:mm:ss | 2023-12-09 08:08 ~ 2023-12-10 10:08 |

Multiple dates or times are used by default `","` (English comma) separated.

> More token available [Date-fns official website](https://date-fns.org/v2.30.0/docs/Unicode-Tokens)

## Content Guidelines

- Date picker is recommended to be used with tags
- Use concise labels to indicate what the date selection refers to
- Please refer to [Date and Time](/en-us/experience/content-guidelines/)

## Design Tokens

::token-table{component="datePicker"}
::

## FAQ

- **Date time picker, when you choose time, minute and second, you don't want to scroll infinitely. How to achieve the effect?**  
  Starting from version V2.22.0, we changed the default mode of ScrollItem in TimePicker from wheel to normal. If you want to apply the infinite scrolling effect again, you can control this behavior through a specific switch in timePickerOpts, that is, :time-picker-opts="{ scrollItemProps: { mode: 'wheel', cycled: true } }".

- **How to set the default display time when the panel is opened?**  
  You can use the defaultPickerValue property.

- **Date time selection, range date selection, after inputting some dates, the panel does not echo the date?**

  The input box needs to be entered completely before it is showed to the panel. For example, for `dateTime` type, the full requested date and time have been entered. For `dateRange` type, full requires start and end dates to be entered.

- **What is the displayed time at the bottom of the date time selection panel?**

  When no time is selected, it is the value of the time in `defaultPickerValue`, if not set it is the time when the panel was opened. After selecting a time, it is the selected time.

  Since it has two hidden meanings in design, which may lead to ambiguity, it is recommended to use inline styles and open them through `insetInput`. It is recommended to read the relevant <a href="#input-in-panel">Documentation</a> before use.

  [See the inset-input demo](#input-in-panel)

## React → Vue migration

| React                                               | Vue                                                                              |
| --------------------------------------------------- | -------------------------------------------------------------------------------- |
| `@douyinfe/semi-ui`                                 | `@aifuxi/semi-ui-vue/date-picker` + `@aifuxi/semi-theme-default/date-picker.css` |
| `useState` / `useMemo`                              | `ref` / `shallowRef` / `computed`                                                |
| `value` + `onChange`                                | `v-model` / `v-model:value` / `:value` + `@change`                               |
| `className` / `ReactNode`                           | Vue `class` / `VNodeChild` and slots                                             |
| `ref.current`                                       | public instance on a template ref                                                |
| `open` + `onOpenChange`                             | `v-model:open` / `:open` + `@open-change`                                        |
| `triggerRender(props)`                              | `#trigger="props"` or the same-named function returning VNodeChild               |
| `onChangeWithDateFirst`                             | `:on-change-with-date-first` retains payload ordering; v-model is unaffected     |
| `renderDate(dayNumber, fullDate)`                   | `#date="{ dayNumber, fullDate }"`                                                |
| `renderFullDate(dayNumber, fullDate, status)`       | `#fullDate="{ dayNumber, fullDate, status }"`                                    |
| `topSlot` / `bottomSlot` / `leftSlot` / `rightSlot` | `#top` / `#bottom` / `#left` / `#right`                                          |
| `onClickOutSide`                                    | `@click-outside`                                                                 |
| `BaseDatePicker` ref                                | `DatePickerExposed`                                                              |

Demos that depend on the current date use local time 2024-08-15 10:24:30. Existing fixed dates and timezone timestamps remain unchanged. Empty DatePicker controls use defaultPickerValue to fix their month; internal today highlighting still depends on the runtime clock.
