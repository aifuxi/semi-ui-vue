import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/LayoutScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-layout',
  title: 'Parity/layout',
  parameters: { parityScenarioId: 'layout' },
  render: renderScenario('layout', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
