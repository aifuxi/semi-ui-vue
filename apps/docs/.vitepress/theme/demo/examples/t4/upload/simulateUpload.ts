import { onBeforeUnmount } from 'vue';
import type { UploadCustomRequestArgs, UploadFileItem } from '@aifuxi/semi-ui-vue/upload';

/** Local-only request: keep progress visible and release timers when a demo unmounts. */
export function useUploadSimulation(delay = 150) {
  const timers = new Set<ReturnType<typeof setInterval>>();
  onBeforeUnmount(() => {
    for (const timer of timers) clearInterval(timer);
    timers.clear();
  });
  return ({ onProgress, onSuccess }: UploadCustomRequestArgs) => {
    let loaded = 0;
    const timer = setInterval(() => {
      if (loaded === 100) {
        clearInterval(timer);
        timers.delete(timer);
        onSuccess({ status_code: 200, demonstration: true });
        return;
      }
      onProgress({ total: 100, loaded });
      loaded += 20;
    }, delay);
    timers.add(timer);
  };
}

export function imageFiles(count = 1): UploadFileItem[] {
  return Array.from({ length: count }, (_, index) => ({
    uid: String(index + 1),
    name: index ? 'second.png' : 'first.png',
    status: 'success',
    size: index ? '222KB' : '130KB',
    preview: true,
    url: index ? '/demos/two.svg' : '/demos/one.svg',
  }));
}

export function documentFiles(): UploadFileItem[] {
  return [
    { uid: '1', name: 'document.pdf', status: 'success', size: '130KB' },
    { uid: '2', name: 'report.xlsx', status: 'success', size: '222KB' },
  ];
}
