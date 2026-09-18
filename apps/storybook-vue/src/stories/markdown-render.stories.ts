import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/MarkdownRenderScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-markdown-render',
  title: 'Parity/markdown-render',
  parameters: { parityScenarioId: 'markdown-render' },
  render: renderScenario('markdown-render', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
