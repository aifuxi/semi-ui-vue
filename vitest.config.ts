import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';
import type { Plugin } from 'vite';
import { adaptPinnedJsonViewerCore } from './packages/foundation-integration/vite-json-viewer-plugin.js';

function resolveSemiUiVueComponentSubpaths(): Plugin {
  return {
    name: 'resolve-semi-ui-vue-component-subpaths',
    enforce: 'pre',
    resolveId(source) {
      if (source === '@aifuxi/semi-ui-vue') {
        return fileURLToPath(new URL('./packages/ui/src/index.ts', import.meta.url));
      }
      const component = source.match(/^@aifuxi\/semi-ui-vue\/([^/]+)$/)?.[1];
      return component
        ? fileURLToPath(new URL(`./packages/ui/src/${component}/index.ts`, import.meta.url))
        : null;
    },
  };
}

export default defineConfig({
  plugins: [resolveSemiUiVueComponentSubpaths(), adaptPinnedJsonViewerCore(), vue(), react()],
  resolve: {
    alias: {
      '@aifuxi/semi-ui-vue/locale/source/en_GB': fileURLToPath(
        new URL('./packages/ui/src/locale/source/en_GB.ts', import.meta.url),
      ),
      '@aifuxi/semi-ui-vue/locale/source/ja_JP': fileURLToPath(
        new URL('./packages/ui/src/locale/source/ja_JP.ts', import.meta.url),
      ),
      '@aifuxi/semi-icons-vue': fileURLToPath(
        new URL('./packages/icons/src/index.ts', import.meta.url),
      ),
      '@aifuxi/semi-icons-lab-vue': fileURLToPath(
        new URL('./packages/icons-lab/src/index.ts', import.meta.url),
      ),
      '@aifuxi/semi-illustrations-vue': fileURLToPath(
        new URL('./packages/illustrations/src/index.ts', import.meta.url),
        new URL('./vendor/semi-design/packages/semi-animation/index.ts', import.meta.url),
      ),
      'bezier-easing': fileURLToPath(
        new URL('./packages/ui/node_modules/bezier-easing/src/index.js', import.meta.url),
      ),
      'async-validator': fileURLToPath(
        new URL('./packages/ui/node_modules/async-validator/dist-web/index.js', import.meta.url),
      ),
      'fast-copy': fileURLToPath(
        new URL('./packages/foundation-integration/src/fast-copy.js', import.meta.url),
      ),
      'lottie-web': fileURLToPath(new URL('./packages/ui/src/test/lottieWeb.ts', import.meta.url)),
      '@semi-v2.102.0/anchor': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiAnchorStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/avatar': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiAvatarStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/avatar-group': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiAvatarGroupStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/badge': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiBadgeStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/banner': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiBannerStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/feedback': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiFeedbackStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/notification': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiNotificationStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/calendar': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiCalendarStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/card': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiCardStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/carousel': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiCarouselStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/collapse': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiCollapseStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/code-highlight': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiCodeHighlightStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/collapsible': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiCollapsibleStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/color-picker': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiColorPickerStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/date-picker': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiDatePickerStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/form': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiFormStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/cropper': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiCropperStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/descriptions': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiDescriptionsStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/dropdown': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiDropdownStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/drag-move': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiDragMoveStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/hot-keys': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiHotKeysStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/lottie': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiLottieStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/audio-player': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiAudioPlayerStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/video-player': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiVideoPlayerStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/user-guide': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiUserGuideStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/json-viewer': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiJsonViewerStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/ai-chat-input': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiAIChatInputStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/ai-chat-dialogue': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiAIChatDialogueStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/chat': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiChatStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/markdown-render': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiMarkdownRenderStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/sidebar': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiSidebarStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/locale-provider': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiLocaleProviderStub.ts', import.meta.url),
      ),
      '@semi-v2.102.0/locale-consumer': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiLocaleConsumerStub.ts', import.meta.url),
      ),
      '@semi-v2.102.0/locale-en-gb': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiLocaleEnGBStub.ts', import.meta.url),
      ),
      '@semi-v2.102.0/locale-ja-jp': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiLocaleJaJPStub.ts', import.meta.url),
      ),
      '@semi-v2.102.0/empty': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiEmptyStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/highlight': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiHighlightStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/image': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiImageStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/list': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiListStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/modal': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiModalStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/overflow-list': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiOverflowListStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/popover': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiPopoverStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/popconfirm': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiPopconfirmStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/progress': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiProgressStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/skeleton': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiSkeletonStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/spin': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiSpinStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/transfer': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiTransferStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/upload': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiUploadStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/navigation': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiNavigationStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/tree-select': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiTreeSelectStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/cascader': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiCascaderStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/toast': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiToastStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/scroll-list': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiScrollListStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/scroll-item': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiScrollItemStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/side-sheet': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiSideSheetStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/table': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiTableStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/tag': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiTagStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/tag-group': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiTagGroupStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/split-tag-group': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiSplitTagGroupStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/timeline': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiTimelineStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/illustrations': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiIllustrationsStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/card-group': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiCardGroupStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/back-top': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiBackTopStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/breadcrumb': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiBreadcrumbStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/auto-complete': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiAutoCompleteStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/button-group': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiButtonGroupStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/split-button-group': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiSplitButtonGroupStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/button': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiButtonStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/icon-button': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiIconButtonStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/checkbox': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiCheckboxStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/config-provider': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiConfigProviderStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/divider': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiDividerStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/float-button': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiFloatButtonStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/float-button-group': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiFloatButtonGroupStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/icon': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiIconStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/input': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiInputStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/input-number': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiInputNumberStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/pin-code': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiPinCodeStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/pagination': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiPaginationStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/radio': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiRadioStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/rating': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiRatingStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/slider': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiSliderStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/input-group': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiInputGroupStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/textarea': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiTextAreaStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/grid': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiGridStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/layout': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiLayoutStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/resizable': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiResizableStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/select': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiSelectStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/icons': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiIconsStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/icons-lab': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiIconsLabStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/space': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiSpaceStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/steps': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiStepsStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/tabs': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiTabsStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/tree': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiTreeStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/switch': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiSwitchStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/tag-input': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiTagInputStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/time-picker': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiTimePickerStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/tooltip': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiTooltipStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/typography': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiTypographyStub.tsx', import.meta.url),
      ),
    },
    dedupe: ['vue'],
  },
  test: {
    environment: 'jsdom',
    include: [
      'scripts/**/*.{test,spec}.mjs',
      'packages/*/src/**/*.{test,spec}.ts',
      'apps/parity-vue/src/**/*.{test,spec}.ts',
      'apps/docs/src/**/*.{test,spec}.ts',
      'apps/reference-react/src/**/*.{test,spec}.{ts,tsx}',
    ],
    exclude: ['vendor/**', '**/dist/**', 'tests/browser/**'],
    coverage: {
      provider: 'v8',
      include: ['packages/*/src/**/*.{ts,tsx,vue}'],
      exclude: [
        'vendor/**',
        '**/dist/**',
        // Exempted files: template-only SFCs, type-only exports, and internal helpers
        // exercised through parity/browser tests but not directly unit-tested.
        'packages/ui/src/select/SelectOption.vue',
        'packages/ui/src/select/SelectOptionGroup.vue',
        'packages/ui/src/tag-input/types.ts',
        'packages/ui/src/ai-chat-dialogue/AIChatDialogueCode.ts',
        'packages/ui/src/ai-chat-input/AIChatInputConfigureRadioButton.vue',
        'packages/ui/src/ai-chat-input/AIChatInputConfigureSelect.vue',
        'packages/ui/src/ai-chat-input/InputSlotNodeView.vue',
        'packages/ui/src/ai-chat-input/SelectSlotNodeView.vue',
        'packages/ui/src/form/FormInputGroup.ts',
        'packages/ui/src/form/FormSlot.ts',
        'packages/ui/src/form/with-form.ts',
        'packages/ui/src/navigation/NavigationIconRenderer.ts',
        'packages/ui/src/sidebar/SidebarAnnotation.vue',
        'packages/ui/src/sidebar/SidebarFileContent.vue',
        'packages/ui/src/sidebar/SidebarImageUploadNodeView.vue',
        'packages/ui/src/sidebar/SidebarMCPConfigure.vue',
      ],
      thresholds: {
        perFile: true,
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
});
