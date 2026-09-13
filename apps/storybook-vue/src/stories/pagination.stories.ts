import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/PaginationScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-pagination',
  title: 'Parity/pagination',
  parameters: { parityScenarioId: 'pagination' },
  render: renderScenario('pagination', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
