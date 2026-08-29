// Keep the pinned SideSheet visibility and keyboard state machine behind the
// private Foundation boundary. The public Vue package bundles this export.
export { default as SideSheetFoundation } from '../../../vendor/semi-design/packages/semi-foundation/sideSheet/sideSheetFoundation';
export {
  cssClasses as sideSheetCssClasses,
  strings as sideSheetStrings,
} from '../../../vendor/semi-design/packages/semi-foundation/sideSheet/constants';
