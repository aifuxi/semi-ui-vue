import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/UploadScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-upload',
  title: 'Parity/upload',
  parameters: { parityScenarioId: 'upload' },
  render: renderScenario('upload', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
