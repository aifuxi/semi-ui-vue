import { expect, type Locator, type Page, type TestInfo } from '@playwright/test';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

const properties = [
  'color',
  'background-color',
  'background-image',
  'font-family',
  'font-size',
  'font-weight',
  'line-height',
  'display',
  'align-items',
  'justify-content',
  'column-gap',
  'row-gap',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'border-top-width',
  'border-right-width',
  'border-bottom-width',
  'border-left-width',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-bottom-left-radius',
  'border-bottom-right-radius',
  'outline-color',
  'outline-style',
  'outline-width',
  'outline-offset',
  'box-shadow',
  'pointer-events',
  'opacity',
  'cursor',
  'fill',
  'stroke',
  'text-decoration-line',
  'direction',
];
// Compare the rendered contract, including group separators and icon geometry.
const selector =
  '.semi-button, .semi-button-content, .semi-icon, svg, hr, strong, a, [role="group"], .semi-button-group-line, .semi-dropdown-menu, .semi-dropdown-item, .semi-dropdown-title, .semi-dropdown-divider';
export async function measureDemo(root: Locator) {
  return root.evaluate(
    (element, { selector, properties }) => {
      const nodes = [element, ...element.querySelectorAll(selector)].filter((node) =>
        node.matches(selector),
      );
      const origin = element.getBoundingClientRect();
      return nodes.map((node) => {
        const styles = getComputedStyle(node),
          rect = node.getBoundingClientRect();
        return {
          tag: node.tagName,
          classes: [...node.classList].filter((name) => name.startsWith('semi-')).sort(),
          text: node.textContent?.replace(/\s+/g, ' ').trim(),
          disabled: node.getAttribute('disabled') !== null,
          ariaDisabled: node.getAttribute('aria-disabled'),
          role: node.getAttribute('role'),
          styles: Object.fromEntries(properties.map((key) => [key, styles.getPropertyValue(key)])),
          rect: {
            x: rect.x - origin.x,
            y: rect.y - origin.y,
            width: rect.width,
            height: rect.height,
          },
        };
      });
    },
    { selector, properties },
  );
}
export async function compareStyles(
  reference: Locator,
  vue: Locator,
  info: TestInfo,
  state: string,
) {
  const [expected, actual] = await Promise.all([measureDemo(reference), measureDemo(vue)]);
  await info.attach(`${state}-styles`, {
    body: JSON.stringify({ expected, actual }),
    contentType: 'application/json',
  });
  expect(actual.length, state).toBe(expected.length);
  for (let index = 0; index < actual.length; index++) {
    const { rect: a, ...actualNode } = actual[index]!;
    const { rect: b, ...expectedNode } = expected[index]!;
    expect(actualNode, `${state} node ${index}`).toEqual(expectedNode);
    for (const axis of ['x', 'y', 'width', 'height'] as const)
      expect(Math.abs(a[axis] - b[axis]), `${state} node ${index} ${axis}`).toBeLessThanOrEqual(
        0.5,
      );
  }
}
export async function freezeAnimations(pages: Page[], time = 0) {
  await Promise.all(
    pages.map((page) =>
      page.evaluate((time) => {
        document.getAnimations().forEach((animation) => {
          animation.pause();
          animation.currentTime = time;
        });
      }, time),
    ),
  );
}
export async function compareTarget(
  reference: Locator,
  vue: Locator,
  info: TestInfo,
  state: string,
) {
  await compareStyles(reference, vue, info, state);
  const capture = async (target: Locator, suffix: string) => {
    if (!state.endsWith('-focus'))
      return target.screenshot({ path: info.outputPath(`${state}-${suffix}.png`) });
    // Include the complete focus ring instead of clipping it at the button border.
    const rect = await target.boundingBox();
    if (!rect) throw new Error('Missing focused target');
    return target.page().screenshot({
      path: info.outputPath(`${state}-${suffix}.png`),
      clip: { x: rect.x - 4, y: rect.y - 4, width: rect.width + 8, height: rect.height + 8 },
    });
  };
  const [expected, actual] = await Promise.all([
    capture(reference, 'reference'),
    capture(vue, 'vue'),
  ]);
  await info.attach(`${state}-reference`, { body: expected, contentType: 'image/png' });
  await info.attach(`${state}-vue`, { body: actual, contentType: 'image/png' });
  await expectScreenshotPixelsToMatch(vue.page(), actual, expected, state);
}
