import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/NavigationScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-navigation',
  title: 'Parity/navigation',
  parameters: { parityScenarioId: 'navigation' },
  render: renderScenario('navigation', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
