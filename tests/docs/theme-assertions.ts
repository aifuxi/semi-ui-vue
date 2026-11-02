import { expect, type Locator } from '@playwright/test';

export async function expectElevatedShadow(locator: Locator): Promise<string> {
  // 固定基线使用 elevated token；由浏览器规范化颜色与长度后比较完整阴影。
  const expected = await locator.evaluate((element) => {
    const probe = document.createElement('span');
    probe.style.boxShadow = 'var(--semi-shadow-elevated)';
    element.append(probe);
    const shadow = getComputedStyle(probe).boxShadow;
    probe.remove();
    return shadow;
  });
  expect(expected).not.toBe('none');
  await expect(locator).toHaveCSS('box-shadow', expected);
  return expected;
}
