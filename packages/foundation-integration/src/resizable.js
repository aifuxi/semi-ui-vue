// Vite transpiles the pinned upstream TypeScript through this private runtime boundary.
// The sibling declaration keeps strict Vue typechecking independent from upstream's
// older TypeScript compiler settings.
export {
  ResizableFoundation,
  ResizeGroupFoundation,
} from '../../../vendor/semi-design/packages/semi-foundation/resizable/foundation';
