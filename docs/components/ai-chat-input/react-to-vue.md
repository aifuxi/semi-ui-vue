# AIChatInput React → Vue 迁移

| Semi React v2.102.0                        | Vue                                      | 说明                                                    |
| ------------------------------------------ | ---------------------------------------- | ------------------------------------------------------- |
| `onContentChange={fn}`                     | `@content-change="fn"`                   | 事件参数保持转换后的内容数组                            |
| `onMessageSend={fn}`                       | `@message-send="fn"`                     | payload 保留 references/attachments/inputContents/setup |
| `renderReference`                          | `#reference="{ reference }"`             | 返回 Vue VNode                                          |
| `renderUploadButton`                       | `#uploadButton="props"`                  | 可用 `defaultNode` 与 `openFileDialog`                  |
| `renderTopSlot`                            | `#top="props"`                           | `topSlotPosition` 值不变                                |
| `renderConfigureArea`                      | `#configure`                             | 配合 `AIChatInput.Configure.*`                          |
| `renderActionArea`                         | `#action="{ menuItem, className }"`      | `menuItem` 已包含可工作的 Upload/Send VNode             |
| `renderSuggestionItem` / `renderSkillItem` | `#suggestion` / `#skill`                 | slot props 提供 class 与点击/悬浮回调                   |
| `renderTemplate`                           | `#template="{ skill, onTemplateClick }"` | 模板选择回写编辑器                                      |
| `ref.current.setContent(...)`              | 组件 ref `.setContent(...)`              | 不暴露私有 Foundation                                   |

`immediatelyRender` 为迁移兼容 prop：React adapter 用它避免 SSR 立即创建 Editor；Vue adapter 天然在 `onMounted` 后创建，因此 true/false 不改变 Vue 的首帧时机，SSR 结果与 React 的 false 路径等价。

```vue
<AIChatInput :references="references" :upload-props="{ action: '/upload' }">
  <template #reference="{ reference }">
    <a :href="reference.url">{{ reference.name }}</a>
  </template>
  <template #action="{ menuItem, className }">
    <div :class="className"><component :is="item" v-for="(item, i) in menuItem" :key="i" /></div>
  </template>
</AIChatInput>
```

所有默认值为 `true` 的 Boolean prop 都区分缺省与显式 `false`；模板中的裸属性、`:prop="false"` 与 render function 输入均遵循 Vue 原生语义。Tiptap 扩展继续通过 `extensions` 追加，公开 Tiptap 类型来自已声明的运行时依赖，不需要消费方初始化 `vendor/semi-design`。
