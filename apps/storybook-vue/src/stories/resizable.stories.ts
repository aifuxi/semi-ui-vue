import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/ResizableScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-resizable',
  title: 'Parity/resizable',
  parameters: { parityScenarioId: 'resizable' },
  render: renderScenario('resizable', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
