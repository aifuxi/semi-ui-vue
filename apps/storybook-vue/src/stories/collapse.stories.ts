import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/CollapseScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-collapse',
  title: 'Parity/collapse',
  parameters: { parityScenarioId: 'collapse' },
  render: renderScenario('collapse', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
