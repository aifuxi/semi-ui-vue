import { computed, nextTick, onBeforeUnmount, shallowRef, type CSSProperties, type Ref } from 'vue';
import type { FlatTableRecord } from './table-utils';
import type { TableDirection, TableRowKey, TableVirtualizedListRef } from './types';

export interface VirtualTableRow extends FlatTableRecord<Record<string, unknown>> {
  expandedRow?: boolean;
  sourceKey?: TableRowKey;
}

interface Options {
  rows: Ref<VirtualTableRow[]>;
  body: Readonly<Ref<HTMLElement | null>>;
  viewport: Readonly<Ref<number>>;
  width: Readonly<Ref<number>>;
  direction: Readonly<Ref<TableDirection>>;
  overscan: () => number;
  estimate: () => number;
  itemSize: (index: number, row: VirtualTableRow) => number;
  onScroll: (offset: number, direction: 'forward' | 'backward', requested: boolean) => void;
}

// Vue implementation of the pinned VariableSizeList's measured prefix and
// estimated suffix. Offsets use each row's own size, including group/expanded rows.
export function useTableVirtualization(options: Options) {
  const offset = shallowRef(0);
  const scrolling = shallowRef(false);
  const scrollDirection = shallowRef<'forward' | 'backward'>('forward');
  const revision = shallowRef(0);
  const measured: Array<{ top: number; height: number }> = [];
  let scrollTimer: ReturnType<typeof setTimeout> | undefined;
  let scrollRequest = 0;
  let disposed = false;

  function metadata(index: number) {
    for (let i = measured.length; i <= index; i++) {
      const previous = measured[i - 1];
      const row = options.rows.value[i]!;
      measured.push({
        top: previous ? previous.top + previous.height : 0,
        height: options.itemSize(i, row),
      });
    }
    return measured[index]!;
  }

  function totalHeight() {
    const count = options.rows.value.length;
    // Filtering only limits the current extent. The pinned list retains measured
    // offsets for records that return when the filter is cleared.
    const measuredCount = Math.min(measured.length, count);
    const last = measured[measuredCount - 1];
    return (last ? last.top + last.height : 0) + (count - measuredCount) * options.estimate();
  }

  function findStart() {
    const count = options.rows.value.length;
    if (!count) return 0;
    let low = 0;
    let high = Math.min(measured.length - 1, count - 1);
    if (high < 0 || metadata(high).top < offset.value) {
      low = Math.max(0, high);
      let step = 1;
      high = low;
      while (high < count && metadata(high).top < offset.value) {
        high += step;
        step *= 2;
      }
      low = Math.floor(high / 2);
      high = Math.min(count - 1, high);
    }
    while (low <= high) {
      const middle = Math.floor((low + high) / 2);
      const top = metadata(middle).top;
      if (top === offset.value) return middle;
      if (top < offset.value) low = middle + 1;
      else high = middle - 1;
    }
    return Math.max(0, low - 1);
  }

  const window = computed(() => {
    void revision.value;
    const rows = options.rows.value;
    if (!rows.length) return { rows: [], styles: new Map<TableRowKey, CSSProperties>(), height: 0 };
    const visibleStart = findStart();
    let visibleEnd = visibleStart;
    let bottom = metadata(visibleEnd).top + metadata(visibleEnd).height;
    while (visibleEnd < rows.length - 1 && bottom < offset.value + options.viewport.value) {
      visibleEnd++;
      bottom += metadata(visibleEnd).height;
    }
    const overscan = Math.max(1, options.overscan());
    const before = !scrolling.value || scrollDirection.value === 'backward' ? overscan : 1;
    const after = !scrolling.value || scrollDirection.value === 'forward' ? overscan : 1;
    const start = Math.max(0, visibleStart - before);
    const end = Math.min(rows.length - 1, visibleEnd + after);
    const styles = new Map<TableRowKey, CSSProperties>();
    for (let index = start; index <= end; index++) {
      const size = metadata(index);
      styles.set(rows[index]!.key, {
        position: 'absolute',
        [options.direction.value === 'rtl' ? 'right' : 'left']: '0px',
        top: `${size.top}px`,
        height: `${size.height}px`,
        width: `${options.width.value}px`,
      });
    }
    return { rows: rows.slice(start, end + 1), styles, height: totalHeight() };
  });

  function finishScroll() {
    if (scrollTimer !== undefined) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      scrollTimer = undefined;
      scrolling.value = false;
    }, 150);
  }

  function setOffset(value: number, requested: boolean) {
    const next = Math.max(0, value);
    if (disposed || next === offset.value) return false;
    scrollDirection.value = offset.value < next ? 'forward' : 'backward';
    offset.value = next;
    if (!requested) scrolling.value = true;
    finishScroll();
    if (!requested) {
      scrollRequest++;
      options.onScroll(next, scrollDirection.value, false);
    }
    return true;
  }

  const listRef: TableVirtualizedListRef = {
    scrollTo(value) {
      if (!setOffset(value, true)) return;
      const request = ++scrollRequest;
      // Newly measured rows can increase the scroll extent. Like the pinned
      // list's componentDidUpdate, write only after that extent reaches the DOM.
      void nextTick(() => {
        if (disposed || request !== scrollRequest || !options.body.value) return;
        options.body.value.scrollTop = offset.value;
        options.onScroll(offset.value, scrollDirection.value, true);
      });
    },
    scrollToItem(requestedIndex, align = 'auto') {
      if (disposed || !options.rows.value.length) return;
      const index = Math.max(0, Math.min(requestedIndex, options.rows.value.length - 1));
      const size = metadata(index);
      const viewport = options.viewport.value;
      const body = options.body.value;
      const scrollbar =
        body && body.scrollWidth > body.clientWidth
          ? Math.max(0, body.offsetHeight - body.clientHeight)
          : 0;
      const max = Math.max(0, Math.min(totalHeight() - viewport, size.top));
      const min = Math.max(0, size.top - viewport + size.height + scrollbar);
      const resolved =
        align === 'smart'
          ? offset.value >= min - viewport && offset.value <= max + viewport
            ? 'auto'
            : 'center'
          : align;
      const target =
        resolved === 'start'
          ? max
          : resolved === 'end'
            ? min
            : resolved === 'center'
              ? Math.round(min + (max - min) / 2)
              : offset.value >= min && offset.value <= max
                ? offset.value
                : offset.value < min
                  ? min
                  : max;
      listRef.scrollTo(target);
    },
    resetAfterIndex(index, shouldForceUpdate = true) {
      if (disposed) return;
      measured.length = Math.max(0, Math.min(measured.length, index));
      if (shouldForceUpdate) revision.value++;
    },
  };

  function onNativeScroll(element: HTMLElement) {
    if (element.scrollTop === offset.value) return;
    setOffset(
      Math.max(0, Math.min(element.scrollTop, element.scrollHeight - element.clientHeight)),
      false,
    );
  }

  onBeforeUnmount(() => {
    disposed = true;
    scrollRequest++;
    if (scrollTimer !== undefined) clearTimeout(scrollTimer);
  });

  return { window, scrolling, offset, listRef, onNativeScroll };
}
