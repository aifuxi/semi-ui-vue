# Steps

Steps decomposes an ordered task into visible stages. The pinned local Semi Design v2.102.0 source is the sole parity baseline.

## Import

```ts
import { Step, Steps } from '@workspace/ui';
import '@workspace/theme-default/steps.css';
```

## Fill and Basic

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { Step, Steps } from '@workspace/ui';

const current = shallowRef(1);
</script>

<template>
  <Steps :current="current" @change="current = $event">
    <Step title="Finished" description="First description" />
    <Step title="In progress" description="Second description" />
    <Step title="Waiting" description="Third description" />
  </Steps>

  <Steps type="basic" size="small" :current="current" @change="current = $event">
    <Step title="Finished" description="First description" />
    <Step title="In progress" description="Second description" />
    <Step title="Waiting" description="Third description" />
  </Steps>
</template>
```

`current` is a zero-based display state. Steps does not mutate it after interaction; write the emitted `change(index)` back in the parent for a controlled Vue loop. `initial` affects both displayed numbers and the emitted index.

## Nav, vertical, and status override

```vue
<Steps type="nav" :current="1">
  <Step title="Register account" />
  <Step title="Product usage" />
  <Step title="Try features" />
</Steps>

<Steps type="basic" direction="vertical" :current="1" status="error">
  <Step title="Finished" />
  <Step title="Error" />
  <Step title="Waiting" status="warning" />
</Steps>
```

An explicit child `Step.status` overrides the status inferred by the parent. `fill/basic` support vertical direction; `size` only affects `basic/nav`, and `hasLine` only affects `basic`, matching the pinned source.

## Custom content and interaction

```vue
<Steps type="basic" :current="0" @change="console.log">
  <Step aria-label="Upload files" @click="console.log('step click')">
    <template #icon><span>1</span></template>
    <template #title>Upload files</template>
    <template #description>VNode content is supported</template>
  </Step>
  <Step title="Done" />
</Steps>
```

On click or Enter, the Step `click`/`keyDown` event fires first and a non-current item then emits the parent `change`. The pinned source does not implement arrow keys, Home/End, or roving tabindex, so Vue does not invent those behaviors.

## Steps API

| Property              | Description                                             | Type                         | Default        |
| --------------------- | ------------------------------------------------------- | ---------------------------- | -------------- |
| `type`                | Visual type                                             | `'fill' \| 'basic' \| 'nav'` | `'fill'`       |
| `current`             | Zero-based current step                                 | `number`                     | `0`            |
| `initial`             | Starting number                                         | `number`                     | `0`            |
| `status`              | Current item status                                     | `StepsStatus`                | `'process'`    |
| `direction`           | fill/basic direction                                    | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `size`                | basic/nav size                                          | `'default' \| 'small'`       | `'default'`    |
| `hasLine`             | Show the basic connector                                | `boolean`                    | `true`         |
| `prefixCls`           | Root class prefix                                       | `string`                     | `'semi-steps'` |
| `ariaLabel`           | Root accessible name; templates may use `aria-label`    | `string`                     | -              |
| `className` / `style` | React-style compatibility; Vue `class/style` also works | `string` / `CSSProperties`   | -              |

Event: `change(index)`. The default slot accepts `Step`.

## Step API

| Property/slot                  | Description                               | Type                       | Default                      |
| ------------------------------ | ----------------------------------------- | -------------------------- | ---------------------------- |
| `title` / `#title`             | Title; slot wins                          | `VNodeChild`               | -                            |
| `description` / `#description` | Description; slot wins                    | `VNodeChild`               | -                            |
| `icon` / `#icon`               | Custom icon; slot wins                    | `VNodeChild`               | -                            |
| `status`                       | Override parent inference                 | `StepsStatus`              | inferred / `wait` standalone |
| `role` / `ariaLabel`           | Root ARIA; templates may use `aria-label` | `string`                   | -                            |
| `className` / `style`          | Item styling                              | `string` / `CSSProperties` | -                            |

Events: `click(event)` and `keyDown(event)`, the latter only for Enter.

## React to Vue migration

| React v2.102.0            | Vue                                      |
| ------------------------- | ---------------------------------------- |
| `const Step = Steps.Step` | `import { Steps, Step }`                 |
| `onChange={setCurrent}`   | `@change="current = $event"`             |
| `title={<Node />}`        | `:title="vnode"` or `#title`             |
| `description={<Node />}`  | `:description="vnode"` or `#description` |
| `icon={<Icon />}`         | `:icon="vnode"` or `#icon`               |
| `onClick` / `onKeyDown`   | `@click` / `@key-down`                   |
| `className`               | `class`; `className` remains compatible  |

SSR emits stable DOM for every type without a Portal, Observer, or global listener. Steps has no component-owned locale text; dark mode and RTL come from the default theme and ConfigProvider direction class.

`Steps.Step` is also retained for render-function and incremental-migration compatibility; Vue SFC templates should prefer the standalone `Step` export.
