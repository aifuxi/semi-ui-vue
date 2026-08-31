# HotKeys 快捷键

HotKeys 用固定 Semi Design v2.102.0 的组合键状态机监听键盘事件，同时渲染一致的
快捷键提示。组合中必须恰好有一个普通键，并可搭配 Meta、Shift、Alt、Control。

```ts
import { HotKeys } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/hot-keys.css';
```

## 基础用法

```vue
<script setup lang="ts">
import { HotKeys } from '@aifuxi/semi-ui-vue/hot-keys';

function save(event: KeyboardEvent) {
  console.log('save', event.code);
}
</script>

<template>
  <HotKeys
    :hot-keys="[HotKeys.Keys.Control, HotKeys.Keys.S]"
    :content="['Ctrl', 'S']"
    prevent-default
    @hot-key="save"
  />
</template>
```

普通键按 `KeyboardEvent.code` 匹配，因此字母大小写不影响组合。未声明的修饰键也必须
处于未按下状态，例如配置 Control+S 时，Control+Shift+S 不会触发。

## 自定义监听目标

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { HotKeys } from '@aifuxi/semi-ui-vue/hot-keys';

const panel = useTemplateRef<HTMLElement>('panel');
</script>

<template>
  <section ref="panel" tabindex="0">
    <HotKeys
      :hot-keys="[HotKeys.Keys.Enter]"
      :get-listener-target="() => panel"
      @hot-key="() => console.log('panel enter')"
    />
  </section>
</template>
```

缺省监听 `document.body`。目标只在挂载时确定；运行中改变 getter 不会重绑，与固定
v2.102.0 Adapter 一致。组件卸载时会从实际注册目标清理监听。

## 自定义显示

默认 slot 是 React `render` prop 的 Vue 原生映射；使用 slot 后不再生成键帽结构，
但保留 `.semi-hotKeys` 根容器。

```vue
<HotKeys :hot-keys="[HotKeys.Keys.Control, HotKeys.Keys.K]">
  <strong>打开命令面板</strong>
</HotKeys>
```

## API

| 属性                  | 说明                                           | 类型                                     | 默认值          |
| --------------------- | ---------------------------------------------- | ---------------------------------------- | --------------- |
| `hotKeys`             | 合法组合键；恰好一个普通键                     | `HotKeysKey[]`                           | 必填            |
| `content`             | 覆盖键帽显示文本，不改变实际组合               | `string[]`                               | `hotKeys`       |
| `getListenerTarget`   | 返回 keydown 监听目标                          | `() => HTMLElement \| null \| undefined` | `document.body` |
| `preventDefault`      | 命中时阻止默认行为                             | `boolean`                                | `false`         |
| `mergeMetaCtrl`       | v2.102.0 兼容 prop；固定 Foundation 中为 no-op | `boolean`                                | `false`         |
| `class` / `className` | 根 class                                       | `HTMLAttributes['class']`                | -               |
| `style`               | 根内联样式                                     | `StyleValue`                             | -               |

事件：`hotKey(event: KeyboardEvent)`、`click(event: MouseEvent)`。默认 slot 覆盖键帽
显示。组件不自动获得焦点或 ARIA role；可按业务语义透传 `role`、`aria-*`、`data-*`。

完整事件顺序、SSR、暗色、RTL 与 accepted deviation 见[对齐矩阵](./alignment.md)，
React 迁移见[迁移说明](./react-to-vue.md)。
