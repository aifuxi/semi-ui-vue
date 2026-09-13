import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/CropperScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-cropper',
  title: 'Parity/cropper',
  parameters: { parityScenarioId: 'cropper' },
  render: renderScenario('cropper', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
