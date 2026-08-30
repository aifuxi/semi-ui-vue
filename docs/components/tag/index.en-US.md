# Tag

`Tag` aligns the Tag, TagGroup, and SplitTagGroup APIs and visuals with Semi Design v2.102.0. It supports colors, types, sizes, shapes, avatars, icons, closing, controlled visibility, collapsed groups, Popover, and keyboard interaction.

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
  <Tag v-model:visible="visible" color="blue" closable>Closable tag</Tag>
  <TagGroup :tag-list="tags" :max-tag-count="2" show-popover />
  <SplitTagGroup aria-label="Connected tags">
    <Tag color="blue" type="solid">One</Tag>
    <Tag color="cyan" type="solid">Two</Tag>
  </SplitTagGroup>
</template>
```

## Vue API

- `Tag` uses the default slot for content. `#prefixIcon` and `#suffixIcon` override their props. A `close(content, event, tagKey)` listener may call `event.preventDefault()` to keep the tag visible; use `v-model:visible` for controlled visibility.
- `TagGroup.tagList` uses `content` instead of React `children`. `tagClose` fires after the item-level close listener. `maxTagCount` renders a `+N` tag.
- `SplitTagGroup` decorates only direct visible children, renders `role="group"`, and preserves existing child classes.
- Interactive tags support Enter activation, Delete/Backspace closing, and Escape blur.

See [alignment.md](./alignment.md) for the full contract and [react-to-vue.md](./react-to-vue.md) for migration.
