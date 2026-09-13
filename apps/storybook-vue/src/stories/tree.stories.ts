import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/TreeScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-tree',
  title: 'Parity/tree',
  parameters: { parityScenarioId: 'tree' },
  render: renderScenario('tree', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
