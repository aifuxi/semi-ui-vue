# Locale context

LocaleProvider supplies the pinned Semi v2.102.0 locale data to a Vue subtree. LocaleConsumer
lets custom components read one component locale, the locale code, the date-fns locale, and the
currency. A surrounding ConfigProvider locale takes precedence.

## Basic usage

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

## Reactive switching

Updating the `locale` prop updates descendants of that Provider. Nested providers stay isolated.

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
    <button type="button" @click="japanese = !japanese">Switch locale</button>
  </LocaleProvider>
</template>
```

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

See the [React-to-Vue migration](./react-to-vue.md) and [alignment matrix](./alignment.md).
