---
title: 'Accessibility'
englishTitle: 'Accessibility'
description: 'Provide accessible experiences through semantics, keyboard support, focus and clear feedback.'
slug: 'accessibility'
locale: 'en-US'
category: 'experience'
order: 7
upstream: 'experience/accessibility'
---

## Accessibility-specific themes

The default theme exposes public `--semi-*` tokens. Override the relevant tokens in your application theme when greater contrast or larger text is needed, and verify light and dark modes separately. This project does not distribute the upstream DSM accessibility theme. See [Customize theme](/en-us/advanced/customize-theme/).

## Understand user needs

To design and develop inclusive products, you first need to understand the different needs of different users and consider the aids and methods they use.

### Visual impairment

Blind users rely on screen readers to access websites and applications. Typically, screen reader users navigate pages by navigating through specific elements such as headings, links, or form elements.
So, you need to use semantic elements and check if the tags make sense out of context.

Low vision users have different needs depending on the nature of their vision impairment. Users may be unable to distinguish text or other content without magnification, especially small text, or have difficulty distinguishing text and images with low color contrast, etc.
These requirements mean that the interface should not rely on color to convey information, the color palette needs to have sufficient contrast, and the layout should be responsive as the font size increases.

### Device dependencies

Users who rely on the keyboard need to be able to access the focusable element on the screen through the keyboard.

Users who rely on mouse or touch need to have a target area large enough to hit easily.

### Cognitive Impairment

Users who struggle with information should benefit from well-written content.
Therefore, the application's information should be clear, concise, and easy to navigate; also consider visual hierarchy, break content into short, related sections, and avoid long paragraphs.

## Keyboard and focus

Many users, including the visually impaired, rely on keyboard navigation to use our products. Therefore, all focusable components should be keyboard accessible, including links, buttons, and form controls.

### Keyboard Shortcuts

- Tab key to switch focus: Tab order should follow a predictable sequential hierarchy, eg: top to bottom, left to right. When some key elements get the focus, the prompt information of the element should be displayed; when the focus is lost, the prompt disappears.
- Arrows: Navigate between related radio buttons, menu items or widget items.
- Enter: activate button, submit form, etc.
- Space: activate a button or toggle a checkbox; outside an actionable control the browser may scroll the page.
- Esc: Exit from various bullet layers.
- Component detailed keyboard interactions are also provided in the documentation for each component.

### Focus Principle

Focus states are an important part of the design because they let the keyboard user know where the focus is currently. The focus needs to follow the following principles:

- Initial focus: To enable users to complete tasks efficiently, always set initial focus for tasks. Set focus to the first logical interactive element or the first element in the task. When the focus is switched, if the current focus control is covered, the focus needs to be automatically switched to the first focus area of ​​the new page.
- Navigation is reversible: when the user switches to the next focus through the [tab key], he must be able to switch to the previous focus through [shift + Tab];
- Returnable: If the currently focused element disappears, the focus state should always return to the previous position. For example, closing a modal might mean that your focus is on the close button; when the modal is closed, you should return focus to the button that opened the modal;

## Color and Contrast

### Multiple prompts

Don't use color as the only way to convey information. Use adding icons, text, underlines, etc. to ensure that all groups of people receive the same message.

::contrast-examples{kind="color"}
::

### Text element comparison

Normal text requires at least 4.5:1 contrast against its background. Large text (at least 18pt / 24px, or 14pt bold) may use 3:1. This corrects the upstream 18px unit error using the [WCAG 2.2 contrast explanation](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

::contrast-examples{kind="text"}
::

### Component Status and Comparison

All operable components need to have a focus state. The active, hover, and focus states of the component all need to meet the 3:1 contrast ratio with the adjacent color. But there is no contrast requirement between the different states.

For a component with a stroke, it only needs to meet the 3:1 contrast between the stroke color and the base color. No contrast is required between the fill and stroke colors.

::contrast-examples{kind="state"}
::

### exception

Text in inactive controls or purely decorative content may qualify for exceptions. Using Message or Banner does not by itself exempt text from contrast requirements; assess explanatory text and actions according to their actual purpose.

::contrast-examples{kind="exception"}
::

## Pictures and Videos

We provide a way to provide a text-based alternative to all images, icons, and SVGs so that screen readers can succinctly describe images and videos, such as avatars.

::demo-block{demo="guides/accessibility/en-us/ImageAlt" title="Image alt"}
::

## React → Vue

Avatar keeps the `alt` and `src` props. Use `:style` for a style object in a Vue template. The example uses a fixed local image instead of the upstream remote avatar while preserving the accessible-name demonstration.
