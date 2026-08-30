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
  it('records Dropdown Adapter, child entries, Foundations, styles and docs', () => {
    expect(getParityScenario('dropdown')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.dropdownPublicEntry,
    });
    expect(assertScenarioComparable('dropdown').targets).toHaveLength(6);
    expect(getParityScenario('dropdown').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.dropdownItemEntry,
        REFERENCE_SOURCE_PATHS.dropdownMenuEntry,
        REFERENCE_SOURCE_PATHS.dropdownFoundation,
        REFERENCE_SOURCE_PATHS.dropdownMenuFoundation,
        REFERENCE_SOURCE_PATHS.dropdownFoundationStyle,
        REFERENCE_SOURCE_PATHS.dropdownDocumentation,
      ]),
    );
  });
  it('records Empty Adapter, constants, styles and docs', () => {
    expect(getParityScenario('empty')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.emptyPublicEntry,
    });
    expect(assertScenarioComparable('empty').targets).toHaveLength(8);
    expect(getParityScenario('empty').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.emptyFoundationConstants,
        REFERENCE_SOURCE_PATHS.emptyFoundationStyle,
        REFERENCE_SOURCE_PATHS.emptyDocumentation,
        REFERENCE_SOURCE_PATHS.illustrationsPublicEntry,
      ]),
    );
    expect(getParityScenario('highlight')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.highlightPublicEntry,
    });
    expect(assertScenarioComparable('highlight').targets).toHaveLength(6);
    expect(getParityScenario('highlight').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.highlightFoundation,
        REFERENCE_SOURCE_PATHS.highlightFoundationStyle,
        REFERENCE_SOURCE_PATHS.highlightDocumentation,
      ]),
    );
    expect(getParityScenario('image')).toMatchObject({
      id: 'image',
      referenceStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.imagePublicEntry,
      vueStatus: 'ready',
    });
    expect(assertScenarioComparable('image').targets).toHaveLength(3);
    expect(getParityScenario('cropper')).toMatchObject({
      id: 'cropper',
      referenceStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.cropperPublicEntry,
      vueStatus: 'ready',
    });
    expect(assertScenarioComparable('cropper').targets).toHaveLength(5);
    expect(getParityScenario('cropper').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.cropperFoundation,
        REFERENCE_SOURCE_PATHS.cropperFoundationStyle,
        REFERENCE_SOURCE_PATHS.cropperDocumentation,
      ]),
    );
    expect(getParityScenario('list')).toMatchObject({
      id: 'list',
      referenceStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.listPublicEntry,
      vueStatus: 'ready',
    });
    expect(assertScenarioComparable('list').targets).toHaveLength(5);
    expect(getParityScenario('list').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.listItemEntry,
        REFERENCE_SOURCE_PATHS.listFoundationConstants,
        REFERENCE_SOURCE_PATHS.listFoundationStyle,
        REFERENCE_SOURCE_PATHS.listDocumentation,
      ]),
    );
    expect(getParityScenario('modal')).toMatchObject({
      id: 'modal',
      referenceStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.modalPublicEntry,
      vueStatus: 'ready',
    });
    expect(assertScenarioComparable('modal').targets).toHaveLength(6);
    expect(getParityScenario('modal').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.modalContentEntry,
        REFERENCE_SOURCE_PATHS.modalConfirmEntry,
        REFERENCE_SOURCE_PATHS.modalFoundation,
        REFERENCE_SOURCE_PATHS.modalContentFoundation,
        REFERENCE_SOURCE_PATHS.modalFoundationStyle,
        REFERENCE_SOURCE_PATHS.modalDocumentation,
      ]),
    );
    expect(getParityScenario('overflow-list')).toMatchObject({
      id: 'overflow-list',
      referenceStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.overflowListPublicEntry,
      vueStatus: 'ready',
    });
    expect(assertScenarioComparable('overflow-list').targets).toHaveLength(5);
    expect(getParityScenario('overflow-list').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.overflowListIntersectionObserver,
        REFERENCE_SOURCE_PATHS.overflowListFoundation,
        REFERENCE_SOURCE_PATHS.overflowListFoundationStyle,
        REFERENCE_SOURCE_PATHS.overflowListDocumentation,
      ]),
    );
  });
  it('records all pinned illustration sources as a complete parity scene', () => {
    expect(getParityScenario('illustrations')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.illustrationsPublicEntry,
    });
    expect(assertScenarioComparable('illustrations').targets).toHaveLength(16);
    expect(getParityScenario('illustrations').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.illustrationsSourceDirectory,
        REFERENCE_SOURCE_PATHS.illustrationsSvgDirectory,
      ]),
    );
  });

  it('records Upload Adapter, FileCard, Foundation, styles and docs', () => {
    expect(getParityScenario('upload')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.uploadPublicEntry,
    });
    expect(assertScenarioComparable('upload').targets).toHaveLength(7);
    expect(getParityScenario('upload').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.uploadFileCardEntry,
        REFERENCE_SOURCE_PATHS.uploadFoundation,
        REFERENCE_SOURCE_PATHS.uploadFoundationStyle,
        REFERENCE_SOURCE_PATHS.uploadDocumentation,
      ]),
    );
  });

  it('records Navigation Adapter, children Foundations, styles and docs', () => {
    expect(getParityScenario('navigation')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.navigationPublicEntry,
    });
    expect(assertScenarioComparable('navigation').targets).toHaveLength(5);
    expect(getParityScenario('navigation').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.navigationItemEntry,
        REFERENCE_SOURCE_PATHS.navigationSubNavEntry,
        REFERENCE_SOURCE_PATHS.navigationFoundation,
        REFERENCE_SOURCE_PATHS.navigationItemFoundation,
        REFERENCE_SOURCE_PATHS.navigationSubNavFoundation,
        REFERENCE_SOURCE_PATHS.navigationFoundationStyle,
        REFERENCE_SOURCE_PATHS.navigationDocumentation,
      ]),
    );
  });

  it('records Descriptions Adapter, Item, Foundation, styles and docs', () => {
    expect(getParityScenario('descriptions')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.descriptionsPublicEntry,
    });
    expect(assertScenarioComparable('descriptions').targets).toHaveLength(6);
    expect(getParityScenario('descriptions').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.descriptionsItemEntry,
        REFERENCE_SOURCE_PATHS.descriptionsFoundation,
        REFERENCE_SOURCE_PATHS.descriptionsFoundationStyle,
        REFERENCE_SOURCE_PATHS.descriptionsDocumentation,
      ]),
    );
  });

  it('records Collapsible Adapter, Foundation, styles and docs', () => {
    expect(getParityScenario('collapsible')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.collapsiblePublicEntry,
    });
    expect(assertScenarioComparable('collapsible').targets).toHaveLength(4);
    expect(getParityScenario('collapsible').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.collapsibleFoundation,
        REFERENCE_SOURCE_PATHS.collapsibleFoundationStyle,
        REFERENCE_SOURCE_PATHS.collapsibleDocumentation,
      ]),
    );
  });

  it('records Carousel Adapter, Arrow, Indicator, Foundation, styles and docs', () => {
    expect(getParityScenario('carousel')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.carouselPublicEntry,
    });
    expect(assertScenarioComparable('carousel').targets).toHaveLength(8);
    expect(getParityScenario('carousel').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.carouselArrowEntry,
        REFERENCE_SOURCE_PATHS.carouselIndicatorEntry,
        REFERENCE_SOURCE_PATHS.carouselFoundation,
        REFERENCE_SOURCE_PATHS.carouselFoundationStyle,
        REFERENCE_SOURCE_PATHS.carouselDocumentation,
      ]),
    );
  });

  it('records Card, Group, Meta, styles and docs as a complete parity scene', () => {
    expect(getParityScenario('card')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.cardPublicEntry,
    });
    expect(assertScenarioComparable('card').targets).toHaveLength(6);
    expect(getParityScenario('card').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.cardGroupEntry,
        REFERENCE_SOURCE_PATHS.cardMetaEntry,
        REFERENCE_SOURCE_PATHS.cardFoundationStyle,
        REFERENCE_SOURCE_PATHS.cardDocumentation,
      ]),
    );
  });

  it('records Calendar Adapter, Foundation, event layout, styles and bilingual docs', () => {
    expect(getParityScenario('calendar')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.calendarPublicEntry,
    });
    expect(assertScenarioComparable('calendar').targets).toHaveLength(6);
    expect(getParityScenario('calendar').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.calendarWeekEntry,
        REFERENCE_SOURCE_PATHS.calendarMonthEntry,
        REFERENCE_SOURCE_PATHS.calendarFoundation,
        REFERENCE_SOURCE_PATHS.calendarEventUtil,
        REFERENCE_SOURCE_PATHS.calendarFoundationStyle,
        REFERENCE_SOURCE_PATHS.calendarDocumentation,
        REFERENCE_SOURCE_PATHS.calendarDocumentationEn,
      ]),
    );
  });

  it('records Badge Adapter, constants, styles and docs as a complete parity scene', () => {
    expect(getParityScenario('badge')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.badgePublicEntry,
    });
    expect(assertScenarioComparable('badge').targets).toHaveLength(6);
    expect(getParityScenario('badge').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.badgeFoundationConstants,
        REFERENCE_SOURCE_PATHS.badgeFoundationStyle,
        REFERENCE_SOURCE_PATHS.badgeDocumentation,
      ]),
    );
  });

  it('records Avatar Adapter, Group, Foundation, styles and docs as a complete parity scene', () => {
    expect(getParityScenario('avatar')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.avatarPublicEntry,
    });
    expect(getParityScenario('avatar').targets).toHaveLength(6);
    expect(getParityScenario('avatar').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.avatarGroupEntry,
        REFERENCE_SOURCE_PATHS.avatarFoundation,
        REFERENCE_SOURCE_PATHS.avatarFoundationStyle,
        REFERENCE_SOURCE_PATHS.avatarDocumentation,
      ]),
    );
  });

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

  it('records Checkbox, Group, Foundation, styles and docs as a complete parity scene', () => {
    expect(getParityScenario('checkbox')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.checkboxPublicEntry,
    });
    expect(assertScenarioComparable('checkbox').targets).toHaveLength(8);
    expect(getParityScenario('checkbox').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.checkboxEntry,
        REFERENCE_SOURCE_PATHS.checkboxGroupEntry,
        REFERENCE_SOURCE_PATHS.checkboxFoundation,
        REFERENCE_SOURCE_PATHS.checkboxFoundationStyle,
        REFERENCE_SOURCE_PATHS.checkboxDocumentation,
      ]),
    );
  });

  it('records Input, InputGroup, TextArea, both Foundations, styles and docs as complete', () => {
    expect(getParityScenario('input')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.inputPublicEntry,
    });
    expect(assertScenarioComparable('input').targets).toHaveLength(10);
    expect(getParityScenario('input').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.inputGroupEntry,
        REFERENCE_SOURCE_PATHS.textAreaEntry,
        REFERENCE_SOURCE_PATHS.inputFoundation,
        REFERENCE_SOURCE_PATHS.textAreaFoundation,
        REFERENCE_SOURCE_PATHS.inputFoundationStyle,
        REFERENCE_SOURCE_PATHS.textAreaFoundationStyle,
        REFERENCE_SOURCE_PATHS.inputDocumentation,
      ]),
    );
  });

  it('records PinCode Adapter, Foundation, styles and docs as a complete parity scene', () => {
    expect(getParityScenario('pin-code')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.pinCodePublicEntry,
    });
    expect(assertScenarioComparable('pin-code').targets).toHaveLength(6);
    expect(getParityScenario('pin-code').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.pinCodeFoundation,
        REFERENCE_SOURCE_PATHS.pinCodeFoundationStyle,
        REFERENCE_SOURCE_PATHS.pinCodeDocumentation,
      ]),
    );
  });

  it('records Radio Adapter, Group/Inner Foundation, styles and docs as a complete parity scene', () => {
    expect(getParityScenario('radio')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.radioPublicEntry,
    });
    expect(assertScenarioComparable('radio').targets).toHaveLength(8);
    expect(getParityScenario('radio').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.radioEntry,
        REFERENCE_SOURCE_PATHS.radioGroupEntry,
        REFERENCE_SOURCE_PATHS.radioInnerEntry,
        REFERENCE_SOURCE_PATHS.radioFoundation,
        REFERENCE_SOURCE_PATHS.radioGroupFoundation,
        REFERENCE_SOURCE_PATHS.radioFoundationStyle,
        REFERENCE_SOURCE_PATHS.radioDocumentation,
      ]),
    );
    expect(getParityScenario('rating')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.ratingPublicEntry,
    });
    expect(getParityScenario('rating').targets).toHaveLength(6);
    expect(getParityScenario('rating').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.ratingItemEntry,
        REFERENCE_SOURCE_PATHS.ratingFoundation,
        REFERENCE_SOURCE_PATHS.ratingFoundationStyle,
        REFERENCE_SOURCE_PATHS.ratingDocumentation,
      ]),
    );
    expect(getParityScenario('slider')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.sliderPublicEntry,
    });
    expect(getParityScenario('slider').targets).toHaveLength(5);
    expect(getParityScenario('slider').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.sliderFoundation,
        REFERENCE_SOURCE_PATHS.sliderFoundationStyle,
        REFERENCE_SOURCE_PATHS.sliderDocumentation,
      ]),
    );
    expect(getParityScenario('tag-input')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.tagInputPublicEntry,
    });
    expect(getParityScenario('tag-input').targets).toHaveLength(7);
    expect(getParityScenario('tag-input').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.tagInputFoundation,
        REFERENCE_SOURCE_PATHS.tagInputFoundationStyle,
        REFERENCE_SOURCE_PATHS.tagInputDocumentation,
      ]),
    );
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

  it('records Space as a complete local-source parity scene', () => {
    expect(getParityScenario('space')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.spacePublicEntry,
    });
    expect(assertScenarioComparable('space').targets).toHaveLength(10);
    expect(getParityScenario('space').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.spaceUtilities,
        REFERENCE_SOURCE_PATHS.spaceFoundationStyle,
        REFERENCE_SOURCE_PATHS.spaceDocumentation,
      ]),
    );
  });

  it('records Layout and responsive Sider as a complete local-source parity scene', () => {
    expect(getParityScenario('layout')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.layoutPublicEntry,
    });
    expect(assertScenarioComparable('layout').targets).toHaveLength(8);
    expect(getParityScenario('layout').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.layoutSiderEntry,
        REFERENCE_SOURCE_PATHS.layoutFoundationStyle,
        REFERENCE_SOURCE_PATHS.layoutDocumentation,
      ]),
    );
  });

  it('records Grid Row and Col as a complete local-source parity scene', () => {
    expect(getParityScenario('grid')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.gridPublicEntry,
    });
    expect(assertScenarioComparable('grid').targets).toHaveLength(7);
    expect(getParityScenario('grid').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.gridRowEntry,
        REFERENCE_SOURCE_PATHS.gridColEntry,
        REFERENCE_SOURCE_PATHS.gridFoundationStyle,
        REFERENCE_SOURCE_PATHS.gridDocumentation,
      ]),
    );
  });

  it('records Resizable single and group as a complete local-source parity scene', () => {
    expect(getParityScenario('resizable')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.resizablePublicEntry,
    });
    expect(assertScenarioComparable('resizable').targets).toHaveLength(6);
    expect(getParityScenario('resizable').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.resizableSingleEntry,
        REFERENCE_SOURCE_PATHS.resizableGroupEntry,
        REFERENCE_SOURCE_PATHS.resizableFoundation,
        REFERENCE_SOURCE_PATHS.resizableFoundationStyle,
        REFERENCE_SOURCE_PATHS.resizableDocumentation,
      ]),
    );
  });

  it('records Typography and numeral Foundation as a complete local-source parity scene', () => {
    expect(getParityScenario('typography')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.typographyPublicEntry,
    });
    expect(assertScenarioComparable('typography').targets).toHaveLength(10);
    expect(getParityScenario('typography').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.typographyBaseEntry,
        REFERENCE_SOURCE_PATHS.typographyNumeralEntry,
        REFERENCE_SOURCE_PATHS.typographyFoundationFormatter,
        REFERENCE_SOURCE_PATHS.typographyFoundationStyle,
        REFERENCE_SOURCE_PATHS.typographyDocumentation,
      ]),
    );
  });

  it('records ConfigProvider context and responsive contracts as a complete parity scene', () => {
    expect(getParityScenario('config-provider')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.configProviderPublicEntry,
    });
    expect(assertScenarioComparable('config-provider').targets).toHaveLength(5);
    expect(getParityScenario('config-provider').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.configProviderContextEntry,
        REFERENCE_SOURCE_PATHS.configProviderResponsiveTypes,
        REFERENCE_SOURCE_PATHS.configProviderDocumentation,
      ]),
    );
  });

  it('records Switch Foundation, styles, and docs as a complete parity scene', () => {
    expect(getParityScenario('switch')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.switchPublicEntry,
    });
    expect(assertScenarioComparable('switch').targets).toHaveLength(11);
    expect(getParityScenario('switch').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.switchFoundation,
        REFERENCE_SOURCE_PATHS.switchFoundationStyle,
        REFERENCE_SOURCE_PATHS.switchDocumentation,
      ]),
    );
  });

  it('records Tooltip Foundation, Portal styles, and docs as a complete parity scene', () => {
    expect(getParityScenario('tooltip')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.tooltipPublicEntry,
    });
    expect(assertScenarioComparable('tooltip').targets).toHaveLength(8);
    expect(getParityScenario('tooltip').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.tooltipFoundation,
        REFERENCE_SOURCE_PATHS.tooltipFoundationStyle,
        REFERENCE_SOURCE_PATHS.tooltipDocumentation,
      ]),
    );
  });

  it('records Tree Adapter, Node, Foundation, styles and docs as a complete parity scene', () => {
    expect(getParityScenario('tree')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.treePublicEntry,
    });
    expect(assertScenarioComparable('tree').targets).toHaveLength(6);
    expect(getParityScenario('tree').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.treeNodeEntry,
        REFERENCE_SOURCE_PATHS.treeFoundation,
        REFERENCE_SOURCE_PATHS.treeFoundationStyle,
        REFERENCE_SOURCE_PATHS.treeDocumentation,
      ]),
    );
  });

  it('records TreeSelect Adapter, Foundation, constants, styles and docs as a complete parity scene', () => {
    expect(getParityScenario('tree-select')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.treeSelectPublicEntry,
    });
    expect(assertScenarioComparable('tree-select').targets).toHaveLength(6);
    expect(getParityScenario('tree-select').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.treeSelectFoundation,
        REFERENCE_SOURCE_PATHS.treeSelectFoundationConstants,
        REFERENCE_SOURCE_PATHS.treeSelectFoundationStyle,
        REFERENCE_SOURCE_PATHS.treeSelectDocumentation,
      ]),
    );
  });

  it('records Cascader Adapter, item, Foundation, constants, styles and docs as a complete parity scene', () => {
    expect(getParityScenario('cascader')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.cascaderPublicEntry,
    });
    expect(assertScenarioComparable('cascader').targets).toHaveLength(6);
    expect(getParityScenario('cascader').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.cascaderItemEntry,
        REFERENCE_SOURCE_PATHS.cascaderFoundation,
        REFERENCE_SOURCE_PATHS.cascaderFoundationConstants,
        REFERENCE_SOURCE_PATHS.cascaderFoundationStyle,
        REFERENCE_SOURCE_PATHS.cascaderDocumentation,
      ]),
    );
  });

  it('records ColorPicker Adapter, DataPart, Foundation, styles and docs as a complete parity scene', () => {
    expect(getParityScenario('color-picker')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.colorPickerPublicEntry,
    });
    expect(assertScenarioComparable('color-picker').targets).toHaveLength(7);
    expect(getParityScenario('color-picker').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.colorPickerDataPartEntry,
        REFERENCE_SOURCE_PATHS.colorPickerFoundation,
        REFERENCE_SOURCE_PATHS.colorPickerFoundationStyle,
        REFERENCE_SOURCE_PATHS.colorPickerDocumentation,
      ]),
    );
  });

  it('records DatePicker Adapter, Month, Foundation, styles and docs as a complete parity scene', () => {
    expect(getParityScenario('date-picker')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.datePickerPublicEntry,
    });
    expect(assertScenarioComparable('date-picker').targets).toHaveLength(6);
    expect(getParityScenario('date-picker').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.datePickerAdapterEntry,
        REFERENCE_SOURCE_PATHS.datePickerMonthEntry,
        REFERENCE_SOURCE_PATHS.datePickerFoundation,
        REFERENCE_SOURCE_PATHS.datePickerFoundationStyle,
        REFERENCE_SOURCE_PATHS.datePickerDocumentation,
      ]),
    );
  });

  it('records Form fields, array state, Foundation, styles and docs as a complete parity scene', () => {
    expect(getParityScenario('form')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.formPublicEntry,
    });
    expect(assertScenarioComparable('form').targets).toHaveLength(5);
    expect(getParityScenario('form').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.formBaseEntry,
        REFERENCE_SOURCE_PATHS.formFieldEntry,
        REFERENCE_SOURCE_PATHS.formArrayFieldEntry,
        REFERENCE_SOURCE_PATHS.formFoundation,
        REFERENCE_SOURCE_PATHS.formFoundationStyle,
        REFERENCE_SOURCE_PATHS.formDocumentation,
      ]),
    );
  });

  it('records Select Adapter, Option, Foundation, styles and docs as a complete parity scene', () => {
    expect(getParityScenario('select')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.selectPublicEntry,
    });
    expect(assertScenarioComparable('select').targets).toHaveLength(6);
    expect(getParityScenario('select').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.selectOptionEntry,
        REFERENCE_SOURCE_PATHS.selectFoundation,
        REFERENCE_SOURCE_PATHS.selectFoundationStyle,
        REFERENCE_SOURCE_PATHS.selectDocumentation,
      ]),
    );
  });

  it('records FloatButton and Group as a complete local-source parity scene', () => {
    expect(getParityScenario('float-button')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.floatButtonPublicEntry,
    });
    expect(assertScenarioComparable('float-button').targets).toHaveLength(8);
    expect(getParityScenario('float-button').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.floatButtonGroupEntry,
        REFERENCE_SOURCE_PATHS.floatButtonFoundationStyle,
        REFERENCE_SOURCE_PATHS.floatButtonDocumentation,
      ]),
    );
  });

  it('records Table Adapter, body, Foundation, styles and docs as a complete parity scene', () => {
    expect(getParityScenario('table')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.tablePublicEntry,
    });
    expect(assertScenarioComparable('table').targets).toHaveLength(4);
    expect(getParityScenario('table').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.tableAdapterEntry,
        REFERENCE_SOURCE_PATHS.tableBodyEntry,
        REFERENCE_SOURCE_PATHS.tableFoundation,
        REFERENCE_SOURCE_PATHS.tableFoundationStyle,
        REFERENCE_SOURCE_PATHS.tableDocumentation,
      ]),
    );
  });

  it('records Tag, Group, Split, constants, styles and docs as a complete parity scene', () => {
    expect(getParityScenario('tag')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.tagPublicEntry,
    });
    expect(assertScenarioComparable('tag').targets).toHaveLength(6);
    expect(getParityScenario('tag').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.tagGroupEntry,
        REFERENCE_SOURCE_PATHS.splitTagGroupEntry,
        REFERENCE_SOURCE_PATHS.tagFoundationConstants,
        REFERENCE_SOURCE_PATHS.tagFoundationStyle,
        REFERENCE_SOURCE_PATHS.tagDocumentation,
      ]),
    );
  });

  it('records Timeline Item, constants, styles and docs as a complete parity scene', () => {
    expect(getParityScenario('timeline')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.timelinePublicEntry,
    });
    expect(assertScenarioComparable('timeline').targets).toHaveLength(6);
    expect(getParityScenario('timeline').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.timelineItemEntry,
        REFERENCE_SOURCE_PATHS.timelineFoundationConstants,
        REFERENCE_SOURCE_PATHS.timelineFoundationStyle,
        REFERENCE_SOURCE_PATHS.timelineDocumentation,
      ]),
    );
  });

  it('records Banner Adapter, Foundation, constants, styles and docs as a complete parity scene', () => {
    expect(getParityScenario('banner')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.bannerPublicEntry,
    });
    expect(assertScenarioComparable('banner').targets).toHaveLength(6);
    expect(getParityScenario('banner').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.bannerFoundation,
        REFERENCE_SOURCE_PATHS.bannerFoundationConstants,
        REFERENCE_SOURCE_PATHS.bannerFoundationStyle,
        REFERENCE_SOURCE_PATHS.bannerDocumentation,
      ]),
    );
  });

  it('records Notification Adapter, Notice, both Foundations, styles and docs', () => {
    expect(getParityScenario('notification')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.notificationPublicEntry,
    });
    expect(assertScenarioComparable('notification').targets).toHaveLength(6);
    expect(getParityScenario('notification').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.notificationNoticeEntry,
        REFERENCE_SOURCE_PATHS.notificationFoundation,
        REFERENCE_SOURCE_PATHS.notificationListFoundation,
        REFERENCE_SOURCE_PATHS.notificationFoundationConstants,
        REFERENCE_SOURCE_PATHS.notificationFoundationStyle,
        REFERENCE_SOURCE_PATHS.notificationDocumentation,
      ]),
    );
  });

  it('records Popconfirm Adapter, Foundation, constants, styles and docs', () => {
    expect(getParityScenario('popconfirm')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.popconfirmPublicEntry,
    });
    expect(assertScenarioComparable('popconfirm').targets).toHaveLength(6);
    expect(getParityScenario('popconfirm').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.popconfirmFoundation,
        REFERENCE_SOURCE_PATHS.popconfirmFoundationConstants,
        REFERENCE_SOURCE_PATHS.popconfirmFoundationStyle,
        REFERENCE_SOURCE_PATHS.popconfirmDocumentation,
      ]),
    );
  });

  it('records Progress Adapter, colour generator, constants, styles and docs', () => {
    expect(getParityScenario('progress')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.progressPublicEntry,
    });
    expect(assertScenarioComparable('progress').targets).toHaveLength(8);
    expect(getParityScenario('progress').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.progressFoundationConstants,
        REFERENCE_SOURCE_PATHS.progressFoundationGenerates,
        REFERENCE_SOURCE_PATHS.progressFoundationStyle,
        REFERENCE_SOURCE_PATHS.progressDocumentation,
      ]),
    );
  });

  it('records Skeleton Adapter, item entry, constants, styles and docs', () => {
    expect(getParityScenario('skeleton')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.skeletonPublicEntry,
    });
    expect(assertScenarioComparable('skeleton').targets).toHaveLength(8);
    expect(getParityScenario('skeleton').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.skeletonItemEntry,
        REFERENCE_SOURCE_PATHS.skeletonFoundationConstants,
        REFERENCE_SOURCE_PATHS.skeletonFoundationStyle,
        REFERENCE_SOURCE_PATHS.skeletonDocumentation,
      ]),
    );
  });

  it('records Spin Adapter, icon, Foundation, constants, styles and docs', () => {
    expect(getParityScenario('spin')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.spinPublicEntry,
    });
    expect(assertScenarioComparable('spin').targets).toHaveLength(7);
    expect(getParityScenario('spin').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.spinIconEntry,
        REFERENCE_SOURCE_PATHS.spinFoundation,
        REFERENCE_SOURCE_PATHS.spinFoundationConstants,
        REFERENCE_SOURCE_PATHS.spinFoundationStyle,
        REFERENCE_SOURCE_PATHS.spinDocumentation,
      ]),
    );

    expect(getParityScenario('transfer')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.transferPublicEntry,
    });
    expect(assertScenarioComparable('transfer').targets).toHaveLength(7);
    expect(getParityScenario('transfer').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.transferFoundation,
        REFERENCE_SOURCE_PATHS.transferFoundationUtils,
        REFERENCE_SOURCE_PATHS.transferFoundationConstants,
        REFERENCE_SOURCE_PATHS.transferFoundationStyle,
        REFERENCE_SOURCE_PATHS.transferDocumentation,
      ]),
    );
  });

  it('records Toast Adapter, hook, Foundations, constants, styles and docs', () => {
    expect(getParityScenario('toast')).toMatchObject({
      referenceStatus: 'ready',
      vueStatus: 'ready',
      referenceSource: REFERENCE_SOURCE_PATHS.toastPublicEntry,
    });
    expect(assertScenarioComparable('toast').targets).toHaveLength(5);
    expect(getParityScenario('toast').sourceEvidence).toEqual(
      expect.arrayContaining([
        REFERENCE_SOURCE_PATHS.toastEntry,
        REFERENCE_SOURCE_PATHS.toastHookEntry,
        REFERENCE_SOURCE_PATHS.toastFoundation,
        REFERENCE_SOURCE_PATHS.toastListFoundation,
        REFERENCE_SOURCE_PATHS.toastFoundationConstants,
        REFERENCE_SOURCE_PATHS.toastFoundationStyle,
        REFERENCE_SOURCE_PATHS.toastDocumentation,
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
