import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/ListScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-list',
  title: 'Parity/list',
  parameters: { parityScenarioId: 'list' },
  render: renderScenario('list', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
