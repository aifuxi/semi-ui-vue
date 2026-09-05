---
title: 'TimePicker'
description: 'Users can easily select a compliant, formatted point of time using the time selector.'
locale: 'en-US'
slug: 'time-picker'
category: 'input'
order: 50
englishTitle: 'TimePicker'
icon: 'doc-timepicker'
upstream: 'input/timepicker'
---

## Demos

### How to import

```ts
import { TimePicker } from '@aifuxi/semi-ui-vue/time-picker';
import '@aifuxi/semi-theme-default/time-picker.css';
```

### Basic Usage

Click TimePicker, and then you can select or enter a time in the floating layer.

::demo-block{demo="time-picker/en-us/Basic" title="Basic Usage"}
::

### Infinite Scroll

Starting from version V2.22.0, we changed the default mode of ScrollItem in TimePicker from `wheel` to `normal`. If you want to apply the effect of infinite scrolling back, please refer to the following example.

::demo-block{demo="time-picker/en-us/Wheel" title="Infinite Scroll"}
::

### Controlled Component

Use v-model for controlled values, or supply value with a change handler that updates it. defaultValue sets only the uncontrolled initial value.

::demo-block{demo="time-picker/en-us/Controlled" title="Controlled Component"}
::

### Different Format

The panel columns follow format. Omitting a time field from format also removes its corresponding panel column.

NOTE: `format` Follow the date-fns `format` Format. https://date-fns.org/v2.30.0/docs/format

::demo-block{demo="time-picker/en-us/Format" title="Different Format"}
::

### Set Panel Header and Footer

::demo-block{demo="time-picker/en-us/PanelSlots" title="Set Panel Header and Footer"}
::

### Disable Time Selection

::demo-block{demo="time-picker/en-us/Disabled" title="Disable Time Selection"}
::

### Set Step Length

Use hourStep, minuteStep and secondStep to set the interval between options in each column.

::demo-block{demo="time-picker/en-us/Step" title="Set Step Length"}
::

### 12-hour System

12-hour time selector, default `format` for `h:mm:ss a`, an incoming `format` The format must be in [dateFns date format](https://date-fns.org/v2.30.0/docs/format)Within range.

> For example, a valid 12-hour format string is:`a h:mm:ss`, if passed in `A h:mm:ss` This will result in an inability to format correctly.

::demo-block{demo="time-picker/en-us/TwelveHours" title="12-hour System"}
::

### Time Range

Pass type = "timeRange" to enable time range selection.

::demo-block{demo="time-picker/en-us/Range" title="Time Range"}
::

### Disable left/right panels in Range mode (disabledTime)

When `type="timeRange"`, you can use `disabledTime(value, panelType)` to apply different disabled rules for the left/right panel.

- `value`: the current range as `Date[]` (empty or length 1/2); this callback applies only in range mode.
- `panelType`: `'left' | 'right'`, representing start/end panel

In the following demo, after selecting a start time, the right (end) panel will disable options earlier than the start time.

::demo-block{demo="time-picker/en-us/DisabledRange" title="Disable left/right panels in Range mode (disabledTime)"}
::

### Custom Trigger

TimePicker uses Input as its default trigger. Customize it with the #trigger scoped slot or a triggerRender function returning VNodeChild.

::demo-block{demo="time-picker/en-us/Trigger" title="Custom Trigger"}
::

## TimeZone Config

Configure a shared display timezone through [ConfigProvider](/en-us/components/config-provider/)

::demo-block{demo="time-picker/en-us/TimeZone" title="TimeZone Config"}
::

## API Reference

### TimePickerProps

| Property                | Type                                                                           | Default                                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------ | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ariaDescribedby`       | `string`                                                                       | `—`                                     | Description element IDs forwarded to input aria-describedby.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `ariaErrormessage`      | `string`                                                                       | `—`                                     | Error message ID forwarded to aria-errormessage.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `ariaInvalid`           | `boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling'`                      | `—`                                     | Mark input validity without running validation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `ariaLabel`             | `string`                                                                       | `—`                                     | Accessible input name.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `ariaLabelledby`        | `string`                                                                       | `—`                                     | Label element IDs forwarded to input aria-labelledby.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `ariaRequired`          | `boolean \| 'false' \| 'true'`                                                 | `—`                                     | Mark the input as required without running validation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `autoAdjustOverflow`    | `boolean`                                                                      | `true`                                  | Whether the floating layer automatically adjusts its direction when it is blocked                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `autoFocus`             | `boolean`                                                                      | `—`                                     | Automatic access to focus                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `borderless`            | `boolean`                                                                      | `false`                                 | borderless mode >=2.33.0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `className`             | `HTMLAttributes['class']`                                                      | `—`                                     | Outer style name                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `clearIcon`             | `VNodeChild`                                                                   | `—`                                     | Can be used to customize the clear button, valid when showClear is true                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `clearText`             | `string`                                                                       | `'clear'`                               | Accessible text for the clear button.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `dateFnsLocale`         | `unknown`                                                                      | `—`                                     | date-fns locale data; defaults to Chinese or English according to localeCode.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `defaultOpen`           | `boolean`                                                                      | `—`                                     | Whether the panel is open by default                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `defaultValue`          | `TimePickerValue`                                                              | `—`                                     | Initial uncontrolled value; use v-model for subsequent changes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `disabled`              | `boolean`                                                                      | `false`                                 | Disable all operations                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `disabledHours`         | `() => number[]`                                                               | `() => []`                              | Prohibited selection of partial hour options                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `disabledMinutes`       | `(selectedHour: number) => number[]`                                           | `() => []`                              | Prohibited to select some minute options                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `disabledSeconds`       | `(selectedHour: number, selectedMinute: number) => number[]`                   | `() => []`                              | Unable to select partial second option                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `disabledTime`          | `(value: Date[], panelType: TimePickerPanelType) => TimePickerDisabledOptions` | `—`                                     | **Range mode only**: derive disabled configuration based on currently selected dates and panel position, allowing left and right panels to use different rules. Params — `value`: currently selected dates (array length 0/1/2); `panelType`: `'left'` or `'right'`. Fields returned by the callback **override** the corresponding top-level `disabledHours` / `disabledMinutes` / `disabledSeconds`; fields that are not returned **fall back** to the top-level props (return a function returning `[]` if you want to clear the top-level rule for that panel). In single mode this prop is ignored — use the top-level `disabledHours` / `disabledMinutes` / `disabledSeconds` instead. |
| `dropdownMargin`        | `number \| TooltipMargin`                                                      | `—`                                     | Popup layer calculates the size of the safe area when the current direction overflows, used in scenes covered by fixed elements, more detail refer to [issue#549](https://github.com/DouyinFE/semi-design/issues/549), same as Tooltip margin                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `focusOnOpen`           | `boolean`                                                                      | `false`                                 | Whether to open the panel and focus the input box when mounting                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `format`                | `string`                                                                       | `use12Hours ? 'h:mm:ss a' : 'HH:mm:ss'` | Time format of presentation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `getPopupContainer`     | `() => HTMLElement`                                                            | `document.body`                         | Specifies the container and the floating layer will be rendered into the element, you need to set 'position: relative` This will change the DOM tree position, but not the view's rendering position.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `hideDisabledOptions`   | `boolean`                                                                      | `false`                                 | Hide disabled time options.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `hourStep`              | `number`                                                                       | `1`                                     | Hour option interval                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `id`                    | `string`                                                                       | `—`                                     | Internal input ID for association with a visible label.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `inputReadOnly`         | `boolean`                                                                      | `false`                                 | Set the input box to read-only (avoid opening a virtual keyboard on a mobile device)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `inputStyle`            | `StyleValue`                                                                   | `—`                                     | Input styles.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `insetLabel`            | `VNodeChild`                                                                   | `—`                                     | Inset input label; also available as the insetLabel slot.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `insetLabelId`          | `string`                                                                       | `—`                                     | Inset label ID.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `locale`                | `TimePickerLocale`                                                             | `—`                                     | Override component translations; defaults to ConfigProvider data.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `localeCode`            | `string`                                                                       | `—`                                     | Date/time locale code; inherits ConfigProvider by default.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `minuteStep`            | `number`                                                                       | `1`                                     | Minute option interval                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `modelValue`            | `TimePickerValue`                                                              | `—`                                     | Two-way binding via v-model; do not also supply value.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `motion`                | `boolean`                                                                      | `true`                                  | Enable panel animation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `onChangeWithDateFirst` | `boolean`                                                                      | `true`                                  | With true, change receives (Date value, formatted text); false reverses them. v-model always receives Date values.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `open`                  | `boolean`                                                                      | `—`                                     | Controlled property of whether the panel is open                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `panelFooter`           | `VNodeChild \| VNodeChild[]`                                                   | `—`                                     | Addon at the bottom of the panel                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `panelHeader`           | `VNodeChild \| VNodeChild[]`                                                   | `—`                                     | Panel head addon                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `panels`                | `TimePickerPanelConfig[]`                                                      | `—`                                     | Header/footer content per range panel, indexed from the left.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `placeholder`           | `string`                                                                       | `locale.placeholder[type]`              | What's displayed when it's not worth it.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `popupClassName`        | `HTMLAttributes['class']`                                                      | `—`                                     | Pop-up class name                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `popupStyle`            | `StyleValue`                                                                   | `—`                                     | Pop-up layer style object                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `position`              | `TooltipPosition`                                                              | `LTR: bottomLeft; RTL: bottomRight`     | Floating position                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `preventScroll`         | `boolean`                                                                      | `false`                                 | Indicates whether the browser should scroll the document to display the newly focused element, acting on the focus method inside the component, excluding the component passed in by the user                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `rangeSeparator`        | `string`                                                                       | `' ~ '`                                 | time range delimiter                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `scrollItemProps`       | `TimePickerScrollItemProps`                                                    | `—`                                     | The props passed through to ScrollItem. The optional values are the same as [ScrollList#API](/en-us/components/scroll-list/)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `secondStep`            | `number`                                                                       | `1`                                     | Second option interval                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `showClear`             | `boolean`                                                                      | `true`                                  | Whether to show the clear button                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `size`                  | `InputSize`                                                                    | `'default'`                             | Size of input box, one of 'default', 'small' and 'large'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `stopPropagation`       | `boolean`                                                                      | `true`                                  | Whether to prevent click events on the popup layer from bubbling                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `style`                 | `StyleValue`                                                                   | `—`                                     | Vue style object or array.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `timeZone`              | `string \| number`                                                             | `ConfigProvider.timeZone`               | Display timezone as a GMT string or an offset in hours; inherits ConfigProvider and preserves the represented timestamp.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `triggerRender`         | `(props: TimePickerTriggerSlotProps) => VNodeChild`                            | `—`                                     | Custom trigger function; templates can use the trigger scoped slot.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `type`                  | `TimePickerType`                                                               | `'time'`                                | type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `use12Hours`            | `boolean`                                                                      | `false`                                 | Using a 12-hour system, `format` default to `h: mm: ssa` when true                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `validateStatus`        | `InputValidateStatus`                                                          | `'default'`                             | Validation appearance: default / error / warning; does not validate values.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `value`                 | `TimePickerValue`                                                              | `—`                                     | Controlled value; v-model:value synchronizes it through update:value.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `zIndex`                | `number \| string`                                                             | `1030`                                  | Popup stacking level.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

`—` means no independent default. Standard class / style support Vue bindings; Boolean defaults follow the current implementation.

### Events

| Event               | Payload                                                                                                                       | Description                                               |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `blur`              | `[event: FocusEvent \| MouseEvent]`                                                                                           | Input blur; account for focus position in range controls. |
| `change`            | `[ value: TimePickerChangeValue \| TimePickerFormattedValue, formatted: TimePickerFormattedValue \| TimePickerChangeValue, ]` | The value changed through selection or input.             |
| `focus`             | `[event: FocusEvent]`                                                                                                         | The input gained focus.                                   |
| `openChange`        | `[open: boolean]`                                                                                                             | Panel visibility changed.                                 |
| `update:modelValue` | `[value: TimePickerChangeValue]`                                                                                              | Synchronize v-model.                                      |
| `update:open`       | `[open: boolean]`                                                                                                             | Synchronize v-model:open.                                 |
| `update:value`      | `[value: TimePickerChangeValue]`                                                                                              | Synchronize v-model:value.                                |

Use kebab-case events in templates, such as @open-change. Use v-model or v-model:value for values; date and time panels also support v-model:open.

### Slots

| Slot           | Signature                                           | Description                                                       |
| -------------- | --------------------------------------------------- | ----------------------------------------------------------------- |
| `#clearIcon`   | `() => VNodeChild`                                  | Clear-button icon.                                                |
| `#insetLabel`  | `() => VNodeChild`                                  | Inset input label.                                                |
| `#panelFooter` | `(props: TimePickerPanelSlotProps) => VNodeChild`   | Panel footer; index is 0/1 and panelType is left/right.           |
| `#panelHeader` | `(props: TimePickerPanelSlotProps) => VNodeChild`   | Panel header; index is 0/1 and panelType is left/right.           |
| `#trigger`     | `(props: TimePickerTriggerSlotProps) => VNodeChild` | Custom trigger; use openPanel, close and clear for panel actions. |

## Methods

Call public instance methods through a template ref.

```ts
export interface TimePickerExposed {
  blur(): void;
  close(): void;
  focus(): void;
  open(): void;
}
```

## Type definitions

```ts
export type TimePickerBaseValue = string | number | Date | undefined;

export type TimePickerValue = TimePickerBaseValue | TimePickerBaseValue[];

export type TimePickerType = 'time' | 'timeRange';

export type TimePickerPanelType = 'left' | 'right';

export type TimePickerChangeValue = Date | Date[] | undefined;

export type TimePickerFormattedValue = string | string[];

export interface TimePickerLocale {
  AM?: string;
  PM?: string;
  begin: string;
  end: string;
  hour: string;
  minute: string;
  placeholder: Record<TimePickerType, string>;
  second: string;
}

export interface TimePickerPanelConfig {
  panelFooter?: VNodeChild;
  panelHeader?: VNodeChild;
}

export interface TimePickerScrollItemProps {
  'aria-label'?: string;
  cycled?: boolean;
  mode?: 'normal' | 'wheel';
  motion?: boolean;
  style?: StyleValue;
}

export interface TimePickerDisabledOptions {
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
}

export interface TimePickerTriggerSlotProps {
  clear(): void;
  close(): void;
  inputValue: string;
  open: boolean;
  openPanel(): void;
  placeholder: string;
  value: Date[];
}

export interface TimePickerPanelSlotProps {
  index: number;
  panelType: TimePickerPanelType;
}
```

## Content Guidelines

- The time selector includes at least hours and minutes, such as: 11:30, which can be adapted to 12-hour or 24-hour format during localization
- When 12-hour clock is selected, it needs to be used together with AM/PM

## Design Tokens

::token-table{component="timePicker"}
::

## Accessibility

### ARIA, keyboard and focus

The popup uses the dialog role. Name the input with ariaLabel / ariaLabelledby, associate format instructions with ariaDescribedby, and use ariaInvalid / ariaErrormessage for application validation results.

Use Tab / Shift + Tab between the input and custom buttons. Enter a complete time matching format or select from the panel. focus / blur / open / close are public instance methods. Custom triggers should be named, focusable elements, and header/footer controls should be keyboard accessible. Do not depend on undocumented arrow-key or Escape behavior.

## FAQ

### Why are only hours or minutes visible?

format determines visible columns; HH:mm hides seconds. Steps only change options in their columns. Include a for AM/PM in 12-hour mode.

### How can range panels have different disabled rules?

disabledTime receives current Date[] and left/right. Returned fields override matching top-level rules; omitted fields fall back. Use disabledHours/Minutes/Seconds for single selection.

### Why do change and v-model have different payload types?

change provides both Date values and formatted text, with order controlled by onChangeWithDateFirst. v-model always synchronizes Date values and may receive undefined on clearing.

## React → Vue migration

| React                         | Vue                                                                                                |
| ----------------------------- | -------------------------------------------------------------------------------------------------- |
| `@douyinfe/semi-ui`           | `@aifuxi/semi-ui-vue/time-picker` + `@aifuxi/semi-theme-default/time-picker.css`                   |
| `useState` / `useMemo`        | `ref` / `shallowRef` / `computed`                                                                  |
| `value` + `onChange`          | `v-model` / `v-model:value` / `:value` + `@change`                                                 |
| `className` / `ReactNode`     | Vue `class` / `VNodeChild` and slots                                                               |
| `ref.current`                 | public instance on a template ref                                                                  |
| `open` + `onOpenChange`       | `v-model:open` / `:open` + `@open-change`                                                          |
| `triggerRender(props)`        | `#trigger="props"` or the same-named function returning VNodeChild                                 |
| `onChangeWithDateFirst`       | `:on-change-with-date-first` retains payload ordering; v-model is unaffected                       |
| `panelHeader` / `panelFooter` | `#panelHeader` / `#panelFooter` receive index and panelType                                        |
| `prefix`                      | No equivalent public prop/slot; use insetLabel for an inset label or #trigger for a custom control |

Demos that depend on the current date use local time 2024-08-15 10:24:30. Existing fixed dates and timezone timestamps remain unchanged. Empty DatePicker controls use defaultPickerValue to fix their month; internal today highlighting still depends on the runtime clock.
