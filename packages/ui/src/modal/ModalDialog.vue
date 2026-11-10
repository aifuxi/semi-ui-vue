<script setup lang="ts">
import {
  computed,
  h,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  shallowRef,
  useId,
  watch,
  type StyleValue,
  type HTMLAttributes,
  type VNodeChild,
} from 'vue';
import {
  ModalContentFoundation,
  ModalFocusTrapHandle,
  type ModalContentAdapter,
} from '@workspace/foundation-integration';

import ModalInnerContent, { type ModalInnerContentExposed } from './ModalInnerContent.vue';
import ModalNodeRenderer from './ModalNodeRenderer';
import type { ConfigDirection } from '../config-provider';
import type { ModalSize } from './types';
import type { ButtonSize } from '../button';
import { getTopModalLayer, registerModalLayer } from './modal-layers';

interface Props {
  body: VNodeChild;
  bodyStyle?: StyleValue | undefined;
  centered: boolean;
  class?: HTMLAttributes['class'];
  closable: boolean;
  closeButtonSize: ButtonSize;
  closeIcon: VNodeChild;
  closeOnEsc: boolean;
  contentClass: HTMLAttributes['class'];
  customContainer: boolean;
  dataAttrs: Record<string, unknown>;
  direction: ConfigDirection;
  footer: VNodeChild;
  fullScreen: boolean;
  header: VNodeChild;
  headerProvided: boolean;
  height?: string | number | undefined;
  hidden: boolean;
  icon: VNodeChild;
  mask: boolean;
  maskClass: HTMLAttributes['class'];
  maskClosable: boolean;
  maskFixed: boolean;
  maskStyle?: StyleValue | undefined;
  modalRender?: ((dialog: VNodeChild) => VNodeChild) | undefined;
  outerStyle?: StyleValue | undefined;
  preventScroll: boolean;
  size: ModalSize;
  title: VNodeChild;
  visible: boolean;
  width?: string | number | undefined;
  zIndex: number;
}

export interface ModalDialogExposed {
  activate: () => Promise<void>;
  deactivate: () => void;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  animationEnd: [event: AnimationEvent];
  close: [event: MouseEvent | KeyboardEvent];
}>();
const dialogId = useId();
const inner = shallowRef<ModalInnerContentExposed | null>(null);
const state = shallowReactive({
  dialogMouseDown: false,
  prevFocusElement: null as HTMLElement | null,
});
const cache = new Map<unknown, unknown>();
let focusTrap: InstanceType<typeof ModalFocusTrapHandle> | undefined;
let mouseResetTimer: ReturnType<typeof setTimeout> | undefined;
let active = false;
/** 激活到退出终态期间持有键盘层级，防止一次 Esc 同时取消多个实例。 */
let unregisterLayer: (() => void) | undefined;
/** 底层卸载不得抢走仍然打开的顶层焦点。 */
let restoreFocus = false;

const foundationProps = computed(() => ({ closeOnEsc: props.closeOnEsc }));
const adapter: ModalContentAdapter<typeof foundationProps.value, typeof state> = {
  getContext: () => undefined,
  getContexts: () => ({}),
  getProp: (key) => foundationProps.value[key],
  getProps: () => foundationProps.value,
  getState: (key) => state[key],
  getStates: () => state,
  setState: (nextState, callback) => {
    Object.assign(state, nextState);
    callback?.();
  },
  getCache: (key) => cache.get(key),
  getCaches: () => cache,
  setCache: (key, value) => cache.set(key, value),
  stopPropagation: (event) => event?.stopPropagation?.(),
  persistEvent: () => undefined,
  notifyClose: (event) => emit('close', event),
  notifyDialogMouseDown: () => {
    state.dialogMouseDown = true;
  },
  notifyDialogMouseUp: () => {
    if (!state.dialogMouseDown) return;
    clearTimeout(mouseResetTimer);
    mouseResetTimer = setTimeout(() => {
      state.dialogMouseDown = false;
    }, 0);
  },
  // 由共享监听选择顶层，继续复用固定 Foundation 的关闭与 closeOnEsc 判断。
  addKeyDownEventListener: () => {
    /** 注册实际内容节点，DOM 顺序用于相同 zIndex 的绘制顺序。 */
    const element = inner.value?.element;
    if (!element) return;
    unregisterLayer = registerModalLayer({
      element,
      // zIndex 可动态修改，不缓存打开时的值。
      zIndex: () => props.zIndex,
      // 退场动效期间仍占据顶层，但不重复发出取消或穿透到底层。
      onKeyDown: (event) => {
        if (props.visible) foundation.handleKeyDown(event);
      },
    });
  },
  // Foundation.destroy 继续负责释放注册，保证关闭与卸载路径一致。
  removeKeyDownEventListener: () => {
    unregisterLayer?.();
    unregisterLayer = undefined;
  },
  getMouseState: () => state.dialogMouseDown,
  // 每层保留自己的 Tab 陷阱，但只有视觉顶层可以在打开时移动焦点。
  modalDialogFocus: () => {
    /** 实际 dialog 内容节点，同时也是焦点陷阱容器。 */
    const element = inner.value?.element;
    if (!element) return;
    /** 已位于本层的用户焦点无需重置。 */
    const current = ModalFocusTrapHandle.getActiveElement();
    /** 防止打开时覆盖内容组件自行设置的焦点。 */
    const activeInDialog = current instanceof Node && element.contains(current);
    focusTrap?.destroy();
    focusTrap = markRaw(new ModalFocusTrapHandle(element, { preventScroll: props.preventScroll }));
    if (!activeInDialog && getTopModalLayer(document)?.element === element) {
      element.focus({ preventScroll: props.preventScroll });
    }
  },
  modalDialogBlur: () => {
    inner.value?.element?.blur();
    focusTrap?.destroy();
    focusTrap = undefined;
  },
  // 菜单项等入口可能已被业务卸载，此时把焦点留在仍打开的外层对话框。
  prevFocusElementReFocus: () => {
    if (!restoreFocus) return;
    /** 移除当前层后剩余的顶层，禁止恢复到它背后的控件。 */
    const remaining = getTopModalLayer(document)?.element;
    /** 打开时保存的入口可能已经离开文档，不能无条件调用 focus。 */
    const previous = state.prevFocusElement;
    if (
      previous?.isConnected &&
      previous !== document.body &&
      (!remaining || remaining.contains(previous))
    ) {
      previous.focus({ preventScroll: props.preventScroll });
    } else {
      /** 优先进入外层已有 Tab 循环；无可操作控件时聚焦 tabindex=-1 的 dialog。 */
      const fallback = remaining
        ? (ModalFocusTrapHandle.getFocusableElements(remaining)[0] ?? remaining)
        : undefined;
      fallback?.focus({ preventScroll: props.preventScroll });
    }
  },
};
const foundation = markRaw(new ModalContentFoundation(adapter));

const rootClasses = computed(() => [
  props.class,
  {
    'semi-modal-popup': props.customContainer && !props.maskFixed,
    'semi-modal-fixed': props.maskFixed,
    'semi-modal-rtl': props.direction === 'rtl',
  },
]);
/** 透传内容层配置，关闭按钮与弹窗尺寸独立；事件继续交由原 Foundation 处理。 */
const innerVNode = computed(() =>
  h(ModalInnerContent, {
    ref: inner,
    body: props.body,
    bodyStyle: props.bodyStyle,
    centered: props.centered,
    closable: props.closable,
    closeButtonSize: props.closeButtonSize,
    closeIcon: props.closeIcon,
    contentClass: props.contentClass,
    dialogId,
    footer: props.footer,
    fullScreen: props.fullScreen,
    header: props.header,
    headerProvided: props.headerProvided,
    height: props.height,
    icon: props.icon,
    outerStyle: props.outerStyle,
    modalRender: props.modalRender,
    size: props.size,
    title: props.title,
    width: props.width,
    // 将真实动效终态交回父级控制 Portal 生命周期。
    onAnimationEnd: (event: AnimationEvent) => emit('animationEnd', event),
    // 按钮只产生关闭请求，保留原取消顺序及受控行为。
    onClose: (event: MouseEvent) => foundation.close(event),
    // 保留遮罩拖放保护，防止 dialog 内按下后误触遮罩。
    onMousedown: () => foundation.handleDialogMouseDown(),
  }),
);

/** 每次打开记录入口并在 Portal 就绪后获取键盘所有权及焦点陷阱。 */
async function activate(): Promise<void> {
  if (active || typeof document === 'undefined') return;
  active = true;
  state.prevFocusElement = ModalFocusTrapHandle.getActiveElement();
  await nextTick();
  if (!active) return;
  foundation.handleKeyDownEventListenerMount();
  foundation.modalDialogFocus();
  // 初始多实例同时挂载时，只有视觉顶层可以移动焦点。
  if (getTopModalLayer(document)?.element !== inner.value?.element) return;
  /** 优先使用显式 autofocus，其次选择首个可聚焦控件。 */
  const element = inner.value?.element;
  if (
    element &&
    (document.activeElement === element || !element.contains(document.activeElement))
  ) {
    /** 用户 autofocus 或默认取消按钮优先于关闭按钮。 */
    const autofocus = element.querySelector<HTMLElement>('[autofocus]');
    /** 未声明 autofocus 时使用固定 Foundation 的可聚焦控件顺序。 */
    const focusable = ModalFocusTrapHandle.getFocusableElements(element);
    (autofocus ?? focusable[0])?.focus({ preventScroll: props.preventScroll });
  }
}

/** 退出终态或卸载时释放本层，只有关闭顶层才恢复焦点。 */
function deactivate(): void {
  if (!active || typeof document === 'undefined') return;
  active = false;
  restoreFocus = getTopModalLayer(document)?.element === inner.value?.element;
  foundation.destroy();
}

function handleMaskClick(event: MouseEvent): void {
  if (props.maskClosable) foundation.handleMaskClick(event);
}

function handleMaskMouseUp(): void {
  if (props.maskClosable) foundation.handleMaskMouseUp();
}

onMounted(() => {
  if (props.visible && !props.hidden) void activate();
});
watch(
  () => props.visible,
  (visible) => {
    if (visible && !props.hidden) void activate();
  },
);
watch(
  () => props.hidden,
  (hidden) => {
    if (hidden) deactivate();
  },
);
onBeforeUnmount(() => {
  clearTimeout(mouseResetTimer);
  deactivate();
});

defineExpose({ activate, deactivate });
</script>

<template>
  <div v-bind="props.dataAttrs" :class="rootClasses">
    <div
      v-if="props.mask"
      class="semi-modal-mask"
      :class="props.maskClass"
      :style="props.maskStyle"
      @animationend="emit('animationEnd', $event)"
    />
    <div
      role="none"
      class="semi-modal-wrap"
      :class="{ 'semi-modal-wrap-center': props.centered }"
      @click="handleMaskClick"
      @mouseup="handleMaskMouseUp"
    >
      <ModalNodeRenderer :content="innerVNode" />
    </div>
  </div>
</template>
