import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/SideSheetScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-side-sheet',
  title: 'Parity/side-sheet',
  parameters: { parityScenarioId: 'side-sheet' },
  render: renderScenario('side-sheet', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
