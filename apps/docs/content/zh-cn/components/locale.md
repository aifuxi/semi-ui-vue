---
title: '多语言'
description: '国际化组件，为 Semi 组件提供多语言支持'
locale: 'zh-CN'
slug: 'locale'
category: 'other'
order: 96
englishTitle: 'LocaleProvider'
icon: 'doc-i18n'
upstream: 'other/locale'
---

LocaleProvider 向当前 Vue 子树提供 Semi v2.102.0 语言数据，LocaleConsumer 可让自定义
组件读取指定组件的文案、locale code、date-fns locale 与 currency。若同时存在
ConfigProvider，其 locale 优先。

## 目前支持语言

固定 v2.102.0 导出 57 个语言源，通过 `@aifuxi/semi-ui-vue/locale/source/<文件名>` 导入。

`ar`, `az`, `bg`, `bn_IN`, `ca`, `ceb_PH`, `cs_CZ`, `da`, `de`, `el_GR`, `en_GB`, `en_US`, `es`, `es_419`, `et`, `fa_IR`, `fi_FI`, `fil_PH`, `fr`, `fr_CA`, `ga`, `he_IL`, `hi_IN`, `hr`, `hu_HU`, `id_ID`, `is`, `it`, `ja_JP`, `jv_ID`, `kk`, `km_KH`, `ko_KR`, `lt`, `lv`, `ms_MY`, `my_MM`, `nb`, `nl_NL`, `pl_PL`, `pt`, `pt_BR`, `ro`, `ru_RU`, `sk`, `sl`, `sq`, `sv_SE`, `sw`, `th_TH`, `tr_TR`, `uk_UA`, `ur`, `uz`, `vi_VN`, `zh_CN`, `zh_TW`

## 已支持组件

Calendar、Cascader、Chat、DatePicker、Form、Image、List、Modal、Navigation、Pagination、Popconfirm、Select、Table、TimePicker、Transfer、Tree、TreeSelect、Typography、Upload。

## 使用

在应用外围包裹 LocaleProvider，更新 locale prop 即可切换语言。存在 ConfigProvider 时其 locale 优先；需要 RTL 时同时配置 direction。

## 国际化

::demo-block{demo="locale/zh-cn/Internationalization" title="国际化"}
::

## 自定义国际化组件

::demo-block{demo="locale/zh-cn/Custom" title="自定义国际化组件"}
::

## 支持多语言的组件

::demo-block{demo="locale/zh-cn/Components" title="支持多语言的组件"}
::

语言菜单保留固定中文示例的 57 项，英文示例为 54 项；图片使用本地样本，导航使用独立品牌。切换语言重新挂载消费者，与上游内嵌组件的生命周期一致。

## API

### LocaleProvider

| 属性     | 类型                   | 默认值  | 说明               |
| -------- | ---------------------- | ------- | ------------------ |
| `locale` | `Readonly<SemiLocale>` | `zh_CN` | 当前子树的语言数据 |

默认 slot 接收任意 Vue 子节点；Provider 不增加 DOM。

### LocaleConsumer

| 属性            | 类型     | 默认值 | 说明                   |
| --------------- | -------- | ------ | ---------------------- |
| `componentName` | `string` | 必填   | 从语言对象读取的组件键 |

默认作用域 slot 暴露：

| 字段            | 类型                  | 说明                                             |
| --------------- | --------------------- | ------------------------------------------------ |
| `localeData`    | `unknown`             | `locale[componentName]`，可通过泛型/局部类型收窄 |
| `localeCode`    | `string`              | 当前语言 code                                    |
| `dateFnsLocale` | `date-fns Locale`     | 当前日期语言；缺失时回退 zh-CN                   |
| `currency`      | `string \| undefined` | 当前货币代码                                     |

若选中的 locale 缺少 `code`，Consumer 会整体回退固定 zh_CN，不执行深合并。

## 语言源

固定 v2.102.0 的 57 个语言源均通过
`@aifuxi/semi-ui-vue/locale/source/<文件名>` 默认导出，例如 `zh_CN`、`en_US`、
`en_GB`、`ja_JP`、`ar`。这些入口可独立 tree-shake，并支持 SSR import。

React 到 Vue 的完整映射见 [迁移说明](#react-vue)，源码与验收证据见
[对齐矩阵](https://github.com/aifuxi/semi-ui-vue/blob/master/docs/components/locale/alignment.md)。

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
