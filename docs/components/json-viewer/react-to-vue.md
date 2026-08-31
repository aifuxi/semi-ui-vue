# JsonViewer React → Vue 迁移

| Semi React v2.102.0                                    | Vue                                        | 说明                                                             |
| ------------------------------------------------------ | ------------------------------------------ | ---------------------------------------------------------------- |
| `<JsonViewer value={value} onChange={setValue} />`     | `<JsonViewer v-model:value="value" />`     | `change` 对应 `onChange`                                         |
| `className`                                            | `class` 或 `className`                     | 两者都会落在外层容器                                             |
| `style`                                                | `:style`                                   | Vue 原生样式绑定                                                 |
| `options`                                              | `:options`                                 | 枚举和字段名保持一致                                             |
| `renderSearchButton(node, controls)`                   | `:render-search-button` 或 `#searchButton` | ReactNode 改为 Vue VNode/slot                                    |
| `customRenderRule[].render` 返回 ReactNode/HTMLElement | 返回 Vue VNodeChild/HTMLElement            | HTMLElement 仍由 core 直接使用；VNode 由 Vue renderer 挂载并清理 |
| `ref.current.foundation...`                            | 组件 ref 的公开方法                        | 不暴露 Foundation 私有实例                                       |

```vue
<JsonViewer :value="value" @change="value = $event">
  <template #searchButton="{ defaultSearchButton, controls }">
    <button type="button" @click="controls.onToggleSearchBar">查找</button>
    <component :is="defaultSearchButton" v-if="controls.showSearchBar" />
  </template>
</JsonViewer>
```

布尔属性遵循 Vue 原生语义：省略 `showSearch` 与显式 `true` 均显示入口，显式 `false` 隐藏。Worker 已内联到发布产物，消费方无需复制 worker 文件或初始化 vendor submodule。
