import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/DropdownScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-dropdown',
  title: 'Parity/dropdown',
  parameters: { parityScenarioId: 'dropdown' },
  render: renderScenario('dropdown', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
