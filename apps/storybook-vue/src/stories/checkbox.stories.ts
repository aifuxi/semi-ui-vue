import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/CheckboxScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-checkbox',
  title: 'Parity/checkbox',
  parameters: { parityScenarioId: 'checkbox' },
  render: renderScenario('checkbox', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
