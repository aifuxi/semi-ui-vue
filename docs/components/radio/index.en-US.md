# Radio

Radio selects one value from mutually exclusive choices. This Vue implementation targets the local Semi Design `v2.102.0` source, supports standalone, group, button, card, pure-card, and advanced deselection modes, and preserves the `.semi-radio*` / `.semi-radioGroup*` style contract.

## Basic usage

```vue
<script setup lang="ts">
import { Radio, RadioGroup } from '@aifuxi/semi-ui-vue/radio';
import { shallowRef } from 'vue';

const value = shallowRef('design');
</script>

<template>
  <RadioGroup v-model="value" name="product" aria-label="Product">
    <Radio value="ui">Semi UI</Radio>
    <Radio value="design">Semi Design</Radio>
    <Radio value="d2c">Semi D2C</Radio>
  </RadioGroup>
</template>
```

Both `value` and `modelValue` establish a controlled Group contract; `value` wins when both are present. A click emits `change(event)`, then `update:value` and `update:modelValue`; controlled visuals wait for the parent write-back.

## Options and layout

```vue
<template>
  <RadioGroup
    direction="vertical"
    :default-value="2"
    :options="[
      { label: 'Public', value: 1 },
      { label: 'Team', value: 2, extra: 'Members only' },
      { label: 'Private', value: 3, disabled: true },
    ]"
  />
</template>
```

`options` accepts strings and objects. Objects can specify `label`, `value`, `disabled`, `extra`, `className`, `style`, `addonId`, `addonClassName`, `addonStyle`, and `extraId`. Use the default slot when each item needs custom slot content or its own event.

## Button and card variants

```vue
<template>
  <RadioGroup type="button" button-size="large" default-value="now">
    <Radio value="now">Send now</Radio>
    <Radio value="later">Schedule</Radio>
  </RadioGroup>

  <RadioGroup type="card" direction="vertical" default-value="a">
    <Radio value="a" extra="Includes the radio indicator">Card A</Radio>
    <Radio value="b" extra="Supports descriptive text">Card B</Radio>
  </RadioGroup>

  <RadioGroup type="pureCard" direction="vertical" default-value="a">
    <Radio value="a" extra="Hides the radio indicator">Pure card A</Radio>
    <Radio value="b">Pure card B</Radio>
  </RadioGroup>
</template>
```

Button groups support `small`, `middle`, and `large`. Matching the pinned source, button items do not display `extra` and do not apply the Group vertical-direction class.

## Advanced deselection and standalone v-model

```vue
<script setup lang="ts">
import { Radio } from '@aifuxi/semi-ui-vue/radio';
import { shallowRef } from 'vue';

const checked = shallowRef(true);
</script>

<template>
  <Radio v-model="checked" mode="advanced">Click again to clear</Radio>
</template>
```

Normal mode uses a native radio input. `mode="advanced"` follows the pinned checkbox-input behavior so a selected item can be cleared. Clearing an advanced Group emits `event.target.value = undefined`.

## API

### Radio

| Property                        | Type                                            | Default     | Description                                    |
| ------------------------------- | ----------------------------------------------- | ----------- | ---------------------------------------------- |
| `checked` / `modelValue`        | `boolean`                                       | -           | Controlled state; `checked` wins               |
| `defaultChecked`                | `boolean`                                       | `false`     | Uncontrolled initial state                     |
| `value`                         | `string \| number \| boolean`                   | -           | Group comparison and event value               |
| `disabled` / `autoFocus`        | `boolean`                                       | `false`     | Disable / autofocus the input                  |
| `mode`                          | `'' \| 'advanced'`                              | `''`        | Normal or deselectable mode                    |
| `type`                          | `'default' \| 'button' \| 'card' \| 'pureCard'` | `'default'` | Standalone Radio style                         |
| `displayMode`                   | `'' \| 'vertical'`                              | `''`        | Item content layout                            |
| `extra`                         | `VNodeChild`                                    | -           | Supporting content; also available as `#extra` |
| `addonId` / `extraId`           | `string`                                        | generated   | ARIA relation ids                              |
| `addonClassName` / `addonStyle` | class / style                                   | -           | Content wrapper styling                        |
| `name` / `preventScroll`        | `string` / `boolean`                            | -           | Native name / exposed focus option             |

Events: `change(event)`, `mouseenter(event)`, `mouseleave(event)`, `update:checked(checked)`, and `update:modelValue(checked)`. Exposed methods: `focus()` and `blur()`.

### RadioGroup

| Property               | Type                                            | Default        | Description                          |
| ---------------------- | ----------------------------------------------- | -------------- | ------------------------------------ |
| `value` / `modelValue` | `string \| number \| boolean`                   | -              | Controlled group value; `value` wins |
| `defaultValue`         | `string \| number \| boolean`                   | -              | Uncontrolled initial value           |
| `options`              | `Array<string \| RadioOption>`                  | -              | Configuration-driven items           |
| `direction`            | `'horizontal' \| 'vertical'`                    | `'horizontal'` | Layout direction                     |
| `type`                 | `'default' \| 'button' \| 'card' \| 'pureCard'` | `'default'`    | Group variant                        |
| `buttonSize`           | `'small' \| 'middle' \| 'large'`                | `'middle'`     | Button size                          |
| `mode`                 | `'' \| 'advanced'`                              | `''`           | Allow deselection                    |
| `disabled`             | `boolean`                                       | `false`        | Disable every item                   |
| `name`                 | `string`                                        | `'default'`    | Child input name                     |
| `ariaLabel`, etc.      | ARIA values                                     | -              | Group root ARIA                      |

Events: `change(event)`, `update:value(value)`, and `update:modelValue(value)`. `Radio.Group` and named `RadioGroup` reference the same component.

## React → Vue migration

| React                                                                  | Vue                            |
| ---------------------------------------------------------------------- | ------------------------------ |
| `<Radio.Group value={value} onChange={e => setValue(e.target.value)}>` | `<RadioGroup v-model="value">` |
| `<Radio onChange={handler}>`                                           | `<Radio @change="handler">`    |
| `children` / `extra={<Node />}`                                        | default slot / `#extra` slot   |
| `onMouseEnter` / `onMouseLeave`                                        | `@mouseenter` / `@mouseleave`  |
| `ref.current.focus()`                                                  | `radioRef?.focus()`            |

See the [alignment matrix](./alignment.md) for state, event order, DOM, keyboard, ARIA, RTL, SSR, visual, and package evidence.
