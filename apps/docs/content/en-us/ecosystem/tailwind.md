---
title: 'With TailwindCSS'
englishTitle: 'Tailwind'
description: 'Combine Tailwind CSS with the public theme through cascade layers and tokens.'
slug: 'tailwind'
locale: 'en-US'
category: 'ecosystem'
order: 13
icon: 'doc-tailwind'
upstream: 'ecosystem/tailwind'
---

## Notice

This page will provide best practices for some issues encountered when using atomic style libraries such as TailwindCSS (supports both v3 and v4) with Semi.

These problems are often encountered when other component libraries are used with Tailwind, but Semi provides official solutions. It is recommended to follow the instructions in this article to configure the project correctly.

> Semi does not rely on any third-party style libraries and can run without installing Tailwind. If you do not use atomic libraries such as Tailwind, please close this page directly.

### 1. Solve the problem of style override priority

#### Problem performance

There is no effect or component library style exception when using some atomic classes in components.

#### Cause Analysis

When using Tailwind, Tailwind modifies the dom style through class, which also affects the Semi component library. At the same time, Tailwind enables [Preflight](https://tailwindcss.com/docs/preflight) by default to reset the browser's default style.

At this time, depending on the configuration of your project and the import of the entry, there are two possibilities:

1. Tailwind is introduced before Semi style, and Semi has higher priority
2. Semi style was introduced before Tailwind, and Tailwind has a higher priority.

If it is 1, it will appear that when Tailwind adds certain atomic classes, if the component style has defined a certain css attribute, the priority of the atomic class is lower than that of Semi, and the atomic class becomes invalid.
For example, under the premise of 1, setting padding on the Button component will cause failure.

If it is 2, because Tailwind has a higher priority, its Preflight overwriting the browser's default style will also override Semi's style.
For example, under the premise of 2, the background color of the light Button will be overwritten as transparent, causing the style to behave abnormally.

#### Solution

Place the compiled default theme CSS in a `semi` layer, after Preflight and before application utilities. Load the theme through this layered entry only; importing the same stylesheet again without a layer changes its priority. Vue and Nuxt applications do not need the upstream React webpack/rspack plugins.

```css
/* app.css — Tailwind v4 */
@layer theme, base, semi, utilities;
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/preflight.css' layer(base);
@import '@aifuxi/semi-theme-default/index.css' layer(semi);
@import 'tailwindcss/utilities.css' layer(utilities);
```

```css
/* app.css — Tailwind v3 */
@layer tailwind-base, semi, tailwind-utilities;
@import '@aifuxi/semi-theme-default/index.css' layer(semi);
@layer tailwind-base {
  @tailwind base;
}
@layer tailwind-utilities {
  @tailwind components;
  @tailwind utilities;
}
```

#### Principle

Through the CSS Layer feature, priority setting of styles from different sources is achieved.

Using `@import ... layer(semi)` places the compiled theme styles in the `semi` layer. In addition, we also manually set the layers of various types of Tailwind styles in the project.

In addition, we configured the priority order of various Layers:

```css
@layer tailwind-base,semi,tailwind-components,tailwind-utils;
```

The meaning of the above CSS is that base (including Preflight) has the lowest priority, followed by Semi. The atomic class styles set by the user (padding-[xxx], etc.) have the highest priority, which can solve the above problems.

### 2. Solve the problem of using Semi Token in Tailwind atomic class (optional)

Tailwind supports users to configure their own Token to implement themes. At the same time, Semi also provides its own theme solution and corresponding Token.
If you want to use Semi Token directly in the project, for example, set the text color of a span to `--semi-color-text-0` to automatically switch between light and dark colors to be consistent with the theme, you need to set the css `color: var(--semi-color-text-0)` separately, which is very inconvenient.

Semi provides Tailwind's theme configuration file, which is used to map Semi's Token to atomic Token. For the above requirements, you can directly set `text-semi-color-text-0` for span.

> The theme configuration methods for Tailwind v3 and v4 are different. Please choose the corresponding configuration method based on the version you are using.

**Tailwind v4 Configuration:**

In your Tailwind entry CSS file (the file containing `@import "tailwindcss";`), add the `@theme` configuration:

```css
@import 'tailwindcss';

/**
 * Semi Design Token integration with Tailwind CSS v4
 * 
 * How it works:
 * 1. Use var(--semi-xxx) as placeholders in @theme to let Tailwind generate utility classes
 *    (var() in @theme won't be resolved at build time, only serves as placeholder)
 * 2. Redefine these variables in body selector, pointing to Semi's actual tokens
 *    (Use body instead of :root to ensure it takes effect after Semi injects :root variables)
 * 
 * Usage examples:
 *   bg-semi-color-primary     -> Primary color background
 *   text-semi-color-text-0    -> Primary text color
 *   rounded-semi-border-radius-medium -> Medium border radius
 */

@theme {
  /* ========== Base Colors ========== */
  --color-semi-color-white: var(--semi-color-white);
  --color-semi-color-black: var(--semi-color-black);

  /* ========== Primary Colors ========== */
  --color-semi-color-primary: var(--semi-color-primary);
  --color-semi-color-primary-hover: var(--semi-color-primary-hover);
  --color-semi-color-primary-active: var(--semi-color-primary-active);
  --color-semi-color-primary-disabled: var(--semi-color-primary-disabled);
  --color-semi-color-primary-light-default: var(--semi-color-primary-light-default);
  --color-semi-color-primary-light-hover: var(--semi-color-primary-light-hover);
  --color-semi-color-primary-light-active: var(--semi-color-primary-light-active);

  /* ========== Secondary Colors ========== */
  --color-semi-color-secondary: var(--semi-color-secondary);
  --color-semi-color-secondary-hover: var(--semi-color-secondary-hover);
  --color-semi-color-secondary-active: var(--semi-color-secondary-active);
  --color-semi-color-secondary-disabled: var(--semi-color-secondary-disabled);
  --color-semi-color-secondary-light-default: var(--semi-color-secondary-light-default);
  --color-semi-color-secondary-light-hover: var(--semi-color-secondary-light-hover);
  --color-semi-color-secondary-light-active: var(--semi-color-secondary-light-active);

  /* ========== Tertiary Colors ========== */
  --color-semi-color-tertiary: var(--semi-color-tertiary);
  --color-semi-color-tertiary-hover: var(--semi-color-tertiary-hover);
  --color-semi-color-tertiary-active: var(--semi-color-tertiary-active);
  --color-semi-color-tertiary-light-default: var(--semi-color-tertiary-light-default);
  --color-semi-color-tertiary-light-hover: var(--semi-color-tertiary-light-hover);
  --color-semi-color-tertiary-light-active: var(--semi-color-tertiary-light-active);

  /* ========== Default Colors ========== */
  --color-semi-color-default: var(--semi-color-default);
  --color-semi-color-default-hover: var(--semi-color-default-hover);
  --color-semi-color-default-active: var(--semi-color-default-active);

  /* ========== Info Colors ========== */
  --color-semi-color-info: var(--semi-color-info);
  --color-semi-color-info-hover: var(--semi-color-info-hover);
  --color-semi-color-info-active: var(--semi-color-info-active);
  --color-semi-color-info-disabled: var(--semi-color-info-disabled);
  --color-semi-color-info-light-default: var(--semi-color-info-light-default);
  --color-semi-color-info-light-hover: var(--semi-color-info-light-hover);
  --color-semi-color-info-light-active: var(--semi-color-info-light-active);

  /* ========== Success Colors ========== */
  --color-semi-color-success: var(--semi-color-success);
  --color-semi-color-success-hover: var(--semi-color-success-hover);
  --color-semi-color-success-active: var(--semi-color-success-active);
  --color-semi-color-success-disabled: var(--semi-color-success-disabled);
  --color-semi-color-success-light-default: var(--semi-color-success-light-default);
  --color-semi-color-success-light-hover: var(--semi-color-success-light-hover);
  --color-semi-color-success-light-active: var(--semi-color-success-light-active);

  /* ========== Danger Colors ========== */
  --color-semi-color-danger: var(--semi-color-danger);
  --color-semi-color-danger-hover: var(--semi-color-danger-hover);
  --color-semi-color-danger-active: var(--semi-color-danger-active);
  --color-semi-color-danger-light-default: var(--semi-color-danger-light-default);
  --color-semi-color-danger-light-hover: var(--semi-color-danger-light-hover);
  --color-semi-color-danger-light-active: var(--semi-color-danger-light-active);

  /* ========== Warning Colors ========== */
  --color-semi-color-warning: var(--semi-color-warning);
  --color-semi-color-warning-hover: var(--semi-color-warning-hover);
  --color-semi-color-warning-active: var(--semi-color-warning-active);
  --color-semi-color-warning-light-default: var(--semi-color-warning-light-default);
  --color-semi-color-warning-light-hover: var(--semi-color-warning-light-hover);
  --color-semi-color-warning-light-active: var(--semi-color-warning-light-active);

  /* ========== Functional Colors ========== */
  --color-semi-color-focus-border: var(--semi-color-focus-border);
  --color-semi-color-disabled-text: var(--semi-color-disabled-text);
  --color-semi-color-disabled-border: var(--semi-color-disabled-border);
  --color-semi-color-disabled-bg: var(--semi-color-disabled-bg);
  --color-semi-color-disabled-fill: var(--semi-color-disabled-fill);
  --color-semi-color-shadow: var(--semi-color-shadow);

  /* ========== Link Colors ========== */
  --color-semi-color-link: var(--semi-color-link);
  --color-semi-color-link-hover: var(--semi-color-link-hover);
  --color-semi-color-link-active: var(--semi-color-link-active);
  --color-semi-color-link-visited: var(--semi-color-link-visited);

  /* ========== Border Colors ========== */
  --color-semi-color-border: var(--semi-color-border);

  /* ========== Background Colors ========== */
  --color-semi-color-nav-bg: var(--semi-color-nav-bg);
  --color-semi-color-overlay-bg: var(--semi-color-overlay-bg);
  --color-semi-color-bg-0: var(--semi-color-bg-0);
  --color-semi-color-bg-1: var(--semi-color-bg-1);
  --color-semi-color-bg-2: var(--semi-color-bg-2);
  --color-semi-color-bg-3: var(--semi-color-bg-3);
  --color-semi-color-bg-4: var(--semi-color-bg-4);

  /* ========== Fill Colors ========== */
  --color-semi-color-fill-0: var(--semi-color-fill-0);
  --color-semi-color-fill-1: var(--semi-color-fill-1);
  --color-semi-color-fill-2: var(--semi-color-fill-2);

  /* ========== Text Colors ========== */
  --color-semi-color-text-0: var(--semi-color-text-0);
  --color-semi-color-text-1: var(--semi-color-text-1);
  --color-semi-color-text-2: var(--semi-color-text-2);
  --color-semi-color-text-3: var(--semi-color-text-3);

  /* ========== Highlight Colors ========== */
  --color-semi-color-highlight-bg: var(--semi-color-highlight-bg);
  --color-semi-color-highlight: var(--semi-color-highlight);

  /* ========== Data Visualization Colors ========== */
  --color-semi-color-data-0: var(--semi-color-data-0);
  --color-semi-color-data-1: var(--semi-color-data-1);
  --color-semi-color-data-2: var(--semi-color-data-2);
  --color-semi-color-data-3: var(--semi-color-data-3);
  --color-semi-color-data-4: var(--semi-color-data-4);
  --color-semi-color-data-5: var(--semi-color-data-5);
  --color-semi-color-data-6: var(--semi-color-data-6);
  --color-semi-color-data-7: var(--semi-color-data-7);
  --color-semi-color-data-8: var(--semi-color-data-8);
  --color-semi-color-data-9: var(--semi-color-data-9);
  --color-semi-color-data-10: var(--semi-color-data-10);
  --color-semi-color-data-11: var(--semi-color-data-11);
  --color-semi-color-data-12: var(--semi-color-data-12);
  --color-semi-color-data-13: var(--semi-color-data-13);
  --color-semi-color-data-14: var(--semi-color-data-14);
  --color-semi-color-data-15: var(--semi-color-data-15);
  --color-semi-color-data-16: var(--semi-color-data-16);
  --color-semi-color-data-17: var(--semi-color-data-17);
  --color-semi-color-data-18: var(--semi-color-data-18);
  --color-semi-color-data-19: var(--semi-color-data-19);

  /* ========== Border Radius ========== */
  --radius-semi-border-radius-extra-small: var(--semi-border-radius-extra-small);
  --radius-semi-border-radius-small: var(--semi-border-radius-small);
  --radius-semi-border-radius-medium: var(--semi-border-radius-medium);
  --radius-semi-border-radius-large: var(--semi-border-radius-large);
  --radius-semi-border-radius-circle: var(--semi-border-radius-circle);
  --radius-semi-border-radius-full: var(--semi-border-radius-full);
}

/**
 * Runtime variable override
 * Use body selector to ensure it takes effect after Semi's :root variables are injected
 */
body {
  /* Base Colors */
  --color-semi-color-white: var(--semi-color-white);
  --color-semi-color-black: var(--semi-color-black);

  /* Primary Colors */
  --color-semi-color-primary: var(--semi-color-primary);
  --color-semi-color-primary-hover: var(--semi-color-primary-hover);
  --color-semi-color-primary-active: var(--semi-color-primary-active);
  --color-semi-color-primary-disabled: var(--semi-color-primary-disabled);
  --color-semi-color-primary-light-default: var(--semi-color-primary-light-default);
  --color-semi-color-primary-light-hover: var(--semi-color-primary-light-hover);
  --color-semi-color-primary-light-active: var(--semi-color-primary-light-active);

  /* Secondary Colors */
  --color-semi-color-secondary: var(--semi-color-secondary);
  --color-semi-color-secondary-hover: var(--semi-color-secondary-hover);
  --color-semi-color-secondary-active: var(--semi-color-secondary-active);
  --color-semi-color-secondary-disabled: var(--semi-color-secondary-disabled);
  --color-semi-color-secondary-light-default: var(--semi-color-secondary-light-default);
  --color-semi-color-secondary-light-hover: var(--semi-color-secondary-light-hover);
  --color-semi-color-secondary-light-active: var(--semi-color-secondary-light-active);

  /* Tertiary Colors */
  --color-semi-color-tertiary: var(--semi-color-tertiary);
  --color-semi-color-tertiary-hover: var(--semi-color-tertiary-hover);
  --color-semi-color-tertiary-active: var(--semi-color-tertiary-active);
  --color-semi-color-tertiary-light-default: var(--semi-color-tertiary-light-default);
  --color-semi-color-tertiary-light-hover: var(--semi-color-tertiary-light-hover);
  --color-semi-color-tertiary-light-active: var(--semi-color-tertiary-light-active);

  /* Default Colors */
  --color-semi-color-default: var(--semi-color-default);
  --color-semi-color-default-hover: var(--semi-color-default-hover);
  --color-semi-color-default-active: var(--semi-color-default-active);

  /* Info Colors */
  --color-semi-color-info: var(--semi-color-info);
  --color-semi-color-info-hover: var(--semi-color-info-hover);
  --color-semi-color-info-active: var(--semi-color-info-active);
  --color-semi-color-info-disabled: var(--semi-color-info-disabled);
  --color-semi-color-info-light-default: var(--semi-color-info-light-default);
  --color-semi-color-info-light-hover: var(--semi-color-info-light-hover);
  --color-semi-color-info-light-active: var(--semi-color-info-light-active);

  /* Success Colors */
  --color-semi-color-success: var(--semi-color-success);
  --color-semi-color-success-hover: var(--semi-color-success-hover);
  --color-semi-color-success-active: var(--semi-color-success-active);
  --color-semi-color-success-disabled: var(--semi-color-success-disabled);
  --color-semi-color-success-light-default: var(--semi-color-success-light-default);
  --color-semi-color-success-light-hover: var(--semi-color-success-light-hover);
  --color-semi-color-success-light-active: var(--semi-color-success-light-active);

  /* Danger Colors */
  --color-semi-color-danger: var(--semi-color-danger);
  --color-semi-color-danger-hover: var(--semi-color-danger-hover);
  --color-semi-color-danger-active: var(--semi-color-danger-active);
  --color-semi-color-danger-light-default: var(--semi-color-danger-light-default);
  --color-semi-color-danger-light-hover: var(--semi-color-danger-light-hover);
  --color-semi-color-danger-light-active: var(--semi-color-danger-light-active);

  /* Warning Colors */
  --color-semi-color-warning: var(--semi-color-warning);
  --color-semi-color-warning-hover: var(--semi-color-warning-hover);
  --color-semi-color-warning-active: var(--semi-color-warning-active);
  --color-semi-color-warning-light-default: var(--semi-color-warning-light-default);
  --color-semi-color-warning-light-hover: var(--semi-color-warning-light-hover);
  --color-semi-color-warning-light-active: var(--semi-color-warning-light-active);

  /* Functional Colors */
  --color-semi-color-focus-border: var(--semi-color-focus-border);
  --color-semi-color-disabled-text: var(--semi-color-disabled-text);
  --color-semi-color-disabled-border: var(--semi-color-disabled-border);
  --color-semi-color-disabled-bg: var(--semi-color-disabled-bg);
  --color-semi-color-disabled-fill: var(--semi-color-disabled-fill);
  --color-semi-color-shadow: var(--semi-color-shadow);

  /* Link Colors */
  --color-semi-color-link: var(--semi-color-link);
  --color-semi-color-link-hover: var(--semi-color-link-hover);
  --color-semi-color-link-active: var(--semi-color-link-active);
  --color-semi-color-link-visited: var(--semi-color-link-visited);

  /* Border Colors */
  --color-semi-color-border: var(--semi-color-border);

  /* Background Colors */
  --color-semi-color-nav-bg: var(--semi-color-nav-bg);
  --color-semi-color-overlay-bg: var(--semi-color-overlay-bg);
  --color-semi-color-bg-0: var(--semi-color-bg-0);
  --color-semi-color-bg-1: var(--semi-color-bg-1);
  --color-semi-color-bg-2: var(--semi-color-bg-2);
  --color-semi-color-bg-3: var(--semi-color-bg-3);
  --color-semi-color-bg-4: var(--semi-color-bg-4);

  /* Fill Colors */
  --color-semi-color-fill-0: var(--semi-color-fill-0);
  --color-semi-color-fill-1: var(--semi-color-fill-1);
  --color-semi-color-fill-2: var(--semi-color-fill-2);

  /* Text Colors */
  --color-semi-color-text-0: var(--semi-color-text-0);
  --color-semi-color-text-1: var(--semi-color-text-1);
  --color-semi-color-text-2: var(--semi-color-text-2);
  --color-semi-color-text-3: var(--semi-color-text-3);

  /* Highlight Colors */
  --color-semi-color-highlight-bg: var(--semi-color-highlight-bg);
  --color-semi-color-highlight: var(--semi-color-highlight);

  /* Data Visualization Colors */
  --color-semi-color-data-0: var(--semi-color-data-0);
  --color-semi-color-data-1: var(--semi-color-data-1);
  --color-semi-color-data-2: var(--semi-color-data-2);
  --color-semi-color-data-3: var(--semi-color-data-3);
  --color-semi-color-data-4: var(--semi-color-data-4);
  --color-semi-color-data-5: var(--semi-color-data-5);
  --color-semi-color-data-6: var(--semi-color-data-6);
  --color-semi-color-data-7: var(--semi-color-data-7);
  --color-semi-color-data-8: var(--semi-color-data-8);
  --color-semi-color-data-9: var(--semi-color-data-9);
  --color-semi-color-data-10: var(--semi-color-data-10);
  --color-semi-color-data-11: var(--semi-color-data-11);
  --color-semi-color-data-12: var(--semi-color-data-12);
  --color-semi-color-data-13: var(--semi-color-data-13);
  --color-semi-color-data-14: var(--semi-color-data-14);
  --color-semi-color-data-15: var(--semi-color-data-15);
  --color-semi-color-data-16: var(--semi-color-data-16);
  --color-semi-color-data-17: var(--semi-color-data-17);
  --color-semi-color-data-18: var(--semi-color-data-18);
  --color-semi-color-data-19: var(--semi-color-data-19);

  /* Border Radius */
  --radius-semi-border-radius-extra-small: var(--semi-border-radius-extra-small);
  --radius-semi-border-radius-small: var(--semi-border-radius-small);
  --radius-semi-border-radius-medium: var(--semi-border-radius-medium);
  --radius-semi-border-radius-large: var(--semi-border-radius-large);
  --radius-semi-border-radius-circle: var(--semi-border-radius-circle);
  --radius-semi-border-radius-full: var(--semi-border-radius-full);
}
```

After configuration, you can use atomic classes like `text-semi-color-text-0`, `bg-semi-color-primary`, `rounded-semi-border-radius-small`, etc.

---

**Tailwind v3 Configuration:**

Just configure the following content in the Tailwind configuration (i.e. `tailwind.config.js`):

```js
module.exports = {
  theme: {
    colors: {
      'semi-color-white': 'var(--semi-color-white)',
      'semi-color-black': 'var(--semi-color-black)',
      'semi-color-primary': 'var(--semi-color-primary)',
      'semi-color-primary-hover': 'var(--semi-color-primary-hover)',
      'semi-color-primary-active': 'var(--semi-color-primary-active)',
      'semi-color-primary-disabled': 'var(--semi-color-primary-disabled)',
      'semi-color-primary-light-default': 'var(--semi-color-primary-light-default)',
      'semi-color-primary-light-hover': 'var(--semi-color-primary-light-hover)',
      'semi-color-primary-light-active': 'var(--semi-color-primary-light-active)',
      'semi-color-secondary': 'var(--semi-color-secondary)',
      'semi-color-secondary-hover': 'var(--semi-color-secondary-hover)',
      'semi-color-secondary-active': 'var(--semi-color-secondary-active)',
      'semi-color-secondary-disabled': 'var(--semi-color-secondary-disabled)',
      'semi-color-secondary-light-default': 'var(--semi-color-secondary-light-default)',
      'semi-color-secondary-light-hover': 'var(--semi-color-secondary-light-hover)',
      'semi-color-secondary-light-active': 'var(--semi-color-secondary-light-active)',
      'semi-color-tertiary': 'var(--semi-color-tertiary)',
      'semi-color-tertiary-hover': 'var(--semi-color-tertiary-hover)',
      'semi-color-tertiary-active': 'var(--semi-color-tertiary-active)',
      'semi-color-tertiary-light-default': 'var(--semi-color-tertiary-light-default)',
      'semi-color-tertiary-light-hover': 'var(--semi-color-tertiary-light-hover)',
      'semi-color-tertiary-light-active': 'var(--semi-color-tertiary-light-active)',
      'semi-color-default': 'var(--semi-color-default)',
      'semi-color-default-hover': 'var(--semi-color-default-hover)',
      'semi-color-default-active': 'var(--semi-color-default-active)',
      'semi-color-info': 'var(--semi-color-info)',
      'semi-color-info-hover': 'var(--semi-color-info-hover)',
      'semi-color-info-active': 'var(--semi-color-info-active)',
      'semi-color-info-disabled': 'var(--semi-color-info-disabled)',
      'semi-color-info-light-default': 'var(--semi-color-info-light-default)',
      'semi-color-info-light-hover': 'var(--semi-color-info-light-hover)',
      'semi-color-info-light-active': 'var(--semi-color-info-light-active)',
      'semi-color-success': 'var(--semi-color-success)',
      'semi-color-success-hover': 'var(--semi-color-success-hover)',
      'semi-color-success-active': 'var(--semi-color-success-active)',
      'semi-color-success-disabled': 'var(--semi-color-success-disabled)',
      'semi-color-success-light-default': 'var(--semi-color-success-light-default)',
      'semi-color-success-light-hover': 'var(--semi-color-success-light-hover)',
      'semi-color-success-light-active': 'var(--semi-color-success-light-active)',
      'semi-color-danger': 'var(--semi-color-danger)',
      'semi-color-danger-hover': 'var(--semi-color-danger-hover)',
      'semi-color-danger-active': 'var(--semi-color-danger-active)',
      'semi-color-danger-light-default': 'var(--semi-color-danger-light-default)',
      'semi-color-danger-light-hover': 'var(--semi-color-danger-light-hover)',
      'semi-color-danger-light-active': 'var(--semi-color-danger-light-active)',
      'semi-color-warning': 'var(--semi-color-warning)',
      'semi-color-warning-hover': 'var(--semi-color-warning-hover)',
      'semi-color-warning-active': 'var(--semi-color-warning-active)',
      'semi-color-warning-light-default': 'var(--semi-color-warning-light-default)',
      'semi-color-warning-light-hover': 'var(--semi-color-warning-light-hover)',
      'semi-color-warning-light-active': 'var(--semi-color-warning-light-active)',
      'semi-color-focus-border': 'var(--semi-color-focus-border)',
      'semi-color-disabled-text': 'var(--semi-color-disabled-text)',
      'semi-color-disabled-border': 'var(--semi-color-disabled-border)',
      'semi-color-disabled-bg': 'var(--semi-color-disabled-bg)',
      'semi-color-disabled-fill': 'var(--semi-color-disabled-fill)',
      'semi-color-shadow': 'var(--semi-color-shadow)',
      'semi-color-link': 'var(--semi-color-link)',
      'semi-color-link-hover': 'var(--semi-color-link-hover)',
      'semi-color-link-active': 'var(--semi-color-link-active)',
      'semi-color-link-visited': 'var(--semi-color-link-visited)',
      'semi-color-border': 'var(--semi-color-border)',
      'semi-color-nav-bg': 'var(--semi-color-nav-bg)',
      'semi-color-overlay-bg': 'var(--semi-color-overlay-bg)',
      'semi-color-fill-0': 'var(--semi-color-fill-0)',
      'semi-color-fill-1': 'var(--semi-color-fill-1)',
      'semi-color-fill-2': 'var(--semi-color-fill-2)',
      'semi-color-bg-0': 'var(--semi-color-bg-0)',
      'semi-color-bg-1': 'var(--semi-color-bg-1)',
      'semi-color-bg-2': 'var(--semi-color-bg-2)',
      'semi-color-bg-3': 'var(--semi-color-bg-3)',
      'semi-color-bg-4': 'var(--semi-color-bg-4)',
      'semi-color-text-0': 'var(--semi-color-text-0)',
      'semi-color-text-1': 'var(--semi-color-text-1)',
      'semi-color-text-2': 'var(--semi-color-text-2)',
      'semi-color-text-3': 'var(--semi-color-text-3)',
      'semi-color-highlight-bg': 'var(--semi-color-highlight-bg)',
      'semi-color-highlight': 'var(--semi-color-highlight)',
      'semi-color-data-0': 'var(--semi-color-data-0)',
      'semi-color-data-1': 'var(--semi-color-data-1)',
      'semi-color-data-2': 'var(--semi-color-data-2)',
      'semi-color-data-3': 'var(--semi-color-data-3)',
      'semi-color-data-4': 'var(--semi-color-data-4)',
      'semi-color-data-5': 'var(--semi-color-data-5)',
      'semi-color-data-6': 'var(--semi-color-data-6)',
      'semi-color-data-7': 'var(--semi-color-data-7)',
      'semi-color-data-8': 'var(--semi-color-data-8)',
      'semi-color-data-9': 'var(--semi-color-data-9)',
      'semi-color-data-10': 'var(--semi-color-data-10)',
      'semi-color-data-11': 'var(--semi-color-data-11)',
      'semi-color-data-12': 'var(--semi-color-data-12)',
      'semi-color-data-13': 'var(--semi-color-data-13)',
      'semi-color-data-14': 'var(--semi-color-data-14)',
      'semi-color-data-15': 'var(--semi-color-data-15)',
      'semi-color-data-16': 'var(--semi-color-data-16)',
      'semi-color-data-17': 'var(--semi-color-data-17)',
      'semi-color-data-18': 'var(--semi-color-data-18)',
      'semi-color-data-19': 'var(--semi-color-data-19)',
    },
    extend: {
      borderRadius: {
        'semi-border-radius-extra-small': 'var(--semi-border-radius-extra-small)',
        'semi-border-radius-small': 'var(--semi-border-radius-small)',
        'semi-border-radius-medium': 'var(--semi-border-radius-medium)',
        'semi-border-radius-large': 'var(--semi-border-radius-large)',
        'semi-border-radius-circle': 'var(--semi-border-radius-circle)',
        'semi-border-radius-full': 'var(--semi-border-radius-full)',
      },
    },
  },
};
```

## Vue and Nuxt integration

Import `app.css` from Vue’s `main.ts`; in Nuxt, configure `css: ['~/assets/app.css']`. Component styles can also use `@import` with `layer(semi)`. Avoid a second plugin that imports another unlayered copy of the theme.

See the [Tailwind Preflight documentation](https://tailwindcss.com/docs/preflight) for its resets and selective imports.
