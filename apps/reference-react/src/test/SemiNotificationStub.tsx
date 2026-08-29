import type { NotificationStatic } from '@semi-v2.102.0/notification';

let seed = 0;
const create = (): string => `notification-stub-${++seed}`;

const Notification: NotificationStatic = {
  close: (id) => id,
  config: () => undefined,
  destroyAll: () => undefined,
  error: create,
  info: create,
  open: create,
  success: create,
  useNotification: () => [
    {
      close: (id) => id,
      error: create,
      info: create,
      open: create,
      success: create,
      warning: create,
    },
    null,
  ],
  warning: create,
};

export default Notification;
