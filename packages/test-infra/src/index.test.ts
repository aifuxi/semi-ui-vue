import { describe, expect, it } from 'vitest';
import { PARITY_VIEWPORTS, REFERENCE_BASELINE, VISUAL_THRESHOLDS } from './index';

describe('parity infrastructure contract', () => {
  it('pins the only accepted upstream baseline', () => {
    expect(REFERENCE_BASELINE).toEqual({
      name: 'Semi Design',
      tag: 'v2.102.0',
      version: '2.102.0',
      commit: 'cdfba6e520fc83ad871b30f51f36d8af3aaa5a21',
    });
  });

  it('keeps the minimum desktop/mobile matrix and strict visual gates', () => {
    expect(PARITY_VIEWPORTS).toEqual({
      desktop: { width: 1440, height: 900, deviceScaleFactor: 1 },
      mobile: { width: 390, height: 844, deviceScaleFactor: 1 },
    });
    expect(VISUAL_THRESHOLDS).toEqual({
      screenshotThreshold: 0.1,
      maxDiffPixelRatio: 0.001,
      boundingRectToleranceCssPx: 0.5,
    });
  });
});
