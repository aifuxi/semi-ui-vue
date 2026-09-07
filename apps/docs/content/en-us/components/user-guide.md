---
title: 'UserGuide'
description: 'Used to guide new users through pages'
locale: 'en-US'
slug: 'user-guide'
category: 'show'
order: 85
englishTitle: 'UserGuide'
icon: 'doc-userGuide'
upstream: 'show/userGuide'
---

UserGuide introduces page features step by step with a popup card or a centered modal. The Vue implementation aligns with Semi Design v2.102.0 for DOM structure, state transitions, themes, masks, buttons, and locale text.

## Demos

### Basic usage

The popup guide visits Switch, Tag and Button. Use Next, Prev, Skip and Finish; target getters resolve only when opening on the client.

::demo-block{demo="user-guide/en-US/Basic" title="Basic usage"}
::

### Theme

Set theme="primary" for the primary popup theme.

::demo-block{demo="user-guide/en-US/Theme" title="Theme"}
::

### Popup position

The steps demonstrate top, right and bottom; showArrow=false hides the last arrow.

::demo-block{demo="user-guide/en-US/Position" title="Popup position"}
::

### Spotlight padding

Set global spotlightPadding=10 and override it with 15 in the third step.

::demo-block{demo="user-guide/en-US/Padding" title="Spotlight padding"}
::

### Custom buttons

Use content in nextButtonProps/prevButtonProps for React children, and finishText for the final step.

::demo-block{demo="user-guide/en-US/Buttons" title="Custom buttons"}
::

### Controlled

v-model:current writes back the step. Finishing or skipping closes the guide and resets it to 0.

::demo-block{demo="user-guide/en-US/Controlled" title="Controlled"}
::

### Modal guide

mode="modal" displays three covers and descriptions. Existing local illustrations replace upstream-branded DSM screenshots; Image dimensions and emphasized text are retained.

::demo-block{demo="user-guide/en-US/Modal" title="Modal guide"}
::

### No mask

mask=false keeps the single-step popup without the mask.

::demo-block{demo="user-guide/en-US/NoMask" title="No mask"}
::

## Basic usage

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

## React → Vue

| React v2.102.0                                | Vue 3.5+                                                              |
| --------------------------------------------- | --------------------------------------------------------------------- |
| `<UserGuide visible={visible} />`             | `<UserGuide :visible="visible" />`                                    |
| `current={current}` + `onChange={setCurrent}` | `v-model:current="current"`; or listen to `@change`                   |
| `onNext/onPrev/onSkip/onFinish`               | `@next/@prev/@skip/@finish`                                           |
| `StepItem.cover/title/description: ReactNode` | `VNodeChild`, or `#cover/#title/#description` scoped slots            |
| `nextButtonProps.children`                    | `nextButtonProps.content`                                             |
| `prevButtonProps.children`                    | `prevButtonProps.content`                                             |
| `className`                                   | Native `class` preferred; `className` supported                       |
| `style: React.CSSProperties`                  | `style: StyleValue`                                                   |
| `target: Element \| (() => Element)`          | `Element \| (() => Element \| null \| undefined)`; getter recommended |

## Explicit visibility

The pinned React Adapter does not hide after skip or finish. Update visible explicitly in Vue as well:

```vue
<UserGuide :visible="visible" :steps="steps" @skip="visible = false" @finish="visible = false" />
```

## Portal container

In v2.102.0, UserGuide.getPopupContainer only skips its body scroll lock; it is not forwarded to Popover/Modal. Use ConfigProvider to select the actual overlay container:

```vue
<ConfigProvider :get-popup-container="() => stage!">
  <div ref="stage">
    <UserGuide
      :visible="visible"
      :steps="steps"
      :get-popup-container="() => stage!"
    />
  </div>
</ConfigProvider>
```

Passing the UserGuide prop also preserves the pinned body-lock behavior; ConfigProvider selects the Portal parent.

## Pinned-source behavior

- Per-step mask and className are declared upstream but unused by the v2.102.0 Adapter; Vue preserves this.
- Global theme="primary" keeps every step primary, even when a step sets theme="default", matching the pinned global-primary OR step-primary logic.
- spotlightPadding=0 falls back to the global value or 5px through the pinned truthy fallback.

## Additional Vue examples

These examples supplement Vue API usage and are not counted as upstream demo mappings.

::demo-block{demo="user-guide/en-US/Example1" title="Example1"}
::
