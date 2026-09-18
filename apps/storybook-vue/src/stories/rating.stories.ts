import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/RatingScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-rating',
  title: 'Parity/rating',
  parameters: { parityScenarioId: 'rating' },
  render: renderScenario('rating', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
