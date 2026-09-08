---
title: Teleport Preserves Scoped Attributes but Changes DOM Ancestry
impact: MEDIUM
impactDescription: Teleported elements retain scope IDs; ancestor selectors and inherited styles depend on the actual target DOM
type: gotcha
tags: [vue3, teleport, scoped-styles, css]
---

# Teleport 保留 scopeId，但会改变 DOM 祖先关系

Teleport 移动渲染节点时会保留组件的作用域属性。组件模板自己生成的 `.modal` 节点通常仍带有 `data-v-*`，所以 `<style scoped>` 中单独的 `.modal` 规则可以正常匹配。不能把 Teleport 样式问题统一归因于作用域属性丢失。

## 按实际选择器排查

1. 在浏览器检查目标节点、`data-v-*`、CSS 加载情况及 computed style。
2. 若选择器是 `.host .modal`，确认 Teleport 后 `.host` 是否仍是 DOM 祖先。组件的逻辑父子关系不能满足 CSS 后代选择器。
3. 检查原父节点提供的 CSS 变量、字体或颜色继承是否随目标容器改变；主题应作用到真实 Portal 容器。
4. 子组件内部节点、slot 或 `v-html` 内容再按各自的 scoped 规则处理；不要默认扩大到全局样式。

```vue
<template>
  <section class="host">
    <Teleport to="body">
      <div class="modal">Dialog</div>
    </Teleport>
  </section>
</template>

<style scoped>
/* 仍能匹配带 scopeId 的 Teleport 节点。 */
.modal {
  color: blue;
}

/* Teleport 到 body 后，.host 不再是 .modal 的 DOM 祖先。 */
.host .modal {
  border: 1px solid red;
}
</style>
```

`:deep()` 只改变作用域选择器的编译方式，不会恢复已不存在的 DOM 祖先。优先按真实节点关系调整选择器或容器；只有样式确实需要跨组件或全局作用域时才使用 deep/global。本仓库的浮层应继续遵守主题包、`.semi-*` class 与 `--semi-*` Token 契约。

多根组件的 class/style fallthrough 是另一项问题；需要显式声明 attrs 的目标时参见 [多根组件 attrs](multi-root-component-class-attrs.md)。

## 参考

- [Vue：Scoped CSS 与 Deep Selectors](https://vuejs.org/api/sfc-css-features.html#scoped-css)
- [Vue：Teleport 的逻辑层级与实际 DOM](https://vuejs.org/guide/built-ins/teleport.html)
