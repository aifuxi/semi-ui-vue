interface BodyScrollLock {
  owners: number;
  restore: (() => void) | undefined;
}

const locksByBody = new WeakMap<HTMLElement, BodyScrollLock>();

function lockBodyStyle(body: HTMLElement): (() => void) | undefined {
  const { documentElement, defaultView } = body.ownerDocument;
  const { style } = body;
  if (!defaultView || style.overflow === 'hidden') return;

  // 写入简写会覆盖独立声明的滚动轴，恢复时也需要保留各轴的优先级。
  const originalStyle = ['overflow', 'overflow-x', 'overflow-y', 'width'].map((name) => ({
    name,
    value: style.getPropertyValue(name),
    priority: style.getPropertyPriority(name),
  }));
  const scrollbarWidth = Math.max(0, defaultView.innerWidth - documentElement.clientWidth);
  style.overflow = 'hidden';
  style.width = `calc(${style.width || '100%'} - ${scrollbarWidth}px)`;

  return () => {
    for (const { name, value, priority } of originalStyle) {
      style.setProperty(name, value, priority);
    }
  };
}

function acquire(body: HTMLElement): void {
  const lock = locksByBody.get(body);
  if (lock) lock.owners += 1;
  else locksByBody.set(body, { owners: 1, restore: lockBodyStyle(body) });
}

function release(body: HTMLElement): void {
  const lock = locksByBody.get(body);
  if (!lock) return;
  lock.owners -= 1;
  if (lock.owners === 0) {
    lock.restore?.();
    locksByBody.delete(body);
  }
}

/** 每个弹层只持有实际 Portal 所在的 body 一次，退场重入不重复获取。 */
export function createBodyScrollLock() {
  let body: HTMLElement | null = null;

  return {
    setTarget(target: HTMLElement | null): void {
      const nextBody = target && target === target.ownerDocument.body ? target : null;
      if (body === nextBody) return;
      if (body) release(body);
      if (nextBody) acquire(nextBody);
      body = nextBody;
    },
  };
}
