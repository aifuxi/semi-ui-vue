import { createApp, defineComponent, h, shallowReactive } from 'vue';

import ConfirmModal from './ConfirmModal.vue';
import type { ModalConfirmProps, ModalConfirmType, ModalHandle, ModalProps } from './types';

/** 跟踪当前命令式弹窗的关闭入口，供 destroyAll 统一释放。 */
const destroyers = new Set<() => void>();
/** 每个静态方法调用创建独立 app；为 useId 分配互不相同的 app 前缀。 */
let imperativeAppId = 0;

/** 挂载独立确认框，并在退出动效结束后释放 app 与宿主。 */
function createImperative(type: ModalConfirmType, config: ModalProps): ModalHandle {
  if (typeof document === 'undefined') {
    throw new Error('Modal imperative methods are only available in a browser.');
  }

  /** 仅浏览器调用创建宿主，模块导入不访问 DOM。 */
  const host = document.createElement('div');
  document.body.appendChild(host);
  /** 配置更新保留确认类型，visible 由公开 handle 与确认框事件共同驱动。 */
  const state = shallowReactive({
    config: { ...config, type } as ModalConfirmProps,
    visible: true,
  });
  let cleaned = false;

  /** 动效完成后的清理入口必须幂等，避免重复卸载。 */
  const cleanup = (): void => {
    if (cleaned) return;
    cleaned = true;
    destroyers.delete(close);
    app.unmount();
    host.remove();
  };
  /** 独立 app 的根组件，将响应式配置透传给确认框。 */
  const Root = defineComponent({
    name: 'ImperativeModalRoot',
    // setup 返回渲染函数，配置或可见性变化时重新生成确认框 VNode。
    setup: () => () =>
      h(ConfirmModal, {
        config: state.config,
        visible: state.visible,
        // 确认框只请求改变本实例可见性，不影响其他弹窗。
        'onUpdate:visible': (visible: boolean) => {
          state.visible = visible;
        },
        onClosed: cleanup,
      }),
  });
  /** useId 默认只保证 app 内唯一；命令式 app 必须使用自己的命名空间。 */
  const app = createApp(Root);
  app.config.idPrefix = `semi-modal-imperative-${imperativeAppId++}`;
  app.mount(host);

  /** 请求关闭，实际卸载仍由原动效终态触发。 */
  function close(): void {
    state.visible = false;
  }

  destroyers.add(close);
  return {
    destroy: close,
    /** 合并调用方更新，但不允许改变创建时的确认类型。 */
    update(nextConfig) {
      state.config = { ...state.config, ...nextConfig, type };
    },
  };
}

export const imperativeMethods = {
  confirm: (config: ModalProps) => createImperative('confirm', config),
  error: (config: ModalProps) => createImperative('error', config),
  info: (config: ModalProps) => createImperative('info', config),
  success: (config: ModalProps) => createImperative('success', config),
  warning: (config: ModalProps) => createImperative('warning', config),
};

export function destroyAll(): void {
  for (const destroy of [...destroyers]) destroy();
}
