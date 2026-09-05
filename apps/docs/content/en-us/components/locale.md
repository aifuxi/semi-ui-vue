---
title: 'LocaleProvider'
description: 'Internationalized components to provide multilingual support for Semi components'
locale: 'en-US'
slug: 'locale'
category: 'other'
order: 96
englishTitle: 'LocaleProvider'
icon: 'doc-i18n'
upstream: 'other/locale'
---

LocaleProvider supplies the pinned Semi v2.102.0 locale data to a Vue subtree. LocaleConsumer
lets custom components read one component locale, the locale code, the date-fns locale, and the
currency. A surrounding ConfigProvider locale takes precedence.

## Basic usage

::demo-block{demo="locale/en-US/Example1" title="Basic usage"}
::

## Reactive switching

Updating the `locale` prop updates descendants of that Provider. Nested providers stay isolated.

::demo-block{demo="locale/en-US/Example2" title="Reactive switching"}
::

## API

### LocaleProvider

| Prop     | Type                   | Default | Description                         |
| -------- | ---------------------- | ------- | ----------------------------------- |
| `locale` | `Readonly<SemiLocale>` | `zh_CN` | Locale data for the current subtree |

The default slot accepts any Vue children. The provider adds no DOM wrapper.

### LocaleConsumer

| Prop            | Type     | Default  | Description                                  |
| --------------- | -------- | -------- | -------------------------------------------- |
| `componentName` | `string` | required | Component key to read from the locale object |

The default scoped slot exposes:

| Field           | Type                  | Description                                            |
| --------------- | --------------------- | ------------------------------------------------------ |
| `localeData`    | `unknown`             | `locale[componentName]`; narrow it locally when needed |
| `localeCode`    | `string`              | Active locale code                                     |
| `dateFnsLocale` | `date-fns Locale`     | Active date locale, falling back to zh-CN              |
| `currency`      | `string \| undefined` | Active currency code                                   |

If the selected locale has no `code`, the consumer falls back to the complete pinned zh_CN
object instead of deep-merging partial data.

## Locale sources

All 57 v2.102.0 sources are default exports under
`@aifuxi/semi-ui-vue/locale/source/<fileName>`, including `zh_CN`, `en_US`, `en_GB`, `ja_JP`, and
`ar`. Each subpath is independently tree-shakeable and SSR-safe.

See the [React-to-Vue migration](#react-vue) and [alignment matrix](https://github.com/aifuxi/semi-ui-vue/blob/master/docs/components/locale/alignment.md).

## React → Vue

## 导入

```tsx
import { LocaleConsumer, LocaleProvider } from '@douyinfe/semi-ui';
import en_GB from '@douyinfe/semi-ui/lib/es/locale/source/en_GB';
```

```ts
import { LocaleConsumer, LocaleProvider } from '@aifuxi/semi-ui-vue';
import enGB from '@aifuxi/semi-ui-vue/locale/source/en_GB';
```

## children render function → 作用域 slot

React Consumer 使用四个位置参数：

```tsx
<LocaleConsumer componentName="TimePicker">
  {(localeData, localeCode, dateFnsLocale, currency) => (
    <span>
      {localeCode}: {localeData.begin}
    </span>
  )}
</LocaleConsumer>
```

Vue 将相同值改为具名 slot 字段：

```vue
<LocaleConsumer
  v-slot="{ localeData, localeCode, dateFnsLocale, currency }"
  component-name="TimePicker"
>
  <span>{{ localeCode }}: {{ localeData.begin }}</span>
</LocaleConsumer>
```

## 对照表

| React                      | Vue                        | 说明                           |
| -------------------------- | -------------------------- | ------------------------------ |
| `children`                 | 默认 slot                  | Provider/Consumer 都不增加 DOM |
| render arg `localeData`    | slot field `localeData`    | 指定组件的语言数据             |
| render arg `localeCode`    | slot field `localeCode`    | 当前 code                      |
| render arg `dateFnsLocale` | slot field `dateFnsLocale` | 缺失时回退 zh-CN               |
| render arg `currency`      | slot field `currency`      | 可为 `undefined`               |
| 切换 `locale` prop         | `:locale="locale"`         | Vue prop/ref 更新保持响应式    |
| `lib/es/locale/source/*`   | `locale/source/*`          | 文件名与默认导出保持一致       |

ConfigProvider 的 locale 优先级、缺 code 时整体回退 zh_CN、嵌套 Provider 隔离和 57 个
语言对象均保持固定 v2.102.0 行为。
