import { createToastStatic } from './imperative';
import type { ToastFactoryStatic } from './types';

export const ToastFactory: ToastFactoryStatic = {
  create: createToastStatic,
};

export const Toast = ToastFactory.create();

export { useToast } from './use-toast';
export {
  TOAST_THEMES,
  TOAST_TYPES,
  type ToastConfig,
  type ToastEntry,
  type ToastFactoryStatic,
  type ToastHookMethod,
  type ToastId,
  type ToastInput,
  type ToastInputId,
  type ToastMethod,
  type ToastMethods,
  type ToastOptions,
  type ToastStaticMethods,
  type ToastTheme,
  type ToastType,
  type ToastUseResult,
} from './types';

export default Toast;
