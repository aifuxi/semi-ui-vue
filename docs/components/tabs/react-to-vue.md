# Tabs React → Vue 迁移

| React v2.102.0                         | Vue                                                | 说明                                             |
| -------------------------------------- | -------------------------------------------------- | ------------------------------------------------ |
| `<Tabs activeKey onChange>`            | `<Tabs :active-key @change>`                       | 保留显式受控模式                                 |
| `activeKey` + state                    | `v-model`                                          | 推荐的 Vue 双向契约；也可监听 `update:activeKey` |
| `<TabPane tab icon>`                   | `<TabPane><template #tab/#icon>`                   | 同名 prop 仍支持，slot 优先                      |
| React children                         | 默认 slot                                          | TabPane 必须是直接子节点                         |
| `tabBarExtraContent={node}`            | `#tabBarExtraContent`                              | 同名 prop 仍支持                                 |
| `renderTabBar(props, TabBar)`          | `#tabBar="props"`                                  | Vue scoped slot，不传 React ComponentType        |
| `renderArrow(items, pos, click, node)` | `#arrow="{ items, position, click, defaultNode }"` | 等价 scoped slot                                 |
| `more={{ render }}`                    | `#more="{ hiddenTabs }"`                           | `more.render` 仍保留为低层兼容能力               |
| `onTabClick(key, SyntheticEvent)`      | `@tab-click="(key, event) => ..."`                 | event 是原生 MouseEvent/KeyboardEvent            |
| `onTabClose(key)`                      | `@tab-close="remove(key)"`                         | 组件不自动删除数据                               |
| `onVisibleTabsChange(Map)`             | `@visible-tabs-change`                             | Map 键仍是 itemKey                               |

## 受控示例

```jsx
const [activeKey, setActiveKey] = useState('docs');
<Tabs activeKey={activeKey} onChange={setActiveKey}>
  <TabPane itemKey="docs" tab="Docs">
    Docs
  </TabPane>
</Tabs>;
```

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
const activeKey = shallowRef('docs');
</script>

<template>
  <Tabs v-model="activeKey">
    <TabPane item-key="docs" tab="Docs">Docs</TabPane>
  </Tabs>
</template>
```

## 注意

- Vue Boolean prop 的缺省、裸属性和显式 false 不等价；本实现按原始 VNode prop 键判断控制语义。
- `keepDOM=false` 只挂载当前面板；依赖首次尺寸的子组件也可使用 `lazyRender=true`。
- 自定义 bar 或 arrow 必须继续提供与默认实现等价的键盘、ARIA 和选中状态；scoped slot 本身不会自动补齐这些语义。
- `.semi-tabs-*` 与 `--semi-*` 是首版兼容契约，不应重命名。
