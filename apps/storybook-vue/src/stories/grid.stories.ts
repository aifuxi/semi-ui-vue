import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/GridScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-grid',
  title: 'Parity/grid',
  parameters: { parityScenarioId: 'grid' },
  render: renderScenario('grid', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
