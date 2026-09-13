import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/SidebarScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-sidebar',
  title: 'Parity/sidebar',
  parameters: { parityScenarioId: 'sidebar' },
  render: renderScenario('sidebar', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
