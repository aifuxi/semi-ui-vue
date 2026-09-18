import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/ChatScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-chat',
  title: 'Parity/chat',
  parameters: { parityScenarioId: 'chat' },
  render: renderScenario('chat', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
