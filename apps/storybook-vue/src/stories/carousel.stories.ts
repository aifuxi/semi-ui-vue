import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/CarouselScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-carousel',
  title: 'Parity/carousel',
  parameters: { parityScenarioId: 'carousel' },
  render: renderScenario('carousel', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
