// Keep the pinned pointer/touch movement state machine behind this private boundary.
// @ts-expect-error -- the pinned vendor source is intentionally compiled only through this private boundary.
export {
  clampValueInRange,
  default as DragMoveFoundation,
} from '../../../vendor/semi-design/packages/semi-foundation/dragMove/foundation';
