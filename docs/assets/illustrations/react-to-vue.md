# Semi Illustrations React → Vue

## 导入

```tsx
// React
import { IllustrationNoContent } from '@douyinfe/semi-illustrations';
```

```vue
<script setup lang="ts">
// Vue
import { IllustrationNoContent } from '@workspace/illustrations';
</script>
```

公开组件名保持不变。React `className` 改用 Vue 原生 `class`，React style object 改用 Vue `:style`；`aria-*`、`data-*`、宽高和原生事件直接作为 attrs 传入。

```tsx
<IllustrationNoContent className="empty-art" style={{ width: 150, height: 150 }} />
```

```vue
<IllustrationNoContent class="empty-art" :style="{ width: '150px', height: '150px' }" />
```

light/dark 仍是两个独立组件。主题切换由 Empty 等消费组件选择对应插画，插画本身不监听 `body[theme-mode]`。
