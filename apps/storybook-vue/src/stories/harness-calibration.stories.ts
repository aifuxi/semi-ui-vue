import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/HarnessCalibration.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-harness-calibration',
  title: 'Parity/harness-calibration',
  parameters: { parityScenarioId: 'harness-calibration' },
  render: renderScenario('harness-calibration', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
