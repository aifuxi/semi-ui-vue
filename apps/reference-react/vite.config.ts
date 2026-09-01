import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import sass from 'sass';
import { adaptPinnedJsonViewerCore } from '../../packages/foundation-integration/vite-json-viewer-plugin.js';

const require = createRequire(import.meta.url);
const workspaceRoot = fileURLToPath(new URL('../..', import.meta.url));
const upstreamPackages = path.join(workspaceRoot, 'vendor/semi-design/packages');
const anchorPublicEntry = path.join(upstreamPackages, 'semi-ui/anchor/index.tsx');
const avatarPublicEntry = path.join(upstreamPackages, 'semi-ui/avatar/index.tsx');
const avatarGroupEntry = path.join(upstreamPackages, 'semi-ui/avatar/avatarGroup.tsx');
const badgePublicEntry = path.join(upstreamPackages, 'semi-ui/badge/index.tsx');
const bannerPublicEntry = path.join(upstreamPackages, 'semi-ui/banner/index.tsx');
const feedbackPublicEntry = path.join(upstreamPackages, 'semi-ui/feedback/index.tsx');
const notificationPublicEntry = path.join(upstreamPackages, 'semi-ui/notification/index.tsx');
const calendarPublicEntry = path.join(upstreamPackages, 'semi-ui/calendar/index.tsx');
const cardPublicEntry = path.join(upstreamPackages, 'semi-ui/card/index.tsx');
const carouselPublicEntry = path.join(upstreamPackages, 'semi-ui/carousel/index.tsx');
const cascaderPublicEntry = path.join(upstreamPackages, 'semi-ui/cascader/index.tsx');
const collapsePublicEntry = path.join(upstreamPackages, 'semi-ui/collapse/index.tsx');
const codeHighlightPublicEntry = path.join(upstreamPackages, 'semi-ui/codeHighlight/index.tsx');
const collapsiblePublicEntry = path.join(upstreamPackages, 'semi-ui/collapsible/index.tsx');
const colorPickerPublicEntry = path.join(upstreamPackages, 'semi-ui/colorPicker/index.tsx');
const datePickerPublicEntry = path.join(upstreamPackages, 'semi-ui/datePicker/index.tsx');
const formPublicEntry = path.join(upstreamPackages, 'semi-ui/form/index.tsx');
const cropperPublicEntry = path.join(upstreamPackages, 'semi-ui/cropper/index.tsx');
const descriptionsPublicEntry = path.join(upstreamPackages, 'semi-ui/descriptions/index.tsx');
const dropdownPublicEntry = path.join(upstreamPackages, 'semi-ui/dropdown/index.tsx');
const dragMovePublicEntry = path.join(upstreamPackages, 'semi-ui/dragMove/index.ts');
const hotKeysPublicEntry = path.join(upstreamPackages, 'semi-ui/hotKeys/index.tsx');
const lottiePublicEntry = path.join(upstreamPackages, 'semi-ui/lottie/index.tsx');
const audioPlayerPublicEntry = path.join(upstreamPackages, 'semi-ui/audioPlayer/index.tsx');
const videoPlayerPublicEntry = path.join(upstreamPackages, 'semi-ui/videoPlayer/index.tsx');
const userGuidePublicEntry = path.join(upstreamPackages, 'semi-ui/userGuide/index.tsx');
const jsonViewerPublicEntry = path.join(upstreamPackages, 'semi-ui/jsonViewer/index.tsx');
const aiChatInputPublicEntry = path.join(upstreamPackages, 'semi-ui/aiChatInput/index.tsx');
const aiChatDialoguePublicEntry = path.join(upstreamPackages, 'semi-ui/aiChatDialogue/index.tsx');
const chatPublicEntry = path.join(upstreamPackages, 'semi-ui/chat/index.tsx');
const markdownRenderPublicEntry = path.join(upstreamPackages, 'semi-ui/markdownRender/index.tsx');
const sidebarPublicEntry = path.join(upstreamPackages, 'semi-ui/sideBar/index.tsx');
const baseComponentEntry = path.join(upstreamPackages, 'semi-ui/_base/baseComponent.tsx');
const localeProviderEntry = path.join(upstreamPackages, 'semi-ui/locale/localeProvider.tsx');
const localeConsumerEntry = path.join(upstreamPackages, 'semi-ui/locale/localeConsumer.tsx');
const localeEnGBEntry = path.join(upstreamPackages, 'semi-ui/locale/source/en_GB.ts');
const localeJaJPEntry = path.join(upstreamPackages, 'semi-ui/locale/source/ja_JP.ts');
const emptyPublicEntry = path.join(upstreamPackages, 'semi-ui/empty/index.tsx');
const highlightPublicEntry = path.join(upstreamPackages, 'semi-ui/highlight/index.tsx');
const imagePublicEntry = path.join(upstreamPackages, 'semi-ui/image/index.tsx');
const listPublicEntry = path.join(upstreamPackages, 'semi-ui/list/index.tsx');
const modalPublicEntry = path.join(upstreamPackages, 'semi-ui/modal/index.tsx');
const overflowListPublicEntry = path.join(upstreamPackages, 'semi-ui/overflowList/index.tsx');
const popoverPublicEntry = path.join(upstreamPackages, 'semi-ui/popover/index.tsx');
const popconfirmPublicEntry = path.join(upstreamPackages, 'semi-ui/popconfirm/index.tsx');
const progressPublicEntry = path.join(upstreamPackages, 'semi-ui/progress/index.tsx');
const skeletonPublicEntry = path.join(upstreamPackages, 'semi-ui/skeleton/index.tsx');
const spinPublicEntry = path.join(upstreamPackages, 'semi-ui/spin/index.tsx');
const transferPublicEntry = path.join(upstreamPackages, 'semi-ui/transfer/index.tsx');
const uploadPublicEntry = path.join(upstreamPackages, 'semi-ui/upload/index.tsx');
const navigationPublicEntry = path.join(upstreamPackages, 'semi-ui/navigation/index.tsx');
const transferSortableEntry = path.join(upstreamPackages, 'semi-ui/_sortable/index.tsx');
const toastPublicEntry = path.join(upstreamPackages, 'semi-ui/toast/index.tsx');
const scrollListPublicEntry = path.join(upstreamPackages, 'semi-ui/scrollList/index.tsx');
const scrollItemPublicEntry = path.join(upstreamPackages, 'semi-ui/scrollList/scrollItem.tsx');
const sideSheetPublicEntry = path.join(upstreamPackages, 'semi-ui/sideSheet/index.tsx');
const tablePublicEntry = path.join(upstreamPackages, 'semi-ui/table/index.tsx');
const tagPublicEntry = path.join(upstreamPackages, 'semi-ui/tag/index.tsx');
const tagGroupEntry = path.join(upstreamPackages, 'semi-ui/tag/group.tsx');
const splitTagGroupEntry = path.join(upstreamPackages, 'semi-ui/tag/splitTagGroup.tsx');
const timelinePublicEntry = path.join(upstreamPackages, 'semi-ui/timeline/index.tsx');
const illustrationsPublicEntry = path.join(upstreamPackages, 'semi-illustrations/src/index.ts');
const cardGroupEntry = path.join(upstreamPackages, 'semi-ui/card/cardGroup.tsx');
const backTopPublicEntry = path.join(upstreamPackages, 'semi-ui/backtop/index.tsx');
const breadcrumbPublicEntry = path.join(upstreamPackages, 'semi-ui/breadcrumb/index.tsx');
const autoCompletePublicEntry = path.join(upstreamPackages, 'semi-ui/autoComplete/index.tsx');
const buttonPublicEntry = path.join(upstreamPackages, 'semi-ui/button/index.tsx');
const iconButtonPublicEntry = path.join(upstreamPackages, 'semi-ui/iconButton/index.tsx');
const checkboxPublicEntry = path.join(upstreamPackages, 'semi-ui/checkbox/index.tsx');
const checkboxGroupEntry = path.join(upstreamPackages, 'semi-ui/checkbox/checkboxGroup.tsx');
const configProviderPublicEntry = path.join(upstreamPackages, 'semi-ui/configProvider/index.tsx');
const buttonGroupEntry = path.join(upstreamPackages, 'semi-ui/button/buttonGroup.tsx');
const splitButtonGroupEntry = path.join(upstreamPackages, 'semi-ui/button/splitButtonGroup.tsx');
const dividerPublicEntry = path.join(upstreamPackages, 'semi-ui/divider/index.tsx');
const floatButtonPublicEntry = path.join(upstreamPackages, 'semi-ui/floatButton/index.tsx');
const floatButtonGroupEntry = path.join(
  upstreamPackages,
  'semi-ui/floatButton/floatButtonGroup.tsx',
);
const iconPublicEntry = path.join(upstreamPackages, 'semi-ui/icons/index.tsx');
const inputPublicEntry = path.join(upstreamPackages, 'semi-ui/input/index.tsx');
const inputNumberPublicEntry = path.join(upstreamPackages, 'semi-ui/inputNumber/index.tsx');
const pinCodePublicEntry = path.join(upstreamPackages, 'semi-ui/pincode/index.tsx');
const paginationPublicEntry = path.join(upstreamPackages, 'semi-ui/pagination/index.tsx');
const radioPublicEntry = path.join(upstreamPackages, 'semi-ui/radio/index.tsx');
const radioGroupEntry = path.join(upstreamPackages, 'semi-ui/radio/radioGroup.tsx');
const ratingPublicEntry = path.join(upstreamPackages, 'semi-ui/rating/index.tsx');
const inputGroupEntry = path.join(upstreamPackages, 'semi-ui/input/inputGroup.tsx');
const textAreaEntry = path.join(upstreamPackages, 'semi-ui/input/textarea.tsx');
const gridPublicEntry = path.join(upstreamPackages, 'semi-ui/grid/index.tsx');
const layoutPublicEntry = path.join(upstreamPackages, 'semi-ui/layout/index.tsx');
const resizablePublicEntry = path.join(upstreamPackages, 'semi-ui/resizable/index.tsx');
const selectPublicEntry = path.join(upstreamPackages, 'semi-ui/select/index.tsx');
const sliderPublicEntry = path.join(upstreamPackages, 'semi-ui/slider/index.tsx');
const spacePublicEntry = path.join(upstreamPackages, 'semi-ui/space/index.tsx');
const stepsPublicEntry = path.join(upstreamPackages, 'semi-ui/steps/index.tsx');
const tabsPublicEntry = path.join(upstreamPackages, 'semi-ui/tabs/index.tsx');
const treePublicEntry = path.join(upstreamPackages, 'semi-ui/tree/index.tsx');
const treeSelectPublicEntry = path.join(upstreamPackages, 'semi-ui/treeSelect/index.tsx');
const switchPublicEntry = path.join(upstreamPackages, 'semi-ui/switch/index.tsx');
const tagInputPublicEntry = path.join(upstreamPackages, 'semi-ui/tagInput/index.tsx');
const timePickerPublicEntry = path.join(upstreamPackages, 'semi-ui/timePicker/index.tsx');
const tooltipPublicEntry = path.join(upstreamPackages, 'semi-ui/tooltip/index.tsx');
const typographyPublicEntry = path.join(upstreamPackages, 'semi-ui/typography/index.tsx');
const foundationRoot = path.join(upstreamPackages, 'semi-foundation');
const animationEntry = path.join(upstreamPackages, 'semi-animation/index.ts');
const iconsEntry = path.join(upstreamPackages, 'semi-icons/src/index.ts');
const iconsLabEntry = path.join(upstreamPackages, 'semi-icons-lab/src/index.ts');
const referenceStyleEntry = fileURLToPath(
  new URL('./src/semi-reference-theme.scss', import.meta.url),
);
const virtualStyleId = 'virtual:semi-reference-styles.css';
const resolvedVirtualStyleId = `\0${virtualStyleId}`;
const emptyUpstreamStyleId = '\0semi-reference-upstream-style-loaded-from-entry';
const feedbackDependenciesId = '\0semi-reference-feedback-dependencies';
const aiChatInputDependenciesId = '\0semi-reference-ai-chat-input-dependencies';
const aiChatDialogueDependenciesId = '\0semi-reference-ai-chat-dialogue-dependencies';
const chatDependenciesId = '\0semi-reference-chat-dependencies';
const chatMarkdownRenderId = '\0semi-reference-chat-markdown-render';
const sidebarDependenciesId = '\0semi-reference-sidebar-dependencies';
const capturedUpstreamStyleImports = new Set([
  '@douyinfe/semi-foundation/anchor/anchor.scss',
  path.join(foundationRoot, 'anchor/anchor.scss'),
  '@douyinfe/semi-foundation/backtop/backtop.scss',
  path.join(foundationRoot, 'backtop/backtop.scss'),
  '@douyinfe/semi-foundation/breadcrumb/breadcrumb.scss',
  path.join(foundationRoot, 'breadcrumb/breadcrumb.scss'),
  '@douyinfe/semi-foundation/autoComplete/autoComplete.scss',
  path.join(foundationRoot, 'autoComplete/autoComplete.scss'),
  '@douyinfe/semi-foundation/button/button.scss',
  '@douyinfe/semi-foundation/button/iconButton.scss',
  path.join(foundationRoot, 'button/button.scss'),
  path.join(foundationRoot, 'button/iconButton.scss'),
  '@douyinfe/semi-foundation/checkbox/checkbox.scss',
  path.join(foundationRoot, 'checkbox/checkbox.scss'),
  '@douyinfe/semi-foundation/codeHighlight/codeHighlight.scss',
  path.join(foundationRoot, 'codeHighlight/codeHighlight.scss'),
  '@douyinfe/semi-foundation/hotKeys/hotKeys.scss',
  path.join(foundationRoot, 'hotKeys/hotKeys.scss'),
  '@douyinfe/semi-foundation/audioPlayer/audioPlayer.scss',
  path.join(foundationRoot, 'audioPlayer/audioPlayer.scss'),
  '@douyinfe/semi-foundation/videoPlayer/videoPlayer.scss',
  path.join(foundationRoot, 'videoPlayer/videoPlayer.scss'),
  '@douyinfe/semi-foundation/userGuide/userGuide.scss',
  path.join(foundationRoot, 'userGuide/userGuide.scss'),
  '@douyinfe/semi-foundation/jsonViewer/jsonViewer.scss',
  path.join(foundationRoot, 'jsonViewer/jsonViewer.scss'),
  '@douyinfe/semi-foundation/aiChatInput/aiChatInput.scss',
  path.join(foundationRoot, 'aiChatInput/aiChatInput.scss'),
  '@douyinfe/semi-foundation/aiChatDialogue/aiChatDialogue.scss',
  path.join(foundationRoot, 'aiChatDialogue/aiChatDialogue.scss'),
  '@douyinfe/semi-foundation/chat/chat.scss',
  path.join(foundationRoot, 'chat/chat.scss'),
  '@douyinfe/semi-foundation/markdownRender/markdownRender.scss',
  path.join(foundationRoot, 'markdownRender/markdownRender.scss'),
  '@douyinfe/semi-foundation/sidebar/sidebar.scss',
  path.join(foundationRoot, 'sidebar/sidebar.scss'),
  '@douyinfe/semi-foundation/divider/divider.scss',
  path.join(foundationRoot, 'divider/divider.scss'),
  '@douyinfe/semi-foundation/floatButton/floatButton.scss',
  path.join(foundationRoot, 'floatButton/floatButton.scss'),
  '@douyinfe/semi-foundation/badge/badge.scss',
  path.join(foundationRoot, 'badge/badge.scss'),
  '@douyinfe/semi-foundation/banner/banner.scss',
  path.join(foundationRoot, 'banner/banner.scss'),
  '@douyinfe/semi-foundation/feedback/feedback.scss',
  path.join(foundationRoot, 'feedback/feedback.scss'),
  '@douyinfe/semi-foundation/notification/notification.scss',
  path.join(foundationRoot, 'notification/notification.scss'),
  '@douyinfe/semi-foundation/popconfirm/popconfirm.scss',
  path.join(foundationRoot, 'popconfirm/popconfirm.scss'),
  '@douyinfe/semi-foundation/progress/progress.scss',
  path.join(foundationRoot, 'progress/progress.scss'),
  '@douyinfe/semi-foundation/calendar/calendar.scss',
  path.join(foundationRoot, 'calendar/calendar.scss'),
  '@douyinfe/semi-foundation/card/card.scss',
  path.join(foundationRoot, 'card/card.scss'),
  '@douyinfe/semi-foundation/carousel/carousel.scss',
  path.join(foundationRoot, 'carousel/carousel.scss'),
  '@douyinfe/semi-foundation/cascader/cascader.scss',
  path.join(foundationRoot, 'cascader/cascader.scss'),
  '@douyinfe/semi-foundation/collapse/collapse.scss',
  path.join(foundationRoot, 'collapse/collapse.scss'),
  '@douyinfe/semi-foundation/skeleton/skeleton.scss',
  path.join(foundationRoot, 'skeleton/skeleton.scss'),
  '@douyinfe/semi-foundation/space/space.scss',
  path.join(foundationRoot, 'space/space.scss'),
  '@douyinfe/semi-foundation/steps/steps.scss',
  path.join(foundationRoot, 'steps/steps.scss'),
  '@douyinfe/semi-foundation/tabs/tabs.scss',
  path.join(foundationRoot, 'tabs/tabs.scss'),
  '@douyinfe/semi-foundation/tree/tree.scss',
  path.join(foundationRoot, 'tree/tree.scss'),
  '@douyinfe/semi-foundation/treeSelect/treeSelect.scss',
  path.join(foundationRoot, 'treeSelect/treeSelect.scss'),
  '@douyinfe/semi-foundation/collapsible/collapsible.scss',
  path.join(foundationRoot, 'collapsible/collapsible.scss'),
  '@douyinfe/semi-foundation/colorPicker/colorPicker.scss',
  path.join(foundationRoot, 'colorPicker/colorPicker.scss'),
  '@douyinfe/semi-foundation/datePicker/datePicker.scss',
  path.join(foundationRoot, 'datePicker/datePicker.scss'),
  '@douyinfe/semi-foundation/cropper/cropper.scss',
  path.join(foundationRoot, 'cropper/cropper.scss'),
  '@douyinfe/semi-foundation/descriptions/descriptions.scss',
  path.join(foundationRoot, 'descriptions/descriptions.scss'),
  '@douyinfe/semi-foundation/dropdown/dropdown.scss',
  path.join(foundationRoot, 'dropdown/dropdown.scss'),
  '@douyinfe/semi-foundation/empty/empty.scss',
  path.join(foundationRoot, 'empty/empty.scss'),
  '@douyinfe/semi-foundation/switch/switch.scss',
  path.join(foundationRoot, 'switch/switch.scss'),
  '@douyinfe/semi-foundation/spin/spin.scss',
  path.join(foundationRoot, 'spin/spin.scss'),
  '@douyinfe/semi-foundation/transfer/transfer.scss',
  path.join(foundationRoot, 'transfer/transfer.scss'),
  '@douyinfe/semi-foundation/upload/upload.scss',
  path.join(foundationRoot, 'upload/upload.scss'),
  '@douyinfe/semi-foundation/navigation/navigation.scss',
  path.join(foundationRoot, 'navigation/navigation.scss'),
  '@douyinfe/semi-foundation/toast/toast.scss',
  path.join(foundationRoot, 'toast/toast.scss'),
  '@douyinfe/semi-foundation/grid/grid.scss',
  path.join(foundationRoot, 'grid/grid.scss'),
  '@douyinfe/semi-foundation/layout/layout.scss',
  path.join(foundationRoot, 'layout/layout.scss'),
  '@douyinfe/semi-foundation/resizable/resizable.scss',
  path.join(foundationRoot, 'resizable/resizable.scss'),
  '@douyinfe/semi-foundation/input/input.scss',
  path.join(foundationRoot, 'input/input.scss'),
  '@douyinfe/semi-foundation/inputNumber/inputNumber.scss',
  path.join(foundationRoot, 'inputNumber/inputNumber.scss'),
  '@douyinfe/semi-foundation/pincode/pincode.scss',
  path.join(foundationRoot, 'pincode/pincode.scss'),
  '@douyinfe/semi-foundation/pagination/pagination.scss',
  path.join(foundationRoot, 'pagination/pagination.scss'),
  '@douyinfe/semi-foundation/radio/radio.scss',
  path.join(foundationRoot, 'radio/radio.scss'),
  '@douyinfe/semi-foundation/rating/rating.scss',
  path.join(foundationRoot, 'rating/rating.scss'),
  '@douyinfe/semi-foundation/input/textarea.scss',
  path.join(foundationRoot, 'input/textarea.scss'),
  '@douyinfe/semi-foundation/form/form.scss',
  path.join(foundationRoot, 'form/form.scss'),
  '@douyinfe/semi-foundation/tag/tag.scss',
  path.join(foundationRoot, 'tag/tag.scss'),
  '@douyinfe/semi-foundation/timeline/timeline.scss',
  path.join(foundationRoot, 'timeline/timeline.scss'),
  '@douyinfe/semi-foundation/tagInput/tagInput.scss',
  path.join(foundationRoot, 'tagInput/tagInput.scss'),
  '@douyinfe/semi-foundation/timePicker/timePicker.scss',
  path.join(foundationRoot, 'timePicker/timePicker.scss'),
  '@douyinfe/semi-foundation/scrollList/scrollList.scss',
  path.join(foundationRoot, 'scrollList/scrollList.scss'),
  '@douyinfe/semi-foundation/sideSheet/sideSheet.scss',
  path.join(foundationRoot, 'sideSheet/sideSheet.scss'),
  '@douyinfe/semi-foundation/table/table.scss',
  path.join(foundationRoot, 'table/table.scss'),
  '@douyinfe/semi-foundation/select/select.scss',
  path.join(foundationRoot, 'select/select.scss'),
  '@douyinfe/semi-foundation/slider/slider.scss',
  path.join(foundationRoot, 'slider/slider.scss'),
  '@douyinfe/semi-foundation/overflowList/overflowList.scss',
  path.join(foundationRoot, 'overflowList/overflowList.scss'),
  '@douyinfe/semi-foundation/highlight/highlight.scss',
  path.join(foundationRoot, 'highlight/highlight.scss'),
  '@douyinfe/semi-foundation/image/image.scss',
  path.join(foundationRoot, 'image/image.scss'),
  '@douyinfe/semi-foundation/list/list.scss',
  path.join(foundationRoot, 'list/list.scss'),
  '@douyinfe/semi-foundation/modal/modal.scss',
  path.join(foundationRoot, 'modal/modal.scss'),
  '@douyinfe/semi-foundation/avatar/avatar.scss',
  path.join(foundationRoot, 'avatar/avatar.scss'),
  '@douyinfe/semi-foundation/_portal/portal.scss',
  path.join(foundationRoot, '_portal/portal.scss'),
  '@douyinfe/semi-foundation/popover/popover.scss',
  path.join(foundationRoot, 'popover/popover.scss'),
  '@douyinfe/semi-foundation/tooltip/tooltip.scss',
  path.join(foundationRoot, 'tooltip/tooltip.scss'),
  '@douyinfe/semi-foundation/typography/typography.scss',
  path.join(foundationRoot, 'typography/typography.scss'),
  '@douyinfe/semi-icons/src/styles/icons.scss',
  path.join(upstreamPackages, 'semi-icons/src/styles/icons.scss'),
  '@douyinfe/semi-icons-lab/src/styles/icons.scss',
  path.join(upstreamPackages, 'semi-icons-lab/src/styles/icons.scss'),
]);

function compilePinnedReferenceStyles(): Plugin {
  return {
    name: 'compile-pinned-semi-reference-styles',
    enforce: 'pre',
    resolveId(source, importer) {
      if (source === virtualStyleId) return resolvedVirtualStyleId;
      if (source === '../index' && importer === feedbackPublicEntry) {
        return feedbackDependenciesId;
      }
      if (/^(?:\.\.\/)+index$/.test(source) && importer?.includes('/semi-ui/aiChatInput/')) {
        return aiChatInputDependenciesId;
      }
      if (/^(?:\.\.\/)+index$/.test(source) && importer?.includes('/semi-ui/aiChatDialogue/')) {
        return aiChatDialogueDependenciesId;
      }
      if (/^(?:\.\.\/)+index$/.test(source) && importer?.includes('/semi-ui/chat/')) {
        return chatDependenciesId;
      }
      if (/^(?:\.\.\/)+markdownRender$/.test(source) && importer?.includes('/semi-ui/chat/')) {
        return chatMarkdownRenderId;
      }
      if (/^(?:\.\.\/)+index$/.test(source) && importer?.includes('/semi-ui/sideBar/')) {
        return sidebarDependenciesId;
      }
      if (capturedUpstreamStyleImports.has(source)) return emptyUpstreamStyleId;
      if (
        source === '../styles/icons.scss' &&
        (importer?.includes('/vendor/semi-design/packages/semi-icons/src/components/Icon.tsx') ||
          importer?.includes('/vendor/semi-design/packages/semi-icons-lab/src/components/Icon.tsx'))
      ) {
        return emptyUpstreamStyleId;
      }
      return null;
    },
    load(id) {
      if (id === emptyUpstreamStyleId) return '';
      if (id === feedbackDependenciesId) {
        return [
          `export { default as TextArea } from ${JSON.stringify(textAreaEntry)};`,
          `export { default as RadioGroup } from ${JSON.stringify(radioGroupEntry)};`,
          `export { default as CheckboxGroup } from ${JSON.stringify(checkboxGroupEntry)};`,
          `export { default as Button } from ${JSON.stringify(buttonPublicEntry)};`,
          `export { default as Modal } from ${JSON.stringify(modalPublicEntry)};`,
          `export { default as SideSheet } from ${JSON.stringify(sideSheetPublicEntry)};`,
        ].join('\n');
      }
      if (id === aiChatInputDependenciesId) {
        return [
          `export { default as Popover } from ${JSON.stringify(popoverPublicEntry)};`,
          `export { default as Tooltip } from ${JSON.stringify(tooltipPublicEntry)};`,
          `export { default as Upload } from ${JSON.stringify(uploadPublicEntry)};`,
          `export { default as Progress } from ${JSON.stringify(progressPublicEntry)};`,
          `export { default as Button } from ${JSON.stringify(buttonPublicEntry)};`,
          `export { default as Select } from ${JSON.stringify(selectPublicEntry)};`,
          `export { default as RadioGroup } from ${JSON.stringify(radioGroupEntry)};`,
          `export { default as Dropdown } from ${JSON.stringify(dropdownPublicEntry)};`,
        ].join('\n');
      }
      if (id === aiChatDialogueDependenciesId) {
        return [
          `export { default as Button } from ${JSON.stringify(buttonPublicEntry)};`,
          `export { default as Dropdown } from ${JSON.stringify(dropdownPublicEntry)};`,
          `export { default as Modal } from ${JSON.stringify(modalPublicEntry)};`,
          `export { default as Toast } from ${JSON.stringify(toastPublicEntry)};`,
          `export { default as Image } from ${JSON.stringify(imagePublicEntry)};`,
        ].join('\n');
      }
      if (id === chatDependenciesId) {
        return [
          `export { default as BaseComponent } from ${JSON.stringify(baseComponentEntry)};`,
          `export { default as Button } from ${JSON.stringify(buttonPublicEntry)};`,
          `export { default as Upload } from ${JSON.stringify(uploadPublicEntry)};`,
          `export { default as Tooltip } from ${JSON.stringify(tooltipPublicEntry)};`,
          `export { default as TextArea } from ${JSON.stringify(textAreaEntry)};`,
          `export { default as Progress } from ${JSON.stringify(progressPublicEntry)};`,
          `export { default as Popconfirm } from ${JSON.stringify(popconfirmPublicEntry)};`,
          `export { default as Toast } from ${JSON.stringify(toastPublicEntry)};`,
        ].join('\n');
      }
      if (id === chatMarkdownRenderId) {
        return [
          `import React from 'react';`,
          `export default function ChatMarkdownRender({ raw = '' }) {`,
          `  return React.createElement('div', { className: 'semi-markdownRender' }, raw);`,
          `}`,
        ].join('\n');
      }
      if (id === sidebarDependenciesId) {
        return [
          `export { default as Button } from ${JSON.stringify(buttonPublicEntry)};`,
          `export { default as JsonViewer } from ${JSON.stringify(jsonViewerPublicEntry)};`,
          `export { default as CodeHighlight } from ${JSON.stringify(codeHighlightPublicEntry)};`,
          `export { default as Collapse } from ${JSON.stringify(collapsePublicEntry)};`,
          `export { default as Toast } from ${JSON.stringify(toastPublicEntry)};`,
          `export { default as Divider } from ${JSON.stringify(dividerPublicEntry)};`,
          `export { default as Dropdown } from ${JSON.stringify(dropdownPublicEntry)};`,
          `export { default as Input } from ${JSON.stringify(inputPublicEntry)};`,
          `export { default as Upload } from ${JSON.stringify(uploadPublicEntry)};`,
          `export { default as RadioGroup } from ${JSON.stringify(radioGroupEntry)};`,
          `export { default as Radio } from ${JSON.stringify(radioPublicEntry)};`,
          `export { default as Tooltip } from ${JSON.stringify(tooltipPublicEntry)};`,
          `export { default as Empty } from ${JSON.stringify(emptyPublicEntry)};`,
        ].join('\n');
      }
      if (id !== resolvedVirtualStyleId) return null;

      return sass
        .renderSync({
          file: referenceStyleEntry,
          outputStyle: 'expanded',
        })
        .css.toString();
    },
  };
}

export default defineConfig({
  plugins: [adaptPinnedJsonViewerCore(), compilePinnedReferenceStyles(), react()],
  resolve: {
    alias: [
      { find: '@semi-v2.102.0/anchor', replacement: anchorPublicEntry },
      { find: '@semi-v2.102.0/avatar', replacement: avatarPublicEntry },
      { find: '@semi-v2.102.0/avatar-group', replacement: avatarGroupEntry },
      { find: '@semi-v2.102.0/badge', replacement: badgePublicEntry },
      { find: '@semi-v2.102.0/banner', replacement: bannerPublicEntry },
      { find: '@semi-v2.102.0/feedback', replacement: feedbackPublicEntry },
      { find: '@semi-v2.102.0/notification', replacement: notificationPublicEntry },
      { find: '@semi-v2.102.0/calendar', replacement: calendarPublicEntry },
      { find: '@semi-v2.102.0/card', replacement: cardPublicEntry },
      { find: '@semi-v2.102.0/carousel', replacement: carouselPublicEntry },
      { find: '@semi-v2.102.0/collapse', replacement: collapsePublicEntry },
      { find: '@semi-v2.102.0/code-highlight', replacement: codeHighlightPublicEntry },
      { find: '@semi-v2.102.0/collapsible', replacement: collapsiblePublicEntry },
      { find: '@semi-v2.102.0/color-picker', replacement: colorPickerPublicEntry },
      { find: '@semi-v2.102.0/date-picker', replacement: datePickerPublicEntry },
      { find: '@semi-v2.102.0/form', replacement: formPublicEntry },
      { find: '@semi-v2.102.0/cropper', replacement: cropperPublicEntry },
      { find: '@semi-v2.102.0/descriptions', replacement: descriptionsPublicEntry },
      { find: '@semi-v2.102.0/dropdown', replacement: dropdownPublicEntry },
      { find: '@semi-v2.102.0/drag-move', replacement: dragMovePublicEntry },
      { find: '@semi-v2.102.0/hot-keys', replacement: hotKeysPublicEntry },
      { find: '@semi-v2.102.0/lottie', replacement: lottiePublicEntry },
      { find: '@semi-v2.102.0/audio-player', replacement: audioPlayerPublicEntry },
      { find: '@semi-v2.102.0/video-player', replacement: videoPlayerPublicEntry },
      { find: '@semi-v2.102.0/user-guide', replacement: userGuidePublicEntry },
      { find: '@semi-v2.102.0/json-viewer', replacement: jsonViewerPublicEntry },
      { find: '@semi-v2.102.0/ai-chat-input', replacement: aiChatInputPublicEntry },
      { find: '@semi-v2.102.0/ai-chat-dialogue', replacement: aiChatDialoguePublicEntry },
      { find: '@semi-v2.102.0/chat', replacement: chatPublicEntry },
      { find: '@semi-v2.102.0/markdown-render', replacement: markdownRenderPublicEntry },
      { find: '@semi-v2.102.0/sidebar', replacement: sidebarPublicEntry },
      {
        find: '@mdx-js/mdx',
        replacement: fileURLToPath(
          new URL(
            '../../packages/foundation-integration/node_modules/@mdx-js/mdx/index.js',
            import.meta.url,
          ),
        ),
      },
      {
        find: 'remark-gfm',
        replacement: fileURLToPath(
          new URL(
            '../../packages/foundation-integration/node_modules/remark-gfm/index.js',
            import.meta.url,
          ),
        ),
      },
      {
        find: /^@tiptap\/(core|extension-document|extension-hard-break|extension-image|extension-paragraph|extension-text|extension-text-align|extension-text-style|extensions|pm(?:\/.+)?|react|starter-kit)$/,
        replacement: `${fileURLToPath(new URL('./node_modules/@tiptap', import.meta.url))}/$1`,
      },
      {
        find: 'prosemirror-state',
        replacement: fileURLToPath(
          new URL('./node_modules/prosemirror-state/dist/index.js', import.meta.url),
        ),
      },
      {
        find: 'prosemirror-model',
        replacement: fileURLToPath(
          new URL('./node_modules/prosemirror-model/dist/index.js', import.meta.url),
        ),
      },
      { find: '@semi-v2.102.0/locale-provider', replacement: localeProviderEntry },
      { find: '@semi-v2.102.0/locale-consumer', replacement: localeConsumerEntry },
      { find: '@semi-v2.102.0/locale-en-gb', replacement: localeEnGBEntry },
      { find: '@semi-v2.102.0/locale-ja-jp', replacement: localeJaJPEntry },
      { find: '@semi-v2.102.0/empty', replacement: emptyPublicEntry },
      { find: '@semi-v2.102.0/highlight', replacement: highlightPublicEntry },
      { find: '@semi-v2.102.0/image', replacement: imagePublicEntry },
      { find: '@semi-v2.102.0/list', replacement: listPublicEntry },
      { find: '@semi-v2.102.0/modal', replacement: modalPublicEntry },
      { find: '@semi-v2.102.0/overflow-list', replacement: overflowListPublicEntry },
      { find: '@semi-v2.102.0/popover', replacement: popoverPublicEntry },
      { find: '@semi-v2.102.0/popconfirm', replacement: popconfirmPublicEntry },
      { find: '@semi-v2.102.0/progress', replacement: progressPublicEntry },
      { find: '@semi-v2.102.0/skeleton', replacement: skeletonPublicEntry },
      { find: '@semi-v2.102.0/spin', replacement: spinPublicEntry },
      { find: '@semi-v2.102.0/transfer', replacement: transferPublicEntry },
      { find: '@semi-v2.102.0/upload', replacement: uploadPublicEntry },
      { find: '@semi-v2.102.0/navigation', replacement: navigationPublicEntry },
      { find: '@semi-v2.102.0/toast', replacement: toastPublicEntry },
      { find: '@semi-v2.102.0/scroll-list', replacement: scrollListPublicEntry },
      { find: '@semi-v2.102.0/scroll-item', replacement: scrollItemPublicEntry },
      { find: '@semi-v2.102.0/side-sheet', replacement: sideSheetPublicEntry },
      { find: '@semi-v2.102.0/table', replacement: tablePublicEntry },
      { find: '@semi-v2.102.0/tag', replacement: tagPublicEntry },
      { find: '@semi-v2.102.0/tag-group', replacement: tagGroupEntry },
      { find: '@semi-v2.102.0/split-tag-group', replacement: splitTagGroupEntry },
      { find: '@semi-v2.102.0/timeline', replacement: timelinePublicEntry },
      { find: '@semi-v2.102.0/illustrations', replacement: illustrationsPublicEntry },
      { find: '@semi-v2.102.0/card-group', replacement: cardGroupEntry },
      { find: '@semi-v2.102.0/back-top', replacement: backTopPublicEntry },
      { find: '@semi-v2.102.0/breadcrumb', replacement: breadcrumbPublicEntry },
      { find: '@semi-v2.102.0/auto-complete', replacement: autoCompletePublicEntry },
      { find: '@semi-v2.102.0/button', replacement: buttonPublicEntry },
      { find: '@semi-v2.102.0/icon-button', replacement: iconButtonPublicEntry },
      { find: '@semi-v2.102.0/checkbox', replacement: checkboxPublicEntry },
      { find: '@semi-v2.102.0/config-provider', replacement: configProviderPublicEntry },
      { find: '@semi-v2.102.0/button-group', replacement: buttonGroupEntry },
      { find: '@semi-v2.102.0/split-button-group', replacement: splitButtonGroupEntry },
      { find: '@semi-v2.102.0/divider', replacement: dividerPublicEntry },
      { find: '@semi-v2.102.0/float-button', replacement: floatButtonPublicEntry },
      { find: '@semi-v2.102.0/float-button-group', replacement: floatButtonGroupEntry },
      { find: '@semi-v2.102.0/icon', replacement: iconPublicEntry },
      { find: '@semi-v2.102.0/input', replacement: inputPublicEntry },
      { find: '@semi-v2.102.0/input-number', replacement: inputNumberPublicEntry },
      { find: '@semi-v2.102.0/pin-code', replacement: pinCodePublicEntry },
      { find: '@semi-v2.102.0/pagination', replacement: paginationPublicEntry },
      { find: '@semi-v2.102.0/radio', replacement: radioPublicEntry },
      { find: '@semi-v2.102.0/rating', replacement: ratingPublicEntry },
      { find: '@semi-v2.102.0/input-group', replacement: inputGroupEntry },
      { find: '@semi-v2.102.0/textarea', replacement: textAreaEntry },
      { find: '@semi-v2.102.0/grid', replacement: gridPublicEntry },
      { find: '@semi-v2.102.0/layout', replacement: layoutPublicEntry },
      { find: '@semi-v2.102.0/resizable', replacement: resizablePublicEntry },
      { find: '@semi-v2.102.0/select', replacement: selectPublicEntry },
      { find: '@semi-v2.102.0/slider', replacement: sliderPublicEntry },
      { find: '@semi-v2.102.0/space', replacement: spacePublicEntry },
      { find: '@semi-v2.102.0/steps', replacement: stepsPublicEntry },
      { find: '@semi-v2.102.0/tabs', replacement: tabsPublicEntry },
      { find: '@semi-v2.102.0/tree', replacement: treePublicEntry },
      { find: '@semi-v2.102.0/tree-select', replacement: treeSelectPublicEntry },
      { find: '@semi-v2.102.0/cascader', replacement: cascaderPublicEntry },
      { find: '@semi-v2.102.0/switch', replacement: switchPublicEntry },
      { find: '@semi-v2.102.0/tag-input', replacement: tagInputPublicEntry },
      { find: '@semi-v2.102.0/time-picker', replacement: timePickerPublicEntry },
      { find: '@semi-v2.102.0/tooltip', replacement: tooltipPublicEntry },
      { find: '@semi-v2.102.0/typography', replacement: typographyPublicEntry },
      { find: '@semi-v2.102.0/icons', replacement: iconsEntry },
      { find: '@semi-v2.102.0/icons-lab', replacement: iconsLabEntry },
      {
        find: '../_sortable',
        replacement: fileURLToPath(new URL('./src/runtime/SemiSortable.tsx', import.meta.url)),
      },
      {
        find: /^@douyinfe\/semi-foundation\/(.+)$/,
        replacement: `${foundationRoot}/$1`,
      },
      { find: '@douyinfe/semi-animation', replacement: animationEntry },
      { find: '@douyinfe/semi-icons', replacement: iconsEntry },
      { find: '@douyinfe/semi-icons-lab', replacement: iconsLabEntry },
      {
        find: transferSortableEntry,
        replacement: fileURLToPath(new URL('./src/runtime/transferSortable.tsx', import.meta.url)),
      },
      {
        find: /^@dnd-kit\/sortable$/,
        replacement: fileURLToPath(new URL('./src/runtime/transferSortable.tsx', import.meta.url)),
      },
      {
        find: /^@dnd-kit\/core$/,
        replacement: fileURLToPath(new URL('./src/runtime/transferSortable.tsx', import.meta.url)),
      },
      {
        find: /^@dnd-kit\/utilities$/,
        replacement: fileURLToPath(new URL('./src/runtime/transferSortable.tsx', import.meta.url)),
      },
      {
        find: /^copy-text-to-clipboard$/,
        replacement: fileURLToPath(new URL('./src/runtime/copyText.ts', import.meta.url)),
      },
      {
        find: /^date-fns\/locale$/,
        replacement: fileURLToPath(new URL('./src/runtime/dateFnsLocale.ts', import.meta.url)),
      },
      { find: /^date-fns$/, replacement: require.resolve('date-fns') },
      { find: /^date-fns-tz$/, replacement: require.resolve('date-fns-tz') },
      { find: /^bezier-easing$/, replacement: require.resolve('bezier-easing') },
      {
        find: /^async-validator$/,
        replacement: path.join(
          workspaceRoot,
          'packages/ui/node_modules/async-validator/dist-web/index.js',
        ),
      },
      { find: /^classnames$/, replacement: require.resolve('classnames') },
      { find: /^lodash$/, replacement: require.resolve('lodash') },
      { find: /^prop-types$/, replacement: require.resolve('prop-types') },
      {
        find: /^memoize-one$/,
        replacement: fileURLToPath(new URL('./src/runtime/memoizeOne.ts', import.meta.url)),
      },
      {
        find: /^react-window$/,
        replacement: fileURLToPath(new URL('./src/runtime/reactWindow.tsx', import.meta.url)),
      },
      {
        find: /^react-resizable$/,
        replacement: fileURLToPath(new URL('./src/runtime/reactResizable.tsx', import.meta.url)),
      },
      {
        find: /^fast-copy$/,
        replacement: fileURLToPath(new URL('./src/runtime/fastCopy.ts', import.meta.url)),
      },
    ],
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: 4173,
    strictPort: true,
    fs: {
      allow: [workspaceRoot],
    },
  },
});
