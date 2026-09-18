import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/ColorPickerScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-color-picker',
  title: 'Parity/color-picker',
  parameters: { parityScenarioId: 'color-picker' },
  render: renderScenario('color-picker', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
