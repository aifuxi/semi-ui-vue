import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/HighlightScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-highlight',
  title: 'Parity/highlight',
  parameters: { parityScenarioId: 'highlight' },
  render: renderScenario('highlight', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
