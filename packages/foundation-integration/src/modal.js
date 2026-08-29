// Keep the pinned Modal close/loading state machines and focus trap behind the
// private Foundation boundary. The public Vue package bundles these exports.
export { default as ModalFoundation } from '../../../vendor/semi-design/packages/semi-foundation/modal/modalFoundation';
export { default as ModalContentFoundation } from '../../../vendor/semi-design/packages/semi-foundation/modal/modalContentFoundation';
export { default as ModalFocusTrapHandle } from '../../../vendor/semi-design/packages/semi-foundation/utils/FocusHandle';
