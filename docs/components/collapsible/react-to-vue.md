# Collapsible React -> Vue 迁移

| React                                          | Vue                                              |
| ---------------------------------------------- | ------------------------------------------------ |
| `<Collapsible isOpen={open}>...</Collapsible>` | `<Collapsible :is-open="open">...</Collapsible>` |
| `onMotionEnd={() => ...}`                      | `@motion-end="..."`                              |
| `className="panel"`                            | `class="panel"` 或 `class-name="panel"`          |
| `children`                                     | 默认 slot                                        |

其余 prop 名和值保持一致。Vue 侧使用原生 kebab-case 模板写法，例如 `keepDOM` 写作 `keep-d-o-m`、`collapseHeightAdaptive` 写作 `collapse-height-adaptive`、`reCalcKey` 写作 `re-calc-key`。

`Collapsible` 不负责生成控制按钮。请让调用方按钮维护 `isOpen`，并用 `aria-controls` 指向传给 Collapsible 的 `id`。固定 v2.102.0 Adapter 会把该 `id` 放到内层内容节点。
