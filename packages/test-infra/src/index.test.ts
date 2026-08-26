import { describe, expect, it } from 'vitest';
import {
  assertScenarioComparable,
  createParityScenarioUrl,
  getParityScenario,
  PARITY_VIEWPORTS,
  parseParityScenarioOptions,
  REFERENCE_BASELINE,
  REFERENCE_SOURCE_PATHS,
  VISUAL_THRESHOLDS,
} from './index';

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

  it('records the exact local source evidence for the first real React scene', () => {
    expect(getParityScenario('button-types')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.buttonPublicEntry,
    });
    expect(assertScenarioComparable('button-types').targets).toHaveLength(5);
  });

  it('records Divider as a complete local-source parity scene', () => {
    expect(getParityScenario('divider')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.dividerPublicEntry,
    });
    expect(assertScenarioComparable('divider').targets).toHaveLength(8);
  });

  it('records Icon and both generated asset packages as a complete parity scene', () => {
    expect(getParityScenario('icon')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.iconPublicEntry,
    });
    expect(assertScenarioComparable('icon').targets).toHaveLength(11);
    expect(getParityScenario('icon').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.iconStableEntry,
        REFERENCE_SOURCE_PATHS.iconLabEntry,
        REFERENCE_SOURCE_PATHS.iconStyle,
      ]),
    );
  });

  it('normalizes scenario query parameters and builds deterministic URLs', () => {
    const options = parseParityScenarioOptions(
      '?scenario=button-types&theme=dark&direction=rtl&locale=en-US',
    );

    expect(options).toEqual({
      scenarioId: 'button-types',
      theme: 'dark',
      direction: 'rtl',
      locale: 'en-US',
    });
    expect(createParityScenarioUrl('http://127.0.0.1:4173', options)).toBe(
      'http://127.0.0.1:4173/?scenario=button-types&theme=dark&direction=rtl&locale=en-US',
    );
  });
});
