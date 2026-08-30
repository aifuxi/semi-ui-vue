# BackTop 回到顶部

BackTop 在页面或指定滚动容器超过阈值后显示回顶入口。本实现以本地 Semi Design v2.102.0 为唯一基线。

## 基本用法

```vue
<script setup lang="ts">
import { BackTop } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/back-top.css';
</script>

<template>
  <main>
    <p>向下滚动页面查看右下角按钮。</p>
    <BackTop @click="console.log('返回顶部')" />
  </main>
</template>
```

默认内容是 light 主题的 IconButton，固定在视口右侧 `100px`、底部 `50px`。

## 自定义容器与内容

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { BackTop } from '@aifuxi/semi-ui-vue';

const panel = useTemplateRef<HTMLElement>('panel');
const getTarget = () => panel.value;
</script>

<template>
  <div ref="panel" class="scroll-panel">
    <div class="long-content">...</div>
    <BackTop
      aria-label="返回面板顶部"
      role="button"
      tabindex="0"
      :duration="300"
      :target="getTarget"
      :visibility-height="160"
      :style="{ right: '40px', bottom: '40px' }"
    >
      <span class="custom-back-top">TOP</span>
    </BackTop>
  </div>
</template>
```

`target` 必须返回实际发生滚动的 Window 或 Element。固定 v2.102.0 根节点本身没有按钮 role 或键盘处理；需要完整自定义语义时，请像上例一样透传 `role`、`tabindex`、`aria-*`，并在业务层提供所需键盘事件。

## API

| 属性                                      | 说明                                           | 类型                                  | 默认值         |
| ----------------------------------------- | ---------------------------------------------- | ------------------------------------- | -------------- |
| `className`                               | Semi 兼容类名；也支持 Vue `class`              | `string`                              | `''`           |
| `duration`                                | 回顶动画时长，同时作为点击节流窗口             | `number`                              | `450`          |
| `style`                                   | 根节点样式；也支持 Vue `style`                 | `CSSProperties`                       | -              |
| `target`                                  | 返回滚动监听目标                               | `() => Window \| HTMLElement \| null` | `() => window` |
| `visibilityHeight`                        | 显示所需滚动高度，严格使用 `scrollTop > value` | `number`                              | `400`          |
| `data-*` / `aria-*` / `role` / `tabindex` | 透传到 `.semi-backtop` 根节点                  | 对应 HTML 属性                        | -              |

| 事件    | 载荷                  | 说明                              |
| ------- | --------------------- | --------------------------------- |
| `click` | `(event: MouseEvent)` | Foundation 启动回顶动画后同步触发 |

| Slot      | 说明                     |
| --------- | ------------------------ |
| `default` | 替换默认 IconButton 内容 |

## React → Vue 迁移

| React v2.102.0                              | Vue                                          |
| ------------------------------------------- | -------------------------------------------- |
| `<BackTop target={getTarget}>...</BackTop>` | `<BackTop :target="getTarget">...</BackTop>` |
| `children`                                  | 默认 slot                                    |
| `onClick`                                   | `@click`                                     |
| `className` / `style`                       | 保留兼容 prop，也支持 Vue `class` / `style`  |

完整源码证据、事件顺序、动画、RTL、SSR 与 deviation 见[对齐矩阵](./alignment.md)。
