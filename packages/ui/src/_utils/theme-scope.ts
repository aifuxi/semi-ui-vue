import { watch } from 'vue';

/** 主题属性、样式表和字体变化对排版测量产生的失效原因。 */
export type ThemeChangeReason = 'attributes' | 'stylesheet' | 'font';

/** 同一文档内共享观察器使用的订阅项。 */
interface ThemeSubscription {
  element: HTMLElement;
  callback: (reason: ThemeChangeReason) => void;
}

/** 共享文档观察器及其释放操作，避免每个文本组件观察整棵 DOM。 */
interface ThemeObserver {
  subscriptions: Set<ThemeSubscription>;
  reconnect: () => void;
  dispose: () => void;
}

/** 只有这些祖先属性会影响已声明的主题作用域或继承样式。 */
const THEME_ATTRIBUTES = ['class', 'style', 'theme-mode', 'data-semi-theme'];
/** 由各文档惰性创建，模块导入时不访问 DOM。 */
const themeObservers = new WeakMap<Document, ThemeObserver>();

/** 创建单个文档的共享主题观察器，不监视页面正文的子树内容。 */
function createThemeObserver(document: Document): ThemeObserver {
  /** 当前仍然挂载的订阅项。 */
  const subscriptions = new Set<ThemeSubscription>();
  /** 元素归属窗口；SSR 不会进入此创建路径。 */
  const view = document.defaultView!;
  /** 通知快照允许回调安全地取消自身订阅。 */
  const notify = (reason: ThemeChangeReason): void => {
    for (const subscription of [...subscriptions]) subscription.callback(reason);
  };
  /** 仅通知受该祖先属性或文档样式表影响的元素。 */
  const handleMutations = (records: MutationRecord[]): void => {
    /** head 中的样式文本、链接属性及节点增删都可能改变已有文本度量。 */
    const stylesheetChanged = records.some(
      /** 检查样式表所在 head 的变化。 */
      (record) => document.head?.contains(record.target),
    );
    if (stylesheetChanged) {
      notify('stylesheet');
      return;
    }
    for (const subscription of [...subscriptions]) {
      if (
        records.some(
          /** 只处理祖先属性，或实际移动当前元素/祖先的节点变更。 */
          (record) =>
            record.type === 'attributes'
              ? record.target.contains(subscription.element)
              : [...record.addedNodes, ...record.removedNodes].some(
                  /** body 新增无关弹层不会使其他订阅失效。 */
                  (node) => node.contains(subscription.element),
                ),
        )
      ) {
        subscription.callback('attributes');
      }
    }
    if (
      records.some(
        /** 节点重挂时重新收窄到最新的祖先链路。 */
        (record) => record.type === 'childList',
      )
    )
      reconnect();
  };
  /** 一个 observer 只订阅参与测量的元素祖先和 head。 */
  const observer = new view.MutationObserver(handleMutations);
  /** 外部样式表加载成功后，computed style 才能反映新字体设置。 */
  const handleLoad = (event: Event): void => {
    /** 捕获阶段可以收到不冒泡的 link load 事件。 */
    const target = event.target as Element | null;
    if (target?.nodeType === 1 && target.matches('link[rel~="stylesheet"]')) notify('stylesheet');
  };
  /** 字体名称不变而字形加载完成时，也必须强制使测量失效。 */
  const handleFonts = (): void => notify('font');
  /** 合并所有订阅的祖先节点，局部订阅不扩展为整页 subtree 观察。 */
  function reconnect(): void {
    /** 重建共享观察范围前先交付待处理变更，避免同 tick 新订阅吞掉主题变更。 */
    const pending = observer.takeRecords();
    if (pending.length) handleMutations(pending);
    observer.disconnect();
    /** 共享祖先只观察一次。 */
    const ancestors = new Set<Element>();
    for (const subscription of subscriptions) {
      /** 从组件本身开始，覆盖局部 class/style 和所有主题祖先。 */
      let ancestor: Element | null = subscription.element;
      while (ancestor) {
        ancestors.add(ancestor);
        ancestor = ancestor.parentElement;
      }
    }
    for (const ancestor of ancestors) {
      observer.observe(ancestor, {
        attributes: true,
        attributeFilter: THEME_ATTRIBUTES,
        childList: true,
      });
    }
    if (document.head) {
      observer.observe(document.head, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
        attributeFilter: [...THEME_ATTRIBUTES, 'href', 'rel', 'media', 'disabled'],
      });
    }
  }
  document.addEventListener('load', handleLoad, true);
  document.fonts?.addEventListener('loadingdone', handleFonts);
  void document.fonts?.ready.then(handleFonts);
  return {
    subscriptions,
    reconnect,
    /** 最后一个订阅退出时释放文档监听器。 */
    dispose(): void {
      observer.disconnect();
      document.removeEventListener('load', handleLoad, true);
      document.fonts?.removeEventListener('loadingdone', handleFonts);
    },
  };
}

/** 订阅元素本身、祖先主题属性、样式表及字体变化；返回幂等取消函数。 */
export function observeThemeChanges(
  element: HTMLElement,
  callback: (reason: ThemeChangeReason) => void,
): () => void {
  /** 使用元素归属文档，支持 iframe，且不在模块初始化时读取全局 document。 */
  const document = element.ownerDocument;
  /** 文档没有窗口时没有可观察的客户端排版。 */
  const view = document.defaultView;
  if (!view) {
    /** 无窗口文档的清理无需执行副作用。 */
    return () => undefined;
  }
  /** 同文档的所有组件共享祖先观察器与字体监听。 */
  const state = themeObservers.get(document) ?? createThemeObserver(document);
  themeObservers.set(document, state);
  /** 每次订阅单独记录，多个消费者可订阅同一元素。 */
  const subscription = { element, callback };
  state.subscriptions.add(subscription);
  state.reconnect();
  /** 移除订阅后重新收窄观察范围，不影响其他组件。 */
  return () => {
    if (!state.subscriptions.delete(subscription)) return;
    if (state.subscriptions.size) state.reconnect();
    else {
      state.dispose();
      themeObservers.delete(document);
    }
  };
}

/** 读取实际渲染排版，用于过滤与当前文本无关的祖先属性变化。 */
export function getTypographySignature(element: HTMLElement): string {
  /** Computed style 与真实字形排版使用同一窗口。 */
  const view = element.ownerDocument.defaultView;
  if (!view) return '';
  /** 字体与间距决定可容纳的字符数，行高决定多行裁切边界。 */
  const style = view.getComputedStyle(element);
  /** strong 的主题字重可以变化而不影响根元素字重。 */
  const strong = element.querySelector('strong');
  return JSON.stringify([
    style.fontFamily,
    style.fontSize,
    style.fontWeight,
    style.fontStyle,
    style.fontStretch,
    style.fontVariant,
    style.fontFeatureSettings,
    style.fontVariationSettings,
    style.lineHeight,
    style.letterSpacing,
    style.wordSpacing,
    strong ? view.getComputedStyle(strong).fontWeight : '',
  ]);
}

/** 识别共享排版变量及组件独立排版变量，不扩散颜色或布局变量。 */
function isTypographyToken(name: string): boolean {
  return name.startsWith('--semi-') && (name.includes('font-') || name.includes('line-height'));
}

/** 将默认 body Portal 接回声明位置的局部主题，释放时还原工具写入的属性。 */
export function mirrorThemeScope(source: HTMLElement, target: HTMLElement): () => void {
  /** 记录原始内联值和优先级，避免移除调用方已有样式。 */
  const originalStyles = new Map<string, [string, string]>();
  /** 工具只写最近一次实际存在的变量，主题取消时须移除旧覆盖。 */
  const writtenStyles = new Set<string>();
  /** 最后写入值用于清理时识别调用方后续自行覆盖的声明。 */
  const lastWrittenValues = new Map<string, string>();
  /** 作用域标记保留调用方原始属性。 */
  const originalScope = target.getAttribute('data-semi-theme');
  /** 写入前留存原始值，并避免相同声明引起重复 MutationObserver 通知。 */
  const writeStyle = (name: string, value: string): void => {
    if (!originalStyles.has(name)) {
      originalStyles.set(name, [
        target.style.getPropertyValue(name),
        target.style.getPropertyPriority(name),
      ]);
    }
    if (target.style.getPropertyValue(name) !== value) target.style.setProperty(name, value);
    lastWrittenValues.set(name, target.style.getPropertyValue(name));
    writtenStyles.add(name);
  };
  /** 恢复一个由镜像机制管理的声明。 */
  const restoreStyle = (name: string): void => {
    /** 写入路径保证原始值已被保存。 */
    const [value, priority] = originalStyles.get(name)!;
    if (
      target.style.getPropertyValue(name) === lastWrittenValues.get(name) &&
      !target.style.getPropertyPriority(name)
    ) {
      if (value) target.style.setProperty(name, value, priority);
      else target.style.removeProperty(name);
    }
    writtenStyles.delete(name);
    lastWrittenValues.delete(name);
  };
  /** 读取当前最近作用域，允许从嵌套局部主题退回外层或全局。 */
  const refresh = (): void => {
    /** 每次失效重新解析，支持动态移除 data-semi-theme 标记。 */
    const scope = source.closest<HTMLElement>('[data-semi-theme]');
    /** 此次需要继续保留的内联声明。 */
    const currentStyles = new Set<string>();
    if (scope && !scope.contains(target)) {
      /** 只把计算后的排版值跨 Portal 边界传递。 */
      const style = source.ownerDocument.defaultView!.getComputedStyle(scope);
      for (const name of Array.from(style)) {
        if (!isTypographyToken(name)) continue;
        writeStyle(name, style.getPropertyValue(name));
        currentStyles.add(name);
      }
      for (const name of ['font-family', 'font-weight']) {
        writeStyle(name, style.getPropertyValue(name));
        currentStyles.add(name);
      }
      /** 标记让嵌套 Portal 和主题选择器继续识别同一局部边界。 */
      const scopeName = scope.getAttribute('data-semi-theme')!;
      if (target.getAttribute('data-semi-theme') !== scopeName)
        target.setAttribute('data-semi-theme', scopeName);
    } else if (originalScope === null) target.removeAttribute('data-semi-theme');
    else target.setAttribute('data-semi-theme', originalScope);
    for (const name of [...writtenStyles]) {
      if (!currentStyles.has(name)) restoreStyle(name);
    }
  };
  refresh();
  /** 源祖先变化会更新镜像，但目标自身的样式写入不会反向触发源订阅。 */
  const unsubscribe = observeThemeChanges(source, refresh);
  /** 清理仅撤回本工具的修改，保留 z-index 等 Portal 本身的样式。 */
  return () => {
    unsubscribe();
    for (const name of [...writtenStyles]) restoreStyle(name);
    if (originalScope === null) target.removeAttribute('data-semi-theme');
    else target.setAttribute('data-semi-theme', originalScope);
  };
}

/** 为声明式 Teleport 绑定主题，容器切换及宿主卸载由 Vue watcher 清理旧订阅。 */
export function usePortalThemeScope(
  source: () => HTMLElement | null,
  target: () => HTMLElement | null,
  enabled: () => boolean,
): void {
  watch(
    [source, target, enabled],
    /** DOM 提交后再读取声明锚点，避免增加可见占位元素或影响 SSR 结构。 */
    ([sourceElement, targetElement, shouldMirror], _previous, onCleanup) => {
      if (sourceElement && targetElement && shouldMirror) {
        onCleanup(mirrorThemeScope(sourceElement, targetElement));
      }
    },
    { immediate: true, flush: 'post' },
  );
}
