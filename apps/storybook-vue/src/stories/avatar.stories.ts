import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/AvatarScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-avatar',
  title: 'Parity/avatar',
  parameters: { parityScenarioId: 'avatar' },
  render: renderScenario('avatar', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
