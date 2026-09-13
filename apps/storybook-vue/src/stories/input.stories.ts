import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/InputScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-input',
  title: 'Parity/input',
  parameters: { parityScenarioId: 'input' },
  render: renderScenario('input', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
