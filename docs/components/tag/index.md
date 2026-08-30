# Tag 标签

`Tag` 对齐 Semi Design v2.102.0 的标签、标签组与组合标签。支持颜色、类型、尺寸、形状、头像、图标、关闭、受控可见性、折叠标签组、Popover 和键盘操作。

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { SplitTagGroup, Tag, TagGroup } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';

const visible = shallowRef(true);
const tags = [
  { tagKey: 'vue', content: 'Vue', color: 'blue' as const, closable: true },
  { tagKey: 'semi', content: 'Semi', color: 'cyan' as const },
  { tagKey: 'design', content: 'Design', color: 'teal' as const },
];
</script>

<template>
  <Tag v-model:visible="visible" color="blue" closable>可关闭标签</Tag>
  <TagGroup :tag-list="tags" :max-tag-count="2" show-popover />
  <SplitTagGroup aria-label="组合标签">
    <Tag color="blue" type="solid">一</Tag>
    <Tag color="cyan" type="solid">二</Tag>
  </SplitTagGroup>
</template>
```

## Vue API

- `Tag`：默认 slot 为内容；`#prefixIcon`、`#suffixIcon` 优先于同名 prop。`close(content, event, tagKey)` 可通过 `event.preventDefault()` 取消隐藏；`v-model:visible` 用于受控显示。
- `TagGroup`：`tagList` 使用 `content` 代替 React `children`；`tagClose` 发生在条目自己的 `close` 回调之后；`maxTagCount` 超出时显示 `+N`。
- `SplitTagGroup`：只装饰直接可见子节点，输出 `role="group"` 并保留子节点已有 class。
- 交互 Tag 支持 Enter 点击、Delete/Backspace 关闭、Escape 失焦。

完整类型、默认值、DOM/RTL/SSR 与验收证据见 [alignment.md](./alignment.md)，React 迁移见 [react-to-vue.md](./react-to-vue.md)。
