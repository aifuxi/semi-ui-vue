import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/AIChatInputScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-ai-chat-input',
  title: 'Parity/ai-chat-input',
  parameters: { parityScenarioId: 'ai-chat-input' },
  render: renderScenario('ai-chat-input', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
