---
title: 'Feedback'
description: 'Quick feedback component'
locale: 'en-US'
slug: 'feedback'
category: 'feedback'
order: 89
englishTitle: 'Feedback'
icon: 'doc-feedback'
upstream: 'feedback/feedback'
---

`Feedback` collects text, emoji, radio, checkbox, or custom feedback in a Modal or bottom SideSheet. It follows Semi Design v2.102.0. Visibility remains controlled by the caller through `v-model:visible`.

## Demos

### How to import

```ts
import { Feedback } from '@aifuxi/semi-ui-vue/feedback';
import '@aifuxi/semi-theme-default/feedback.css';
```

### Basic usage

Control visibility with `visible`. The defaults are popup and emoji; `@value-change` receives the selection. Submit and cancel callbacks close the example.

::demo-block{demo="feedback/en-US/Basic" title="Basic usage"}
::

### Text type

Use `type="text"` and configure the multiline input through `textAreaProps`. This example preserves the upstream `maxCount: 200`.

::demo-block{demo="feedback/en-US/Text" title="Text type"}
::

### Single choice feedback

Use `type="radio"` and `radioGroupProps.options` for vertical role choices.

::demo-block{demo="feedback/en-US/Radio" title="Single choice feedback"}
::

### Multiple choice feedback

Use `type="checkbox"` and `checkboxGroupProps.options` for product choices. Clearing all choices disables submission again.

::demo-block{demo="feedback/en-US/Checkbox" title="Multiple choice feedback"}
::

### Customized feedback content

Use `type="custom"` with the default slot instead of React `renderContent`. Control submission through `okButtonProps.disabled`.

::demo-block{demo="feedback/en-US/Custom" title="Customized feedback content"}
::

### Modal

Set `mode="modal"` to display a modal dialog.

::demo-block{demo="feedback/en-US/Modal" title="Modal"}
::

### Feedback completion tips

Popup and Modal have independent state. Submission shows the success illustration and acknowledgment with the title and footer hidden. Each closes after 1500ms and resets the acknowledgment 200ms later. Timers are cleared on unmount.

::demo-block{demo="feedback/en-US/Completion" title="Feedback completion tips"}
::

Both languages follow the same seven upstream examples, without language-only examples or additional source files. The Chinese Modal title and completion buttons/titles also retain the upstream English text. Each English example passes the complete `locale/source/en_US` data to `ConfigProvider` for English labels on the page and in the online editor; `{ code: 'en-US' }` alone does not supply the `Feedback` labels.

The custom example initializes its value to an empty string instead of the upstream self-reference `useState(value)`. Its controlled input uses `v-model`, avoiding the stale closure caused by the upstream missing `value` dependency. Completion uses the existing Vue `footer: null` hiding behavior. The strict acceptance scope and pinned-source repairs are recorded in `docs/documentation/feedback-acceptance.md` in the repository; generated evidence determines the current acceptance status.

## Content types

- `text`: one TextArea configured through `textAreaProps`.
- `emoji`: `😞`, `😐`, and `😃`; selecting `😞` reveals an optional reason field.
- `radio` / `checkbox`: provide options through `radioGroupProps` / `checkboxGroupProps`.
- `custom`: renders the default slot. Use `#content="{ content }"` or `renderContent` to wrap generated content.

## API reference

In addition to feedback-specific options, `mode="modal"` accepts [Modal props](/en-us/components/modal/), and `mode="popup"` accepts [SideSheet props](/en-us/components/side-sheet/), including title, width, close controls, mask, and Portal container. Pass these props directly; there is no separate `ModalProps` or `SideSheetProps` wrapper object.

| Prop                                  | Type                                                     | Default         | Description                                    |
| ------------------------------------- | -------------------------------------------------------- | --------------- | ---------------------------------------------- |
| `mode`                                | `'popup' \| 'modal'`                                     | `'popup'`       | SideSheet or Modal container                   |
| `type`                                | `'text' \| 'emoji' \| 'radio' \| 'checkbox' \| 'custom'` | `'emoji'`       | Feedback content                               |
| `visible`                             | `boolean`                                                | `false`         | Visibility; supports `v-model:visible`         |
| `textAreaProps`                       | `FeedbackTextAreaProps`                                  | -               | TextArea options                               |
| `radioGroupProps`                     | `FeedbackRadioGroupProps`                                | -               | RadioGroup options                             |
| `checkboxGroupProps`                  | `FeedbackCheckboxGroupProps`                             | -               | CheckboxGroup options                          |
| `renderContent`                       | `(content: VNodeChild) => VNodeChild`                    | -               | Wrap or replace generated content              |
| `okButtonProps` / `cancelButtonProps` | `FeedbackButtonProps`                                    | -               | Default footer button options                  |
| `footer`                              | `VNodeChild`                                             | default buttons | Popup footer; `#footer` is also supported      |
| `onOk` / `onCancel`                   | `(event) => void \| Promise`                             | noop            | Action callbacks; popup Promises drive loading |

`value-change` emits a string for text/radio, an array for checkbox, or `{ emoji, text? }` for emoji. Submit stays disabled for an empty value or empty checkbox array. Popup actions do not mutate the parent's `visible`; close it in the callback. Modal keeps its established async-close behavior.

`getPopupContainer` can target an existing mount container. Cancel/submit labels come from the `Feedback` locale supplied by `LocaleProvider` or `ConfigProvider`. Imports are SSR-safe; Portals and browser listeners are created only after mounting and are cleaned up on unmount.

See [react-to-vue.md](#react-vue) for migration and [alignment.md](https://github.com/aifuxi/semi-ui-vue/blob/master/docs/components/feedback/alignment.md) for the evidence matrix.

## React → Vue

| Semi React v2.102.0                           | Vue                                                  |
| --------------------------------------------- | ---------------------------------------------------- |
| `<Feedback visible={visible} />`              | `<Feedback v-model:visible="visible" />`             |
| `mode="popup"` / `mode="modal"`               | Same `mode` prop                                     |
| Five content types, including `type="emoji"`  | Same `type` prop                                     |
| `onValueChange={handleValue}`                 | `@value-change="handleValue"`                        |
| `onOk={handleOk}` / `onCancel={handleCancel}` | `@ok="handleOk"` / `@cancel="handleCancel"`          |
| `children` with `type="custom"`               | Default slot with `type="custom"`                    |
| `renderContent={content => ...}`              | `#content="{ content }"` or the `renderContent` prop |
| `footer={<Footer />}`                         | `#footer` or the `footer` prop                       |
| `title={<Title />}`                           | `#title` or the `title` prop                         |
| `className` / `style`                         | Prefer native Vue `class` / `style`                  |

The parent controls `visible`. Default popup buttons call `onOk` / `onCancel` without closing on behalf of the caller; Modal handles its own Promise-based close flow. Use `:on-ok="handler"` / `:on-cancel="handler"` when the return value must reach the internal asynchronous state machine.

The fixed React Adapter appends the literal `.className` class; this implementation preserves that compatibility behavior. Prefer native Vue `class` in application code. Emoji choices retain the upstream clickable `span` semantics without adding keyboard roles.
