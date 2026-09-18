import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/VideoPlayerScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-video-player',
  title: 'Parity/video-player',
  parameters: { parityScenarioId: 'video-player' },
  render: renderScenario('video-player', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
