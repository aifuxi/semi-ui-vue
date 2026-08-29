import type { ToastStatic } from '@semi-v2.102.0/toast';

let seed = 0;
const create = (): string => `toast-stub-${++seed}`;

const Toast: ToastStatic = {
  close: (id) => String(id),
  config: () => undefined,
  destroyAll: () => undefined,
  error: create,
  getWrapperId: () => null,
  info: create,
  success: create,
  warning: create,
};

export default Toast;
