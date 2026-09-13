import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/TableScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-table',
  title: 'Parity/table',
  parameters: { parityScenarioId: 'table' },
  render: renderScenario('table', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
