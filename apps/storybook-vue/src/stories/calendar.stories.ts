import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/CalendarScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-calendar',
  title: 'Parity/calendar',
  parameters: { parityScenarioId: 'calendar' },
  render: renderScenario('calendar', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
