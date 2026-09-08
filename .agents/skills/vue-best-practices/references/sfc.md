---
title: Single-File Component Structure, Styling, and Template Patterns
impact: MEDIUM
impactDescription: Consistent SFC structure and styling choices improve maintainability, tooling support, and render performance
type: best-practice
tags:
  [
    vue3,
    sfc,
    scoped-css,
    styles,
    build-tools,
    performance,
    template,
    v-html,
    v-for,
    computed,
    v-if,
    v-show,
  ]
---

# Single-File Component Structure, Styling, and Template Patterns

**Impact: MEDIUM** - Using SFCs with consistent structure and performant styling keeps components easier to maintain and avoids unnecessary render overhead.

## Task List

- Use `.vue` SFCs for component template and setup logic; follow the project's existing style packaging
- Colocate component-local styles when appropriate; shared themes and published SCSS/CSS may live separately
- Use PascalCase for component names in templates and filenames
- Prefer scoped styles for isolated application UI; preserve library theme and selector contracts
- Prefer class selectors (not element selectors) in scoped CSS for performance
- Access DOM / component refs with `useTemplateRef()` in Vue 3.5+
- Use camelCase keys in `:style` bindings for consistency and IDE support
- Use `v-for` and `v-if` correctly
- Never use `v-html` with untrusted/user-provided content
- Choose `v-if` vs `v-show` based on toggle frequency and initial render cost

## Colocate template, script, and styles

对普通业务组件，同文件组织便于维护；独立样式文件本身不是错误。本仓库的组件样式由 `packages/theme-default` 集成固定上游 SCSS，并提供独立发布入口。不要为了套用下列业务组件示例把 `.semi-*` / `--semi-*` 迁入 scoped 样式，或拆散共享主题依赖。

**Usually unnecessary for a small application component:**

```
components/
├── UserCard.vue
├── UserCard.js
└── UserCard.css
```

**GOOD:**

```vue
<!-- components/UserCard.vue -->
<script setup>
import { computed } from 'vue';

const props = defineProps({
  user: { type: Object, required: true },
});

const displayName = computed(() => `${props.user.firstName} ${props.user.lastName}`);
</script>

<template>
  <div class="user-card">
    <h3 class="name">{{ displayName }}</h3>
  </div>
</template>

<style scoped>
.user-card {
  padding: 1rem;
}

.name {
  margin: 0;
}
</style>
```

## Use PascalCase for component names

**BAD:**

```vue
<script setup>
import userProfile from './user-profile.vue';
</script>

<template>
  <user-profile :user="currentUser" />
</template>
```

**GOOD:**

```vue
<script setup>
import UserProfile from './UserProfile.vue';
</script>

<template>
  <UserProfile :user="currentUser" />
</template>
```

## Best practices for `<style>` block in SFCs

### Prefer component-scoped styles

- Use `<style scoped>` for isolated application component styles when it fits the project.
- 本组件库的默认主题、上游 SCSS、公开 class/Token 与逐组件样式入口遵循现有主题包边界；不要因这条建议改变样式作用域或兼容契约。
- Keep **global CSS** in a dedicated file (e.g. `src/assets/main.css`) for resets, typography, tokens, etc.
- Use `:deep()` sparingly (edge cases only).

**BAD:**

```vue
<style>
/* ❌ leaks everywhere */
button {
  border-radius: 999px;
}
</style>
```

**GOOD:**

```vue
<style scoped>
.button {
  border-radius: 999px;
}
</style>
```

**GOOD:**

```css
/* src/assets/main.css */
/* ✅ resets, tokens, typography, app-wide rules */
:root {
  --radius: 999px;
}
```

### Use class selectors in scoped CSS

**BAD:**

```vue
<template>
  <article>
    <h1>{{ title }}</h1>
    <p>{{ subtitle }}</p>
  </article>
</template>

<style scoped>
article {
  max-width: 800px;
}
h1 {
  font-size: 2rem;
}
p {
  line-height: 1.6;
}
</style>
```

**GOOD:**

```vue
<template>
  <article class="article">
    <h1 class="article-title">{{ title }}</h1>
    <p class="article-subtitle">{{ subtitle }}</p>
  </article>
</template>

<style scoped>
.article {
  max-width: 800px;
}
.article-title {
  font-size: 2rem;
}
.article-subtitle {
  line-height: 1.6;
}
</style>
```

## Access DOM / component refs with `useTemplateRef()`

For Vue 3.5+: use `useTemplateRef()` to access template refs.

```vue
<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';

const inputRef = useTemplateRef<HTMLInputElement>('input');

onMounted(() => {
  inputRef.value?.focus();
});
</script>

<template>
  <input ref="input" />
</template>
```

## Use camelCase in `:style` bindings

**BAD:**

```vue
<template>
  <div :style="{ 'font-size': fontSize + 'px', 'background-color': bg }">Content</div>
</template>
```

**GOOD:**

```vue
<template>
  <div :style="{ fontSize: fontSize + 'px', backgroundColor: bg }">Content</div>
</template>
```

## Use `v-for` and `v-if` correctly

### Always provide a stable `:key`

- Prefer primitive keys (`string | number`).
- Avoid using objects as keys.

**GOOD:**

```vue
<li v-for="item in items" :key="item.id">
  <input v-model="item.text" />
</li>
```

### Avoid `v-if` and `v-for` on the same element

It leads to unclear intent and unnecessary work.
([Reference](https://vuejs.org/guide/essentials/list.html#v-for-with-v-if))

**To filter items**
**BAD:**

```vue
<li v-for="user in users" v-if="user.active" :key="user.id">
  {{ user.name }}
</li>
```

**GOOD:**

```vue
<script setup lang="ts">
import { computed } from 'vue';

const activeUsers = computed(() => users.value.filter((u) => u.active));
</script>

<template>
  <li v-for="user in activeUsers" :key="user.id">
    {{ user.name }}
  </li>
</template>
```

**To conditionally show/hide the entire list**
**GOOD:**

```vue
<ul v-if="shouldShowUsers">
  <li v-for="user in users" :key="user.id">
    {{ user.name }}
  </li>
</ul>
```

## Never render untrusted HTML with `v-html`

**BAD:**

```vue
<template>
  <!-- DANGEROUS: untrusted input can inject scripts -->
  <article v-html="userProvidedContent"></article>
</template>
```

**GOOD:**

```vue
<script setup>
import { computed } from 'vue'
import DOMPurify from 'dompurify'

const props = defineProps<{
  trustedHtml?: string
  plainText: string
}>()

const safeHtml = computed(() => DOMPurify.sanitize(props.trustedHtml ?? ''))
</script>

<template>
  <!-- Preferred: escaped interpolation -->
  <p>{{ props.plainText }}</p>

  <!-- Only for trusted/sanitized HTML -->
  <article v-html="safeHtml"></article>
</template>
```

## Choose `v-if` vs `v-show` by toggle behavior

**BAD:**

```vue
<template>
  <!-- Frequent toggles with v-if cause repeated mount/unmount -->
  <ComplexPanel v-if="isPanelOpen" />

  <!-- Rarely shown content with v-show pays initial render cost -->
  <AdminPanel v-show="isAdmin" />
</template>
```

**GOOD:**

```vue
<template>
  <!-- Frequent toggles: keep in DOM, toggle display -->
  <ComplexPanel v-show="isPanelOpen" />

  <!-- Rare condition: lazy render only when true -->
  <AdminPanel v-if="isAdmin" />
</template>
```
