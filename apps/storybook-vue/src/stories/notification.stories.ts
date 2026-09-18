import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/NotificationScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-notification',
  title: 'Parity/notification',
  parameters: { parityScenarioId: 'notification' },
  render: renderScenario('notification', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
