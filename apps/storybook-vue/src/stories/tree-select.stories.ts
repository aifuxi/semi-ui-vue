import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/TreeSelectScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-tree-select',
  title: 'Parity/tree-select',
  parameters: { parityScenarioId: 'tree-select' },
  render: renderScenario('tree-select', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
