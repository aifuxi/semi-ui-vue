import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/ToastScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-toast',
  title: 'Parity/toast',
  parameters: { parityScenarioId: 'toast' },
  render: renderScenario('toast', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
