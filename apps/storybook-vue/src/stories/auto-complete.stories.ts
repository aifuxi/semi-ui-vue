import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/AutoCompleteScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-auto-complete',
  title: 'Parity/auto-complete',
  parameters: { parityScenarioId: 'auto-complete' },
  render: renderScenario('auto-complete', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
