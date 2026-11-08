/** 同一文档内可见 Modal 的键盘与焦点所有者，不跨越其他组件的弹层边界。 */
interface ModalLayer {
  element: HTMLElement;
  zIndex: () => number;
  onKeyDown: (event: KeyboardEvent) => void;
}

/** 按文档隔离注册表；模块导入时不读取 DOM，保留 SSR-safe import。 */
const layersByDocument = new WeakMap<Document, Set<ModalLayer>>();

/** 根据公开 zIndex 及相同层级的实际 DOM 绘制顺序找出顶层。 */
export function getTopModalLayer(document: Document): ModalLayer | undefined {
  let top: ModalLayer | undefined;
  for (const layer of layersByDocument.get(document) ?? []) {
    if (!layer.element.isConnected) continue;
    if (
      !top ||
      layer.zIndex() > top.zIndex() ||
      (layer.zIndex() === top.zIndex() &&
        // DOCUMENT_POSITION_FOLLOWING=4，避免在模块作用域引用浏览器 Node 全局。
        Boolean(top.element.compareDocumentPosition(layer.element) & 4))
    ) {
      top = layer;
    }
  }
  return top;
}

/** 每个文档只安装一个监听器，一次事件只交给事件开始时的顶层 Foundation。 */
export function registerModalLayer(layer: ModalLayer): () => void {
  /** 以实际 dialog 所在文档管理监听，允许多个独立 Vue app 共享同一层级。 */
  const document = layer.element.ownerDocument;
  let layers = layersByDocument.get(document);
  if (!layers) {
    layers = new Set();
    layersByDocument.set(document, layers);
    document.addEventListener('keydown', dispatchKeyDown);
  }
  layers.add(layer);
  // 最后一层退出后释放共享监听器，keepDOM 隐藏实例不保留键盘所有权。
  return () => {
    layers.delete(layer);
    if (layers.size === 0) {
      document.removeEventListener('keydown', dispatchKeyDown);
      layersByDocument.delete(document);
    }
  };
}

/** 不广播给底层；closeOnEsc=false 的顶层仍阻止 Escape 穿透。 */
function dispatchKeyDown(event: KeyboardEvent): void {
  getTopModalLayer(event.currentTarget as Document)?.onKeyDown(event);
}
