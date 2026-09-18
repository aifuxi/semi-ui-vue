import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/DragMoveScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-drag-move',
  title: 'Parity/drag-move',
  parameters: { parityScenarioId: 'drag-move' },
  render: renderScenario('drag-move', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
