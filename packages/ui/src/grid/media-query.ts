export type GridMediaQueryHandler = (matches: boolean) => void;

export function registerGridMediaQuery(media: string, handler: GridMediaQueryHandler): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => undefined;
  }

  const mediaQueryList = window.matchMedia(media);
  const handleChange = (event: MediaQueryList | MediaQueryListEvent): void => {
    handler(event.matches);
  };

  handleChange(mediaQueryList);
  if (typeof mediaQueryList.addEventListener === 'function') {
    mediaQueryList.addEventListener('change', handleChange);
    return () => mediaQueryList.removeEventListener('change', handleChange);
  }

  mediaQueryList.addListener(handleChange);
  return () => mediaQueryList.removeListener(handleChange);
}
