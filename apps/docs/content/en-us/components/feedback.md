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

::demo-block{demo="feedback/en-US/Example1" title="Feedback"}
::

## Content types

- `text`: one TextArea configured through `textAreaProps`.
- `emoji`: `😞`, `😐`, and `😃`; selecting `😞` reveals an optional reason field.
- `radio` / `checkbox`: provide options through `radioGroupProps` / `checkboxGroupProps`.
- `custom`: renders the default slot. Use `#content="{ content }"` or `renderContent` to wrap generated content.

## API

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

| Semi React v2.102.0                           | Vue                                                   |
| --------------------------------------------- | ----------------------------------------------------- |
| `<Feedback visible={visible} />`              | `<Feedback v-model:visible="visible" />`              |
| `mode="popup"` / `mode="modal"`               | 同名 `mode` prop                                      |
| `type="emoji"` 等五种类型                     | 同名 `type` prop                                      |
| `onValueChange={handleValue}`                 | `@value-change="handleValue"`                         |
| `onOk={handleOk}` / `onCancel={handleCancel}` | `@ok="handleOk"` / `@cancel="handleCancel"`           |
| `children` 且 `type="custom"`                 | 默认 slot 且 `type="custom"`                          |
| `renderContent={content => ...}`              | `#content="{ content }"`，或保留 `renderContent` prop |
| `footer={<Footer />}`                         | `#footer`，或 `footer` prop                           |
| `title={<Title />}`                           | `#title`，或 `title` prop                             |
| `className` / `style`                         | 优先使用 Vue 原生 `class` / `style`                   |

`visible` 仍是父级受控状态。popup 的默认按钮只调用 `onOk` / `onCancel`，不会替调用方关闭；Modal 的 Promise 关闭流程由 Modal 处理。回调若必须返回 Promise，请使用 `:on-ok="handler"` / `:on-cancel="handler"`，以保留返回值给内部异步状态机。

固定 React Adapter 的 `className` 拼接存在字面 `.className` 行为，本实现为了像素兼容予以保留；普通 Vue 代码应使用 `class`。emoji 项保持上游可点击 `span` 的语义，没有额外创造键盘角色。
