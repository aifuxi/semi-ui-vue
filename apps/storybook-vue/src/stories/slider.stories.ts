import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/SliderScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-slider',
  title: 'Parity/slider',
  parameters: { parityScenarioId: 'slider' },
  render: renderScenario('slider', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
