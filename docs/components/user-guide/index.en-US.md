# UserGuide

UserGuide introduces page features step by step with a popup card or a centered modal. The Vue implementation aligns with Semi Design v2.102.0 for DOM structure, state transitions, themes, masks, buttons, and locale text.

## Basic usage

```vue
<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { UserGuide, type UserGuideStepItem } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/user-guide.css';

const target = useTemplateRef<HTMLElement>('target');
const visible = ref(false);
const current = ref(0);
const steps = ref<UserGuideStepItem[]>([]);

onMounted(() => {
  steps.value = [
    {
      target: () => target.value,
      title: 'Create a task',
      description: 'Start a new task from here.',
      position: 'bottom',
    },
  ];
});
</script>

<template>
  <button ref="target" type="button" @click="visible = true">Start guide</button>
  <UserGuide
    v-model:current="current"
    :visible="visible"
    :steps="steps"
    @finish="visible = false"
    @skip="visible = false"
  />
</template>
```

Mount target elements before opening the guide. A target getter may temporarily return `null`; the component will then render neither the popup nor the spotlight.

## Content slots

Steps accept `VNodeChild` values directly. SFC templates can also provide scoped content for the current step:

```vue
<UserGuide :visible="visible" :steps="steps">
  <template #cover="{ index }">
    <img v-if="index === 0" src="/guide-cover.png" alt="Feature overview" />
  </template>
  <template #title="{ step }">
    <strong>{{ step.title }}</strong>
  </template>
</UserGuide>
```

Slot props are `{ current, index, step }`. A provided slot takes precedence over the corresponding step field.

## Controlled current step

- Without `current`, the component owns the active step.
- With an explicit `current`, it emits `change` and `update:current` and waits for parent write-back.
- Next emits `change`, `update:current`, then `next`; previous emits the current update and then `prev`.
- The last step emits only `finish`. `skip` and `finish` do not close the guide automatically; update `visible` in the parent.

## Modal mode

```vue
<UserGuide
  mode="modal"
  :visible="visible"
  :steps="steps"
  finish-text="Get started"
  @finish="visible = false"
/>
```

Modal mode reuses Modal focus, Escape, Portal, and accessibility behavior. Popup mode reuses Popover positioning and its dialog role.

## API

### UserGuideProps

| Property              | Description                                                     | Type                           | Default         |
| --------------------- | --------------------------------------------------------------- | ------------------------------ | --------------- |
| `current`             | Active step; controlled when explicitly present                 | `number`                       | `0`             |
| `visible`             | Whether the guide is visible                                    | `boolean`                      | `false`         |
| `steps`               | Step definitions                                                | `readonly UserGuideStepItem[]` | `[]`            |
| `mode`                | Popup or modal guide                                            | `'popup' \| 'modal'`           | `'popup'`       |
| `mask`                | Whether to render the mask                                      | `boolean`                      | `true`          |
| `position`            | Default popup position                                          | `PopoverPosition`              | `'bottom'`      |
| `theme`               | Default theme                                                   | `'default' \| 'primary'`       | `'default'`     |
| `spotlightPadding`    | Spotlight expansion in pixels                                   | `number`                       | `5`             |
| `showPrevButton`      | Show the previous button                                        | `boolean`                      | `true`          |
| `showSkipButton`      | Show the skip button                                            | `boolean`                      | `true`          |
| `finishText`          | Finish button text                                              | `string`                       | locale `finish` |
| `nextButtonProps`     | Next/finish Button props; `content` maps React children         | `UserGuideButtonProps`         | `{}`            |
| `prevButtonProps`     | Previous Button props; `content` maps React children            | `UserGuideButtonProps`         | `{}`            |
| `class` / `className` | Popup Popover class                                             | `HTMLAttributes['class']`      | -               |
| `style`               | Popup Popover style                                             | `StyleValue`                   | -               |
| `getPopupContainer`   | In v2.102.0, only controls body locking; see compatibility note | `() => HTMLElement`            | -               |
| `zIndex`              | Spotlight SVG z-index                                           | `number`                       | `1030`          |

### UserGuideStepItem

| Property           | Description              | Type                                              | Default |
| ------------------ | ------------------------ | ------------------------------------------------- | ------- |
| `target`           | Target Element or getter | `Element \| (() => Element \| null \| undefined)` | -       |
| `cover`            | Cover content            | `VNodeChild`                                      | -       |
| `title`            | Title content            | `VNodeChild`                                      | -       |
| `description`      | Description content      | `VNodeChild`                                      | -       |
| `showArrow`        | Show the popup arrow     | `boolean`                                         | `true`  |
| `spotlightPadding` | Per-step expansion       | `number`                                          | -       |
| `theme`            | Per-step theme           | `'default' \| 'primary'`                          | -       |
| `position`         | Per-step popup position  | `PopoverPosition`                                 | -       |

### Events and slots

| Name                                 | Arguments                  |
| ------------------------------------ | -------------------------- |
| `change` / `update:current`          | `(current: number)`        |
| `next` / `prev`                      | `(current: number)`        |
| `skip` / `finish`                    | `()`                       |
| `#cover` / `#title` / `#description` | `{ current, index, step }` |

## Pinned-baseline compatibility

The v2.102.0 types and docs declare per-step `mask` and `className`, but the pinned React Adapter never reads them. They remain ineffective in Vue for runtime parity. Likewise, `getPopupContainer` only affects UserGuide's own body-scroll lock and is not forwarded to the nested Popover or Modal. Configure `getPopupContainer` on `ConfigProvider` to change the actual overlay container.

## SSR

Imports are SSR-safe. DOM lookup, scrolling, and measurement run only during a visible client cycle. Prefer rendering with `visible=false` on the server and opening after hydration.
