// Keep the pinned Collapse active-key state machine and short-id helper behind this private boundary.
// @ts-expect-error -- the pinned vendor source is intentionally compiled only through this private boundary.
export { default as CollapseFoundation } from '../../../vendor/semi-design/packages/semi-foundation/collapse/foundation';
// @ts-expect-error -- the pinned vendor source is intentionally compiled only through this private boundary.
export { getUuidShort as createCollapsePanelId } from '../../../vendor/semi-design/packages/semi-foundation/utils/uuid';
