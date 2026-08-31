// Keep the pinned shortcut validation and keydown state machine behind this private boundary.
// @ts-expect-error -- the pinned vendor source is intentionally compiled only through this private boundary.
export { default as HotKeysFoundation } from '../../../vendor/semi-design/packages/semi-foundation/hotKeys/foundation';
// @ts-expect-error -- the public package exposes a local typed facade, not this vendor path.
export { Keys as HotKeysFoundationKeys } from '../../../vendor/semi-design/packages/semi-foundation/hotKeys/constants';
