import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/FeedbackScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-feedback',
  title: 'Parity/feedback',
  parameters: { parityScenarioId: 'feedback' },
  render: renderScenario('feedback', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
