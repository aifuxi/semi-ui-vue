# Feedback 反馈

`Feedback` 用 Modal 或底部 SideSheet 收集文本、表情、单选、复选或自定义反馈。实现固定对齐 Semi Design v2.102.0；可见性由调用方通过 `v-model:visible` 控制。

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Feedback } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/feedback.css';

const visible = ref(true);
</script>

<template>
  <Feedback
    v-model:visible="visible"
    title="这次体验怎么样？"
    type="emoji"
    @value-change="(value) => console.log(value)"
    @cancel="visible = false"
    @ok="visible = false"
  />
</template>
```

## 内容类型

- `text`：单个 TextArea；可通过 `textAreaProps` 配置。
- `emoji`：`😞`、`😐`、`😃`；选择 `😞` 后出现可选原因输入框。
- `radio` / `checkbox`：分别通过 `radioGroupProps` / `checkboxGroupProps` 提供 `options`。
- `custom`：渲染默认 slot。若需包裹内置内容，使用 `#content="{ content }"` 或 `renderContent`。

```vue
<Feedback
  v-model:visible="visible"
  mode="modal"
  type="radio"
  title="主要问题是什么？"
  :radio-group-props="{
    options: [
      { label: '交互不清晰', value: 'interaction' },
      { label: '响应较慢', value: 'performance' },
    ],
  }"
  @cancel="visible = false"
  @ok="visible = false"
/>
```

## API

| Prop                                  | 类型                                                     | 默认值    | 说明                                      |
| ------------------------------------- | -------------------------------------------------------- | --------- | ----------------------------------------- |
| `mode`                                | `'popup' \| 'modal'`                                     | `'popup'` | SideSheet 或 Modal 容器                   |
| `type`                                | `'text' \| 'emoji' \| 'radio' \| 'checkbox' \| 'custom'` | `'emoji'` | 反馈内容                                  |
| `visible`                             | `boolean`                                                | `false`   | 容器可见性，支持 `v-model:visible`        |
| `textAreaProps`                       | `FeedbackTextAreaProps`                                  | -         | TextArea 配置                             |
| `radioGroupProps`                     | `FeedbackRadioGroupProps`                                | -         | RadioGroup 配置                           |
| `checkboxGroupProps`                  | `FeedbackCheckboxGroupProps`                             | -         | CheckboxGroup 配置                        |
| `renderContent`                       | `(content: VNodeChild) => VNodeChild`                    | -         | 包裹或替换已生成内容                      |
| `okButtonProps` / `cancelButtonProps` | `FeedbackButtonProps`                                    | -         | 默认 footer 按钮配置                      |
| `footer`                              | `VNodeChild`                                             | 默认按钮  | popup footer；也可用 `#footer`            |
| `onOk` / `onCancel`                   | `(event) => void \| Promise`                             | noop      | 操作回调；popup 可用 Promise 驱动 loading |

`value-change` 返回：文本/单选为字符串，复选为数组，表情为 `{ emoji, text? }`。提交按钮在值为空或复选数组为空时禁用。popup 的确定/取消不会自行修改父级 `visible`，请在回调中关闭；Modal 沿用既有异步关闭规则。

## Portal、国际化与 SSR

可通过 `getPopupContainer` 指定首次挂载时已存在的容器。取消/提交文案来自 `LocaleProvider` 或 `ConfigProvider` 的 `Feedback` locale。模块导入 SSR-safe；Portal 和浏览器监听只在挂载后创建并在卸载时清理。

React 迁移见 [react-to-vue.md](./react-to-vue.md)，完整对齐证据见 [alignment.md](./alignment.md)。
