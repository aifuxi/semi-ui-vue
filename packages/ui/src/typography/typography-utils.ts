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

function numberFromPixelValue(value: string): number {
  if (!value) return 0;
  const match = value.match(/^\d*(\.\d*)?/);
  return match ? Number(match[0]) : 0;
}

function styleToString(style: CSSStyleDeclaration): string {
  return Array.from(style)
    .map((name) => `${name}: ${style.getPropertyValue(name)};`)
    .join('');
}

let ellipsisContainer: HTMLElement | undefined;

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

  const originStyle = window.getComputedStyle(originElement);
  ellipsisContainer.setAttribute('style', styleToString(originStyle));
  ellipsisContainer.style.position = 'fixed';
  ellipsisContainer.style.left = '0';
  ellipsisContainer.style.top = '-999999px';
  ellipsisContainer.style.zIndex = '-1000';
  ellipsisContainer.style.height = 'auto';
  ellipsisContainer.style.textOverflow = 'clip';
  ellipsisContainer.style.webkitLineClamp = 'none';
  if (originStyle.width === 'auto' && originElement.offsetWidth) {
    ellipsisContainer.style.width = `${originElement.offsetWidth}px`;
  }
  if (strong) ellipsisContainer.style.fontWeight = '600';

  const lineHeight = numberFromPixelValue(originStyle.lineHeight);
  const maxHeight = Math.round(
    lineHeight * (rows + 1) +
      numberFromPixelValue(originStyle.paddingTop) +
      numberFromPixelValue(originStyle.paddingBottom),
  );
  const holder = document.createElement('span');
  const textNode = document.createTextNode(content);
  holder.append(textNode);
  if (suffix) holder.append(document.createTextNode(suffix));

  const reset = (includeAllFixedNodes: boolean) => {
    ellipsisContainer!.replaceChildren(holder);
    for (const node of includeAllFixedNodes ? fixedNodes : fixedNodes.slice(1)) {
      if (node) ellipsisContainer!.append(node.cloneNode(true));
    }
  };
  const inRange = () => {
    const widthInRange = ellipsisContainer!.scrollWidth <= ellipsisContainer!.offsetWidth;
    const heightInRange = ellipsisContainer!.scrollHeight < maxHeight;
    return rows === 1 ? widthInRange && heightInRange : heightInRange;
  };
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
  const measureText = (start: number, end: number): string => {
    const middle = Math.floor((start + end) / 2);
    const candidate = getText(middle);
    textNode.textContent = candidate;

    if (start >= end - 1 && end > 0) {
      for (let step = end; step >= start; step -= 1) {
        const stepCandidate = getText(step);
        textNode.textContent = stepCandidate;
        if (inRange()) return stepCandidate;
      }
    } else if (end === 0) {
      return '...';
    }

    return inRange() ? measureText(middle, end) : measureText(start, middle);
  };
  const answer = measureText(
    0,
    position === 'middle' ? Math.floor(content.length / 2) : content.length,
  );
  ellipsisContainer.replaceChildren();
  return answer;
}
