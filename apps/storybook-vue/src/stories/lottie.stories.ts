import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/LottieScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-lottie',
  title: 'Parity/lottie',
  parameters: { parityScenarioId: 'lottie' },
  render: renderScenario('lottie', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
