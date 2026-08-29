import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
import sass from 'sass';

export const virtualAnchorStyleId = 'virtual:workspace-anchor-styles.css';
export const virtualAvatarStyleId = 'virtual:workspace-avatar-styles.css';
export const virtualBadgeStyleId = 'virtual:workspace-badge-styles.css';
export const virtualBannerStyleId = 'virtual:workspace-banner-styles.css';
export const virtualNotificationStyleId = 'virtual:workspace-notification-styles.css';
export const virtualCalendarStyleId = 'virtual:workspace-calendar-styles.css';
export const virtualCardStyleId = 'virtual:workspace-card-styles.css';
export const virtualCarouselStyleId = 'virtual:workspace-carousel-styles.css';
export const virtualCollapsibleStyleId = 'virtual:workspace-collapsible-styles.css';
export const virtualCropperStyleId = 'virtual:workspace-cropper-styles.css';
export const virtualDescriptionsStyleId = 'virtual:workspace-descriptions-styles.css';
export const virtualDropdownStyleId = 'virtual:workspace-dropdown-styles.css';
export const virtualEmptyStyleId = 'virtual:workspace-empty-styles.css';
export const virtualHighlightStyleId = 'virtual:workspace-highlight-styles.css';
export const virtualImageStyleId = 'virtual:workspace-image-styles.css';
export const virtualListStyleId = 'virtual:workspace-list-styles.css';
export const virtualModalStyleId = 'virtual:workspace-modal-styles.css';
export const virtualOverflowListStyleId = 'virtual:workspace-overflow-list-styles.css';
export const virtualPopoverStyleId = 'virtual:workspace-popover-styles.css';
export const virtualPopconfirmStyleId = 'virtual:workspace-popconfirm-styles.css';
export const virtualProgressStyleId = 'virtual:workspace-progress-styles.css';
export const virtualSkeletonStyleId = 'virtual:workspace-skeleton-styles.css';
export const virtualSpinStyleId = 'virtual:workspace-spin-styles.css';
export const virtualToastStyleId = 'virtual:workspace-toast-styles.css';
export const virtualScrollListStyleId = 'virtual:workspace-scroll-list-styles.css';
export const virtualSideSheetStyleId = 'virtual:workspace-side-sheet-styles.css';
export const virtualTableStyleId = 'virtual:workspace-table-styles.css';
export const virtualTagStyleId = 'virtual:workspace-tag-styles.css';
export const virtualTimelineStyleId = 'virtual:workspace-timeline-styles.css';
export const virtualBackTopStyleId = 'virtual:workspace-back-top-styles.css';
export const virtualBreadcrumbStyleId = 'virtual:workspace-breadcrumb-styles.css';
export const virtualPaginationStyleId = 'virtual:workspace-pagination-styles.css';
export const virtualAutoCompleteStyleId = 'virtual:workspace-auto-complete-styles.css';
export const virtualButtonStyleId = 'virtual:workspace-button-styles.css';
export const virtualCheckboxStyleId = 'virtual:workspace-checkbox-styles.css';
export const virtualConfigProviderStyleId = 'virtual:workspace-config-provider-styles.css';
export const virtualDividerStyleId = 'virtual:workspace-divider-styles.css';
export const virtualFloatButtonStyleId = 'virtual:workspace-float-button-styles.css';
export const virtualIconStyleId = 'virtual:workspace-icon-styles.css';
export const virtualInputStyleId = 'virtual:workspace-input-styles.css';
export const virtualInputNumberStyleId = 'virtual:workspace-input-number-styles.css';
export const virtualGridStyleId = 'virtual:workspace-grid-styles.css';
export const virtualLayoutStyleId = 'virtual:workspace-layout-styles.css';
export const virtualPinCodeStyleId = 'virtual:workspace-pin-code-styles.css';
export const virtualRadioStyleId = 'virtual:workspace-radio-styles.css';
export const virtualRatingStyleId = 'virtual:workspace-rating-styles.css';
export const virtualResizableStyleId = 'virtual:workspace-resizable-styles.css';
export const virtualSelectStyleId = 'virtual:workspace-select-styles.css';
export const virtualSliderStyleId = 'virtual:workspace-slider-styles.css';
export const virtualSpaceStyleId = 'virtual:workspace-space-styles.css';
export const virtualStepsStyleId = 'virtual:workspace-steps-styles.css';
export const virtualTabsStyleId = 'virtual:workspace-tabs-styles.css';
export const virtualTreeStyleId = 'virtual:workspace-tree-styles.css';
export const virtualSwitchStyleId = 'virtual:workspace-switch-styles.css';
export const virtualTagInputStyleId = 'virtual:workspace-tag-input-styles.css';
export const virtualTimePickerStyleId = 'virtual:workspace-time-picker-styles.css';
export const virtualTooltipStyleId = 'virtual:workspace-tooltip-styles.css';
export const virtualTransferStyleId = 'virtual:workspace-transfer-styles.css';
export const virtualTypographyStyleId = 'virtual:workspace-typography-styles.css';
const resolvedVirtualAnchorStyleId = `\0${virtualAnchorStyleId}`;
const resolvedVirtualAvatarStyleId = `\0${virtualAvatarStyleId}`;
const resolvedVirtualBadgeStyleId = `\0${virtualBadgeStyleId}`;
const resolvedVirtualBannerStyleId = `\0${virtualBannerStyleId}`;
const resolvedVirtualNotificationStyleId = `\0${virtualNotificationStyleId}`;
const resolvedVirtualCalendarStyleId = `\0${virtualCalendarStyleId}`;
const resolvedVirtualCardStyleId = `\0${virtualCardStyleId}`;
const resolvedVirtualCarouselStyleId = `\0${virtualCarouselStyleId}`;
const resolvedVirtualCollapsibleStyleId = `\0${virtualCollapsibleStyleId}`;
const resolvedVirtualCropperStyleId = `\0${virtualCropperStyleId}`;
const resolvedVirtualDescriptionsStyleId = `\0${virtualDescriptionsStyleId}`;
const resolvedVirtualDropdownStyleId = `\0${virtualDropdownStyleId}`;
const resolvedVirtualEmptyStyleId = `\0${virtualEmptyStyleId}`;
const resolvedVirtualHighlightStyleId = `\0${virtualHighlightStyleId}`;
const resolvedVirtualImageStyleId = `\0${virtualImageStyleId}`;
const resolvedVirtualListStyleId = `\0${virtualListStyleId}`;
const resolvedVirtualModalStyleId = `\0${virtualModalStyleId}`;
const resolvedVirtualOverflowListStyleId = `\0${virtualOverflowListStyleId}`;
const resolvedVirtualPopoverStyleId = `\0${virtualPopoverStyleId}`;
const resolvedVirtualPopconfirmStyleId = `\0${virtualPopconfirmStyleId}`;
const resolvedVirtualProgressStyleId = `\0${virtualProgressStyleId}`;
const resolvedVirtualSkeletonStyleId = `\0${virtualSkeletonStyleId}`;
const resolvedVirtualSpinStyleId = `\0${virtualSpinStyleId}`;
const resolvedVirtualToastStyleId = `\0${virtualToastStyleId}`;
const resolvedVirtualScrollListStyleId = `\0${virtualScrollListStyleId}`;
const resolvedVirtualSideSheetStyleId = `\0${virtualSideSheetStyleId}`;
const resolvedVirtualTableStyleId = `\0${virtualTableStyleId}`;
const resolvedVirtualTagStyleId = `\0${virtualTagStyleId}`;
const resolvedVirtualTimelineStyleId = `\0${virtualTimelineStyleId}`;
const resolvedVirtualBackTopStyleId = `\0${virtualBackTopStyleId}`;
const resolvedVirtualBreadcrumbStyleId = `\0${virtualBreadcrumbStyleId}`;
const resolvedVirtualPaginationStyleId = `\0${virtualPaginationStyleId}`;
const resolvedVirtualAutoCompleteStyleId = `\0${virtualAutoCompleteStyleId}`;
const resolvedVirtualButtonStyleId = `\0${virtualButtonStyleId}`;
const resolvedVirtualCheckboxStyleId = `\0${virtualCheckboxStyleId}`;
const resolvedVirtualConfigProviderStyleId = `\0${virtualConfigProviderStyleId}`;
const resolvedVirtualDividerStyleId = `\0${virtualDividerStyleId}`;
const resolvedVirtualFloatButtonStyleId = `\0${virtualFloatButtonStyleId}`;
const resolvedVirtualIconStyleId = `\0${virtualIconStyleId}`;
const resolvedVirtualInputStyleId = `\0${virtualInputStyleId}`;
const resolvedVirtualInputNumberStyleId = `\0${virtualInputNumberStyleId}`;
const resolvedVirtualGridStyleId = `\0${virtualGridStyleId}`;
const resolvedVirtualLayoutStyleId = `\0${virtualLayoutStyleId}`;
const resolvedVirtualPinCodeStyleId = `\0${virtualPinCodeStyleId}`;
const resolvedVirtualRadioStyleId = `\0${virtualRadioStyleId}`;
const resolvedVirtualRatingStyleId = `\0${virtualRatingStyleId}`;
const resolvedVirtualResizableStyleId = `\0${virtualResizableStyleId}`;
const resolvedVirtualSelectStyleId = `\0${virtualSelectStyleId}`;
const resolvedVirtualSliderStyleId = `\0${virtualSliderStyleId}`;
const resolvedVirtualSpaceStyleId = `\0${virtualSpaceStyleId}`;
const resolvedVirtualStepsStyleId = `\0${virtualStepsStyleId}`;
const resolvedVirtualTabsStyleId = `\0${virtualTabsStyleId}`;
const resolvedVirtualTreeStyleId = `\0${virtualTreeStyleId}`;
const resolvedVirtualSwitchStyleId = `\0${virtualSwitchStyleId}`;
const resolvedVirtualTagInputStyleId = `\0${virtualTagInputStyleId}`;
const resolvedVirtualTimePickerStyleId = `\0${virtualTimePickerStyleId}`;
const resolvedVirtualTooltipStyleId = `\0${virtualTooltipStyleId}`;
const resolvedVirtualTransferStyleId = `\0${virtualTransferStyleId}`;
const resolvedVirtualTypographyStyleId = `\0${virtualTypographyStyleId}`;
const anchorStyleEntry = fileURLToPath(new URL('./src/anchor.scss', import.meta.url));
const avatarStyleEntry = fileURLToPath(new URL('./src/avatar.scss', import.meta.url));
const badgeStyleEntry = fileURLToPath(new URL('./src/badge.scss', import.meta.url));
const bannerStyleEntry = fileURLToPath(new URL('./src/banner.scss', import.meta.url));
const notificationStyleEntry = fileURLToPath(new URL('./src/notification.scss', import.meta.url));
const calendarStyleEntry = fileURLToPath(new URL('./src/calendar.scss', import.meta.url));
const cardStyleEntry = fileURLToPath(new URL('./src/card.scss', import.meta.url));
const carouselStyleEntry = fileURLToPath(new URL('./src/carousel.scss', import.meta.url));
const collapsibleStyleEntry = fileURLToPath(new URL('./src/collapsible.scss', import.meta.url));
const cropperStyleEntry = fileURLToPath(new URL('./src/cropper.scss', import.meta.url));
const descriptionsStyleEntry = fileURLToPath(new URL('./src/descriptions.scss', import.meta.url));
const dropdownStyleEntry = fileURLToPath(new URL('./src/dropdown.scss', import.meta.url));
const emptyStyleEntry = fileURLToPath(new URL('./src/empty.scss', import.meta.url));
const highlightStyleEntry = fileURLToPath(new URL('./src/highlight.scss', import.meta.url));
const imageStyleEntry = fileURLToPath(new URL('./src/image.scss', import.meta.url));
const listStyleEntry = fileURLToPath(new URL('./src/list.scss', import.meta.url));
const modalStyleEntry = fileURLToPath(new URL('./src/modal.scss', import.meta.url));
const overflowListStyleEntry = fileURLToPath(new URL('./src/overflow-list.scss', import.meta.url));
const popoverStyleEntry = fileURLToPath(new URL('./src/popover.scss', import.meta.url));
const popconfirmStyleEntry = fileURLToPath(new URL('./src/popconfirm.scss', import.meta.url));
const progressStyleEntry = fileURLToPath(new URL('./src/progress.scss', import.meta.url));
const skeletonStyleEntry = fileURLToPath(new URL('./src/skeleton.scss', import.meta.url));
const spinStyleEntry = fileURLToPath(new URL('./src/spin.scss', import.meta.url));
const toastStyleEntry = fileURLToPath(new URL('./src/toast.scss', import.meta.url));
const scrollListStyleEntry = fileURLToPath(new URL('./src/scroll-list.scss', import.meta.url));
const sideSheetStyleEntry = fileURLToPath(new URL('./src/side-sheet.scss', import.meta.url));
const tableStyleEntry = fileURLToPath(new URL('./src/table.scss', import.meta.url));
const tagStyleEntry = fileURLToPath(new URL('./src/tag.scss', import.meta.url));
const timelineStyleEntry = fileURLToPath(new URL('./src/timeline.scss', import.meta.url));
const backTopStyleEntry = fileURLToPath(new URL('./src/back-top.scss', import.meta.url));
const breadcrumbStyleEntry = fileURLToPath(new URL('./src/breadcrumb.scss', import.meta.url));
const paginationStyleEntry = fileURLToPath(new URL('./src/pagination.scss', import.meta.url));
const autoCompleteStyleEntry = fileURLToPath(new URL('./src/auto-complete.scss', import.meta.url));
const buttonStyleEntry = fileURLToPath(new URL('./src/button.scss', import.meta.url));
const checkboxStyleEntry = fileURLToPath(new URL('./src/checkbox.scss', import.meta.url));
const configProviderStyleEntry = fileURLToPath(
  new URL('./src/config-provider.scss', import.meta.url),
);
const dividerStyleEntry = fileURLToPath(new URL('./src/divider.scss', import.meta.url));
const floatButtonStyleEntry = fileURLToPath(new URL('./src/float-button.scss', import.meta.url));
const iconStyleEntry = fileURLToPath(new URL('./src/icon.scss', import.meta.url));
const inputStyleEntry = fileURLToPath(new URL('./src/input.scss', import.meta.url));
const inputNumberStyleEntry = fileURLToPath(new URL('./src/input-number.scss', import.meta.url));
const gridStyleEntry = fileURLToPath(new URL('./src/grid.scss', import.meta.url));
const layoutStyleEntry = fileURLToPath(new URL('./src/layout.scss', import.meta.url));
const pinCodeStyleEntry = fileURLToPath(new URL('./src/pin-code.scss', import.meta.url));
const radioStyleEntry = fileURLToPath(new URL('./src/radio.scss', import.meta.url));
const ratingStyleEntry = fileURLToPath(new URL('./src/rating.scss', import.meta.url));
const resizableStyleEntry = fileURLToPath(new URL('./src/resizable.scss', import.meta.url));
const selectStyleEntry = fileURLToPath(new URL('./src/select.scss', import.meta.url));
const sliderStyleEntry = fileURLToPath(new URL('./src/slider.scss', import.meta.url));
const spaceStyleEntry = fileURLToPath(new URL('./src/space.scss', import.meta.url));
const stepsStyleEntry = fileURLToPath(new URL('./src/steps.scss', import.meta.url));
const tabsStyleEntry = fileURLToPath(new URL('./src/tabs.scss', import.meta.url));
const treeStyleEntry = fileURLToPath(new URL('./src/tree.scss', import.meta.url));
const switchStyleEntry = fileURLToPath(new URL('./src/switch.scss', import.meta.url));
const tagInputStyleEntry = fileURLToPath(new URL('./src/tag-input.scss', import.meta.url));
const timePickerStyleEntry = fileURLToPath(new URL('./src/time-picker.scss', import.meta.url));
const tooltipStyleEntry = fileURLToPath(new URL('./src/tooltip.scss', import.meta.url));
const transferStyleEntry = fileURLToPath(new URL('./src/transfer.scss', import.meta.url));
const typographyStyleEntry = fileURLToPath(new URL('./src/typography.scss', import.meta.url));

const styleEntries = new Map([
  [resolvedVirtualAnchorStyleId, anchorStyleEntry],
  [resolvedVirtualAvatarStyleId, avatarStyleEntry],
  [resolvedVirtualBadgeStyleId, badgeStyleEntry],
  [resolvedVirtualBannerStyleId, bannerStyleEntry],
  [resolvedVirtualNotificationStyleId, notificationStyleEntry],
  [resolvedVirtualCalendarStyleId, calendarStyleEntry],
  [resolvedVirtualCardStyleId, cardStyleEntry],
  [resolvedVirtualCarouselStyleId, carouselStyleEntry],
  [resolvedVirtualCollapsibleStyleId, collapsibleStyleEntry],
  [resolvedVirtualCropperStyleId, cropperStyleEntry],
  [resolvedVirtualDescriptionsStyleId, descriptionsStyleEntry],
  [resolvedVirtualDropdownStyleId, dropdownStyleEntry],
  [resolvedVirtualEmptyStyleId, emptyStyleEntry],
  [resolvedVirtualHighlightStyleId, highlightStyleEntry],
  [resolvedVirtualImageStyleId, imageStyleEntry],
  [resolvedVirtualListStyleId, listStyleEntry],
  [resolvedVirtualModalStyleId, modalStyleEntry],
  [resolvedVirtualOverflowListStyleId, overflowListStyleEntry],
  [resolvedVirtualPopoverStyleId, popoverStyleEntry],
  [resolvedVirtualPopconfirmStyleId, popconfirmStyleEntry],
  [resolvedVirtualProgressStyleId, progressStyleEntry],
  [resolvedVirtualSkeletonStyleId, skeletonStyleEntry],
  [resolvedVirtualSpinStyleId, spinStyleEntry],
  [resolvedVirtualToastStyleId, toastStyleEntry],
  [resolvedVirtualScrollListStyleId, scrollListStyleEntry],
  [resolvedVirtualSideSheetStyleId, sideSheetStyleEntry],
  [resolvedVirtualTableStyleId, tableStyleEntry],
  [resolvedVirtualTagStyleId, tagStyleEntry],
  [resolvedVirtualTimelineStyleId, timelineStyleEntry],
  [resolvedVirtualBackTopStyleId, backTopStyleEntry],
  [resolvedVirtualBreadcrumbStyleId, breadcrumbStyleEntry],
  [resolvedVirtualPaginationStyleId, paginationStyleEntry],
  [resolvedVirtualAutoCompleteStyleId, autoCompleteStyleEntry],
  [resolvedVirtualButtonStyleId, buttonStyleEntry],
  [resolvedVirtualCheckboxStyleId, checkboxStyleEntry],
  [resolvedVirtualConfigProviderStyleId, configProviderStyleEntry],
  [resolvedVirtualDividerStyleId, dividerStyleEntry],
  [resolvedVirtualFloatButtonStyleId, floatButtonStyleEntry],
  [resolvedVirtualIconStyleId, iconStyleEntry],
  [resolvedVirtualInputStyleId, inputStyleEntry],
  [resolvedVirtualInputNumberStyleId, inputNumberStyleEntry],
  [resolvedVirtualGridStyleId, gridStyleEntry],
  [resolvedVirtualLayoutStyleId, layoutStyleEntry],
  [resolvedVirtualPinCodeStyleId, pinCodeStyleEntry],
  [resolvedVirtualRadioStyleId, radioStyleEntry],
  [resolvedVirtualRatingStyleId, ratingStyleEntry],
  [resolvedVirtualResizableStyleId, resizableStyleEntry],
  [resolvedVirtualSelectStyleId, selectStyleEntry],
  [resolvedVirtualSliderStyleId, sliderStyleEntry],
  [resolvedVirtualSpaceStyleId, spaceStyleEntry],
  [resolvedVirtualStepsStyleId, stepsStyleEntry],
  [resolvedVirtualTabsStyleId, tabsStyleEntry],
  [resolvedVirtualTreeStyleId, treeStyleEntry],
  [resolvedVirtualSwitchStyleId, switchStyleEntry],
  [resolvedVirtualTagInputStyleId, tagInputStyleEntry],
  [resolvedVirtualTimePickerStyleId, timePickerStyleEntry],
  [resolvedVirtualTooltipStyleId, tooltipStyleEntry],
  [resolvedVirtualTransferStyleId, transferStyleEntry],
  [resolvedVirtualTypographyStyleId, typographyStyleEntry],
]);

/** Compile pinned legacy SCSS without asking Vite 8 to call a removed modern Sass API. */
export function compilePinnedComponentStyles(): Plugin {
  return {
    name: 'compile-pinned-component-styles',
    enforce: 'pre',
    resolveId(source) {
      if (source === virtualAnchorStyleId) return resolvedVirtualAnchorStyleId;
      if (source === virtualAvatarStyleId) return resolvedVirtualAvatarStyleId;
      if (source === virtualBadgeStyleId) return resolvedVirtualBadgeStyleId;
      if (source === virtualBannerStyleId) return resolvedVirtualBannerStyleId;
      if (source === virtualNotificationStyleId) return resolvedVirtualNotificationStyleId;
      if (source === virtualCalendarStyleId) return resolvedVirtualCalendarStyleId;
      if (source === virtualCardStyleId) return resolvedVirtualCardStyleId;
      if (source === virtualCarouselStyleId) return resolvedVirtualCarouselStyleId;
      if (source === virtualCollapsibleStyleId) return resolvedVirtualCollapsibleStyleId;
      if (source === virtualCropperStyleId) return resolvedVirtualCropperStyleId;
      if (source === virtualDescriptionsStyleId) return resolvedVirtualDescriptionsStyleId;
      if (source === virtualDropdownStyleId) return resolvedVirtualDropdownStyleId;
      if (source === virtualEmptyStyleId) return resolvedVirtualEmptyStyleId;
      if (source === virtualHighlightStyleId) return resolvedVirtualHighlightStyleId;
      if (source === virtualImageStyleId) return resolvedVirtualImageStyleId;
      if (source === virtualListStyleId) return resolvedVirtualListStyleId;
      if (source === virtualModalStyleId) return resolvedVirtualModalStyleId;
      if (source === virtualOverflowListStyleId) return resolvedVirtualOverflowListStyleId;
      if (source === virtualPopoverStyleId) return resolvedVirtualPopoverStyleId;
      if (source === virtualPopconfirmStyleId) return resolvedVirtualPopconfirmStyleId;
      if (source === virtualProgressStyleId) return resolvedVirtualProgressStyleId;
      if (source === virtualSkeletonStyleId) return resolvedVirtualSkeletonStyleId;
      if (source === virtualSpinStyleId) return resolvedVirtualSpinStyleId;
      if (source === virtualToastStyleId) return resolvedVirtualToastStyleId;
      if (source === virtualScrollListStyleId) return resolvedVirtualScrollListStyleId;
      if (source === virtualSideSheetStyleId) return resolvedVirtualSideSheetStyleId;
      if (source === virtualTableStyleId) return resolvedVirtualTableStyleId;
      if (source === virtualTagStyleId) return resolvedVirtualTagStyleId;
      if (source === virtualTimelineStyleId) return resolvedVirtualTimelineStyleId;
      if (source === virtualBackTopStyleId) return resolvedVirtualBackTopStyleId;
      if (source === virtualBreadcrumbStyleId) return resolvedVirtualBreadcrumbStyleId;
      if (source === virtualPaginationStyleId) return resolvedVirtualPaginationStyleId;
      if (source === virtualAutoCompleteStyleId) return resolvedVirtualAutoCompleteStyleId;
      if (source === virtualButtonStyleId) return resolvedVirtualButtonStyleId;
      if (source === virtualCheckboxStyleId) return resolvedVirtualCheckboxStyleId;
      if (source === virtualConfigProviderStyleId) return resolvedVirtualConfigProviderStyleId;
      if (source === virtualDividerStyleId) return resolvedVirtualDividerStyleId;
      if (source === virtualFloatButtonStyleId) return resolvedVirtualFloatButtonStyleId;
      if (source === virtualIconStyleId) return resolvedVirtualIconStyleId;
      if (source === virtualInputStyleId) return resolvedVirtualInputStyleId;
      if (source === virtualInputNumberStyleId) return resolvedVirtualInputNumberStyleId;
      if (source === virtualGridStyleId) return resolvedVirtualGridStyleId;
      if (source === virtualLayoutStyleId) return resolvedVirtualLayoutStyleId;
      if (source === virtualPinCodeStyleId) return resolvedVirtualPinCodeStyleId;
      if (source === virtualRadioStyleId) return resolvedVirtualRadioStyleId;
      if (source === virtualRatingStyleId) return resolvedVirtualRatingStyleId;
      if (source === virtualResizableStyleId) return resolvedVirtualResizableStyleId;
      if (source === virtualSelectStyleId) return resolvedVirtualSelectStyleId;
      if (source === virtualSliderStyleId) return resolvedVirtualSliderStyleId;
      if (source === virtualSpaceStyleId) return resolvedVirtualSpaceStyleId;
      if (source === virtualStepsStyleId) return resolvedVirtualStepsStyleId;
      if (source === virtualTabsStyleId) return resolvedVirtualTabsStyleId;
      if (source === virtualTreeStyleId) return resolvedVirtualTreeStyleId;
      if (source === virtualSwitchStyleId) return resolvedVirtualSwitchStyleId;
      if (source === virtualTagInputStyleId) return resolvedVirtualTagInputStyleId;
      if (source === virtualTimePickerStyleId) return resolvedVirtualTimePickerStyleId;
      if (source === virtualTooltipStyleId) return resolvedVirtualTooltipStyleId;
      if (source === virtualTransferStyleId) return resolvedVirtualTransferStyleId;
      if (source === virtualTypographyStyleId) return resolvedVirtualTypographyStyleId;
      return null;
    },
    load(id) {
      const styleEntry = styleEntries.get(id);
      if (!styleEntry) return null;
      return sass
        .renderSync({
          file: styleEntry,
          outputStyle: 'expanded',
        })
        .css.toString();
    },
  };
}
