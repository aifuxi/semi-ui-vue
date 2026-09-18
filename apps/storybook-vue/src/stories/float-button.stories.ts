import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/FloatButtonScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-float-button',
  title: 'Parity/float-button',
  parameters: { parityScenarioId: 'float-button' },
  render: renderScenario('float-button', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
