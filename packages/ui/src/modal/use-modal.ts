import { defineComponent, h, markRaw, shallowReactive, type Component } from 'vue';

import ConfirmModal from './ConfirmModal.vue';
import type {
  ModalConfirmProps,
  ModalConfirmType,
  ModalHandle,
  ModalMethods,
  ModalProps,
  ModalUseModalResult,
} from './types';

interface ModalEntry {
  config: ModalConfirmProps;
  id: number;
  visible: boolean;
}

let holderId = 0;

export function useModal(): ModalUseModalResult {
  const entries = shallowReactive<ModalEntry[]>([]);

  function open(type: ModalConfirmType, config: ModalProps): ModalHandle {
    const entry = shallowReactive<ModalEntry>({
      config: { ...config, type },
      id: holderId++,
      visible: true,
    });
    entries.push(entry);
    return {
      destroy: () => {
        entry.visible = false;
      },
      update: (nextConfig) => {
        entry.config = { ...entry.config, ...nextConfig, type };
      },
    };
  }

  const methods: ModalMethods = {
    confirm: (config) => open('confirm', config),
    error: (config) => open('error', config),
    info: (config) => open('info', config),
    success: (config) => open('success', config),
    warning: (config) => open('warning', config),
  };
  const ContextHolder = markRaw(
    defineComponent({
      name: 'ModalContextHolder',
      setup: () => () =>
        entries.map((entry) =>
          h(ConfirmModal, {
            key: entry.id,
            config: entry.config,
            visible: entry.visible,
            'onUpdate:visible': (visible: boolean) => {
              entry.visible = visible;
            },
            onClosed: () => {
              const index = entries.indexOf(entry);
              if (index >= 0) entries.splice(index, 1);
            },
          }),
        ),
    }) as Component,
  );

  return [methods, ContextHolder] as const;
}
