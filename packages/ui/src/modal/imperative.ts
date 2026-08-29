import { createApp, defineComponent, h, shallowReactive } from 'vue';

import ConfirmModal from './ConfirmModal.vue';
import type { ModalConfirmProps, ModalConfirmType, ModalHandle, ModalProps } from './types';

const destroyers = new Set<() => void>();

function createImperative(type: ModalConfirmType, config: ModalProps): ModalHandle {
  if (typeof document === 'undefined') {
    throw new Error('Modal imperative methods are only available in a browser.');
  }

  const host = document.createElement('div');
  document.body.appendChild(host);
  const state = shallowReactive({
    config: { ...config, type } as ModalConfirmProps,
    visible: true,
  });
  let cleaned = false;

  const cleanup = (): void => {
    if (cleaned) return;
    cleaned = true;
    destroyers.delete(close);
    app.unmount();
    host.remove();
  };
  const Root = defineComponent({
    name: 'ImperativeModalRoot',
    setup: () => () =>
      h(ConfirmModal, {
        config: state.config,
        visible: state.visible,
        'onUpdate:visible': (visible: boolean) => {
          state.visible = visible;
        },
        onClosed: cleanup,
      }),
  });
  const app = createApp(Root);
  app.mount(host);

  function close(): void {
    state.visible = false;
  }

  destroyers.add(close);
  return {
    destroy: close,
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
