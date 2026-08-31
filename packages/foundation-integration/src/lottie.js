// Keep the pinned lottie-web lifecycle behind this private boundary.
// @ts-expect-error -- the pinned vendor source is intentionally compiled only through this private boundary.
export { default as LottieFoundation } from '../../../vendor/semi-design/packages/semi-foundation/lottie/foundation';
// @ts-expect-error -- the public package exposes a local typed facade, not this vendor path.
export { cssClasses as lottieCssClasses } from '../../../vendor/semi-design/packages/semi-foundation/lottie/constants';
