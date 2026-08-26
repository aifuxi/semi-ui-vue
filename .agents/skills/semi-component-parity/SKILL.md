---
name: semi-component-parity
description: Use when adding, fixing, reviewing, or visually aligning chen Registry components against the pinned Semi Design 2.102.0 source. Applies to registry/chen/ui, chen theme tokens, component docs, tests, screenshots, and generated Registry output; do not use for unrelated Vue work.
metadata:
  short-description: Align chen Registry components to Semi
---

# Semi Component Parity

Use this skill for any chen Registry component task where the expected behavior or visuals should match the pinned Semi Design baseline.

This is a contract-first workflow. Do not treat existing chen implementation, current tests, screenshots, generated Registry JSON, or docs as proof of correctness until they have been checked against the Semi source.

## Scope

Apply this skill when the task involves:

- `registry/chen/ui/*` component source.
- `registry/chen/theme/theme.mjs` tokens used by Semi-aligned components.
- Component docs/examples under `src/content/components/*`.
- Component route/view additions.
- Unit tests, Playwright tests, screenshots, or generated Registry files for those components.

Do not use this skill for unrelated app pages, generic Vue refactors, or business UI that is not trying to match Semi.

## Source Order

1. Read the local pinned Semi source first. Prefer these paths before online sources:
   - `vendor/semi-design/packages/semi-ui/<component>/`
   - `vendor/semi-design/packages/semi-foundation/<component>/`
   - `vendor/semi-design/content/`
2. If `vendor/semi-design` is missing, initialize it with the project command from `AGENTS.md` instead of switching to online lookup.
3. Treat `vendor/semi-design` as read-only.
4. Use online Semi docs only when the pinned local source does not contain the needed information, or when the user explicitly asks to check current upstream behavior. State when online material is newer than the pinned baseline.

## Required Contract Matrix

Before editing implementation or tests for a component, prepare a concise parity matrix. It can be in the working notes or committed docs when useful, but the comparison itself must happen before coding.

Include these rows when applicable:

- Component names and equivalent chen/Vue naming.
- Semi props, default props, controlled/uncontrolled behavior, and event order.
- Modes and state matrix, including size, type/tone, disabled/loading/error, open/closed, selected, bordered, full/container, nullable icon props, and any component-specific states.
- DOM structure that affects styling, layout, accessibility, focus, or attribute forwarding.
- SCSS variables and computed CSS values for padding, radius, border, color, typography, shadow, z-index, transitions, and placement.
- Semi documentation demo scenarios and their chen docs/example equivalents. Example titles must not silently swap modes: a chen "basic/default" demo should match Semi's basic/default demo, while container, bordered, controlled, custom, or advanced modes need separately named examples.
- The first user-visible example or first viewport state in the chen docs page, because this is what users inspect first and it can diverge even when lower-level component tests pass.
- ARIA roles, labels, keyboard behavior, focus management, and Portal/Teleport behavior.
- Internal state behavior, such as whether close/open actions mutate visibility after emitting callbacks.
- RTL or direction-sensitive spacing when Semi has dedicated rules.
- Explicit intentional deviations, with a reason and matching tests/docs.

If the matrix exposes an API or behavior gap that would change the public chen contract, stop and explain the choice before widening or breaking the API.

## Implementation Rules

- `registry/chen/` is the source of truth. Do not hand-edit generated `public/r/*` or `registry.json`; regenerate them.
- Theme token changes belong in `registry/chen/theme/theme.mjs`, then run `npm run registry:build`.
- Preserve the project's Vue 3, `<script setup lang="ts">`, Tailwind CSS v4, `tailwind-variants`, and Registry conventions.
- Use Reka UI only when it is needed for interaction primitives already accepted by the project.
- For Portal/Teleport wrappers, explicitly verify `class`, `data-*`, ARIA attributes, events, and refs/focus behavior reach the actual interactive/content node.
- Keep the implementation narrow. Do not add unrelated variants, business examples, global styles, routes, dependencies, or API compatibility layers.
- If chen intentionally differs from Semi, document the deviation in component docs or tests and make the test assert the chen decision.

## Documentation and Demo Parity

Treat documentation examples as part of the public component contract.

- Map every edited `CodeDemo` to the matching Semi documentation scenario before changing it.
- Do not use a non-default Semi mode as the chen "basic" or first example unless the user explicitly asks for that product choice.
- If a useful chen example has no direct Semi equivalent, name it as a chen-specific or advanced example and keep it out of the default/basic slot.
- Verify the rendered docs page, not only isolated component nodes. The first visible demo should visually communicate the same default state as the corresponding Semi demo.
- When updating screenshots, inspect at least one actual page or demo screenshot before accepting the new baseline.

## Test Rules

Write tests from the Semi contract matrix, not from the current chen output.

Required coverage for meaningful component changes:

- Unit tests for props/defaults, slot behavior, event order, controlled state, and internal state rules.
- Playwright behavior tests for keyboard, pointer, focus, Portal/Teleport, and visibility behavior when applicable.
- Playwright computed-style assertions for the highest-risk Semi-derived values before updating screenshots.
- Playwright or browser evidence for the docs page's first visible example when docs/examples are edited.
- Desktop and mobile light/dark screenshots only after source-derived style assertions pass.
- Registry install verification when Registry metadata, generated files, exports, dependencies, or theme tokens change.

Screenshots are regression evidence, not source-of-truth evidence. Do not use screenshots alone to prove Semi parity.

## Verification

Choose verification proportional to the change, but do not mark parity complete without target checks.

Typical commands:

- `npm run registry:build` after Registry metadata or theme changes.
- `npm run lint` after source/test edits.
- `npm run typecheck` after API or type changes.
- `npm run test:unit -- <component>` or the closest target Vitest command for component unit tests.
- `npx playwright test tests/e2e/<component>.spec.ts` for target E2E.
- `npm run test:registry` after Registry output changes.

Run `npm run check` when the change touches shared theme behavior, generation scripts, Registry contracts, or multiple components. Do not run an unrequested app build merely because a component changed.

## Completion Bar

A Semi-aligned component is complete only when:

- The Semi contract matrix has no unexplained gaps.
- Any intentional chen deviations are explicit and tested.
- Documentation examples map to the correct Semi demo scenarios, especially the default/basic example.
- The first user-visible docs example has been checked in a browser when docs/examples changed.
- Implementation, docs, tests, and generated Registry output agree.
- Target unit and E2E tests pass.
- Screenshot updates follow passing computed-style or behavior assertions.
- The final response names the demo-scenario mapping status, any tests not run, and any residual parity risk.
