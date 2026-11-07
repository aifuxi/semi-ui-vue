import { afterEach, describe, expect, it } from 'vitest';

import { measureTypographyEllipsis } from './typography-utils';

// 每个用例只移除自己创建的文本节点；测量器复用内部离屏容器。
const roots: HTMLElement[] = [];

/** 创建有确定排版的实际 DOM，验证测量器读取计算样式。 */
function createText(strongWeight?: string): HTMLSpanElement {
  // 正文与强调使用不同字重，避免只测到根节点样式。
  const root = document.createElement('span');
  root.style.cssText = 'font-size:14px;line-height:20px;font-weight:400';
  if (strongWeight) {
    // 模拟主题或业务样式覆盖后的强调节点。
    const strong = document.createElement('strong');
    strong.style.fontWeight = strongWeight;
    strong.textContent = 'Theme typography';
    root.append(strong);
  } else {
    root.textContent = 'Theme typography';
  }
  document.body.append(root);
  roots.push(root);
  return root;
}

/** 定位测量容器，断言其实际采用的排版而不依赖 jsdom 的布局能力。 */
function measurementWeight(): string | undefined {
  // 测量器使用固定的离屏位置，避免匹配到其他 aria-hidden 元素。
  const container = Array.from(document.querySelectorAll<HTMLElement>('[aria-hidden="true"]'))
    // 只选择 Typography 创建的离屏容器。
    .find((element) => element.style.top === '-999999px');
  return container?.style.fontWeight;
}

// 用例结束后释放业务 DOM，测试不会遗留字体或主题设置。
afterEach(() => {
  for (const root of roots.splice(0)) root.remove();
});

// 主题排版属于浏览器测量输入，必须保持显示与测量一致。
describe('Typography 主题测量', () => {
  // 原先固定 600 会忽略主题自定义的强调字重。
  it('强调字重按实际 strong 节点读取，并响应后续更新', () => {
    // 使用不等于默认 600 的值，使回归具备可观察差异。
    const root = createText('725');
    measureTypographyEllipsis(root, 1, root.textContent!, [], '', 'end', true);
    expect(measurementWeight()).toBe('725');

    root.querySelector('strong')!.style.fontWeight = '800';
    measureTypographyEllipsis(root, 1, root.textContent!, [], '', 'end', true);
    expect(measurementWeight()).toBe('800');
  });

  // 普通文字继续采用根节点排版，不受前一次强调测量残留影响。
  it('普通文字保留根节点字重，测量节点复用不会泄漏上次主题', () => {
    // 先测量强调文本，再测量普通正文，覆盖复用容器的边界。
    const emphasized = createText('700');
    measureTypographyEllipsis(emphasized, 1, emphasized.textContent!, [], '', 'end', true);
    // 普通文字的基线字重为 400。
    const regular = createText();
    measureTypographyEllipsis(regular, 1, regular.textContent!, [], '', 'end', false);
    expect(measurementWeight()).toBe('400');
  });
});
