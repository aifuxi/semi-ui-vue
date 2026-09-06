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

## Supported languages

The pinned v2.102.0 release exports 57 locale sources. Import each through `@aifuxi/semi-ui-vue/locale/source/<name>`.

`ar`, `az`, `bg`, `bn_IN`, `ca`, `ceb_PH`, `cs_CZ`, `da`, `de`, `el_GR`, `en_GB`, `en_US`, `es`, `es_419`, `et`, `fa_IR`, `fi_FI`, `fil_PH`, `fr`, `fr_CA`, `ga`, `he_IL`, `hi_IN`, `hr`, `hu_HU`, `id_ID`, `is`, `it`, `ja_JP`, `jv_ID`, `kk`, `km_KH`, `ko_KR`, `lt`, `lv`, `ms_MY`, `my_MM`, `nb`, `nl_NL`, `pl_PL`, `pt`, `pt_BR`, `ro`, `ru_RU`, `sk`, `sl`, `sq`, `sv_SE`, `sw`, `th_TH`, `tr_TR`, `uk_UA`, `ur`, `uz`, `vi_VN`, `zh_CN`, `zh_TW`

## Supported components

Calendar, Cascader, Chat, DatePicker, Form, Image, List, Modal, Navigation, Pagination, Popconfirm, Select, Table, TimePicker, Transfer, Tree, TreeSelect, Typography and Upload.

## Usage

Wrap the application in LocaleProvider and update its locale prop to switch languages. ConfigProvider takes precedence when present and also supports direction for RTL.

## Internationalization

::demo-block{demo="locale/en-us/Internationalization" title="Internationalization"}
::

## Custom internationalized components

::demo-block{demo="locale/en-us/Custom" title="Custom internationalized components"}
::

## Components supporting multiple languages

::demo-block{demo="locale/en-us/Components" title="Components supporting multiple languages"}
::

The language menu preserves the pinned English list (54 entries); the Chinese example has 57. Images use local samples and navigation uses independent branding. Changing language remounts the consumer showcase, matching the upstream nested component.

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
