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

## Basic usage

::demo-block{demo="user-guide/en-US/Example1" title="Basic usage"}
::

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

| React v2.102.0                                | Vue 3.5+                                                       |
| --------------------------------------------- | -------------------------------------------------------------- |
| `<UserGuide visible={visible} />`             | `<UserGuide :visible="visible" />`                             |
| `current={current}` + `onChange={setCurrent}` | `v-model:current="current"`，也可监听 `@change`                |
| `onNext/onPrev/onSkip/onFinish`               | `@next/@prev/@skip/@finish`                                    |
| `StepItem.cover/title/description: ReactNode` | `VNodeChild`，或 `#cover/#title/#description` scoped slots     |
| `nextButtonProps.children`                    | `nextButtonProps.content`                                      |
| `prevButtonProps.children`                    | `prevButtonProps.content`                                      |
| `className`                                   | 推荐原生 `class`；仍兼容 `className`                           |
| `style: React.CSSProperties`                  | `style: StyleValue`                                            |
| `target: Element \| (() => Element)`          | `Element \| (() => Element \| null \| undefined)`；推荐 getter |

## 可见性不是 v-model

固定 React Adapter 在 `skip` 或 `finish` 后不会自动隐藏。Vue 保留这一点，因此应显式更新 `visible`：

```vue
<UserGuide :visible="visible" :steps="steps" @skip="visible = false" @finish="visible = false" />
```

## Portal 容器

固定 v2.102.0 的 `UserGuide.getPopupContainer` 只用于跳过 body scroll 锁，并未传给内部 Popover/Modal。React 与 Vue 都应通过 ConfigProvider 控制真正的浮层容器：

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

同时传 UserGuide prop 可保持固定 Adapter 的 body-lock 行为；ConfigProvider 负责 Portal 父节点。

## 固定源码差异

- step 级 `mask` 与 `className` 在上游公开类型中存在，但 v2.102.0 React Adapter 没有读取；Vue 不额外实现。
- 全局 `theme="primary"` 会使所有步骤保持 primary，即使某一步写了 `theme="default"`；这是固定 Adapter 的 `global primary || step primary` 逻辑。
- `spotlightPadding=0` 会按固定 Adapter 的 truthy fallback 回退到全局值或 5px。
