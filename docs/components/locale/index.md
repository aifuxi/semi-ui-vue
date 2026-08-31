# Locale 多语言上下文

LocaleProvider 向当前 Vue 子树提供 Semi v2.102.0 语言数据，LocaleConsumer 可让自定义
组件读取指定组件的文案、locale code、date-fns locale 与 currency。若同时存在
ConfigProvider，其 locale 优先。

## 基本使用

```vue
<script setup lang="ts">
import { LocaleConsumer, LocaleProvider } from '@aifuxi/semi-ui-vue';
import enGB from '@aifuxi/semi-ui-vue/locale/source/en_GB';
</script>

<template>
  <LocaleProvider :locale="enGB">
    <LocaleConsumer v-slot="{ localeData, localeCode }" component-name="TimePicker">
      <p>{{ localeCode }}: {{ localeData.begin }}</p>
    </LocaleConsumer>
  </LocaleProvider>
</template>
```

## 响应式切换

`locale` 可以是 computed/ref 解包后的对象；prop 更新会立即传给当前 Provider 的后代，
嵌套 Provider 彼此隔离。

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { LocaleConsumer, LocaleProvider } from '@aifuxi/semi-ui-vue';
import enGB from '@aifuxi/semi-ui-vue/locale/source/en_GB';
import jaJP from '@aifuxi/semi-ui-vue/locale/source/ja_JP';

const japanese = ref(false);
const locale = computed(() => (japanese.value ? jaJP : enGB));
</script>

<template>
  <LocaleProvider :locale="locale">
    <LocaleConsumer v-slot="slotProps" component-name="Pagination">
      <span>{{ slotProps.localeData.jumpTo }}</span>
    </LocaleConsumer>
    <button type="button" @click="japanese = !japanese">切换语言</button>
  </LocaleProvider>
</template>
```

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

React 到 Vue 的完整映射见 [迁移说明](./react-to-vue.md)，源码与验收证据见
[对齐矩阵](./alignment.md)。
