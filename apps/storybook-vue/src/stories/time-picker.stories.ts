import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/TimePickerScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-time-picker',
  title: 'Parity/time-picker',
  parameters: { parityScenarioId: 'time-picker' },
  render: renderScenario('time-picker', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
