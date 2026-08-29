// 这是唯一允许从 vendor/semi-design 的 Foundation TypeScript 源码建立运行时依赖的包。
// 具体组件适配会在对应对齐矩阵建立后加入，并由公开包构建阶段内联。
export { AnchorFoundation, AnchorLinkFoundation } from './anchor.js';
export type { AnchorAdapter, AnchorLinkAdapter } from './anchor.js';
export { AvatarFoundation } from './avatar.js';
export type { AvatarAdapter } from './avatar.js';
export { BannerFoundation } from './banner.js';
export type { BannerAdapter } from './banner.js';
export { BackTopFoundation } from './back-top.js';
export type { BackTopAdapter } from './back-top.js';
export { BreadcrumbFoundation, BreadcrumbItemFoundation } from './breadcrumb.js';
export type { BreadcrumbAdapter, BreadcrumbItemAdapter } from './breadcrumb.js';
export {
  calcRangeData as calcCalendarRangeData,
  calcRowHeight as calcCalendarRowHeight,
  calcWeekData as calcCalendarWeekData,
  checkWeekend as checkCalendarWeekend,
  CalendarFoundation,
  getCurrDate as getCalendarCurrentDate,
  getPos as getCalendarPosition,
  round as roundCalendarPosition,
} from './calendar.js';
export type {
  CalendarAdapter,
  CalendarDateObject,
  CalendarMonthData,
  CalendarParsedEvents,
  CalendarParsedEventsType,
  FoundationCalendarEvent,
  MonthlyCalendarEvents,
  ParsedCalendarEvent,
  WeekStartsOn as CalendarWeekStartsOn,
} from './calendar.js';
export { CarouselFoundation } from './carousel.js';
export type { CarouselAdapter } from './carousel.js';
export { CollapsibleFoundation } from './collapsible.js';
export type { CollapsibleAdapter } from './collapsible.js';
export { CropperFoundation, cropperCssClasses, cropperStrings } from './cropper.js';
export type {
  CropperAdapter,
  CropperBoxState,
  CropperImageDataState,
  CropperPoint,
} from './cropper.js';
export { DescriptionsFoundation } from './descriptions.js';
export type { DescriptionsAdapter } from './descriptions.js';
export { DropdownFoundation, DropdownMenuFoundation } from './dropdown.js';
export type { DropdownAdapter, DropdownMenuAdapter } from './dropdown.js';
export { HighlightFoundation } from './highlight.js';
export type {
  HighlightFoundationChunk,
  HighlightFoundationQuery,
  HighlightFoundationSearchWord,
  HighlightFoundationSearchWords,
} from './highlight.js';
export { ModalContentFoundation, ModalFocusTrapHandle, ModalFoundation } from './modal.js';
export type {
  FoundationModalContentProps,
  FoundationModalContentState,
  FoundationModalProps,
  FoundationModalState,
  ModalAdapter,
  ModalContentAdapter,
} from './modal.js';
export {
  NotificationFoundation,
  NotificationListFoundation,
  notificationCssClasses,
  notificationNumbers,
  notificationStrings,
} from './notification.js';
export type { NotificationAdapter, NotificationListAdapter } from './notification.js';
export { OverflowListFoundation } from './overflow-list.js';
export type { OverflowListAdapter } from './overflow-list.js';
export { popoverCssClasses, popoverNumbers, popoverStrings } from './popover.js';
export type { PopoverArrowBoundingConstants } from './popover.js';
export {
  PopconfirmFoundation,
  popconfirmCssClasses,
  popconfirmNumbers,
  popconfirmStrings,
} from './popconfirm.js';
export type { PopconfirmAdapter } from './popconfirm.js';
export { generateProgressColor, ProgressAnimation } from './progress.js';
export type { ProgressStrokePoint } from './progress.js';
export {
  crossMergeImageSources,
  getPreloadImageSources,
  ImageFoundation,
  ImagePreviewFooterFoundation,
  ImagePreviewFoundation,
  ImagePreviewImageFoundation,
  ImagePreviewInnerFoundation,
  isImagePreviewTarget,
} from './image.js';
export type {
  ImageFoundationAdapter,
  ImagePreviewImageAdapter,
  ImagePreviewInnerAdapter,
  ImageRatioType,
} from './image.js';
export { AutoCompleteFoundation } from './auto-complete.js';
export type { AutoCompleteAdapter } from './auto-complete.js';
export { CheckboxFoundation, CheckboxGroupFoundation } from './checkbox.js';
export type { CheckboxAdapter, CheckboxGroupAdapter } from './checkbox.js';
export { InputFoundation, TextAreaFoundation } from './input.js';
export type { InputAdapter, TextAreaAdapter } from './input.js';
export { InputNumberFoundation } from './input-number.js';
export type { InputNumberAdapter } from './input-number.js';
export { PinCodeFoundation } from './pin-code.js';
export type { PinCodeAdapter } from './pin-code.js';
export { PaginationFoundation } from './pagination.js';
export type { PaginationAdapter, PaginationPage, PaginationPageListState } from './pagination.js';
export { RadioFoundation, RadioGroupFoundation, RadioInnerFoundation } from './radio.js';
export type { RadioAdapter, RadioGroupAdapter, RadioInnerAdapter } from './radio.js';
export { RatingFoundation, RatingItemFoundation } from './rating.js';
export type { RatingAdapter, RatingItemAdapter } from './rating.js';
export {
  animatedScrollTo,
  ScrollItemFoundation,
  scrollListCssClasses,
  scrollListNumbers,
  scrollListStrings,
} from './scroll-list.js';
export type {
  FoundationScrollItem,
  ScrollAnimation,
  ScrollItemAdapter,
  ScrollItemNearestNodeInfo,
  ScrollItemTargetNodeInfo,
} from './scroll-list.js';
export { SideSheetFoundation, sideSheetCssClasses, sideSheetStrings } from './side-sheet.js';
export type {
  FoundationSideSheetProps,
  FoundationSideSheetState,
  SideSheetAdapter,
} from './side-sheet.js';
export { SpinFoundation } from './spin.js';
export type { SpinAdapter } from './spin.js';
export { tableCssClasses, tableNumbers, tableStrings } from './table.js';
export * from './resizable.js';
export { SelectFoundation } from './select.js';
export type { SelectAdapter } from './select.js';
export { SliderFoundation } from './slider.js';
export type { SliderAdapter, SliderLengths } from './slider.js';
export { SwitchFoundation } from './switch.js';
export type { SwitchAdapter } from './switch.js';
export { TabsFoundation } from './tabs.js';
export type { TabsAdapter } from './tabs.js';
export { TagInputFoundation } from './tag-input.js';
export type { TagInputAdapter, TagInputSortEnd } from './tag-input.js';
export {
  formatOption as formatTimePickerOption,
  TimeInputFoundation,
  TimePickerComboboxFoundation,
  TimePickerFoundation,
} from './time-picker.js';
export type {
  TimePickerAdapter,
  TimePickerComboboxState,
  TimePickerPanelChange,
} from './time-picker.js';
export { TooltipFoundation } from './tooltip.js';
export type { TooltipAdapter, TooltipPopupContainerRect } from './tooltip.js';
export {
  ToastFoundation,
  ToastListFoundation,
  toastCssClasses,
  toastNumbers,
  toastStrings,
} from './toast.js';
export type { ToastAdapter, ToastListAdapter } from './toast.js';
export {
  calcCheckedKeys as calcTreeCheckedKeys,
  calcDisabledKeys as calcTreeDisabledKeys,
  calcExpandedKeys as calcTreeExpandedKeys,
  calcExpandedKeysForValues as calcTreeExpandedKeysForValues,
  convertDataToEntities as convertTreeDataToEntities,
  convertJsonToData as convertTreeJsonToData,
  filterTreeData,
  findKeysForValues as findTreeKeysForValues,
  flattenTreeData,
  normalizeValue as normalizeTreeValue,
  TreeFoundation,
} from './tree.js';
export type { TreeAdapter } from './tree.js';
export * from './typography.js';
