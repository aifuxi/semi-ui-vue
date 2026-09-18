import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/AIChatDialogueScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-ai-chat-dialogue',
  title: 'Parity/ai-chat-dialogue',
  parameters: { parityScenarioId: 'ai-chat-dialogue' },
  render: renderScenario('ai-chat-dialogue', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
