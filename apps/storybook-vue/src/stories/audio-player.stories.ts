import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/AudioPlayerScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-audio-player',
  title: 'Parity/audio-player',
  parameters: { parityScenarioId: 'audio-player' },
  render: renderScenario('audio-player', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
