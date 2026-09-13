import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/IllustrationsScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-illustrations',
  title: 'Parity/illustrations',
  parameters: { parityScenarioId: 'illustrations' },
  render: renderScenario('illustrations', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
