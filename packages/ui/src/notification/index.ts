import { config, destroyAll, imperativeMethods } from './imperative';
import { useNotification } from './use-notification';
import type { NotificationStaticMethods } from './types';

export const Notification = Object.assign({}, imperativeMethods, {
  config,
  destroyAll,
  useNotification,
}) as NotificationStaticMethods;

export default Notification;
export { useNotification };
export {
  NOTIFICATION_POSITIONS,
  NOTIFICATION_THEMES,
  NOTIFICATION_TYPES,
  type NotificationConfig,
  type NotificationId,
  type NotificationMethod,
  type NotificationMethods,
  type NotificationOptions,
  type NotificationPosition,
  type NotificationStaticMethods,
  type NotificationTheme,
  type NotificationType,
  type NotificationUseResult,
} from './types';
