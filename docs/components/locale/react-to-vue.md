# Locale React → Vue 迁移

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
