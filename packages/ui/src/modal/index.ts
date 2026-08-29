import ModalBase from './Modal.vue';
import { destroyAll, imperativeMethods } from './imperative';
import { useModal } from './use-modal';
import type { ModalStaticMethods } from './types';

export type ModalComponent = typeof ModalBase & ModalStaticMethods;

export const Modal = Object.assign(ModalBase, imperativeMethods, {
  destroyAll,
  useModal,
}) as ModalComponent;

export default Modal;
export { useModal };
export {
  MODAL_CONFIRM_TYPES,
  MODAL_SIZES,
  type ModalActionHandler,
  type ModalButtonProps,
  type ModalConfirmProps,
  type ModalConfirmType,
  type ModalEmits,
  type ModalHandle,
  type ModalLocale,
  type ModalMethod,
  type ModalMethods,
  type ModalProps,
  type ModalSize,
  type ModalSlots,
  type ModalStaticMethods,
  type ModalUseModalResult,
} from './types';
