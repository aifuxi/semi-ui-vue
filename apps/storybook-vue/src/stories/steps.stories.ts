import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/StepsScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-steps',
  title: 'Parity/steps',
  parameters: { parityScenarioId: 'steps' },
  render: renderScenario('steps', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
