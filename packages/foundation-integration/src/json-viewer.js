// Keep the pinned JsonViewer Foundation and core behind this private boundary.
// @ts-expect-error -- vendor TypeScript is compiled only through the private integration package.
export { default as JsonViewerFoundation } from '../../../vendor/semi-design/packages/semi-foundation/jsonViewer/foundation';
// @ts-expect-error -- public declarations expose a local facade instead of this vendor path.
export { cssClasses as jsonViewerCssClasses } from '../../../vendor/semi-design/packages/semi-foundation/jsonViewer/constants';
