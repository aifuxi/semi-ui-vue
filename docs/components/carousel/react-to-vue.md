# Carousel React → Vue 迁移

| React v2.102.0                    | Vue                                               | 说明                                             |
| --------------------------------- | ------------------------------------------------- | ------------------------------------------------ |
| `<Carousel>{children}</Carousel>` | `<Carousel><div />...</Carousel>`                 | `children` 映射为默认 slot                       |
| `activeIndex`                     | `:active-index`                                   | 保持受控语义                                     |
| `onChange={(next, prev) => {}}`   | `@change="(next, prev) => {}"`                    | Vue emit                                         |
| `className`                       | `class` 或 `class-name`                           | 两者均合并到根节点                               |
| `style={{ height: 240 }}`         | `:style="{ height: '240px' }"`                    | Vue 数字 style 的单位规则不同，尺寸建议显式写 px |
| `arrowProps.leftArrow.children`   | `#leftArrow`                                      | slot 优先；仍可用 VNodeChild prop                |
| `arrowProps.rightArrow.children`  | `#rightArrow`                                     | slot 优先；仍可用 VNodeChild prop                |
| `ref.current.next()`              | `useTemplateRef<CarouselMethods>().value?.next()` | 同名公开方法                                     |

`autoPlay`、`showArrow` 和 `showIndicator` 都保留缺省为 `true`、显式 `false` 与显式 `true` 的区别。默认 slot 的元素 VNode 会被克隆以追加固定 class/style；调用方原有 class/style/attrs/listener 不会丢失。
