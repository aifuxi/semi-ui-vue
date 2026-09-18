import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/RadioScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-radio',
  title: 'Parity/radio',
  parameters: { parityScenarioId: 'radio' },
  render: renderScenario('radio', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
