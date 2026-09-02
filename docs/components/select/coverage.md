# Select 文档覆盖清单

- 状态：`ready`
- 正式页面：`apps/docs/src/content/docs/{zh-CN,en-US}/components/select.mdx`
- Vue Demo：`apps/docs/src/demos/select/Showcase.vue`
- API 元数据：`apps/docs/src/data/api/select.ts`
- 固定上游：`vendor/semi-design/content/input/select/index{,-en-US}.md`

## 上游内容映射

| 上游章节                                   | 迁移结果                                              |
| ------------------------------------------ | ----------------------------------------------------- |
| 基本、数组 Option、多选、分组、尺寸、校验  | 合并进入 Showcase 与 Props 表                         |
| 前后缀、附加项、自定义候选项/已选项/触发器 | 映射为完整 Slots 表与 React→Vue 表                    |
| 受控、动态 Option、联动                    | 迁入 v-model 与受控状态说明                           |
| 搜索位置、远程/自定义搜索、创建条目        | 合并进入搜索契约、事件与 Props 表；不复制模拟网络请求 |
| 虚拟化、弹层样式、Portal                   | 迁入 Props、Portal 与实例方法说明                     |
| ARIA、键盘、焦点、文案、泛型、FAQ          | 迁入正式页面与类型化 API                              |
| Related Material                           | 排除；不迁移上游生态市场和营销内容                    |

Select Demo 属于交互与 Portal 场景，使用 `client:only="vue"`，避免 Astro 多岛 SSR 的 `useId()` 前缀差异；Select 组件自身的 SSR render/hydration 证明仍由组件切片测试承担。

正式页面已吸收原 `index*` 的用户内容；完整行为与视觉证据继续保留在 `alignment.md`。
