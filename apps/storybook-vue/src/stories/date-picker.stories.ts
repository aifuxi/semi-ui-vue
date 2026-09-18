import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/DatePickerScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-date-picker',
  title: 'Parity/date-picker',
  parameters: { parityScenarioId: 'date-picker' },
  render: renderScenario('date-picker', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
