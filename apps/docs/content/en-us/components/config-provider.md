---
title: 'ConfigProvider'
description: 'Provide a unified global configuration for components.'
locale: 'en-US'
slug: 'config-provider'
category: 'other'
order: 95
englishTitle: 'ConfigProvider'
icon: 'doc-configprovider'
upstream: 'other/configprovider'
---

## Scenes to be used

ConfigProvider supplies direction, locale, time zone, popup container and responsive breakpoints to its Vue subtree through instance-scoped provide/inject. Use it for shared configuration; use semiGlobal for site-wide default props.

## ConfigProvider

### How to import

```ts
import { ConfigProvider, ConfigConsumer } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
```

### Basic Usage

Select a GMT offset to configure both date and time inputs. The initial timestamp is fixed at 1581599305265.

::demo-block{demo="config-provider/en-us/TimeZone" title="Time zone"}
::

### Manually obtain values

The ConfigConsumer default scoped slot exposes the current configuration. Components normally consume it automatically.

::demo-block{demo="config-provider/en-us/Consumer" title="Read configuration"}
::

### Responsive breakpoints

responsiveObserve defaults to false. When enabled, matchMedia listeners are registered on the first subscription and cleaned up after the last unsubscribe. onBreakpoint and screens are Consumer values, not Provider props. Each subscription immediately receives the current matches. Keep responsiveMap references stable to avoid re-registering listeners.

#### Enable observing & custom breakpoints

```vue
<script setup lang="ts">
import { ConfigProvider, ConfigConsumer } from '@aifuxi/semi-ui-vue/config-provider';
import BreakpointSubscriber from './BreakpointSubscriber.vue';
const responsiveMap = ConfigProvider.defaultResponsiveMap;
</script>
<template>
  <ConfigProvider responsive-observe :responsive-map="responsiveMap">
    <ConfigConsumer v-slot="context">
      <BreakpointSubscriber :context="context" />
    </ConfigConsumer>
  </ConfigProvider>
</template>
```

BreakpointSubscriber.vue subscribes on the client and unsubscribes before unmount; SSR does not access window.

```vue
<script setup lang="ts">
import { shallowRef, onMounted, onBeforeUnmount } from 'vue';
import type { ConfigContextValue } from '@aifuxi/semi-ui-vue/config-provider';
const props = defineProps<{ context: ConfigContextValue }>();
const screens = shallowRef(props.context.screens);
let unsubscribe: (() => void) | undefined;
onMounted(() => {
  unsubscribe = props.context.onBreakpoint((next) => {
    screens.value = next;
  });
});
onBeforeUnmount(() => unsubscribe?.());
</script>
<template>
  <span>{{ JSON.stringify(screens) }}</span>
</template>
```

#### Subscription API

- onBreakpoint(callback): receives the full screens map immediately and on changes.
- onBreakpoint(['md', 'lg'], callback): immediately receives (screen, match) in the supplied order, then only the requested changes.

Both return an unsubscribe function. Defaults: xs ≤575px, sm ≥576px, md ≥768px, lg ≥992px, xl ≥1200px, xxl ≥1600px.

### RTL/LTR

RTL adds a .semi-rtl wrapper; LTR adds no wrapper. The example includes inputs, navigation, display and feedback. Imperative Modal, Notification and Toast calls require an explicit direction. Decide whether to mirror standalone directional icons yourself. The pinned documentation excludes RTL tree Table data and supports fixed columns from 2.32.

::demo-block{demo="config-provider/en-us/Direction" title="RTL/LTR component showcase"}
::

## API Reference

| Prop              | Type                | Default and behavior                                                                                      |
| ----------------- | ------------------- | --------------------------------------------------------------------------------------------------------- |
| direction         | `'ltr' \| 'rtl'`    | `'ltr'`                                                                                                   |
| locale            | `SemiLocale`        | Complete pinned zh-CN; takes precedence over LocaleProvider                                               |
| timeZone          | `string \| number`  | Unset; consumed by time components                                                                        |
| getPopupContainer | `() => HTMLElement` | Unset on Provider; overlays normally fall back to document.body. Custom containers use position: relative |
| responsiveObserve | `boolean`           | false; listeners register on demand                                                                       |
| responsiveMap     | `ResponsiveMap`     | Six pinned breakpoints; also ConfigProvider.defaultResponsiveMap                                          |

The ConfigConsumer slot receives ConfigContextValue. Read the values and update configuration through Provider props.

### Time Zone Identifier

Numbers express UTC offsets in hours and may be negative or fractional. Strings support GMT offsets and IANA identifiers such as Asia/Shanghai. Numeric/GMT offsets are mapped to IANA regions, preferring those without daylight saving time. Offsets such as -3.5, 3.5, 10.5 and 13.75 may map to regions with daylight saving time. Prefer an IANA name for a specific region.

### FAQ

ConfigProvider has no global prefixCls option. The upstream React SemiWebpackPlugin prefix replacement does not apply to this project, which preserves .semi-* and --semi-* style contracts.

## semiGlobal

semiGlobal.config.overrideDefaultProps is a process-wide singleton and must be configured before components are created. Do not use it for per-request SSR user settings. For local overrides, wrap components and pass explicit props.

```ts
import { semiGlobal } from '@aifuxi/semi-ui-vue/config-provider';
semiGlobal.config.overrideDefaultProps = {
  Select: { zIndex: 2000 },
  Tooltip: { zIndex: 2001, trigger: 'click' },
};
```

## React → Vue

| React                          | Vue                                                                   |
| ------------------------------ | --------------------------------------------------------------------- |
| Context.Provider / children    | ConfigProvider / default slot                                         |
| ConfigConsumer render function | `v-slot="context"`                                                    |
| useState / onSelect            | shallowRef / @select; use each consumer's v-model contract            |
| useEffect and cleanup          | onMounted and onBeforeUnmount                                         |
| JSX icon / suffix              | named slots; h() for VNodes inside data APIs                          |
| className / ref                | class / template ref on a child container, not Provider configuration |

The three live examples use pinned v2.102.0 sources. Responsive snippets are non-live upstream examples and do not add to that count. Source, editor and preview share the same SFC. Strict acceptance depends on current coverage evidence.
