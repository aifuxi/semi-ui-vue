import type { LayoutBreakpoint } from './types';

export type LayoutMediaQueryHandler = (screen: LayoutBreakpoint, matches: boolean) => void;

let nextLayoutSiderId = 1;

export function generateLayoutSiderId(): string {
  const id = `semi-layout-sider-${nextLayoutSiderId}`;
  nextLayoutSiderId += 1;
  return id;
}

export function registerLayoutMediaQuery(
  screen: LayoutBreakpoint,
  media: string,
  handler: LayoutMediaQueryHandler,
): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => undefined;
  }

  const mediaQueryList = window.matchMedia(media);
  const handleChange = (event: MediaQueryList | MediaQueryListEvent): void => {
    handler(screen, event.matches);
  };

  handleChange(mediaQueryList);
  if (typeof mediaQueryList.addEventListener === 'function') {
    mediaQueryList.addEventListener('change', handleChange);
    return () => mediaQueryList.removeEventListener('change', handleChange);
  }

  mediaQueryList.addListener(handleChange);
  return () => mediaQueryList.removeListener(handleChange);
}
