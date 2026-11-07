import { Fragment, Text, h, isVNode, type Component, type VNodeChild } from 'vue';

export function getTypographyText(nodes: readonly VNodeChild[]): string {
  const visit = (node: VNodeChild): string => {
    if (node === null || node === undefined || typeof node === 'boolean') return '';
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(visit).join('');
    if (!isVNode(node)) return '';
    if (typeof node.children === 'string') return node.children;
    if (Array.isArray(node.children)) return node.children.map(visit).join('');
    return '';
  };
  return nodes.map(visit).join('');
}

export function formatTypographyNodes(
  nodes: readonly VNodeChild[],
  format: (content: string) => string,
): VNodeChild[] {
  const visit = (node: VNodeChild): VNodeChild => {
    if (typeof node === 'string' || typeof node === 'number') return format(String(node));
    if (Array.isArray(node)) return node.map(visit);
    if (!isVNode(node)) return node;
    if (node.type === Text && typeof node.children === 'string') {
      return h(Text, null, format(node.children));
    }
    if (node.type === Fragment && Array.isArray(node.children)) {
      return h(Fragment, null, node.children.map(visit));
    }
    if (typeof node.children === 'string') {
      return h(node.type as string | Component, node.props, format(node.children));
    }
    if (Array.isArray(node.children)) {
      return h(node.type as string | Component, node.props, node.children.map(visit));
    }
    return node;
  };
  return nodes.map(visit);
}

/** 读取浏览器计算样式中的像素数值，用于省略容器几何计算。 */
function numberFromPixelValue(value: string): number {
  if (!value) return 0;
  // 兼容整数与小数像素，缺少可解析数值时维持原有零值行为。
  const match = value.match(/^\d*(\.\d*)?/);
  return match ? Number(match[0]) : 0;
}

/** 将已解析的计算样式复制到 body 中的隔离测量容器。 */
function styleToString(style: CSSStyleDeclaration): string {
  return (
    Array.from(style)
      // 使用计算后的属性值，避免局部主题变量在 body 下重新解析。
      .map((name) => `${name}: ${style.getPropertyValue(name)};`)
      .join('')
  );
}

// 单次同步测量复用同一离屏节点，不为每个文本实例增加常驻节点。
let ellipsisContainer: HTMLElement | undefined;

/** 按真实排版和操作入口占位二分求取可显示文本，兼容末尾及中间省略。 */
export function measureTypographyEllipsis(
  originElement: HTMLElement,
  rows: number,
  content: string,
  fixedNodes: readonly Node[],
  suffix: string,
  position: 'end' | 'middle',
  strong: boolean,
): string {
  if (!content.length || typeof document === 'undefined') return content;
  ellipsisContainer ??= document.createElement('div');
  if (!ellipsisContainer.isConnected) {
    ellipsisContainer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ellipsisContainer);
  }

  // 计算样式已解析源主题的变量，复制后不会受 body 主题影响。
  const originStyle = window.getComputedStyle(originElement);
  ellipsisContainer.setAttribute('style', styleToString(originStyle));
  ellipsisContainer.style.position = 'fixed';
  ellipsisContainer.style.left = '0';
  // 延续固定基线的离屏位置与层级，不参与页面显示或交互。
  ellipsisContainer.style.top = '-999999px';
  ellipsisContainer.style.zIndex = '-1000';
  ellipsisContainer.style.height = 'auto';
  ellipsisContainer.style.textOverflow = 'clip';
  ellipsisContainer.style.webkitLineClamp = 'none';
  if (originStyle.width === 'auto' && originElement.offsetWidth) {
    ellipsisContainer.style.width = `${originElement.offsetWidth}px`;
  }
  if (strong) {
    // 强调字重可以由主题或业务 CSS 覆盖，不能固定按基线 600 测量。
    const strongElement = originElement.querySelector('strong') ?? originElement;
    ellipsisContainer.style.fontWeight = window.getComputedStyle(strongElement).fontWeight;
  }

  // 浏览器计算出的行高用于限定允许的行数。
  const lineHeight = numberFromPixelValue(originStyle.lineHeight);
  // 与固定 Foundation 相同：下一行的高度作为排他上限。
  const maxHeight = Math.round(
    lineHeight * (rows + 1) +
      numberFromPixelValue(originStyle.paddingTop) +
      numberFromPixelValue(originStyle.paddingBottom),
  );
  // 可变文本与后缀共同放入 holder，操作入口单独克隆。
  const holder = document.createElement('span');
  // 二分过程中只改文本节点，避免反复构建装饰结构。
  const textNode = document.createTextNode(content);
  holder.append(textNode);
  if (suffix) holder.append(document.createTextNode(suffix));

  /** 按测量阶段装入复制/展开节点，保留原算法的入口占位顺序。 */
  const reset = (includeAllFixedNodes: boolean) => {
    ellipsisContainer!.replaceChildren(holder);
    for (const node of includeAllFixedNodes ? fixedNodes : fixedNodes.slice(1)) {
      if (node) ellipsisContainer!.append(node.cloneNode(true));
    }
  };
  /** 单行同时检查宽高，多行以总高度判断是否溢出。 */
  const inRange = () => {
    // scrollWidth 包含文本和固定入口的横向占位。
    const widthInRange = ellipsisContainer!.scrollWidth <= ellipsisContainer!.offsetWidth;
    // 使用排他上限，避免刚进入下一行的文本被误判为可容纳。
    const heightInRange = ellipsisContainer!.scrollHeight < maxHeight;
    return rows === 1 ? widthInRange && heightInRange : heightInRange;
  };
  /** 构造末尾省略或对称的中间省略文本。 */
  const getText = (length: number) => {
    if (!length) return '...';
    return position === 'end'
      ? `${content.slice(0, length)}...`
      : `${content.slice(0, length)}...${content.slice(content.length - length)}`;
  };

  reset(false);
  if (inRange()) {
    ellipsisContainer.replaceChildren();
    return content;
  }
  reset(true);
  /** 二分缩小候选长度，最后逐项确认临界长度以保留基线截断语义。 */
  const measureText = (start: number, end: number): string => {
    // 向下取整保证每次搜索范围收敛。
    const middle = Math.floor((start + end) / 2);
    // 当前候选直接写入离屏节点以触发真实浏览器测量。
    const candidate = getText(middle);
    textNode.textContent = candidate;

    if (start >= end - 1 && end > 0) {
      for (let step = end; step >= start; step -= 1) {
        // 最后两个边界按从长到短尝试，取第一个可容纳结果。
        const stepCandidate = getText(step);
        textNode.textContent = stepCandidate;
        if (inRange()) return stepCandidate;
      }
    } else if (end === 0) {
      return '...';
    }

    return inRange() ? measureText(middle, end) : measureText(start, middle);
  };
  // 中间省略同时保留首尾，所以单侧搜索长度为总长度的一半。
  const answer = measureText(
    0,
    position === 'middle' ? Math.floor(content.length / 2) : content.length,
  );
  ellipsisContainer.replaceChildren();
  return answer;
}
