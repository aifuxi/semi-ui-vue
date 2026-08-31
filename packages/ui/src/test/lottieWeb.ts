import type { AnimationItem, LottiePlayer } from 'lottie-web';

const lottie = {
  loadAnimation(params: { container: Element }) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    params.container.append(svg);
    return {
      destroy: () => svg.remove(),
      goToAndStop: () => undefined,
    } as unknown as AnimationItem;
  },
} as LottiePlayer;

export default lottie;
