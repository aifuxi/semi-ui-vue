import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/ButtonTypesScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-button-types',
  title: 'Parity/button-types',
  parameters: { parityScenarioId: 'button-types' },
  render: renderScenario('button-types', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
