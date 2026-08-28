# Empty

Empty communicates that a region has no content by combining an image, title, description, and action area. This implementation is aligned exclusively with the pinned Semi Design v2.102.0 Adapter, Foundation SCSS, and documentation.

## Import

```ts
import { Empty } from '@workspace/ui';
import '@workspace/theme-default/empty.css';
```

The subpath is also public:

```ts
import Empty, { type EmptyProps } from '@workspace/ui/empty';
```

## Basic usage

```vue
<script setup lang="ts">
import { Empty } from '@workspace/ui';
import { IllustrationConstruction, IllustrationConstructionDark } from '@workspace/illustrations';
import '@workspace/theme-default/empty.css';
</script>

<template>
  <Empty title="Under construction" description="This feature is not available yet.">
    <template #image>
      <IllustrationConstruction :style="{ width: '150px', height: '150px' }" />
    </template>
    <template #darkModeImage>
      <IllustrationConstructionDark :style="{ width: '150px', height: '150px' }" />
    </template>
  </Empty>
</template>
```

When `darkModeImage` exists, Empty observes the `theme-mode` attribute on `document.body` on the client. It displays the dark image while the value is `dark`, updates on runtime changes, and disconnects the observer on unmount. SSR always emits the light `image` first and synchronizes the theme after hydration.

## Custom image, content, and actions

`image`, `title`, and `description` support both props and same-named slots; a slot wins. The default slot maps to the fixed Adapter's children/footer position.

```vue
<script setup lang="ts">
import { Button, Empty } from '@workspace/ui';
import { IllustrationNoContent, IllustrationNoContentDark } from '@workspace/illustrations';
</script>

<template>
  <Empty title="No dashboards" description="Create your first dashboard to analyze data.">
    <template #image>
      <IllustrationNoContent :style="{ width: '150px', height: '150px' }" />
    </template>
    <template #darkModeImage>
      <IllustrationNoContentDark :style="{ width: '150px', height: '150px' }" />
    </template>
    <Button type="primary" theme="solid">Create dashboard</Button>
  </Empty>
</template>
```

A string image produces a native `<img>`. Its `alt` is the final description when that description is a string; otherwise it is `empty`. Passing `{ id: 'symbol-id' }` produces the fixed upstream structure:

```vue
<Empty :image="{ id: 'empty-symbol' }" description="No content" />
```

```html
<svg aria-hidden="true"><use xlink:href="#empty-symbol" /></svg>
```

The public type retains `viewBox` and `url`, but the pinned v2.102.0 Adapter reads only `id`.

## No-image and horizontal layouts

```vue
<template>
  <Empty title="No matching results" description="Try resetting the filters." />

  <Empty
    layout="horizontal"
    image="/images/success.svg"
    title="Created"
    description="You can now configure permissions and notifications."
    :style="{ width: '800px', margin: '32px auto 0' }"
  >
    <button type="button">Configure</button>
  </Empty>
</template>
```

Without an image, the title uses Typography heading 6 with a 400 font weight. With an image, it uses heading 4. The vertical layout centers the content. The horizontal layout places content after the image and reverses the spacing under RTL.

## API

### Props

| Prop            | Type                         | Default      | Description                                  |
| --------------- | ---------------------------- | ------------ | -------------------------------------------- |
| `layout`        | `'vertical' \| 'horizontal'` | `'vertical'` | Layout direction                             |
| `image`         | `EmptyImage`                 | -            | Light image, SVG descriptor, or custom VNode |
| `darkModeImage` | `EmptyImage`                 | -            | Image used for `body[theme-mode="dark"]`     |
| `imageStyle`    | `StyleValue`                 | -            | Styles for `.semi-empty-image`               |
| `title`         | `VNodeChild`                 | -            | Title; the named slot wins                   |
| `description`   | `VNodeChild`                 | -            | Description; the named slot wins             |
| `class`         | `HTMLAttributes['class']`    | -            | Native Vue class                             |
| `className`     | `HTMLAttributes['class']`    | -            | React migration compatibility class          |
| `style`         | `StyleValue`                 | -            | Root styles                                  |

`EmptyImage = VNodeChild | EmptySvgNode`. `EmptySvgNode` has optional `id`, `viewBox`, and `url` fields.

### Slots

| Slot            | Description                                    |
| --------------- | ---------------------------------------------- |
| `image`         | Light image; wins over the `image` prop        |
| `darkModeImage` | Dark image; wins over the `darkModeImage` prop |
| `title`         | Title; wins over the `title` prop              |
| `description`   | Description; wins over the `description` prop  |
| `default`       | Footer/action area                             |

The root preserves native Vue `class`, `style`, `data-*`, `aria-*`, `role`, and DOM-listener attrs. Empty defines no additional emits, keyboard state, or focus state.

## Accessibility, RTL, and SSR

- An SVG descriptor receives `aria-hidden="true"`. Callers own ARIA inside custom VNodes.
- Empty creates no focusable node besides controls supplied in the footer.
- `.semi-rtl` and `.semi-portal-rtl` ancestors activate the pinned RTL SCSS.
- Root and `@workspace/ui/empty` subpath imports are DOM-free. The observer is created only after mount and is fully cleaned up.

See the [alignment matrix](./alignment.md) for source evidence, DOM, computed-style and visual scenarios, and deviations. See [React → Vue](./react-to-vue.md) for migration details.
