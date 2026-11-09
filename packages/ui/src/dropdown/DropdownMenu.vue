<script setup lang="ts">
import { DropdownMenuFoundation } from '@workspace/foundation-integration';
import { inject, markRaw, useAttrs } from 'vue';

import { dropdownContextKey } from './dropdown-context';
import type { DropdownMenuProps, DropdownMenuSlots } from './types';

defineOptions({ name: 'DropdownMenu', inheritAttrs: false });
defineProps<DropdownMenuProps>();
defineSlots<DropdownMenuSlots>();
/** Menu 支持调用方原生属性与键盘监听，监听由内部处理后再转发。 */
const attrs = useAttrs();
/** 仅向固定 Foundation 提供当前 Dropdown 的触发方式。 */
const context = inject(dropdownContextKey, undefined);
/** 继续复用固定 Foundation 的导航、字符查找及菜单项激活。 */
const foundation = markRaw(
  new DropdownMenuFoundation({
    // standalone Menu 没有 Dropdown context，保留 undefined。
    getContext: (key: string) => (key === 'trigger' ? context?.trigger.value : undefined),
  }),
);

/** 排除由 handleKeydown 主动转发的监听，避免一次按键通知两次。 */
function forwardedAttrs(): Record<string, unknown> {
  return Object.fromEntries(
    // 其他 DOM 属性保持原样透传。
    Object.entries(attrs).filter(([key]) => key !== 'onKeydown'),
  );
}

/** 手动激活只执行一次；保留调用方监听及原生冒泡。 */
function handleKeydown(event: KeyboardEvent): void {
  /** 只接管可聚焦菜单项；菜单内输入框仍保留空格输入等原生默认动作。 */
  const target = event.target;
  // Foundation 在 keydown 中 click 菜单项；先取消默认动作，防止焦点移入
  // Modal 后浏览器又原生点击取消按钮。不能 stopPropagation，以保留宿主快捷键。
  if (
    (event.key === 'Enter' || event.key === ' ') &&
    target instanceof HTMLElement &&
    target.getAttribute('role') === 'menuitem'
  ) {
    event.preventDefault();
  }
  foundation.onMenuKeydown(event);
  /** Vue 同一事件可能合并多个监听，保持原有转发顺序。 */
  const handler = attrs.onKeydown as
    ((event: KeyboardEvent) => void) | Array<(event: KeyboardEvent) => void> | undefined;
  // 每个调用方监听接收同一个已处理的事件，不生成替代事件。
  if (Array.isArray(handler)) handler.forEach((entry) => entry(event));
  else handler?.(event);
}
</script>

<template>
  <ul
    v-bind="forwardedAttrs()"
    role="menu"
    aria-orientation="vertical"
    :class="['semi-dropdown-menu', $props.class]"
    :style="$props.style"
    @keydown="handleKeydown"
  >
    <slot />
  </ul>
</template>
