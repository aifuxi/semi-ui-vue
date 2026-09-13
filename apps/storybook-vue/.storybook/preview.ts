import type { Preview } from '@storybook/vue3-vite';
import { h } from 'vue';
import { isParityScenarioId } from '@workspace/test-infra';
import ScenarioFrame from '../src/ScenarioFrame.vue';
import { scenarioOptions } from '../src/scenario-context';
import '../src/preview-styles';

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
  globalTypes: {
    theme: {
      description: 'Semi theme',
      toolbar: { title: 'Theme', items: ['light', 'dark'], dynamicTitle: true },
    },
    direction: {
      description: 'Document and component direction',
      toolbar: { title: 'Direction', items: ['ltr', 'rtl'], dynamicTitle: true },
    },
    locale: {
      description: 'Scenario locale',
      toolbar: { title: 'Locale', items: ['zh-CN', 'en-US'], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'light', direction: 'ltr', locale: 'zh-CN' },
  loaders: [
    async () => {
      // Load fonts before mounting geometry-sensitive components. With an empty
      // iframe, fonts.ready alone can resolve before the first font is requested.
      await Promise.all(
        [400, 500, 600, 700].map((weight) => document.fonts.load(`${weight} 14px Inter`)),
      );
      await document.fonts.ready;
      return {};
    },
  ],
  decorators: [
    (story, context) => {
      const scenarioId: unknown = context.parameters.parityScenarioId;
      if (typeof scenarioId !== 'string' || !isParityScenarioId(scenarioId)) {
        throw new Error(`Story ${context.id} has no registered parity scenario`);
      }
      const options = scenarioOptions(scenarioId, context.globals);
      return {
        setup() {
          return () =>
            h(
              ScenarioFrame,
              {
                ...options,
                key: `${context.id}:${options.theme}:${options.direction}:${options.locale}`,
              },
              { default: () => h(story()) },
            );
        },
      };
    },
  ],
};

export default preview;
