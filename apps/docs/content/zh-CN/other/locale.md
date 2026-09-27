---
title: 'LocaleProvider 多语言'
description: '国际化组件，为 Semi 组件提供多语言支持'
type: 'other'
order: 96
icon: 'doc-i18n'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/locale` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 目前支持语言

| 最低支持版本 | 语言                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| v0.0.1       | 简体中文: zh_CN                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| v0.7.0       | 英语: en_GB、日语: ja_JP、韩语: ko_KR                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| v1.8.0       | 阿拉伯语: ar                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| v1.11.0      | 越南语: vi_VN、俄罗斯语: ru_RU、印尼语: id_ID、马来语: ms_MY、泰语: th_TH、土耳其语: tr_TR                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| v1.17.0      | 葡萄牙语（巴西）: pt_BR                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| v1.28.0      | 繁体中文: zh_TW                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| v2.2.0       | 西班牙语: es                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| v2.15.0      | 意大利语: it、法语：fr、德语：de                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| v2.21.0      | 罗马尼亚语: ro                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| v2.29.0      | 瑞典语： sv_SE、波兰语： pl_PL、荷兰语： nl_NL                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| v2.88.0      | 阿塞拜疆语：az、保加利亚语：bg、加泰罗尼亚语：ca、捷克语：cs_CZ、宿务语：ceb_PH、丹麦语： da、希腊语：el_GR、西班牙语（拉美）：es_419、爱沙尼亚语：et、波斯语：fa_IR、菲律宾语：fil_PH、芬兰语： fi_FI、法语（加）：fr_CA、爱尔兰语：ga、希伯来语：he_IL、印地语：hi_IN、克罗地亚语：hr、匈牙利语：hu_HU、冰岛语：is、爪哇语：jv_ID、哈萨克语：kk、高棉语：km_KH、立陶宛语：lt、拉脱维亚语：lv、缅甸语：my_MM、挪威语： nb、葡萄牙语：pt、斯洛伐克语：sk、斯洛文尼亚语：sl、阿尔巴尼亚语：sq、斯瓦希里语：sw、乌克兰语：uk_UA、乌尔都语：ur、乌兹别克语：uz |

## 已支持组件

目前有以下组件存在内置默认文本，均已实现国际化多语言适配
Calendar、Cascader、Chat、DatePicker、Form、Image、List、List、Modal、Navigation、Nav、Pagination、Popconfirm、Select、Table、TimePicker、Transfer、Tree、TreeSelect、Typography、Upload

## 使用

LocaleProvider 使用 Vue provide/inject 向组件子树提供语言数据，在应用外围包裹一次即可生效。
当需要切换语言时，直接切换 props 传入的 locale 即可

<DemoBlock id="zh-CN-other-locale-1" title="使用" kind="code" />

## 代码示例

### 国际化

<DemoBlock id="zh-CN-other-locale-2" title="国际化" kind="live" />

### 自定义国际化组件

自定义组件需要读取 localeCode 或具体组件的 i18n 文本 localeData 时，可以通过 LocaleConsumer 的默认作用域插槽获取。

<DemoBlock id="zh-CN-other-locale-3" title="自定义国际化组件" kind="live" />

### 支持多语言的组件

示例给出了目前所有支持多语言的组件

当你的网站有RTL适配需求时，推荐直接使用ConfigProvider，除了可配置locale外，还可以直接同时配置direction='rtl'/'ltr'
若无RTL适配需求，直接使用LocaleProvider即可

<DemoBlock id="zh-CN-other-locale-4" title="支持多语言的组件" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/locale/types.ts`、`packages/ui/src/locale/index.ts` 的公开类型为准。

#### Vue 用法

- LocaleConsumer 优先读取 ConfigProvider 的 locale，其次读取最近的 LocaleProvider，最后回退到 `zh_CN`。
- Provider 与 Consumer 都不增加 DOM；57 个语言源从 `@aifuxi/semi-ui-vue/locale/source/*` 导入。

#### Vue 插槽

**LocaleProvider**

| 插槽    | 作用域参数 | 说明                     |
| ------- | ---------- | ------------------------ |
| default | {}         | 使用该语言数据的组件子树 |

**LocaleConsumer**

| 插槽    | 作用域参数                                          | 说明                   |
| ------- | --------------------------------------------------- | ---------------------- |
| default | { localeData, localeCode, dateFnsLocale, currency } | 读取指定组件的语言数据 |

### LocaleProvider

| 属性   | 说明               | 类型                       | 默认值  |
| ------ | ------------------ | -------------------------- | ------- |
| locale | 注入子树的语言数据 | Readonly&lt;SemiLocale&gt; | `zh_CN` |

### LocaleConsumer

| 属性          | 说明                   | 类型           | 默认值 |
| ------------- | ---------------------- | -------------- | ------ |
| componentName | 读取语言数据的组件键名 | string（必填） | —      |
