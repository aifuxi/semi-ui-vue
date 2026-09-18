import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/BackTopScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-back-top',
  title: 'Parity/back-top',
  parameters: { parityScenarioId: 'back-top' },
  render: renderScenario('back-top', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
