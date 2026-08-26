export const REFERENCE_BASELINE = Object.freeze({
  name: 'Semi Design',
  tag: 'v2.102.0',
  version: '2.102.0',
  commit: 'cdfba6e520fc83ad871b30f51f36d8af3aaa5a21',
});

export const PARITY_VIEWPORTS = Object.freeze({
  desktop: Object.freeze({ width: 1440, height: 900, deviceScaleFactor: 1 }),
  mobile: Object.freeze({ width: 390, height: 844, deviceScaleFactor: 1 }),
});

export const VISUAL_THRESHOLDS = Object.freeze({
  screenshotThreshold: 0.1,
  maxDiffPixelRatio: 0.001,
  boundingRectToleranceCssPx: 0.5,
});
