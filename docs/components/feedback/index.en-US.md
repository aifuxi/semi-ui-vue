# Feedback

`Feedback` collects text, emoji, radio, checkbox, or custom feedback in a Modal or bottom SideSheet. It follows Semi Design v2.102.0. Visibility remains controlled by the caller through `v-model:visible`.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Feedback } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/feedback.css';

const visible = ref(true);
</script>

<template>
  <Feedback
    v-model:visible="visible"
    title="How was your experience?"
    type="emoji"
    @value-change="(value) => console.log(value)"
    @cancel="visible = false"
    @ok="visible = false"
  />
</template>
```

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

See [react-to-vue.md](./react-to-vue.md) for migration and [alignment.md](./alignment.md) for the evidence matrix.
